const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export interface MoneyParts {
  /** Symbol, sign and whole dollars, e.g. `-$4,542`. */
  dollars: string;
  /** The two fractional digits alone, without the point. */
  cents: string;
}

/**
 * The headline balance, split so the cents can be set smaller than the
 * dollars. They are the least significant thing on the page and still have to
 * be there.
 *
 * @param amount dollars (not cents!)
 */
export function moneyParts(amount: number): MoneyParts {
  const parts = currency.formatToParts(amount);

  const cents = parts.find((part) => part.type === 'fraction')?.value ?? '00';

  const dollars = parts
    .filter((part) => part.type !== 'fraction' && part.type !== 'decimal')
    .map((part) => part.value)
    .join('');

  return { dollars, cents };
}
