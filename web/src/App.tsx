import { Box, HStack, Heading, Text, VStack } from '@gluestack-ui/themed';
import { useAccount, useRecentTransactions } from './api';
import { Panel } from './components/Panel';

import { RecentTransactions } from './components/RecentTransactions';


import { TransactionForm } from './components/TransactionForm';
import { money } from './format';
import { useLedgerStore } from './store';
import type { Notice } from './submissionMachine';




export default function App() {
  //
  const account = useAccount();
  const recent = useRecentTransactions();
  const notice = useLedgerStore((state) => state.notice);

  return (
    //
    <Box minHeight="100vh">
      <Box bg="#16181c" borderBottomWidth={1} borderBottomColor="#2a2e34">
        <Container paddingVertical={16}>
          <Heading fontFamily='system-ui, -apple-system, "Segoe UI", sans-serif' color="$text" fontWeight="600" sx={{ fontSize: 30 }}>
            PocketLedger
          </Heading>
        </Container>
      </Box>

      <Container paddingVertical="$6">
        <HStack
          space="lg"
          alignItems="flex-start"
          sx={{ '@base': { flexDirection: 'column' }, '@lg': { flexDirection: 'row' } }}
        >
          <VStack space="lg" flex={1} width="100%">
            <Panel title="Balance">
              <Text
                fontFamily="$mono"
                color="$text"
                dataSet={{ figure: true }}
                sx={{ fontSize: 32, lineHeight: 40 }}
              >
                {money(account.data?.balance ?? 0)}
              </Text>
            </Panel>

            <NoticeBanner notice={notice} />
            <RecentTransactions transactions={recent.data?.transactions} error={recent.error} />
          </VStack>

          <Box width="100%" sx={{ '@lg': { width: 340, flexShrink: 0 } }}>
            <TransactionForm />
          </Box>
        </HStack>
      </Container>
    </Box>
  );
}

function Container({ children, paddingVertical }: { children: React.ReactNode; paddingVertical: string | number }) {
  return (
    <Box
      width="100%"
      maxWidth={1000}
      marginHorizontal="auto"
      paddingHorizontal={20}
      paddingVertical={paddingVertical}
    >
      {children}
    </Box>
  );
}

function NoticeBanner({ notice }: { notice: Notice | null }) {
  if (!notice) return null;
  const colour = notice.tone === 'refused' ? '$debit' : '$warn';

  return (
    <Box
      role="alert"
      bg={notice.tone === 'refused' ? '$debitWash' : '$warnWash'}
      borderWidth={1}
      borderColor={colour}
      borderRadius={4}
      paddingHorizontal="$4"
      paddingVertical="$3"
    >
      <Text fontFamily="$body" color={colour} sx={{ fontSize: 13, lineHeight: 20 }}>
        {notice.message}
      </Text>
    </Box>
  );
}
