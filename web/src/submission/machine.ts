import { createFSM } from '@codigos/typed-fsm';
import type {
  SubmissionDeps,
  SubmissionEvent,
  SubmissionInstance,
  SubmissionMessage,
  SubmissionState,
} from './types';

// handlers close over `deps` so they live here with the machine - pulling them
// out into their own file just buys indirection
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

  function handleIdle(message: SubmissionMessage, self: SubmissionInstance) {
    if (message.payload.type !== 'SUBMIT') return message.reply(false);

    deps.onNotice(null);
    self.setState('submitting');
    message.reply(true);
  }

  function settled(state: SubmissionState) {
    return (message: SubmissionMessage, self: SubmissionInstance) => {
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
