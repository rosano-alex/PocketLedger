import { createFSM, type Instance } from '@codigos/typed-fsm';
import type { LedgerError } from '@pocketledger/shared';

// A submit can succeed, be refused, or fail, and flags for that allow
// imposible combinations. Double-submit is structural here: `SUBMIT` isn't
// handled while one is in flight.
export type SubmissionState = 'idle' | 'submitting' | 'accepted' | 'refused' | 'failed';

export type SubmissionEvent =
  | { type: 'SUBMIT' }
  | { type: 'ACCEPTED' }
  | { type: 'REFUSED'; error: LedgerError }
  | { type: 'FAILED'; message: string }
  | { type: 'EDIT' };

// Only failures are shown; a success speaks through the updated balnace.
export interface Notice {
  tone: 'refused' | 'failed';
  message: string;
}

interface SubmissionDeps {
  onAccepted: () => void;
  onNotice: (notice: Notice | null) => void;
  onTransition?: (from: SubmissionState, to: SubmissionState) => void;
}

type SubmissionInstance = Instance<SubmissionState, SubmissionEvent, boolean>;

export function createSubmissionMachine(deps: SubmissionDeps): SubmissionInstance {
  return createFSM<SubmissionState, SubmissionEvent, boolean>({
    initialState: 'idle',
    ...(deps.onTransition ? { onChange: deps.onTransition } : {}),
    states: {
      idle: { onMessage: handleIdle },
      submitting: {
        onMessage(message, self) {
          const event = message.payload;

          switch(event.type){
            case 'ACCEPTED':
              self.setState('accepted');
              deps.onAccepted();
              deps.onNotice(null);
              return message.reply(true);

            case 'REFUSED':
              self.setState('refused');
              deps.onNotice({ tone: 'refused', message: event.error.message });
              return message.reply(true);

            case 'FAILED':
              self.setState('failed');
              deps.onNotice({ tone: 'failed', message: event.message });
              return message.reply(true);

            default:
              return message.reply(false);
          }
        },
      },
      accepted: { onMessage: settled('accepted') },
      refused: { onMessage: settled('refused') },
      failed: { onMessage: settled('failed') },
    },
  });

  function handleIdle(
    message: { payload: SubmissionEvent; reply: (ack: boolean) => void },
    self: SubmissionInstance,
  ) {
    if (message.payload.type !== 'SUBMIT') return message.reply(false);

    deps.onNotice(null);
    self.setState('submitting');
    message.reply(true);
  }

  function settled(state: SubmissionState) {
    return (
      message: { payload: SubmissionEvent; reply: (ack: boolean) => void },
      self: SubmissionInstance,
    ) => {
      if (message.payload.type === 'SUBMIT') return handleIdle(message, self);

      // Nothing to clear after a success, so only failures reset on edit.
      if (message.payload.type === 'EDIT' && state !== 'accepted') {
        deps.onNotice(null);
        self.setState('idle');
        return message.reply(true);
      }

      return message.reply(false);
    };
  }
}
