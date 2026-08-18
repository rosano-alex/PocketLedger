import { cleanAmount } from './amount';

describe('cleanAmount', () => {
  it('drps characters that could never be an amount', () => {
    expect(cleanAmount('$1,250.99')).toBe('1250.99');

    expect(cleanAmount('abc')).toBe('');
  });

  it('keeps one decimal point and at most two places', () => {
    expect(cleanAmount('1.2.3')).toBe('1.23');
    expect(cleanAmount('1.2345')).toBe('1.23');
  });

  it('keeps a leading minus so a negative amount can be attempted', () => {
    expect(cleanAmount('-10')).toBe('-10');
    expect(cleanAmount('-$1,250.99')).toBe('-1250.99');

    // Only leading. A minus anywhere else is noise, not a sign.
    expect(cleanAmount('10-5')).toBe('105');
  });
});
