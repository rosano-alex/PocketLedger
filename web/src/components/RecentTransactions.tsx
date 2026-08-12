import type { Transaction } from '@pocketledger/shared';
import { Box, HStack, Text, VStack } from '@gluestack-ui/themed';
import { figure, when } from '../format';

import { Panel } from './Panel';

interface RecentTransactionsProps {
  transactions: Transaction[] | undefined;
  error: Error | null;
}

// Stacks, not a `<table>`; gluestack rendres React Native views.
export function RecentTransactions({ transactions, error }: RecentTransactionsProps) {


  if (error) {

    return (
      <Panel title="Last 5 transactions">
        <Text role="status" fontFamily="$body" color="$debit" sx={{ fontSize: 14 }}>
          {error.message}
        </Text>
      </Panel>
    );
  }

  return (
    <Panel title="Last 5 transactions">
      <VStack role="table">
        <Row header>
          <Cell flex={25}>Date</Cell>
          <Cell flex={28}>Description</Cell>
          <Cell flex={13}>Type</Cell>
          <Cell flex={17} align="right">
            Amount
          </Cell>
          <Cell flex={17} align="right">
            Balance
          </Cell>
        </Row>

        {(transactions ?? []).map((transaction) => (
          <Row key={transaction.id}>
            <Cell flex={25} mono muted>
              {when(transaction.timestamp)}
            </Cell>

            <Cell flex={28}>{transaction.description}</Cell>
            <Cell flex={13}>{transaction.type === 'credit' ? 'Credit' : 'Debit'}</Cell>
            {
              // Unsigned; the Type column carries the direction.
            }


            <Cell flex={17} align="right" mono>
              {figure(transaction.amount)}
            </Cell>
            <Cell flex={17} align="right" mono muted>
              {figure(transaction.balanceAfter)}
            </Cell>
          </Row>
        ))}
      </VStack>
    </Panel>
  );
}

function Row({ children, header = false }: { children: React.ReactNode; header?: boolean }) {
  return (
    <HStack
      role="row"
      space="sm"
      alignItems="center"
      paddingVertical={header ? 8 : 12}
      borderBottomWidth={1}
      borderBottomColor="#2a2e34"
    >
      {children}
    </HStack>
  );
}

function Cell({
  children,
  flex,
  align = 'left',
  mono = false,
  muted = false,
}: {
  children: string;
  flex: number;
  align?: 'left' | 'right';
  mono?: boolean;
  muted?: boolean;
}) {




  return (
    <Box flex={flex} minWidth={0} role="cell">
      <Text
        fontFamily={mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : '$body'}
        color={muted ? '$textMuted' : '$text'}
        textAlign={align}
        numberOfLines={1}
        dataSet={{ figure: mono }}
        sx={{ fontSize: 13 }}
      >
        {children}
      </Text>
    </Box>
  );
}
