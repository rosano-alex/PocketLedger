import { figure, money } from './money';

describe('money', () => {
  it('formatz money with a symbol and two decimals', () => {
    expect(money(1234.5)).toBe('$1,234.50');
    expect(money(0)).toBe('$0.00');
  });

  it('groups a bare figure without a symbol', () => {
    expect(figure(1234.5)).toBe('1,234.50');
  });
});
