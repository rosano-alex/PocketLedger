// Digits, one decmial point, two places, and an optional leading minus.
//
// The minus is kept on purpose - a negative amount has to be typeable so the
// server can refuse it and the user sees why. Used to strip it here and the
// Post button just sat there dead, which nobody could explain.
//
// The server really validates.
export function cleanAmount(raw: string): string {
  let whole = '';
  let fraction = ''; // fractional
  let afterPoint = false;

  const negative = raw.startsWith('-');

  for (const character of raw) {
    if (character >= '0' && character <= '9') {
      if (!afterPoint) whole += character;
      else if (fraction.length < 2) fraction += character;
    }
    else if (character === '.') {
      afterPoint = true;
    }
  }

  const magnitude = afterPoint ? `${whole}.${fraction}` : whole;

  return negative ? '-' + magnitude : magnitude;
}
