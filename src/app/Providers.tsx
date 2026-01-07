/**
 * App Providers - wraps the app with necessary context providers
 */

import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({children}) => {
  // Future: Add QueryClientProvider, theme provider, etc.
  return <>{children}</>;
};
