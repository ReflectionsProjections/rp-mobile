import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchEvents } from '@/lib/slices/favoritesSlice';
import { fetchUserProfile } from '@/lib/slices/userSlice';
import { fetchAttendeeProfile } from '@/lib/slices/attendeeSlice';
import { fetchMyShifts } from '@/lib/slices/shiftsSlice';
import { fetchStaff } from '@/lib/slices/staffSlice';
import { fetchDailyLeaderboard, fetchGlobalLeaderboard } from '@/lib/slices/leaderboardSlice';

// Stale data thresholds (in milliseconds)
const STALE_THRESHOLDS = {
  USER_PROFILE: 2 * 60 * 1000, // 2 minutes
  ATTENDEE_PROFILE: 2 * 60 * 1000, // 2 minutes
  EVENTS: 5 * 60 * 1000, // 5 minutes
  LEADERBOARD: 2 * 60 * 1000, // 2 minutes
  SHIFTS: 5 * 60 * 1000, // 5 minutes
  STAFF: 10 * 60 * 1000, // 10 minutes
} as const;

// Check if data is stale
const isDataStale = (lastFetched: number | null, threshold: number): boolean => {
  if (!lastFetched) return true;
  return Date.now() - lastFetched > threshold;
};

export const useAutoRefresh = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const attendeeState = useAppSelector((state) => state.attendee);
  const favoritesState = useAppSelector((state) => state.favorites);
  const leaderboardState = useAppSelector((state) => state.leaderboard);
  const shiftsState = useAppSelector((state) => state.shifts);
  const staffState = useAppSelector((state) => state.staff);
  const profile = useAppSelector((state) => state.user.profile);
  const roles: string[] = Array.isArray(profile?.roles) ? (profile.roles as string[]) : [];
  const hasUserRole = roles.some((role) => role.toUpperCase() === 'USER');
  const hasStaffOrAdminRole = roles.some((role) => {
    const normalizedRole = role.toUpperCase();
    return normalizedRole === 'STAFF' || normalizedRole === 'ADMIN';
  });

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastRefreshRef = useRef<number>(0);

  // Same refresh logic as the header button
  const refreshAllData = useCallback(async () => {
    const now = Date.now();
    // Prevent too frequent refreshes (minimum 30 seconds between refreshes)
    if (now - lastRefreshRef.current < 30 * 1000) {
      console.log('Skipping refresh - too soon since last refresh');
      return;
    }

    lastRefreshRef.current = now;
    console.log('Auto-refreshing stale data...');

    try {
      // Re-initialize app data via Redux fetches (same as header button)
      dispatch(fetchEvents());
      dispatch(fetchUserProfile());
      if (hasUserRole) {
        dispatch(fetchAttendeeProfile());
      }

      if (hasStaffOrAdminRole) {
        dispatch(fetchMyShifts());
        if (profile?.email) {
          dispatch(fetchStaff(profile.email));
        }
      }

      const today = new Date();
      const dayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate(),
      ).padStart(2, '0')}`;
      dispatch(fetchDailyLeaderboard({ day: dayStr }));
      dispatch(fetchGlobalLeaderboard({}));

      console.log('Auto-refresh completed successfully');
    } catch (e) {
      console.warn('Failed to auto-refresh app data:', e);
    }
  }, [dispatch, hasStaffOrAdminRole, hasUserRole, profile?.email]);

  // Check if any data is stale (only check slices that have lastFetched)
  const isAnyDataStale = useCallback(() => {
    return (
      isDataStale(userState.lastFetched, STALE_THRESHOLDS.USER_PROFILE) ||
      (hasUserRole && isDataStale(attendeeState.lastFetched, STALE_THRESHOLDS.ATTENDEE_PROFILE)) ||
      isDataStale(favoritesState.eventsLastFetched, STALE_THRESHOLDS.EVENTS) ||
      (hasStaffOrAdminRole && isDataStale(shiftsState.lastFetched, STALE_THRESHOLDS.SHIFTS)) ||
      isDataStale(leaderboardState.daily.lastFetched, STALE_THRESHOLDS.LEADERBOARD) ||
      isDataStale(leaderboardState.global.lastFetched, STALE_THRESHOLDS.LEADERBOARD) ||
      (hasStaffOrAdminRole && isDataStale(staffState.lastFetched, STALE_THRESHOLDS.STAFF))
      // For leaderboard and staff, check if data exists (they don't have lastFetched)
      //   (!leaderboardState.daily.leaderboard.length && !leaderboardState.daily.loading) ||
      //   (!leaderboardState.global.leaderboard.length && !leaderboardState.global.loading) ||
      //   (!staffState.me && !staffState.loading)
    );
  }, [
    attendeeState.lastFetched,
    favoritesState.eventsLastFetched,
    hasStaffOrAdminRole,
    hasUserRole,
    leaderboardState.daily.lastFetched,
    leaderboardState.global.lastFetched,
    shiftsState.lastFetched,
    staffState.lastFetched,
    userState.lastFetched,
  ]);

  // Auto-refresh on app focus
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App focused - checking for stale data');
        if (isAnyDataStale()) {
          refreshAllData();
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isAnyDataStale, refreshAllData]);

  // Periodic refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        console.log('Periodic check for stale data');
        if (isAnyDataStale()) {
          refreshAllData();
        }
      },
      1 * 60 * 1000,
    ); // 1 minute

    return () => clearInterval(interval);
  }, [isAnyDataStale, refreshAllData]);

  return {
    refreshAllData,
    isAnyDataStale: isAnyDataStale(),
  };
};
