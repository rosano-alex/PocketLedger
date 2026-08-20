// The running order, named. Reading order across the page: the form is the
// left column and fills first, then the balance and the list it explains.
export const steps = {
  masthead: 0,
  form: 1,
  balance: 2,
  recent: 3,
  recentHeader: 4,
  // Rows continue off the header, one rung each.
  recentRow: (index: number) => 5 + index,
  // Last in, after the five rows above it.
  footer: 10,
} as const;
