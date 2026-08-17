import { createFSM } from '@codigos/typed-fsm';
import { toAmount } from './amounts.js';
import type { Outcome, PostingDeps, PostingInstance, PostingMessage, PostingState, ValidTransaction } from './types.js';
import { validate } from './validate.js';

export function createPostingMachine(deps: PostingDeps): PostingInstance {

  let valid: ValidTransaction | null = null;
  let balanceAfterCents = 0;

  return createFSM<PostingState, unknown, Outcome>({
    initialState: 'idle',
    ...(deps.onTransition ? { onChange: deps.onTransition } : {}),

    states: {
      idle: {
        onMessage: (message, self) => advance(self, message, 'validating'),
      },

      validating: {
        onMessage(message, self) {
          const result = validate(message.payload);
          if (!result.ok) return settle(self, message, { ok: false, error: result.error, fault: false });

          valid = result.value;
          advance(self, message, 'checkingFunds');
        },
      },

      checkingFunds: {
        onMessage(message, self) {
          if (!valid) return settle(self, message, fault('Not validated.'));

          const balance = deps.balanceCents();
          const next = balance + (valid.type === 'credit' ? valid.amountCents : -valid.amountCents);

          // The rule the whole sytem exists for.
          if (next < 0) {
            return settle(self, message, {
              ok: false,
              fault: false,
              error: {
                code: 'INSUFFICIENT_FUNDS',
                message: `Not enough funds. Balance is $${toAmount(balance).toFixed(2)}.`,
              },
            });
          }

          balanceAfterCents = next;
          advance(self, message, 'persisting');
        },
      },

      persisting: {
        async onMessage(message, self) {
          if (!valid) return settle(self, message, fault('Not validated.'));
          try {
            await deps.commit(valid, balanceAfterCents);
            settle(self, message, { ok: true, balanceCents: balanceAfterCents });
          } catch (e) {
            console.error('[ledger] failed to save:', e);
            settle(self, message, fault('Could not save. Nothing changed.'));
          }
        },
      },

      settled: {
        onMessage: (message) => message.reply(fault('Already settled.')),
      },
    },
  });
}

// helpers

function advance(self: PostingInstance, message: PostingMessage, next: PostingState): void {
  self.setState(next);
  self.send(message);
}
function settle(self: PostingInstance, message: PostingMessage, outcome: Outcome): void {
  self.setState('settled');
  message.reply(outcome);
}
function fault(message: string): Outcome {
  return { ok: false, fault: true, error: { code: 'STORAGE_FAILURE', message } };
}

// `send` is fire-and-forget, so adapt the reply handshkae to a promise.
export function runPosting(machine: PostingInstance, body: unknown): Promise<Outcome> {
  return new Promise((resolve) => machine.send({ payload: body, reply: resolve }));
}
