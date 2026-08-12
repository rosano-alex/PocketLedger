import type { Account, ApiResponse, PostResult, RecentResult, TransactionInput } from '@pocketledger/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useLedgerStore } from './store';



async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  }).catch(() => {
    throw new Error("Can't reach the server.");
  });


  const body = (await response.json()) as ApiResponse<T>;

  // A 500 is the server failng; a refusal comes back as 200 with ok: false.
  if (response.status >= 500) throw new Error(body.ok ? 'Something went wrong.' : body.error.message);

  return body;
}

async function read<T>(path: string): Promise<T> {

  const result = await request<T>(path);
  if (!result.ok) throw new Error(result.error.message);
  return result.data;
}

export function useAccount() {
  return useQuery({ queryKey: ['account'], queryFn: () => read<Account>('/account') });
}
export function useRecentTransactions() {

  return useQuery({ queryKey: ['transactions'], queryFn: () => read<RecentResult>('/transactions') });
}

// Resolves to the envelope, not to "success"; the machine reads the outcome.
export function usePostTransaction() {
  const queryClient = useQueryClient();
  const dispatch = useLedgerStore((state) => state.dispatch);

  return useMutation({
    mutationFn: (input: TransactionInput) =>
      request<PostResult>('/transactions', { method: 'POST', body: JSON.stringify(input) }),

    onSuccess: async (response) => {
      if (!response.ok) {
        dispatch({ type: 'REFUSED', error: response.error });
        return;
      }

      dispatch({ type: 'ACCEPTED' });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['account'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      ]);
    },

    onError: (cause: Error) => dispatch({ type: 'FAILED', message: cause.message }),
  });
}
