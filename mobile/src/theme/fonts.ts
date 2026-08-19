import { Platform } from 'react-native';

// No bundled faces. The web app's three Google faces would each cost a load
// step on every cold start, and the system UI font is the one that already
// looks right on the device. Figures are the exception: money in a column has
// to be monospaced or the decimal points wander.
export const fonts = {
  body: Platform.select({ ios: 'System', default: 'sans-serif' }) as string,
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }) as string,
} as const;
