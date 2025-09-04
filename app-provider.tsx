import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,   // data considered fresh for 1 hour
      gcTime: 360 * 60 * 1000,     // garbage collect after 6 hours of inactivity
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
  maxAge: 24 * 60 * 60 * 1000, // keep cache up to 1 day between launches
});

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
