import { usePostTransaction } from '../api';
import { useLedgerStore } from '../store';

/*
 * The form's decision-making, kept out of its markup: what the amount parses
 * to, whether the button is live, and what pressing it does.
 */
export function useSubmit() {
  const draft = useLedgerStore((state) => state.draft);
  const status = useLedgerStore((state) => state.status);
  const dispatch = useLedgerStore((state) => state.dispatch);

  const post = usePostTransaction();

  const isSubmitting = status === 'submitting';
  const amount = Number.parseFloat(draft.amount);

  // NB: negative and zero ARE submittable, deliberately. The ledger refuses
  // them and the user gets told why. Only a non-number ("", "-", ".") blocks,
  // since there's nothing to send.
  const canSubmit = Number.isFinite(amount) && draft.description.trim() !== '' && !isSubmitting;

  function submit() {
    // machine is the guard - won't take SUBMIT while one's in flight
    if (!canSubmit || !dispatch({ type: 'SUBMIT' })) return;

    post.mutate({ amount: amount, type: draft.type, description: draft.description.trim() });
  }

  return { canSubmit, isSubmitting, submit };
}
