import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { configureApi, createQueryClient } from '@pocketledger/shared/api';
import { devApiBaseUrl } from './src/api';
import { LedgerScreen } from './src/screens';


configureApi(devApiBaseUrl());

const queryClient = createQueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* The ground is dark at every point the bar sits over. */}
        <StatusBar style="light" />
        <LedgerScreen />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
