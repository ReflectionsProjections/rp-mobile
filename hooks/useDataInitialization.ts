import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '@/lib/store';
import { useUserProfile } from '@/api/tanstack/user';
import { useAttendeeProfile, useAttendeePoints } from '@/api/tanstack/attendee';
import { fetchEvents, fetchUserFavorites } from '@/lib/slices/favoritesSlice';
import * as SecureStore from 'expo-secure-store';

/**
 * Hook to initialize all app data when user logs in
 * Implements "load once and persist" strategy
 */
export function useDataInitialization() {
  const dispatch = useAppDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const hasEvents = useAppSelector(
    (state: RootState) => (state.favorites?.events || []).length > 0,
  );
  const hasFavorites = useAppSelector(
    (state: RootState) => (state.favorites?.favoriteEventIds || []).length > 0,
  );
  const favoritesLastFetched = useAppSelector((state: RootState) => state.favorites?.lastFetched);
  const hasUser = useAppSelector((state: RootState) => !!state.user?.profile);
  const hasAttendeeData = useAppSelector((state: RootState) => !!state.attendee?.attendee);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const jwt = await SecureStore.getItemAsync('jwt');
        setIsAuthenticated(!!jwt);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Pass authentication status to the hooks
  const { data: user, isLoading: userLoading } = useUserProfile(isAuthenticated);
  const { data: attendee, isLoading: attendeeLoading } = useAttendeeProfile(isAuthenticated);
  const { data: points, isLoading: pointsLoading } = useAttendeePoints(isAuthenticated);

  // Always fetch events (public data)
  useEffect(() => {
    if (!hasEvents) {
      dispatch(fetchEvents());
    }
  }, [hasEvents, dispatch]);

  // Only fetch user-specific data if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.userId && !hasFavorites) {
      // Load once and never again - simple approach
      dispatch(fetchUserFavorites(user.userId));
    }
  }, [isAuthenticated, user?.userId, hasFavorites, dispatch]);

  // For guests, we only need events to be loaded
  // For authenticated users, we need events + user data
  const isInitialized =
    isAuthenticated === false
      ? hasEvents // Guest users only need events
      : hasEvents && (isAuthenticated ? hasUser && hasAttendeeData : true); // Authenticated users need everything

  const isLoading =
    isAuthenticated === null
      ? true // Still checking auth status
      : !hasEvents; // Only show loading if events aren't loaded yet

  return {
    isInitialized,
    isLoading,
    hasUser: !!user,
    hasAttendee: !!attendee,
    points: points || 0,
    attendee: attendee,
    isAuthenticated,
  };
}
