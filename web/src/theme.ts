import { config as base } from '@gluestack-ui/config';
import { createConfig } from '@gluestack-style/react';

export const theme = createConfig({
  ...base,
  tokens: {
    ...base.tokens,
    colors: {
      ...base.tokens.colors,
      surface: '#16181c',
      surfaceMuted: '#22262c',
      text: '#e8eaed',
      textMuted: '#9aa0a6',
      line: '#2a2e34',
      credit: '#60a5fa',
      debit: '#facc15',
      danger: '#f87171',
      dangerWash: '#2b1618',
      warn: '#fbbf24',
      warnWash: '#2a2113',
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


