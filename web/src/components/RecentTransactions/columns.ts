// Shared by the header and the body, so the two can't drift out of alignment.
// Type is wider than its label needs: it holds a pill, not a word.
export const columns = {
  date: 25,
  description: 26,
  type: 15,
  amount: 17,
  balance: 17,
} as const;
