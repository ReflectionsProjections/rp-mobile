import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { useUserProfile } from '@/api/tanstack/user';
import { useAttendeePoints } from '@/api/tanstack/attendee';
import { fetchEvents, fetchUserFavorites } from '@/lib/slices/favoritesSlice';

/**
 * Hook to initialize all app data when user logs in
 * Implements "load once and persist" strategy
 */
export function useDataInitialization() {
  const dispatch = useAppDispatch();
  
  const hasEvents = useAppSelector((state: any) => (state.favorites?.events || []).length > 0);
  const hasFavorites = useAppSelector((state: any) => (state.favorites?.favoriteEventIds || []).length > 0);
  const hasUser = useAppSelector((state: any) => !!state.user?.profile);
  const hasAttendeeData = useAppSelector((state: any) => !!state.attendee?.attendee);
  
  const { data: user, isLoading: userLoading } = useUserProfile();
  const { data: points, isLoading: pointsLoading } = useAttendeePoints();

  useEffect(() => {
    if (user && !hasEvents) {
      dispatch(fetchEvents());
    }
  }, [user, hasEvents, dispatch]);

  useEffect(() => {
    if (user?.userId && !hasFavorites) {
      dispatch(fetchUserFavorites(user.userId));
    }
  }, [user?.userId, hasFavorites, dispatch]);

  return {
    isInitialized: hasEvents && hasFavorites && hasUser && hasAttendeeData,
    isLoading: userLoading || pointsLoading,
    hasUser: !!user,
    points: points || 0,
  };
}
