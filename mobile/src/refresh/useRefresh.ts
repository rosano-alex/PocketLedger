import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { keys } from '@pocketledger/shared/api';

// Pull to refresh — a gesture the web app has no use for, since a browser tab
// has a reload button and a phone screen does not. Both figures are refetched
// together so the balance and the list it explains can never disagree.
export function useRefresh() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);

    void Promise.all([
      queryClient.refetchQueries({ queryKey: keys.account }),
      queryClient.refetchQueries({ queryKey: keys.transactions }),
    ]).finally(() => setRefreshing(false));
  }, [queryClient]);

  return { refreshing, refresh };
}
