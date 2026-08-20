import { GluestackUIProvider } from '@gluestack-ui/themed';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@pocketledger/shared/api';
import { StrictMode } from 'react';


import { createRoot } from 'react-dom/client'
//
import App from './App';
import { theme } from './theme';
// styles.css paints the dark page ground. Without it body keeps the UA default,
// which is white in a light-mode browser — the app's own dark surfaces then sit
// on a white page.
import './styles.css';
import './fonts.css';
import './animation/fade.css';


const queryClient = createQueryClient();

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
