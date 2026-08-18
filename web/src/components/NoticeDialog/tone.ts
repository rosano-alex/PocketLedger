import type { Notice } from '@pocketledger/shared/submission';
import { noticeTitle } from '@pocketledger/shared/submission';

interface ToneStyle {
  title: string;
  colour: string;
}

// The two things a tone decides. Anything else about the dialog is the same
// either way. The wording comes from shared; only the token is web's.
export function toneStyle(notice: Notice | null): ToneStyle {
  return {
    title: noticeTitle(notice),
    colour: notice?.tone === 'refused' ? '$danger' : '$warn',
  };
}
