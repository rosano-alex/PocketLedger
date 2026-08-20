import type { TransactionType } from '@pocketledger/shared';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../../theme';

interface TypeOptionProps {
  value: TransactionType;
  selected: boolean;
  onSelect: (field: 'type', value: TransactionType) => void;
}

// One half of the segmented control. The chosen half fills with the colour that
// type carries everywhere else — sky for credit, coral for debit — so the form
// says which way the money is going in the same language as the table.
export function TypeOption({ value, selected, onSelect }: TypeOptionProps) {
  const fill = value === 'credit' ? colors.credit : colors.debit;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.option,
        selected && { backgroundColor: fill },
        !selected && pressed && { backgroundColor: colors.pressed },
      ]}
      onPress={() => onSelect('type', value)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={value}
    >
      {/*
        Both halves are set in white; the unselected one is held back with
        opacity rather than a second colour, so the fill alone says which is
        chosen.
      */}
      <Text style={[styles.text, !selected && styles.unselected]}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.onFill,
  },
  unselected: {
    opacity: 0.62,
  },
});
