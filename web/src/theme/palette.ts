// The five colours the UI is drawn from. Every colour token is one of these,
// so the whole app repaints from this file.
export const palette = {
  navy: '#293241',
  blue: '#3d5a80',
  sky: '#98c1d9',
  ice: '#e0fbfc',
  coral: '#ee6c4d',
} as const;

// Two mixes the five can't cover on their own: a pressed-down coral for the
// button hover, and a blue dim enough for placeholder text, which at $sky
// reads as filled-in rather than empty — but only just dim enough, so labels
// stay legible against the lit panels.
export const shades = {
  coralDeep: '#d95c3f',
  skyDim: '#a6c3d9',
} as const;

// Plain white, for text that sits on top of a filled control. The five are all
// coloured, and a label on a coral or sky fill wants no colour of its own.
export const onFill = '#ffffff';

// The same five at low alpha — badge fills, hairlines, and the wells that
// sit behind inputs. Kept as literals because they go into the RN style
// system, which has no colour-mixing of its own.
export const veils = {
  skyWash: 'rgba(152, 193, 217, 0.2)',
  skyEdge: 'rgba(152, 193, 217, 0.46)',
  coralWash: 'rgba(238, 108, 77, 0.2)',
  coralEdge: 'rgba(238, 108, 77, 0.52)',
  hairline: 'rgba(152, 193, 217, 0.26)',
  // A film of light rather than a hole: on lit panels a dark pit reads as a
  // dead patch, where sky at low alpha still reads as somewhere to type.
  well: 'rgba(224, 251, 252, 0.08)',
  // Neutral, because it lands on whichever half of the switch you're over.
  hover: 'rgba(152, 193, 217, 0.16)',
} as const;
