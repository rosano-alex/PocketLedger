import { GluestackUIProvider } from '@gluestack-ui/themed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';


import { createRoot } from 'react-dom/client'
//
import App from './App';
import { theme } from './theme';


const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10_000, retry: 1 }, mutations: { retry: false } },
});

const container = document.getElementById('root');
if (!container) throw new Error('No #root element.');

createRoot(container).render(
  <StrictMode>
    <GluestackUIProvider config={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GluestackUIProvider>
  </StrictMode>,
);
