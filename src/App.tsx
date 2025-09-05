import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

const HomePage = lazy(() => import('./pages/HomePage'));
const RoutePage = lazy(() => import('./pages/RoutePage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen />}>
              <Layout>
                {/* <Routes /> */}
              </Layout>
            </Suspense>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                },
              }}
            />
          </ErrorBoundary>
        </QueryClientProvider>
      </I18nextProvider>
    </HelmetProvider>
  );
}

export default App;
