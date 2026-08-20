import { QueryClient } from '@tanstack/react-query';

// Both clients talk to the same small API over the same kind of connection, so
// they cache it the same way. Ten seconds is long enough that switching back to
// the app doesn't refetch what it just showed, and short enough that a posting
// made elsewhere turns up quickly. Mutations never retry: a refusal is an
// answer, and re-sending a POST could post twice.
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 10_000, retry: 1 },
      mutations: { retry: false },
    },
  });
}
