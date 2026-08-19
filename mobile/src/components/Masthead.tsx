import { Animated, StyleSheet, Text, View } from 'react-native';
import { steps } from '@pocketledger/shared/animation';
import { useFadeIn } from '../animation';
import { colors, fonts, text } from '../theme';

// The web masthead is set in a bundled brush face at 62px. On a phone that is
// most of the first screen, so the name is set in the system face at a size
// that leaves room for the balance underneath it.
export function Masthead() {
  const fade = useFadeIn(steps.masthead);

  return (
    <Animated.View style={[styles.masthead, fade]}>
      <Text style={styles.name}>PocketLedger</Text>
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
    fontFamily: fonts.body,
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -0.6,
    color: colors.text,
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
