import type { LedgerError } from './errors.js';
import type { Transaction } from './transaction.js';

// 200 + `ok: false` menas the ledger said no; 500 means the server failed.
export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: LedgerError };

export interface PostResult {
  transaction: Transaction;
  balance: number;
}

export interface RecentResult {
  transactions: Transaction[];
  balance: number;
}
