const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const dateTime = new Intl.DateTimeFormat('en-US', {
  // dinero!
  month: 'short',
  day: '2-digit',
  hour: 'numeric',
  minute: '2-digit',
});

export function money(amount: number): string {

  return currency.format(amount);
}

export function figure(amount: number): string {
  return amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });
}

export function when(iso: string): string {

  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? iso : dateTime.format(parsed);
}

// Digits and one decmial point, two places. The server really validates.
export function cleanAmount(raw: string): string {
  let whole = '';
  // fractional 
  let fraction = '';
  let afterPoint = false;

  for (const character of raw) {

    if (character >= '0' && character <= '9') {
      if (!afterPoint) whole += character;
      else if (fraction.length < 2) fraction += character;
    } else if (character === '.') {
      afterPoint = true;
    }
  }

  return afterPoint ? `${whole}.${fraction}` : whole;
}
