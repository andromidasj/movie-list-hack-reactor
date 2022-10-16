import { MantineProvider } from '@mantine/core';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <MantineProvider
        theme={{
          colorScheme: 'dark',
        }}
        withNormalizeCSS
        withGlobalStyles
      >
        <App />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </BrowserRouter>
  </QueryClientProvider>
);
