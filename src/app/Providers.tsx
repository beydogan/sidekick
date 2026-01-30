/**
 * App Providers - wraps the app with necessary context providers
 */

import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AIContextProvider} from '@features/ai-assistant';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({children}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AIContextProvider>{children}</AIContextProvider>
    </QueryClientProvider>
  );
};
