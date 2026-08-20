import type { Draft } from './types';

export const emptyDraft = (): Draft => ({ amount: '', type: 'credit', description: '' });
