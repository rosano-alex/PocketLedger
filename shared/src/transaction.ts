export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  type: TransactionType;
  description: string;
  balanceAfter: number;
}

// The server sets id, timestamp and balanceAfter, so a request carries only these.
export interface TransactionInput {
  amount: number;
  type: TransactionType;
  description: string;
}
