import { money } from './money';

export interface MoneyParts {
  /** Symbol, sign and whole dollars, e.g. `-$4,542`. */
  dollars: string;
  /** The two fractional digits alone, without the point. */
  cents: string;
}

/**
 * The headline balance, split so the cents can be set smaller than the
 * dollars. They are the least significant thing on the screen and still have to
 * be there.
 *
 * Split off the formatted string rather than with `formatToParts`, which
 * Hermes does not implement — on the phone that call is `undefined` and the
 * balance takes the whole screen down with it. `money` is already the one
 * currency formatter, and en-US/USD always ends in a point and two digits.
 *
 * @param amount dollars (not cents!)
 */
export function moneyParts(amount: number): MoneyParts {
  const formatted = money(amount);
  const point = formatted.lastIndexOf('.');

  return point === -1
    ? { dollars: formatted, cents: '00' }
    : { dollars: formatted.slice(0, point), cents: formatted.slice(point + 1) };
}
