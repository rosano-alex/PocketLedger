import { config as base } from '@gluestack-ui/config';
import { createConfig } from '@gluestack-style/react';
import { onFill, palette, shades, veils } from '@pocketledger/shared/theme';

export const theme = createConfig({
  ...base,
  tokens: {
    ...base.tokens,
    colors: {
      ...base.tokens.colors,
      surface: palette.navy,
      surfaceMuted: palette.blue,
      text: palette.ice,
      textMuted: palette.sky,
      // Placeholders and adornments — present, but clearly not a value.
      hint: shades.skyDim,
      line: veils.hairline,
      // The one loud colour, kept for things the user acts on.
      accent: palette.coral,
      accentHover: shades.coralDeep,
      onAccent: palette.navy,
      // Label colour for anything drawn on top of a filled control.
      onFill,
      // Inputs and the segmented track sink into the panel rather than
      // sitting on it, so the eye reads them as somewhere to put something.
      well: veils.well,
      hover: veils.hover,
      credit: palette.sky,
      creditWash: veils.skyWash,
      creditEdge: veils.skyEdge,
      debit: palette.coral,
      debitWash: veils.coralWash,
      debitEdge: veils.coralEdge,
      danger: palette.coral,
      warn: palette.sky,
    },
    fonts: {
      ...base.tokens.fonts,
      // The masthead only. Falls back to the heading stack while the face
      // loads, and permanently if it fails to.
      display: '"Ink Brush Arabic", Georgia, serif',
      // The balance, and nothing else — one serif on the page, on the one
      // number the page exists to show.
      serif: '"Fraunces", Georgia, "Times New Roman", serif',
      heading: '"Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
      body: '"Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
      mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    },
  },
} as const);

type Theme = typeof theme;

declare module '@gluestack-ui/themed' {
  interface UIConfig extends Theme { }
}
