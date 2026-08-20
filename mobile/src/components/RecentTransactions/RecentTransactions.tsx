import type { Transaction } from '@pocketledger/shared';
import { StyleSheet, Text, View } from 'react-native';
import { steps } from '@pocketledger/shared/animation';
import { colors, text } from '../../theme';
import { Panel } from '../Panel';
import { Row } from './Row';

interface RecentTransactionsProps {
  transactions: Transaction[] | undefined;
  error: Error | null;
}



const TITLE = 'Last 5 transactions';

export function RecentTransactions({ transactions, error }: RecentTransactionsProps) {
  if (error) {
    return (
      <Panel title={TITLE} step={steps.recent}>
        <Text style={styles.error} accessibilityRole="alert">
          {error.message}
        </Text>
      </Panel>
    );
  }

  const rows = transactions ?? [];

  return (
    <Panel title={TITLE} step={steps.recent}>
      {rows.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nothing posted yet — the first transaction will appear here.</Text>
        </View>
      ) : (


        // Keyed by id so an existing row keeps its node and does not replay the
        // fade; only a newly posted one animates.
        rows.map((transaction, index) => (
          <Row
            key={transaction.id}
            transaction={transaction}
            step={steps.recentRow(index)}
            last={index === rows.length - 1}
          />
        ))
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  error: {
    ...text.body,
    color: colors.danger,
  },
  empty: {
    paddingVertical: 18,
  },
  emptyText: {
    ...text.body,
    fontSize: 13,
    color: colors.hint,
    lineHeight: 19,
  },
});
