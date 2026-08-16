import type { Notice } from '../../submission';

interface ToneStyle {
  title: string;
  colour: string;
}

// The two things a tone decides. Anything else about the dialog is the same
// either way.
export function toneStyle(notice: Notice | null): ToneStyle {
  return notice?.tone === 'refused'
    ? { title: 'Transaction refused', colour: '$danger' }
    : { title: 'Something went wrong', colour: '$warn' };
}
