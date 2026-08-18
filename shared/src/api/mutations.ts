import type { PostResult } from '../responses';
import type { TransactionInput } from '../transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLedgerStore } from '../store';
import { request } from './client';
import { keys } from './keys';

// Resolves to the envelope, not to "success"; the machine reads the outcome.
export function usePostTransaction() {
  const queryClient = useQueryClient();
  const dispatch = useLedgerStore((state) => state.dispatch);

  return useMutation({
    mutationFn: (input: TransactionInput) =>
      request<PostResult>('/transactions', { method: 'POST', body: JSON.stringify(input) }),

    onSuccess: async (res) => {
      if (!res.ok) {
        // ledger said no. not an error, just an answer
        dispatch({ type: 'REFUSED', error: res.error });
        return;
      }

      dispatch({ type: 'ACCEPTED' });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.account }),
        queryClient.invalidateQueries({ queryKey: keys.transactions }),
      ]);
    },

    onError: (cause: Error) => dispatch({ type: 'FAILED', message: cause.message }),
  });
}
