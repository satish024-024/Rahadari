import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';
import './styles/animations.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const RoutePage = lazy(() => import('./pages/RoutePage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
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
            <Router>
              <Suspense fallback={<LoadingScreen />}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/route" element={<RoutePage />} />
                  </Routes>
                </Layout>
              </Suspense>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#fff',
                    borderRadius: '12px',
                  },
                }}
              />
            </Router>
          </ErrorBoundary>
        </QueryClientProvider>
      </I18nextProvider>
    </HelmetProvider>
  );
}

export default App;