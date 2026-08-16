import type { Instance, Message } from '@codigos/typed-fsm';
import type { LedgerError, TransactionType } from '@pocketledger/shared';

export interface ValidTransaction {
  amountCents: number;
  type: TransactionType;
  description: string;
}

// `persisting` is only reachable through `checkingFunds`, so no later edit can
// write a transaction that overdraws the account. One machine per request.
export type PostingState = 'idle' | 'validating' | 'checkingFunds' | 'persisting' | 'settled';

export type Outcome =
  | { ok: true; balanceCents: number }
  | { ok: false; error: LedgerError; fault: boolean };

export interface PostingDeps {
  balanceCents: () => number;
  commit: (transaction: ValidTransaction, balanceAfterCents: number) => Promise<void>;
  onTransition?: (from: PostingState, to: PostingState) => void;
}

export type PostingMessage = Message<unknown, Outcome>;
export type PostingInstance = Instance<PostingState, unknown, Outcome>;

export type ValidationResult =
  | { ok: true; value: ValidTransaction }
  | { ok: false; error: LedgerError };
