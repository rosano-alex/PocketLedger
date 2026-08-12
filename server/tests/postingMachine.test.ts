import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createPostingMachine, runPosting, toCents, validate } from '../src/postingMachine.js';

function machineWith(balanceCents: number, options: { failCommit?: boolean } = {}) {
  const transitions: string[] = [];
  let committed = 0;

  const machine = createPostingMachine({
    balanceCents: () => balanceCents,
    onTransition: (from, to) => transitions.push(`${from}->${to}`),
    commit: async () => {
      if (options.failCommit) throw new Error('disk on fire');
      committed += 1;
    },
  });

  return { machine, transitions, commits: () => committed };
}

const credit = { amount: 40, type: 'credit', description: 'Deposit' };
const debit = { amount: 40, type: 'debit', description: 'Withdrawal' };

describe('posting machine', () => {
  it('walks validate → check funds → persist for an accepted transaction', async () => {
    const { machine, transitions } = machineWith(0);
    const outcome = await runPosting(machine, credit);

    assert.equal(outcome.ok && outcome.balanceCents, 4000);
    assert.deepEqual(transitions, [
      'idle->validating',
      'validating->checkingFunds',
      'checkingFunds->persisting',
      'persisting->settled',
    ]);
  });

  it('allows a debit that lands exactly on zero', async () => {
    const { machine } = machineWith(4000);
    const outcome = await runPosting(machine, debit);

    assert.equal(outcome.ok && outcome.balanceCents, 0);
  });

  it('refuses a debit that would overdraw, and never persists it', async () => {
    const { machine, transitions, commits } = machineWith(3999);
    const outcome = await runPosting(machine, debit);

    assert.equal(outcome.ok, false);
    if (!outcome.ok) {
      assert.equal(outcome.error.code, 'INSUFFICIENT_FUNDS');
      assert.equal(outcome.fault, false, 'a refusal is not a server fault');
    }
    assert.equal(commits(), 0, 'nothing should have been written');
    assert.ok(!transitions.includes('checkingFunds->persisting'));
  });

  it('reports a save failure as a fault rather than a refusal', async () => {
    const { machine } = machineWith(0, { failCommit: true });
    const outcome = await runPosting(machine, credit);

    assert.equal(outcome.ok, false);
    if (!outcome.ok) {
      assert.equal(outcome.error.code, 'STORAGE_FAILURE');
      assert.equal(outcome.fault, true);
    }
  });
});

describe('validate', () => {
  it('accepts a well-formed transaction and converts to cents', () => {
    const result = validate({ amount: 25.5, type: 'credit', description: '  Opening  ' });

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.value, { amountCents: 2550, type: 'credit', description: 'Opening' });
    }
  });

  it('refuses anything that is not a usable transaction', () => {
    const bad: unknown[] = [
      'not a body',
      null,
      { amount: 25, type: 'transfer', description: 'Wrong type' },
      { amount: 0, type: 'credit', description: 'Zero' },
      { amount: -5, type: 'credit', description: 'Negative' },
      { amount: '10', type: 'credit', description: 'Not a number' },
      { amount: 25, type: 'credit', description: '   ' },
    ];

    for (const body of bad) {
      assert.equal(validate(body).ok, false, `expected ${JSON.stringify(body)} to be refused`);
    }
  });

  it('adds in cents, so float drift cannot creep in', () => {
    // 0.1 + 0.2 is 0.30000000000000004 in floats, and exactly 30 in cents.
    assert.equal(toCents(0.1) + toCents(0.2), 30);
  });
});
