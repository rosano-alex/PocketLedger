import { StyleSheet, Text, View } from 'react-native';
import { steps } from '@pocketledger/shared/animation';
import { moneyParts } from '@pocketledger/shared/format';
import { colors, fonts, text } from '../theme';
import { Panel } from './Panel';

// The headline. The cents drop to a third of the dollars' size and into the
// muted blue, so the figure reads as one number with a tail rather than as two.
export function BalancePanel({ balance }: { balance: number }) {
  const { dollars, cents } = moneyParts(balance);

  return (
    <Panel title="Balance" step={steps.balance}>
      <View style={styles.row}>
        <Text style={styles.dollars}>{dollars}</Text>
        <Text style={styles.cents}>.{cents}</Text>
        <Text style={[text.label, styles.unit]}>USD</Text>
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dollars: {
    fontFamily: fonts.body,
    fontSize: 46,
    fontWeight: '500',
    letterSpacing: -1.4,
    color: colors.text,
  },
  cents: {
    fontFamily: fonts.body,
    fontSize: 20,
    fontWeight: '500',
    color: colors.textMuted,
    marginLeft: 2,
  },
  unit: {
    marginLeft: 8,
    letterSpacing: 1.6,
  },
});
