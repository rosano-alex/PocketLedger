import type { Notice } from './types';

// What a notice is called. The colour that goes with it is each platform's own
// business — the two clients name their tokens differently — but the wording a
// user reads should not depend on which one they opened.
export function noticeTitle(notice: Notice | null): string {
  return notice?.tone === 'refused' ? 'Transaction refused' : 'Something went wrong';
}
