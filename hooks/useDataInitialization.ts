import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { useUserProfile } from '@/api/tanstack/user';
import { fetchEvents, fetchUserFavorites } from '@/lib/slices/favoritesSlice';

/**
 * Hook to initialize all app data when user logs in
 * Implements "load once and persist" strategy
 */
export function useDataInitialization() {
  const dispatch = useAppDispatch();
  
  // Check if we already have data - add null checks to prevent errors
  const hasEvents = useAppSelector((state: any) => (state.favorites?.events || []).length > 0);
  const hasFavorites = useAppSelector((state: any) => (state.favorites?.favoriteEventIds || []).length > 0);
  const hasUser = useAppSelector((state: any) => !!state.user?.profile);
  
  // Get user profile (this will trigger the user fetch if needed)
  const { data: user, isLoading: userLoading } = useUserProfile();

  // Debug logging
  console.log('useDataInitialization - hasEvents:', hasEvents);
  console.log('useDataInitialization - hasFavorites:', hasFavorites);
  console.log('useDataInitialization - hasUser:', hasUser);
  console.log('useDataInitialization - user from hook:', user);
  console.log('useDataInitialization - userLoading:', userLoading);

  // Initialize data when user is available and we don't have cached data
  useEffect(() => {
    console.log('useDataInitialization - checking events, user:', user, 'hasEvents:', hasEvents);
    if (user && !hasEvents) {
      console.log('useDataInitialization - dispatching fetchEvents');
      dispatch(fetchEvents());
    }
  }, [user, hasEvents, dispatch]);

  useEffect(() => {
    console.log('useDataInitialization - checking favorites, userId:', user?.userId, 'hasFavorites:', hasFavorites);
    if (user?.userId && !hasFavorites) {
      console.log('useDataInitialization - dispatching fetchUserFavorites');
      dispatch(fetchUserFavorites(user.userId));
    }
  }, [user?.userId, hasFavorites, dispatch]);

  return {
    isInitialized: hasEvents && hasFavorites && hasUser,
    isLoading: userLoading,
    hasUser: !!user,
  };
}
