import type { TransactionType } from '@pocketledger/shared';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';

// Sky for money in, coral for money out. The word stays in the badge: colour is
// the emphasis, never the only telling.
export function TypeBadge({ type }: { type: TransactionType }) {
  const credit = type === 'credit';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: credit ? colors.creditWash : colors.debitWash,
          borderColor: credit ? colors.creditEdge : colors.debitEdge,
        },
      ]}
    >

      <Text style={[styles.label, { color: credit ? colors.credit : colors.debit }]}>
        {credit ? 'Credit' : 'Debit'}
      </Text>
    </View>
  );
}




const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
