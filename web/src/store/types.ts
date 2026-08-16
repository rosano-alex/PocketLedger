import type { TransactionType } from '@pocketledger/shared';
import type { Notice, SubmissionEvent, SubmissionState } from '../submission';

export interface Draft {
  // Kept as text, so a half-typed "12." isn't mangled into a number.
  amount: string;
  type: TransactionType;
  description: string;
}

export interface LedgerUiState {
  draft: Draft;
  status: SubmissionState;
  notice: Notice | null;

  setField: <K extends keyof Draft>(field: K, value: Draft[K]) => void;
  dispatch: (event: SubmissionEvent) => boolean;
}
