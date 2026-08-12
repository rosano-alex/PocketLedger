import { createFSM, type Instance, type Message } from '@codigos/typed-fsm';
import type { LedgerError, TransactionType } from '@pocketledger/shared';

// Amounts are cents internaly, so a long history can't drift.
export const toCents = (amount: number): number => Math.round(amount * 100);
export const toAmount = (cents: number): number => cents / 100;


export interface ValidTransaction {
  amountCents: number;
  type: TransactionType;
  description: string
}

export function validate(body: unknown): { ok: true; value: ValidTransaction } | { ok: false; error: LedgerError } {


  const input = body as Partial<Record<string, unknown>> | null;

  if (typeof input !== 'object' || input === null) return invalid('Invalid request.');

  const { amount, type, description } = input;

  if (type !== 'credit' && type !== 'debit') return invalid('Type must be credit or debit.');
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return invalid('Amount must be more than zero.');
  }
  if (typeof description !== 'string' || description.trim() === '') {
    return invalid('Description is required.');
  }

  return { ok: true, value: { amountCents: toCents(amount), type, description: description.trim() } };
}

function invalid(message: string): { ok: false; error: LedgerError } {
  return { ok: false, error: { code: 'INVALID_INPUT', message } };
}

// `persisting` is only reachable through `checkingFunds`, so no later edit can
// write a transaction that overdraws the account. One machine per request.
type PostingState = 'idle' | 'validating' | 'checkingFunds' | 'persisting' | 'settled';

export type Outcome =
  | { ok: true; balanceCents: number }
  | { ok: false; error: LedgerError; fault: boolean };

interface PostingDeps {
  balanceCents: () => number;
  commit: (transaction: ValidTransaction, balanceAfterCents: number) => Promise<void>;
  onTransition?: (from: PostingState, to: PostingState) => void;
}

type PostingMessage = Message<unknown, Outcome>;
type PostingInstance = Instance<PostingState, unknown, Outcome>;

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
          } catch (cause) {
            console.error('[ledger] failed to save:', cause);
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
