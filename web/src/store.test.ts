import { useLedgerStore } from './store';

describe('ledger store', () => {
  beforeEach(() => {
    useLedgerStore.getState().dispatch({ type: 'EDIT' });
    useLedgerStore.setState({ draft: { amount: '', type: 'credit', description: '' }, notice: null });
  });

  it('mirrors the machine state into `status`', () => {
    expect(useLedgerStore.getState().status).toBe('idle');

    useLedgerStore.getState().dispatch({ type: 'SUBMIT' });
    expect(useLedgerStore.getState().status).toBe('submitting');

    useLedgerStore.getState().dispatch({ type: 'ACCEPTED' });
    expect(useLedgerStore.getState().status).toBe('accepted');
  });

  it('drops a refusal notice as soon as the user edits', () => {
    useLedgerStore.getState().dispatch({ type: 'SUBMIT' });
    useLedgerStore
      .getState()
      .dispatch({ type: 'REFUSED', error: { code: 'INSUFFICIENT_FUNDS', message: 'No funds.' } });

    expect(useLedgerStore.getState().notice?.tone).toBe('refused');

    useLedgerStore.getState().setField('amount', '5');

    expect(useLedgerStore.getState().notice).toBeNull();
    expect(useLedgerStore.getState().status).toBe('idle');
  });
});
