import { createSubmissionMachine, type Notice, type SubmissionEvent } from './index';

function harness() {
  const notices: (Notice | null)[] = [];
  let cleared = 0;

  const machine = createSubmissionMachine({
    onNotice: (notice) => notices.push(notice),
    onAccepted: () => {
      cleared += 1;
    },
  });

  const send = (event: SubmissionEvent): boolean => {
    let handled = false;

    machine.send({ payload: event, reply: (ack) => void (handled = ack) });
    return handled;
  };

  return { machine, send, notices, cleared: () => cleared };
}

describe('submission machine', () => {

  it('starts idle and moves to submitting', () => {
    const { machine, send } = harness();

    expect(machine.currentState).toBe('idle');



    expect(send({ type: 'SUBMIT' })).toBe(true);
    expect(machine.currentState).toBe('submitting');
  });

  it('ignores a second SUBMIT while one is in flight', () => {
    const { machine, send } = harness();
    send({ type: 'SUBMIT' });

    // This is what stops a double-click posting two transactions.
    expect(send({ type: 'SUBMIT' })).toBe(false);
    expect(machine.currentState).toBe('submitting');
  });

  it('clears the form on acceptance', () => {
    const { machine, send, cleared } = harness();
    send({ type: 'SUBMIT' });
    send({ type: 'ACCEPTED' });

    expect(machine.currentState).toBe('accepted');
    expect(cleared()).toBe(1);
  });

  it('surfaces a refusal without clearing the form', () => {
    const { machine, send, notices, cleared } = harness();
    send({ type: 'SUBMIT' });
    send({ type: 'REFUSED', error: { code: 'INSUFFICIENT_FUNDS', message: 'Not enough funds.' } });

    expect(machine.currentState).toBe('refused');
    expect(cleared()).toBe(0);
    expect(notices.at(-1)).toEqual({ tone: 'refused', message: 'Not enough funds.' });
  });

  it('distinguishes a failure from a refusal', () => {
    const { machine, send, notices } = harness();
    send({ type: 'SUBMIT' });
    send({ type: 'FAILED', message: "Can't reach the server." });

    expect(machine.currentState).toBe('failed');
    expect(notices.at(-1)?.tone).toBe('failed');
  });

  it('clears a refusal when the user edits', () => {
    const { machine, send, notices } = harness();
    send({ type: 'SUBMIT' });
    send({ type: 'REFUSED', error: { code: 'INSUFFICIENT_FUNDS', message: 'No.' } });

    expect(send({ type: 'EDIT' })).toBe(true);
    expect(machine.currentState).toBe('idle');
    expect(notices.at(-1)).toBeNull();
  });
});
