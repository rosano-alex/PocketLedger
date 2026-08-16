// One place for the cache keys, so a query and the mutation that invalidates
// it can never drift apart.
export const keys = {
  account: ['account'] as const,
  transactions: ['transactions'] as const,
};
