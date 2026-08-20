import { moneyParts } from './parts';

describe('moneyParts', () => {
  it('splits the symbol and whole dollars from the cents', () => {
    expect(moneyParts(4542.84)).toEqual({ dollars: '$4,542', cents: '84' });
  });

  it('keeps the minus sign with the dollars', () => {
    expect(moneyParts(-4542.84)).toEqual({ dollars: '-$4,542', cents: '84' });
  });

  it('pads a whole amount to two cents', () => {
    expect(moneyParts(0)).toEqual({ dollars: '$0', cents: '00' });
    expect(moneyParts(12)).toEqual({ dollars: '$12', cents: '00' });
  });
});
