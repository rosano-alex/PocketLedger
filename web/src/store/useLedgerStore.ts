import { create } from 'zustand';
import { createSubmissionMachine } from '../submission';
import { emptyDraft } from './draft';
import type { LedgerUiState } from './types';

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

    // returns whether the machine actually handled it
    dispatch: (event) => {
      let handled = false;
      machine.send({ payload: event, reply: (ack) => void (handled = ack) });
      return handled;
    },
  };
});
