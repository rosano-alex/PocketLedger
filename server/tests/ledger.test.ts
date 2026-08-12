import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import { Ledger } from '../src/ledger.js';

const dirs: string[] = [];

async function tempPath(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'pocketledger-'));
  dirs.push(dir);
  return join(dir, 'nested', 'transactions.json');
}

async function ledger(): Promise<Ledger> {
  const instance = new Ledger(await tempPath());
  await instance.load();
  return instance;
}

after(async () => {
  await Promise.all(dirs.map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('Ledger', () => {
  it('refuses an overdraw and leaves the balance untouched', async () => {
    const book = await ledger();
    await book.post({ amount: 10, type: 'credit', description: 'Deposit' });

    const outcome = await book.post({ amount: 10.01, type: 'debit', description: 'Too much' });

    assert.equal(outcome.ok, false);
    if (!outcome.ok) assert.equal(outcome.error.code, 'INSUFFICIENT_FUNDS');
    assert.deepEqual(book.summary(), { balance: 10, transactionCount: 1 });
  });

  it('returns the last five, newest first, with running balances', async () => {
    const book = await ledger();

    for (let n = 1; n <= 7; n += 1) {
      await book.post({ amount: n, type: 'credit', description: `Entry ${n}` });
    }

    const { transactions, balance } = book.recent();

    assert.equal(transactions.length, 5);
    assert.deepEqual(
      transactions.map((tx) => tx.description),
      ['Entry 7', 'Entry 6', 'Entry 5', 'Entry 4', 'Entry 3'],
    );
    assert.equal(transactions[0]?.balanceAfter, 28);
    assert.equal(balance, 28);
  });

    it('keeps money exact across many fractional entries', async () => {
        const book = await ledger();
    await book.post({ amount: 1, type: 'credit', description: 'Seed' });

    for (let n = 0; n < 10; n += 1) {
      await book.post({ amount: 0.1, type: 'debit', description: `Slice ${n}` });
    }

    // Ten 0.10 debits against 1.00 must land exactly on zero, not 1e-17.
    assert.equal(book.summary().balance, 0);
  });

  it('serialises concurrent debits so they cannot jointly overdraw', async () => {
    const book = await ledger();
    await book.post({ amount: 100, type: 'credit', description: 'Deposit' });

    const outcomes = await Promise.all([
      book.post({ amount: 60, type: 'debit', description: 'First' }),
      book.post({ amount: 60, type: 'debit', description: 'Second' }),
    ]);

    assert.equal(outcomes.filter((outcome) => outcome.ok).length, 1);
    assert.equal(book.summary().balance, 40);
  });

  it('persists across a restart', async () => {
    const path = await tempPath();

    const first = new Ledger(path);
    await first.load();
    await first.post({ amount: 19.99, type: 'credit', description: 'Deposit' });

    const saved = JSON.parse(await readFile(path, 'utf8')) as { amount: number }[];
    assert.equal(saved[0]?.amount, 19.99);

    const second = new Ledger(path);
    await second.load();
    assert.equal(second.summary().balance, 19.99);
  });

  it('rolls the balance back when the write fails', async () => {
    const book = await ledger();
    await book.post({ amount: 50, type: 'credit', description: 'Deposit' });

    (book as unknown as { save: () => Promise<void> }).save = () =>
      Promise.reject(new Error('disk full'));

    const outcome = await book.post({ amount: 10, type: 'credit', description: 'Lost' });

    assert.equal(outcome.ok, false);
    assert.deepEqual(book.summary(), { balance: 50, transactionCount: 1 });
  });
});
