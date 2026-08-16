import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { createStore } from 'zustand/vanilla';
import type { Account, RecentResult, Transaction } from '@pocketledger/shared';
import {
  createPostingMachine,
  runPosting,
  toAmount,
  toCents,
  type Outcome,
  type ValidTransaction,
} from './posting/index.js';

const RECENT_LIMIT = 5;

// Transactions are stored exactly as they go over the wire. Arithmetic still
// happens in cents; nothing here ever adds two floats together.
interface State {
  entries: Transaction[];
  balanceCents: number;
}

// In-memory state lives in a vanilla zustand store, the JSON file is the
// durabel copy, and all file I/O is async.
export class Ledger {
  private readonly store = createStore<State>()(() => ({ entries: [], balanceCents: 0 }));
  private queue: Promise<unknown> = Promise.resolve();

  constructor(readonly filePath: string) {}

  async load(): Promise<void> {
    let raw: string;

    try {
      raw = await readFile(this.filePath, 'utf8');
    } catch (cause) {
      // No file, or an empty one, means an acount nobody has written to yet.
      if ((cause as { code?: string }).code === 'ENOENT') return;
      throw cause;
    }

    if (raw.trim() === '') return;

    // Refuse to start on a ledger we can't read. Treating it as empty would
    // wipe real transactions the first time anything is posted.
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`Ledger file is not valid JSON: ${this.filePath}`);
    }
    if (!Array.isArray(parsed)) {
      throw new Error(`Ledger file is not a list of transactions: ${this.filePath}`);
    }

    // Each entry carries its running balance, so loading is a lookup, not a sum.
    const entries = parsed as Transaction[];
    this.store.setState({ entries, balanceCents: toCents(entries.at(-1)?.balanceAfter ?? 0) });
  }

  summary(): Account {
    const { entries, balanceCents } = this.store.getState();
    return { balance: toAmount(balanceCents), transactionCount: entries.length };
  }

  recent(): RecentResult {
    const { entries, balanceCents } = this.store.getState();

    return {
        transactions: entries.slice(-RECENT_LIMIT).reverse(),
      balance:toAmount(balanceCents),
        };
  }

  // One at a time, or two debits could read the same balance.
  post(body: unknown): Promise<Outcome> {
    const task = () =>
      runPosting(
        createPostingMachine({
          balanceCents: () => this.store.getState().balanceCents,
          commit: (transaction, balanceAfterCents) => this.commit(transaction, balanceAfterCents),
        }),
        body,
      );

    const result = this.queue.then(task, task);
    this.queue = result.catch(() => undefined);
    return result;
  }

  private async commit(transaction: ValidTransaction, balanceAfterCents: number): Promise<void> {
    const previous = this.store.getState();
    const entry: Transaction = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      amount: toAmount(transaction.amountCents),
      type: transaction.type,
      description: transaction.description,
      balanceAfter: toAmount(balanceAfterCents),
    };

    this.store.setState({ entries: [...previous.entries, entry], balanceCents: balanceAfterCents });

    try {
      await this.save();
    } catch (cause) {
      // Memory must never claim a balance the file doesn't back.
      this.store.setState(previous);
      throw cause;
    }
  }

  // Temp file then rename: atomic, so a crash can't trucate the ledger.
  private async save(): Promise<void> {
    const json = JSON.stringify(this.store.getState().entries, null, 2);

    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(`${this.filePath}.tmp`, `${json}\n`, 'utf8');
    await rename(`${this.filePath}.tmp`, this.filePath);
  }
}
