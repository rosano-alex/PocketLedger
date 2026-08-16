import type { Instance } from '@codigos/typed-fsm';
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

export interface SubmissionDeps {
  onAccepted: () => void;
  onNotice: (notice: Notice | null) => void;
  onTransition?: (from: SubmissionState, to: SubmissionState) => void;
}

export type SubmissionInstance = Instance<SubmissionState, SubmissionEvent, boolean>;

// The handshake every state handler receives.
export type SubmissionMessage = {
  payload: SubmissionEvent;
  reply: (ack: boolean) => void;
};
