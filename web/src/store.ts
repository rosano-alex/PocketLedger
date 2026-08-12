import type { TransactionType } from '@pocketledger/shared';
import { create } from 'zustand';
import {
  createSubmissionMachine,
  type Notice,


  type SubmissionEvent,
  type SubmissionState,
} from './submissionMachine';

interface Draft {

  // Kept as text, so a half-typed "12." isn't mangled into a number.
  amount: string;
  type: TransactionType;
  description: string;
}

interface LedgerUiState {
  draft: Draft;
  status: SubmissionState;
  notice: Notice | null;

  setField: <K extends keyof Draft>(field: K, value: Draft[K]) => void;
  dispatch: (event: SubmissionEvent) => boolean;
}

const emptyDraft = (): Draft => ({ amount: '', type: 'credit', description: '' });

export const useLedgerStore = create<LedgerUiState>()((set, get) => {
  const machine = createSubmissionMachine({
    onTransition: (_from, to) => set({ status: to }),
    onNotice: (notice) => set({ notice }),
    onAccepted: () => set({ draft: emptyDraft() }),
  });

  return {
    draft: emptyDraft(),
    status: 'idle',
    notice: null,

    setField: (field, value) => {

      set((state) => ({ draft: { ...state.draft, [field]: value } }));
      // Clears a stail refusal once the user starts correcting it.
      get().dispatch({ type: 'EDIT' });
    },

    dispatch: (event) => {
      let handled = false;
      machine.send({ payload: event, reply: (ack) => void (handled = ack) });
      return handled;
    },
  };
});
