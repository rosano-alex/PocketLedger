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
shared/    the types both sides import
server/    index · app · ledger · postingMachine
web/       React UI
```
