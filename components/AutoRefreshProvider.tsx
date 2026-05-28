import React, { useEffect } from 'react';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

export const AutoRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { refreshAllData } = useAutoRefresh();
  
  useEffect(() => {
    (global as any).manualRefresh = async () => {
      console.log('Manual refresh triggered');
      await refreshAllData();
    };
  }, [refreshAllData]);
  
  return <>{children}</>;
};
