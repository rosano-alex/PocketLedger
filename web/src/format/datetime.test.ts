import { when } from './datetime';

describe('when', () => {
  it('passes through a timestamp it cannot parse', () => {
    expect(when('not a date')).toBe('not a date');
  });
});
