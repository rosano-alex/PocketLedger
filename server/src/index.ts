import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { createApp } from './app.js';
import { Ledger } from './ledger.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PORT = Number(process.env.PORT ?? 4400);

const LEDGER_FILE = process.env.LEDGER_FILE ?? resolve(root, 'data/transactions.json');

const WEB_ROOT = resolve(root, '../web/dist');

const ledger = new Ledger(LEDGER_FILE);

// Load before acepting traffic, or the first request sees an empty balance.
await ledger.load();

const app = await createApp(ledger, WEB_ROOT);
app.listen(PORT, () => {
  console.log(`PocketLedger on http://localhost:${PORT}`);
  console.log(`Ledger file: ${LEDGER_FILE}`);
});
