// The masthead face, shared with the web app rather than copied into this
// project — it is 2.3MB, and one of it is enough.
//
// Named to match the web's @font-face family so the two mastheads are set in
// the same words as well as the same face.
export const DISPLAY_FAMILY = 'Ink Brush Arabic';

export const displayFont = {
  [DISPLAY_FAMILY]: require('../../../shared/assets/fonts/InkBrushArabic_DEMO-Textured.otf'),
};
