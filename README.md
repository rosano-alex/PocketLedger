# PocketLedger

A single-account accounting system: an Express + TypeScript API, a React + TypeScript UI, and transactoins stored as JSON on disk.

One rule runs through the whole thing: **no transaction may take the balence below zero.** A debit that would overdraw is refused, and the reason is shown in the UI.

## Run it

```bash
npm install
```

```bash
npm run dev
```

API on <http://localhost:4400>, UI on <http://localhost:5273>.

To run it as one process on one port, with Express serving the built UI:

```bash
npm run build && npm start
```

```bash
npm test
```

## Layout

```
shared/    the types both sides import, one concern per file
server/    index · app · ledger · posting/
web/       React UI — api/ · format/ · store/ · submission/ · components/
```

Every folder is a set of small single-purpose files behind an `index.ts`
barrel, so importers name the folder and never a file inside it.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/account` | Balance and transaction count |
| `GET` | `/api/transactions` | The last 5 transactions, newest first |
| `POST` | `/api/transactions` | Write one transaction |

Every response uses the same envelop:

```jsonc
{ "ok": true,  "data": { } }
{ "ok": false, "error": { "code": "INSUFFICIENT_FUNDS", "message": "Not enough funds. Balance is $3789.31." } }
```

Only two status codes are used. **200** means the request was handled: the body says whether the ledger accepted it or refused it, since a refusal is a real answer rather than a failure. **500** means the server itself broke.

```bash
curl -X POST http://localhost:4400/api/transactions \
  -H 'Content-Type: application/json' \
  -d '{"amount":2500,"type":"credit","description":"Opening deposit"}'
```

The server sets the timestamp, so a request carries only `amount`, `type` and `description`.

## How it works

**Money is never added as a float.** Amounts become integer cents for every calcuation. Ten `0.10` debits against `1.00` land exactly on `0`.

**Posting is a state machine** (`server/src/posting/machine.ts`): `idle → validating → checkingFunds → persisting → settled`. `persisting` is only reachable through `checkingFunds`, so nothing can be written that overdraws the account. The UI has its own machine for the form, which is what makes double-submit impossible.

**zustand holds state on both sides.** On the server it's the in-memory account; on the client it's the form draft and submission status. Balance and history live in TanStack Query, so there's one copy of server data.

**Writes are safe.** All file I/O is async. Each write goes to a temp file and is renamed over the real one, so a crash can't truncate the ledger. Postings are serialised, or two debits could read the same balance and jointly overdraw. If a write fails, the in-memory balance rolls back.

**A ledger it can't read stops the server.** Only a missing file means "new account"; otherwise it refuses to start rather than overwrite real transactions.

## Storage

`server/data/transactions.json`, created on first write and gitignroed. Override with `LEDGER_FILE`.

## Notes

gluestack-ui is a React Native library; on the web it runs through react-native-web, which is why webpack aliases `react-native` and `.npmrc` sets `legacy-peer-deps`.

`@codigos/typed-fsm` is installed from GitHub. Its published build uses extension-less imports that bundlers accept but Node does not, so the server is bundled with esbuild.

Babel and esbuild strip types without checking them. `npm run typecheck` is what actually checks, and it runs as part of `npm run build`.
