// A refusal answers something the user just did, so it should land, not drift
// in. Both fades are well under the stock 250ms.
const FADE = { type: 'timing', duration: 110 } as const;

// The stock scrim is a 0.5 wash, which barely registers against a dark page.
export const backdropSx = {
  ':animate': { opacity: 0.75 },
  ':transition': { opacity: FADE },
} as const;

export const contentSx = {
  ':initial': { scale: 0.96, opacity: 0 },
  ':exit': { scale: 0.96, opacity: 0 },
  ':transition': { type: 'spring', damping: 30, stiffness: 400, opacity: FADE },
} as const;
