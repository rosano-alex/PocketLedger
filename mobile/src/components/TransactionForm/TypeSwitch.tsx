import type { TransactionType } from '@pocketledger/shared';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';
import { TypeOption } from './TypeOption';

interface TypeSwitchProps {
  value: TransactionType;
  onSelect: (field: 'type', value: TransactionType) => void;
}

// A sunken track holding two halves, so the pair reads as one switch.
export function TypeSwitch({ value, onSelect }: TypeSwitchProps) {
  return (
    <View style={styles.track} accessibilityRole="radiogroup" accessibilityLabel="Transaction type">
      <TypeOption value="credit" selected={value === 'credit'} onSelect={onSelect} />
      <TypeOption value="debit" selected={value === 'debit'} onSelect={onSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: colors.well,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 4,
  },
});
