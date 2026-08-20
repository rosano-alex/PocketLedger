import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAccount, useRecentTransactions } from '@pocketledger/shared/api';
import {
  BalancePanel,
  Footer,
  Ground,
  Masthead,
  NoticeDialog,
  RecentTransactions,
  TransactionForm,
} from '../components';
import { useRefresh } from '../refresh';
import { colors } from '../theme';

// The same blocks in the same order the web app stacks them in once it is
// narrower than a tablet: the form first, because it is what you came to do,
// then the balance and the list that explains it.
export function LedgerScreen() {
  const account = useAccount();
  const recent = useRecentTransactions();
  const { refreshing, refresh } = useRefresh();
  const insets = useSafeAreaInsets();

  return (
    <Ground>
      {/*
        The top inset belongs to the viewport, not to the scrolling content:
        padding inside the ScrollView only places the *first* screenful clear of
        the notch, and everything after it slides up under the clock. Insetting
        the frame means the list scrolls beneath nothing.
      */}
      <SafeAreaView style={styles.fill} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.fill}
          // Android already resizes the window; on iOS the keyboard would sit
          // over the description field.
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.fill}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
            // So tapping Post while the keyboard is up presses the button rather
            // than just dismissing the keyboard.
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.textMuted} />
            }
          >
            <Masthead />
            <TransactionForm />
            <BalancePanel balance={account.data?.balance ?? 0} />
            <RecentTransactions transactions={recent.data?.transactions} error={recent.error} />
            <Footer />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <NoticeDialog />
    </Ground>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 18,
  },
});
