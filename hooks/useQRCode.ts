import { useState, useRef, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { api } from '@/api/api';

// Constants for QR code management
const QR_REFRESH_INTERVAL = 10000; // 10 seconds
const QR_EXPIRY_BUFFER = 5000; // 5 seconds before expiry
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds between retries

interface QRCodeState {
  qrValue: string | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  timeUntilExpiry: number;
  shouldShowManualRefresh: boolean;
}

interface QRCodeActions {
  fetchQRCode: (isRetry?: boolean) => Promise<void>;
  handleManualRefresh: () => void;
}

export const useQRCode = (): QRCodeState & QRCodeActions => {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(0);

  // Refs for timer management
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const qrExpiryTimeRef = useRef<number>(0);

  // Clear all timers safely
  const clearAllTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Calculate time until QR expires
  const getTimeUntilExpiry = useCallback(() => {
    const now = Date.now();
    const timeUntilExpiry = qrExpiryTimeRef.current - now;
    return Math.max(0, Math.ceil(timeUntilExpiry / 1000));
  }, []);

  // Determine if manual refresh should be shown
  const shouldShowManualRefresh = useCallback(() => {
    // Always show on error
    if (error) return true;

    // Show if QR is about to expire (less than 10 seconds)
    if (qrValue && timeUntilExpiry <= 10) return true;

    // Show if QR seems stale (no recent fetch)
    if (qrValue && lastFetchTime > 0) {
      const timeSinceLastFetch = Date.now() - lastFetchTime;
      if (timeSinceLastFetch > QR_REFRESH_INTERVAL + 5000) return true;
    }

    return false;
  }, [error, qrValue, timeUntilExpiry, lastFetchTime]);

  // Fetch QR code with retry logic and protection against concurrent calls
  const fetchQRCode = useCallback(
    async (isRetry: boolean = false) => {
      // Prevent concurrent API calls
      if (isFetchingRef.current) {
        console.log('QR fetch already in progress, skipping...');
        return;
      }

      // Check if component is still mounted
      if (!isMountedRef.current) {
        console.log('Component unmounted, skipping QR fetch');
        return;
      }

      isFetchingRef.current = true;

      try {
        if (!isRetry) {
          setLoading(true);
        }

        const res = await api.get('/attendee/qr');

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) {
          return;
        }

        if (res.data?.qrCode) {
          setQrValue(res.data.qrCode);
          setError(null);
          setRetryCount(0);
          setLastFetchTime(Date.now());

          // Calculate QR expiry time (assuming QR codes are valid for 30 seconds)
          qrExpiryTimeRef.current = Date.now() + 30000;

          console.log('QR code fetched successfully');
        } else {
          throw new Error('Invalid QR code response');
        }
      } catch (e: any) {
        console.error('QR fetch error:', e);

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) {
          return;
        }

        setError(e.message || 'Failed to fetch QR code');

        // Implement retry logic
        if (retryCount < MAX_RETRY_ATTEMPTS) {
          const newRetryCount = retryCount + 1;
          setRetryCount(newRetryCount);

          console.log(`Retrying QR fetch (attempt ${newRetryCount}/${MAX_RETRY_ATTEMPTS})`);

          retryTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              fetchQRCode(true);
            }
          }, RETRY_DELAY);
        } else {
          console.error('Max retry attempts reached for QR fetch');
          setRetryCount(0);
        }
      } finally {
        isFetchingRef.current = false;
        if (!isRetry) {
          setLoading(false);
        }
      }
    },
    [retryCount],
  );

  // Check if QR code is about to expire and refresh if needed
  const checkQRExpiry = useCallback(() => {
    const now = Date.now();
    const timeUntilExpiry = qrExpiryTimeRef.current - now;

    if (timeUntilExpiry <= QR_EXPIRY_BUFFER && !isFetchingRef.current) {
      console.log('QR code about to expire, refreshing...');
      fetchQRCode();
    }
  }, [fetchQRCode]);

  // Handle app state changes
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App came to foreground, check if QR needs refresh
        const timeSinceLastFetch = Date.now() - lastFetchTime;
        if (timeSinceLastFetch > QR_REFRESH_INTERVAL || !qrValue) {
          console.log('App became active, refreshing QR code');
          fetchQRCode();
        }
      } else if (nextAppState === 'background') {
        // App went to background, clear timers to save resources
        console.log('App went to background, clearing timers');
        clearAllTimers();
      }
    },
    [lastFetchTime, qrValue, fetchQRCode, clearAllTimers],
  );

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    if (!isFetchingRef.current) {
      console.log('Manual QR refresh triggered');
      fetchQRCode();
    }
  }, [fetchQRCode]);

  // Initialize QR code management
  useEffect(() => {
    isMountedRef.current = true;

    // Initial QR fetch
    fetchQRCode();

    // Set up interval for regular QR refresh
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        checkQRExpiry();
      }
    }, 5000); // Check every 5 seconds

    // Set up countdown timer
    countdownIntervalRef.current = setInterval(() => {
      if (isMountedRef.current && qrValue) {
        setTimeUntilExpiry(getTimeUntilExpiry());
      }
    }, 1000);

    // Listen to app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
      appStateSubscription?.remove();
    };
  }, [
    fetchQRCode,
    checkQRExpiry,
    handleAppStateChange,
    clearAllTimers,
    getTimeUntilExpiry,
    qrValue,
  ]);

  return {
    // State
    qrValue,
    loading,
    error,
    retryCount,
    timeUntilExpiry,
    shouldShowManualRefresh: shouldShowManualRefresh(),

    // Actions
    fetchQRCode,
    handleManualRefresh,
  };
};
