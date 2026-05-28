import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './lib/store';
import { setStore } from './api/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // data considered fresh for 1 hour
      gcTime: 30 * 60 * 1000, // garbage collect after 6 hours of inactivity
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
    },
  },
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

persistQueryClient({
  queryClient,
  persister,
  maxAge: 12 * 60 * 60 * 1000, // keep cache up to 12 hours between launches
});

export default function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setStore(store);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
