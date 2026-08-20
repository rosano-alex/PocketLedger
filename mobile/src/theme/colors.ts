import { onFill, palette, shades, veils } from '@pocketledger/shared/theme';

// The same five colours the web app is drawn from, mapped to the roles this
// app uses them in. Repainting both clients still happens in one file:
// shared/src/theme/palette.ts.
export const colors = {
  // The foot of the web page's gradient, and this app's ground.
  page: '#212c3d',
  // The three-stop fall behind it. Softer than the web's four washes, which
  // lean on blend modes and a grain layer that RN has no equivalent for.
  pageFall: ['#3c5480', '#2e3c54', '#212c3d'] as const,

  // Frosted navy. RN has no backdrop blur, so the panel carries the tint the
  // blur would have picked up from the page behind it.
  panel: 'rgba(62, 80, 108, 0.9)',
  panelEdge: veils.hairline,
  // The lit hairline along a panel's top edge.
  panelLip: 'rgba(224, 251, 252, 0.1)',

  text: palette.ice,
  textMuted: palette.sky,
  hint: shades.skyDim,
  line: veils.hairline,
  rowLine: 'rgba(152, 193, 217, 0.16)',

  accent: palette.coral,
  accentPressed: shades.coralDeep,
  onAccent: palette.navy,
  onFill,

  well: veils.well,
  pressed: veils.hover,

  credit: palette.sky,
  creditWash: veils.skyWash,
  creditEdge: veils.skyEdge,
  debit: palette.coral,
  debitWash: veils.coralWash,
  debitEdge: veils.coralEdge,

  danger: palette.coral,
  warn: palette.sky,

  scrim: 'rgba(0, 0, 0, 0.75)',
} as const;
