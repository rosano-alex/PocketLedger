import { cleanAmount, money, when } from './format';

describe('format', () => {
  it('formatz money with a symbol and two decimals', () => {
    //
    expect(money(1234.5)).toBe('$1,234.50');
    expect(money(0)).toBe('$0.00');
  });


  it('passes through a timestamp it cannot parse', () => {
    //
    expect(when('not a date')).toBe('not a date');
  });
});

describe('cleanAmount', () => {
  it('drps characters that could never be an amount', () => {
    expect(cleanAmount('$1,250.99')).toBe('1250.99');

    expect(cleanAmount('abc')).toBe('');
  });


  it('keeps one decimal point and at most two places', () => {
    expect(cleanAmount('1.2.3')).toBe('1.23');
    expect(cleanAmount('1.2345')).toBe('1.23');
  });
});
