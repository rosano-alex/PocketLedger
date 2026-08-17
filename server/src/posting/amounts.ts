// Amounts are cents internaly, so a long history can't drift.
// (learned this the hard way - 0.1 + 0.2 etc)

export const toCents = (amount: number): number => Math.round(amount * 100);

export function toAmount(cents: number): number {
  return cents / 100;
}
