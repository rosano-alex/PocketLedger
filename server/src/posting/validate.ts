import type { LedgerError } from '@pocketledger/shared';
import { toCents } from './amounts.js';
import type { ValidationResult } from './types.js';

/*
 * Request validation.
 *
 * NOTE: this runs before the funds check, so anything that gets through here
 * is assumed well-formed by the rest of the machine. Don't loosen it without
 * looking at checkingFunds.
 *
 * TODO: description length cap? nothing enforces one right now
 */

export function validate(body: unknown): ValidationResult {
  const obj = body as Partial<Record<string, unknown>> | null;
  if (typeof obj !== 'object' || obj === null) {
    return invalid('Invalid request.');
  }

  const { amount, type, description } = obj;

  // type first - cheapest check
  if (type !== 'credit' && type !== 'debit') return invalid('Type must be credit or debit.');

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return invalid('Amount must be more than zero.');
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return invalid('Description is required.');
  }

  return {
    ok: true,
    value: {
      amountCents: toCents(amount),
      type,
      description: description.trim(),
    },
  };
}

function invalid(msg: string): { ok: false; error: LedgerError } {
  return { ok: false, error: { code: 'INVALID_INPUT', message: msg } };
}
