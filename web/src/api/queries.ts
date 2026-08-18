import type { Account, RecentResult } from '@pocketledger/shared';
import { useQuery } from '@tanstack/react-query';
import { read } from './client';
import { keys } from './keys';

export function useAccount() {
  return useQuery({ queryKey: keys.account, queryFn: () => read<Account>('/account') });
}

export function useRecentTransactions() {
  return useQuery({
    queryKey: keys.transactions,
    queryFn: () => read<RecentResult>('/transactions'),
  });
}
