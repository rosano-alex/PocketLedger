// Panels are 70ms apart so each is distinctly its own beat; the table rows
// that follow are 45ms apart so they read as one sweep, not a queue.
const PANEL_STEP_MS = 70;
const ROW_STEP_MS = 45;

// `steps.recentHeader` is the last panel-paced beat; everything after it is a
// row.
const LAST_PANEL_STEP = 4;

export const FADE_DURATION_MS = 460;

// A strong ease-out: most of the distance is covered immediately, then it
// settles. Reads as confident rather than floaty.
export const FADE_EASING = [0.16, 1, 0.3, 1] as const;

/** How long a given step in the entrance waits before it starts. */
export function fadeDelay(step: number): number {
  return step <= LAST_PANEL_STEP
    ? step * PANEL_STEP_MS
    : LAST_PANEL_STEP * PANEL_STEP_MS + (step - LAST_PANEL_STEP) * ROW_STEP_MS;
}
