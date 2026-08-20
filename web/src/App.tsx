import { Box, HStack, VStack } from '@gluestack-ui/themed';
import { useAccount, useRecentTransactions } from '@pocketledger/shared/api';
import {
  BalancePanel,
  Container,
  Footer,
  Masthead,
  NoticeDialog,
  RecentTransactions,
  TransactionForm,
} from './components';

export default function App() {
  const account = useAccount();
  const recent = useRecentTransactions();

  return (
    <Box minHeight="100vh">
      <Masthead />

      {/*
        Two columns from the tablet break up: the form on the left, and the
        balance with the list it explains on the right. Below that the form
        stacks on top — it's what you came to do.
      */}
      <Container paddingVertical={28}>
        <HStack
          space="lg"
          alignItems="flex-start"
          sx={{ '@base': { flexDirection: 'column' }, '@md': { flexDirection: 'row' } }}
        >
          <Box width="100%" sx={{ '@md': { width: 330, flexShrink: 0 } }}>
            <TransactionForm />
          </Box>

          <VStack space="lg" flex={1} width="100%">
            <BalancePanel balance={account.data?.balance ?? 0} />
            <RecentTransactions transactions={recent.data?.transactions} error={recent.error} />
          </VStack>
        </HStack>

        <Footer />
      </Container>

      <NoticeDialog />
    </Box>
  );
}
