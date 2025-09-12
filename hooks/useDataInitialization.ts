import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '@/lib/store';
import { fetchEvents, fetchUserFavorites } from '@/lib/slices/favoritesSlice';
import { fetchMyShifts } from '@/lib/slices/shiftsSlice';
import { fetchStaff } from '@/lib/slices/staffSlice';
import { fetchUserProfile } from '@/lib/slices/userSlice';
import { fetchAttendeeProfile } from '@/lib/slices/attendeeSlice';
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
  const hasUser = useAppSelector((state: RootState) => !!state.user?.profile);
  const hasAttendeeData = useAppSelector((state: RootState) => !!state.attendee?.attendee);
  const hasShifts = useAppSelector((state: RootState) => (state.shifts?.shifts || []).length > 0);

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

  // Get data from Redux store
  const user = useAppSelector((state: RootState) => state.user.profile);
  const attendee = useAppSelector((state: RootState) => state.attendee.attendee);
  const userLoading = useAppSelector((state: RootState) => state.user.loading);
  const attendeeLoading = useAppSelector((state: RootState) => state.attendee.loading);

  useEffect(() => {
    if (!hasEvents) {
      dispatch(fetchEvents());
    }
  }, [hasEvents, dispatch]);

  useEffect(() => {
    if (isAuthenticated === true && !user && !userLoading) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, user, userLoading, dispatch]);

  useEffect(() => {
    if (isAuthenticated === true && !attendee && !attendeeLoading) {
      dispatch(fetchAttendeeProfile());
    }
  }, [isAuthenticated, attendee, attendeeLoading, dispatch]);

  // Fetch user favorites if authenticated
  useEffect(() => {
    if (isAuthenticated === true && user?.userId && !hasFavorites) {
      dispatch(fetchUserFavorites(user.userId));
    }
  }, [isAuthenticated, user?.userId, hasFavorites, dispatch]);

  // Fetch shifts and profile for staff and admin users only
  useEffect(() => {
    if (isAuthenticated === true && user?.roles) {
      const hasStaffOrAdminRole = user.roles.some((role: string) => {
        const roleUpper = role.toUpperCase();
        return roleUpper === 'STAFF' || roleUpper === 'ADMIN';
      });

      if (hasStaffOrAdminRole && !hasShifts) {
        dispatch(fetchMyShifts());
      }
      if (hasStaffOrAdminRole && user?.email) {
        dispatch(fetchStaff(user.email));
      }
    }
  }, [isAuthenticated, user?.roles, hasShifts, dispatch]);

  const isInitialized =
    isAuthenticated === false
      ? hasEvents
      : hasEvents && (isAuthenticated ? hasUser && hasAttendeeData : true);

  const isLoading = isAuthenticated === null ? true : !hasEvents;

  return {
    isInitialized,
    isLoading,
    hasUser: !!user,
    hasAttendee: !!attendee,
    points: attendee?.points || 0,
    attendee: attendee,
    isAuthenticated,
  };
}
