// The running order lives in shared: mobile stages the same blocks in the
// same sequence, on the same ladder of delays. Only `fadeIn` is web's,
// because it pairs with fade.css.
export { FADE_DURATION_MS, FADE_EASING, fadeDelay, steps } from '@pocketledger/shared/animation';
export { fadeIn } from './fadeIn';
