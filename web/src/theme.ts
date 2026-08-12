import { config as base } from '@gluestack-ui/config';
import { createConfig } from '@gluestack-style/react';

export const theme = createConfig({
  ...base,
  tokens: {
    ...base.tokens,
    colors: {
      ...base.tokens.colors,
      surface: '#ffffff',
      surfaceMuted: '#fafafa',
      text: '#1a1a1a',
      textMuted: '#5f6368',
      line: '#e3e3e3',
      debit: '#b3261e',
      debitWash: '#fdf2f1',
      warn: '#8a6116',
      warnWash: '#fdf6e8',
    },
    fonts: {
      ...base.tokens.fonts,
      heading: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      body: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    },
  },
} as const);

type Theme = typeof theme;

declare module '@gluestack-ui/themed' {
  interface UIConfig extends Theme { }
}


