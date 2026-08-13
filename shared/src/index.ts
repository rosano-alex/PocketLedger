export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  type: TransactionType;
  description: string;
  balanceAfter: number;
}

export interface TransactionInput {
  amount: number;
  type: TransactionType;
  description: string;
}


export interface Account {
  balance: number;
  transactionCount: number;
}

export interface LedgerError {
  code: 'INSUFFICIENT_FUNDS' | 'INVALID_INPUT' | 'STORAGE_FAILURE';
  message: string;
}

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
