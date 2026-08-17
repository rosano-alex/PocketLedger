import type { Transaction } from '@pocketledger/shared';
import { Box, Text, VStack } from '@gluestack-ui/themed';
import { steps } from '../../animation';
import { figure, when } from '../../format';
import { Panel } from '../Panel';
import { Cell } from './Cell';
import { Row } from './Row';
import { TypeBadge } from './TypeBadge';
import { columns } from './columns';

interface RecentTransactionsProps {
  transactions: Transaction[] | undefined;
  error: Error | null;
}

const TITLE = 'Last 5 transactions';

// Stacks, not a `<table>`; gluestack rendres React Native views.
export function RecentTransactions({ transactions, error }: RecentTransactionsProps) {

  if (error) {
    return (
      <Panel title={TITLE} step={steps.recent}>
        <Text role="status" fontFamily="$body" color="$danger" sx={{ fontSize: 14 }}>{error.message}</Text>
      </Panel>
    );
  }

  const rows = transactions ?? [];

  return (
    <Panel title={TITLE} step={steps.recent}>
      <VStack role="table">
        <Row header step={steps.recentHeader}>
          <Cell head flex={columns.date}>Date</Cell>
          <Cell head flex={columns.description}>Description</Cell>
          <Cell head flex={columns.type}>Type</Cell>
          <Cell head flex={columns.amount} align="right">
            Amount
          </Cell>
          <Cell head optional flex={columns.balance} align="right">
            Balance
          </Cell>
        </Row>

        {rows.map((t, i) => (
          // keyed by id so an existing row keeps its node and doesn't replay
          // the fade - only a newly posted one animates
          <Row key={t.id} step={steps.recentRow(i)}>
            <Cell flex={columns.date} mono muted>{when(t.timestamp)}</Cell>
            <Cell flex={columns.description}>{t.description}</Cell>

            <Box flex={columns.type} minWidth={0} role="cell">
              <TypeBadge type={t.type} />
            </Box>

            {
              // Unsigned; the Type column carries the direction.
            }
            <Cell flex={columns.amount} align="right" mono>{figure(t.amount)}</Cell>
            <Cell flex={columns.balance} align="right" mono muted optional>{figure(t.balanceAfter)}</Cell>
          </Row>
        ))}

        {rows.length === 0 ? (
          <Box paddingVertical={22}>
            <Text role="status" fontFamily="$body" color="$hint" sx={{ fontSize: 13 }}>
              Nothing posted yet — the first transaction will appear here.
            </Text>
          </Box>
        ) : null}
      </VStack>
    </Panel>
  );
}
