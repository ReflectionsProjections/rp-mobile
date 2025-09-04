import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setFavorites, toggleFavorite as toggleFavoriteRedux } from '@/lib/slices/favoritesSlice';
import { api } from '../api';
import { path } from '../types';

export const USER_FAVORITES_QK = ['user', 'favorites'] as const;

async function fetchUserFavorites(userId: string): Promise<string[]> {
  console.log('API: Fetching favorites for user:', userId);
  const response = await api.get(path('/attendee/favorites', { userId }));
  console.log('API: Favorites response:', response.data);
  const favorites = (response.data as any).favorites as string[];
  console.log('API: Extracted favorites:', favorites);
  return favorites;
}

export function useUserFavorites(userId?: string) {
  const dispatch = useAppDispatch();
  const reduxFavorites = useAppSelector(state => state.favorites.favoriteEventIds) || [];
  const reduxLastFetched = useAppSelector(state => state.favorites.lastFetched);

  const query = useQuery<string[]>({
    queryKey: USER_FAVORITES_QK,
    queryFn: async () => {
      if (!userId) {
        return []; // Return empty array if no userId
      }
      return fetchUserFavorites(userId);
    },
    enabled: !!userId && (!reduxFavorites.length || !reduxLastFetched || (Date.now() - reduxLastFetched) > 10 * 60 * 1000), // 10 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    select: (data) => {
      dispatch(setFavorites(data));
      return data;
    },
  });

  return {
    ...query,
    data: reduxFavorites,
    favoriteIds: reduxFavorites,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useToggleFavorite() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentFavorites = useAppSelector(state => state.favorites.favoriteEventIds) || [];

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      console.log('API: Starting toggle favorite for event:', eventId, 'user:', userId);
      dispatch(toggleFavoriteRedux({ eventId, userId }));
      
      const isCurrentlyFavorite = currentFavorites.includes(eventId);
      console.log('API: Is currently favorite:', isCurrentlyFavorite);
      
      if (isCurrentlyFavorite) {
        console.log('API: Deleting favorite from server');
        await api.delete(path('/attendee/favorites/:eventId', { eventId }), {
          data: { userId },
        });
        console.log('API: Favorite deleted from server successfully');
      } else {
        console.log('API: Adding favorite to server');
        await api.post(path('/attendee/favorites/:eventId', { eventId }), {
          userId,
        });
        console.log('API: Favorite added to server successfully');
      }
      
      return { eventId, action: isCurrentlyFavorite ? 'remove' : 'add' };
    },
    onError: (error, variables) => {
      // Revert optimistic update - automatically handled by Redux
      console.error('Failed to toggle favorite:', error);
    },
    onSuccess: () => {
      // Invalidate favorites query to ensure consistency - handled by Redux
      queryClient.invalidateQueries({ queryKey: USER_FAVORITES_QK });
    },
  });
}

export function useRefreshFavorites() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: USER_FAVORITES_QK });
}
