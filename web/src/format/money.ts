const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/**
 * With the symbol, for the headline balance.
 * @param amount dollars (not cents!)
 */
export function money(amount: number): string {
  return currency.format(amount);
}

/**
 * Bare digits, for table columns that already sit under a labelled header.
 */
export function figure(amount: number): string {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });
}
