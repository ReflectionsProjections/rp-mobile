import { useState, useRef, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { api } from '@/api/api';
import * as SecureStore from 'expo-secure-store';

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
  handleManualRefresh: () => void;
}

export const useQRCode = (): QRCodeState & QRCodeActions => {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
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
  const shouldShowManualRefresh = Boolean(error || (qrValue && timeUntilExpiry <= 10));

  // Fetch QR code
  const fetchQRCode = useCallback(async () => {
    if (isFetchingRef.current || !isMountedRef.current) return;

    // Check authentication
    try {
      const jwt = await SecureStore.getItemAsync('jwt');
      if (!jwt) return;
    } catch {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await api.get('/attendee/qr');

      if (!isMountedRef.current) return;

      if (res.data?.qrCode) {
        setQrValue(res.data.qrCode);
        setError(null);
        setRetryCount(0);
        qrExpiryTimeRef.current = Date.now() + 30000; // 30 seconds
      } else {
        throw new Error('Invalid QR code response');
      }
    } catch (e: any) {
      if (!isMountedRef.current) return;

      setError(e.message || 'Failed to fetch QR code');

      // Simple retry logic
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        setRetryCount((prev) => prev + 1);
        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) fetchQRCode();
        }, RETRY_DELAY);
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [retryCount]);

  // Check if QR code is about to expire and refresh if needed
  const checkQRExpiry = useCallback(() => {
    const now = Date.now();
    const timeUntilExpiry = qrExpiryTimeRef.current - now;

    if (timeUntilExpiry <= QR_EXPIRY_BUFFER && !isFetchingRef.current) {
      fetchQRCode();
    }
  }, [fetchQRCode]);

  // Handle app state changes
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && !qrValue) {
        fetchQRCode();
      } else if (nextAppState === 'background') {
        clearAllTimers();
      }
    },
    [qrValue, fetchQRCode, clearAllTimers],
  );

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    if (!isFetchingRef.current) {
      fetchQRCode();
    }
  }, [fetchQRCode]);

  // Main effect - initialize and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    fetchQRCode();

    // Check for expiry every 5 seconds
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current) checkQRExpiry();
    }, 5000);

    // Update countdown every second
    countdownIntervalRef.current = setInterval(() => {
      if (isMountedRef.current && qrValue) {
        setTimeUntilExpiry(getTimeUntilExpiry());
      }
    }, 1000);

    // Listen to app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Check auth state periodically
    const authCheckInterval = setInterval(async () => {
      try {
        const jwt = await SecureStore.getItemAsync('jwt');
        if (!jwt && qrValue) {
          setQrValue(null);
          setError(null);
          setRetryCount(0);
          setTimeUntilExpiry(0);
          clearAllTimers();
        }
      } catch {}
    }, 2000);

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
      clearInterval(authCheckInterval);
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
    shouldShowManualRefresh,

    // Actions
    handleManualRefresh,
  };
};
