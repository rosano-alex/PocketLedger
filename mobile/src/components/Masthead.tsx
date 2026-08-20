import { Animated, StyleSheet, Text, View } from 'react-native';
import { steps } from '@pocketledger/shared/animation';
import { useFadeIn } from '../animation';
import { DISPLAY_FAMILY, useDisplayFont } from '../fonts';
import { colors, text } from '../theme';

// The same brush face the web masthead is set in, at a size that still leaves
// room for the balance underneath it on a phone.
export function Masthead() {
  const displayReady = useDisplayFont();
  const fade = useFadeIn(steps.masthead);

  return (
    <Animated.View style={[styles.masthead, fade]}>
      {/*
        Held back until the face is ready rather than swapped under the reader:
        the brush face is nothing like the system stack, so a fallback would
        visibly re-set itself a moment after the screen appears.
      */}
      <Text style={[styles.name, displayReady && styles.brush]}>PocketLedger</Text>
      <Text style={[text.label, styles.tagline]}>Single-account ledger</Text>

      {/* The one bit of coral above the fold, tying the masthead to the button. */}
      <View style={styles.rule} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  masthead: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(152, 193, 217, 0.2)',
    paddingBottom: 18,
  },
  name: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -0.6,
    color: colors.text,
  },
  brush: {
    fontFamily: DISPLAY_FAMILY,
    // 400, not 600: the brush face ships one weight, so a heavier request only
    // gets synthesised — which smears the stroke edges.
    fontWeight: '400',
    fontSize: 52,
    // Brush ascenders overshoot their em box; without the room they clip.
    lineHeight: 68,
    letterSpacing: 0,
    marginBottom: -6,
  },
  tagline: {
    marginTop: 6,
    fontSize: 10.5,
    letterSpacing: 2,
  },
  rule: {
    width: 54,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 14,
  },
});
