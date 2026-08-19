import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';

interface SubmitButtonProps {
  onPress: () => void;
  isDisabled: boolean;
  isSubmitting: boolean;
}

// The screen's only filled control, and the only warm thing on it — so it
// glows a little coral onto the panel underneath.
export function SubmitButton({ onPress, isDisabled, isSubmitting }: SubmitButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isSubmitting }}
    >
      <View style={styles.content}>
        {isSubmitting ? <ActivityIndicator size="small" color={colors.onFill} /> : null}
        <Text style={styles.label}>{isSubmitting ? 'Posting…' : 'Post transaction'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    // Android has no coloured shadow; elevation is the closest it gets.
    elevation: 4,
  },
  pressed: {
    backgroundColor: colors.accentPressed,
  },
  disabled: {
    opacity: 0.35,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.onFill,
  },
});
