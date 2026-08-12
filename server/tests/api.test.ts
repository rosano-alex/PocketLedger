import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import type { Express } from 'express';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Ledger } from '../src/ledger.js';

const dirs: string[] = [];

async function app(): Promise<{ server: Express; ledger: Ledger }> {
  const dir = await mkdtemp(join(tmpdir(), 'pocketledger-api-'));
  dirs.push(dir);

  const ledger = new Ledger(join(dir, 'transactions.json'));
  await ledger.load();

  return { server: await createApp(ledger), ledger };
}

after(async () => {
  await Promise.all(dirs.map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('HTTP API', () => {
  it('GET /api/account returns 200 and the balance', async () => {
    const { server } = await app();
    const response = await request(server).get('/api/account').expect(200);

    assert.deepEqual(response.body, { ok: true, data: { balance: 0, transactionCount: 0 } });
  });

  it('POST /api/transactions returns 200 and the stored transaction', async () => {
    const { server } = await app();

    const response = await request(server)
      .post('/api/transactions')
      .send({ amount: 120.5, type: 'credit', description: 'Invoice 0042' })
      .expect(200);

    assert.equal(response.body.ok, true);
    assert.equal(response.body.data.balance, 120.5);
    assert.equal(response.body.data.transaction.amount, 120.5);
    assert.equal(response.body.data.transaction.balanceAfter, 120.5);
    assert.ok(response.body.data.transaction.id);
  });

  it('GET /api/transactions returns the last five, newest first', async () => {
    const { server } = await app();

    for (let n = 1; n <= 6; n += 1) {
      await request(server)
        .post('/api/transactions')
        .send({ amount: n, type: 'credit', description: `Entry ${n}` })
        .expect(200);
    }

    const response = await request(server).get('/api/transactions').expect(200);

    assert.equal(response.body.data.transactions.length, 5);
    assert.equal(response.body.data.transactions[0].description, 'Entry 6');
    assert.equal(response.body.data.balance, 21);
  });

  it('refuses an overdrawing debit with 200 and a message for the UI', async () => {
    const { server } = await app();
    await request(server)
      .post('/api/transactions')
      .send({ amount: 20, type: 'credit', description: 'Deposit' })
      .expect(200);

    // The request was understood and answered; the ledger simply said no.
    const response = await request(server)
      .post('/api/transactions')
      .send({ amount: 20.01, type: 'debit', description: 'Overdraft attempt' })
      .expect(200);

    assert.equal(response.body.ok, false);
    assert.equal(response.body.error.code, 'INSUFFICIENT_FUNDS');
    assert.ok(response.body.error.message.includes('Not enough funds'));

    const account = await request(server).get('/api/account').expect(200);
    assert.equal(account.body.data.balance, 20);
  });

  it('refuses invalid input', async () => {
    const { server } = await app();

    const response = await request(server)
      .post('/api/transactions')
      .send({ amount: -1, type: 'credit', description: 'Negative' })
      .expect(200);

    assert.equal(response.body.error.code, 'INVALID_INPUT');
  });

  it('answers malformed JSON with the standard envelope', async () => {
    const { server } = await app();

    const response = await request(server)
      .post('/api/transactions')
      .set('Content-Type', 'application/json')
      .send('{ not json')
      .expect(200);

    assert.equal(response.body.error.code, 'INVALID_INPUT');
  });

  it('returns 500 when the ledger cannot be written', async () => {
    const { server, ledger } = await app();
    (ledger as unknown as { save: () => Promise<void> }).save = () =>
      Promise.reject(new Error('disk full'));

    const response = await request(server)
      .post('/api/transactions')
      .send({ amount: 5, type: 'credit', description: 'Doomed' })
      .expect(500);

    assert.equal(response.body.error.code, 'STORAGE_FAILURE');
  });
});
