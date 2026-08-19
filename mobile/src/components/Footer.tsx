import { Animated, StyleSheet, Text } from 'react-native';
import { steps } from '@pocketledger/shared/animation';
import { useFadeIn } from '../animation';
import { colors, text } from '../theme';

// The ledger has exactly one rule, and it decides half of what the UI ever says
// back to you. Worth stating once, quietly, at the foot of the screen.
export function Footer() {
  const fade = useFadeIn(steps.footer);

  return (
    <Animated.View style={[styles.footer, fade]}>
      <Text style={[text.label, styles.rule]}>No transaction may take the balance below zero</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    marginTop: 32,
    paddingTop: 18,
  },
  rule: {
    letterSpacing: 1.6,
    lineHeight: 16,
  },
});
