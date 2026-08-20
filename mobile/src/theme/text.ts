import type { TextStyle } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

// The three voices the UI speaks in, so a size or a letterspacing is set in one
// place rather than at each call site.
export const text = {
  // Small caps, wide, quiet. Every panel title, column header and field label.
  label: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.hint,
  } satisfies TextStyle,

  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
  } satisfies TextStyle,

  // Anything that is a number in a column.
  figure: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.text,
  } satisfies TextStyle,
} as const;
