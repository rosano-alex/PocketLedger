# PocketLedger

PocketLedger is a small, single-account ledger with an Express and TypeScript API, a React and TypeScript interface, and JSON-backed transaction storage.

One rule guides the whole app: **the balance can never fall below zero.** If a debit would overdraw the account, PocketLedger declines it and clearly explains why in the interface.

## Quick Start

To run the API and web app side by side in development do:

```bash
npm install
npm run dev
```

The API runs at <http://localhost:4400> and the web app at <http://localhost:5273>.

```

To run the test suite:

```bash
npm test
```

Each folder contains small, focused modules exposed through an `index.ts` barrel, so imports refer to the folder rather than individual files.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/account` | Balance and transaction count |
| `GET` | `/api/transactions` | The last 5 transactions, newest first |
| `POST` | `/api/transactions` | Write one transaction |

Every response uses the same envelope:

```jsonc
{ "ok": true,  "data": { } }
{ "ok": false, "error": { "code": "INSUFFICIENT_FUNDS", "message": "Not enough funds. Balance is $3789.31." } }
```

Only two status codes are used. A **200** means the request was handled; the response body tells you whether the ledger accepted or declined it. A declined posting is an expected result, not a server error. A **500** means something went wrong on the server.

```bash
curl -X POST http://localhost:4400/api/transactions \
  -H 'Content-Type: application/json' \
  -d '{"amount":2500,"type":"credit","description":"Opening deposit"}'
```

The server sets the timestamp, so a request carries only `amount`, `type`, and `description`.

## How It Works

**Money is stored as integer cents.** All calculations use cents rather than floating-point numbers, so ten $0.10 debits from $1.00 land exactly at $0.00.

**Posting follows a state machine** (`server/src/posting/machine.ts`): `idle → validating → checkingFunds → persisting → settled`. Because `persisting` is only reachable after the funds check, an overdraft can never be written to disk. The form uses its own state machine to prevent double submissions. Both use [typed-fsm](https://github.com/rosano-alex/typed-fsm).

**Zustand manages local state on both sides.** The server uses it for the in-memory account; the client uses it for the form draft and submission state. TanStack Query owns the balance and transaction history, keeping one source of truth for server data.

**Writes are designed to be safe.** File I/O is asynchronous. Each update is written to a temporary file, then renamed over the ledger, so a crash cannot truncate the data. Postings are serialized to prevent concurrent debits from reading the same balance and jointly overdrawing the account. If a write fails, the in-memory balance is rolled back.

**An unreadable ledger stops the server.** A missing file is treated as a new account; any other read error prevents startup, protecting existing transaction data from being overwritten.

## Storage

Transactions live in `server/data/transactions.json`. The file is created on the first write and ignored by Git. Set `LEDGER_FILE` to use a different location.

