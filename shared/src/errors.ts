export interface LedgerError {
  code: 'INSUFFICIENT_FUNDS' | 'INVALID_INPUT' | 'STORAGE_FAILURE';
  message: string;
}
