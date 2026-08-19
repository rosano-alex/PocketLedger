import type { Transaction } from '@pocketledger/shared';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { figure, when } from '@pocketledger/shared/format';
import { useFadeIn } from '../../animation';
import { colors, fonts, text } from '../../theme';
import { TypeBadge } from './TypeBadge';

// The web app lays these out as a five-column table, which does not survive a
// phone
export function Row({ transaction, step, last }: { transaction: Transaction; step: number; last: boolean }) {
  const fade = useFadeIn(step);

  return (
    <Animated.View style={[styles.row, last && styles.last, fade]}>
      <View style={styles.line}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        {/* Unsigned; the badge below carries the direction. */}
        <Text style={styles.amount}>{figure(transaction.amount)}</Text>
      </View>

      <View style={[styles.line, styles.underline]}>
        <View style={styles.meta}>
          <TypeBadge type={transaction.type} />
          <Text style={styles.when}>{when(transaction.timestamp)}</Text>
        </View>

        <Text style={styles.balance}>{figure(transaction.balanceAfter)}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.rowLine,
  },
  // A rule under the final row would fence the list in.
  last: {
    borderBottomColor: 'transparent',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  underline: {
    marginTop: 6,
  },
  description: {
    ...text.body,
    flexShrink: 1,
  },
  amount: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.text,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  when: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.textMuted,
  },
  balance: {
    fontFamily: fonts.mono,
    fontSize: 11.5,
    color: colors.textMuted,
  },
});
