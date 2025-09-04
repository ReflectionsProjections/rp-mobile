import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setFavorites, toggleFavorite as toggleFavoriteRedux } from '@/lib/slices/favoritesSlice';
import { api } from '../api';
import { path } from '../types';

export const USER_FAVORITES_QK = ['user', 'favorites'] as const;

async function fetchUserFavorites(userId: string): Promise<string[]> {
  const response = await api.get(path('/attendee/favorites', { userId }));
  return response.data.favorites as string[];
}

export function useUserFavorites(userId?: string) {
  const dispatch = useAppDispatch();
  const reduxFavorites = useAppSelector(state => state.favorites.favoriteEventIds);
  const reduxLastFetched = useAppSelector(state => state.favorites.lastFetched);

  const query = useQuery<string[]>({
    queryKey: USER_FAVORITES_QK,
    queryFn: () => fetchUserFavorites(userId!),
    enabled: !!userId && (!reduxFavorites.size || !reduxLastFetched || (Date.now() - reduxLastFetched) > 10 * 60 * 1000), // 10 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    select: (data) => {
      dispatch(setFavorites(data));
      return data;
    },
  });

  return {
    ...query,
    data: Array.from(reduxFavorites),
    favoriteIds: reduxFavorites,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useToggleFavorite() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentFavorites = useAppSelector(state => state.favorites.favoriteEventIds);

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      dispatch(toggleFavoriteRedux({ eventId, userId }));
      
      const isCurrentlyFavorite = currentFavorites.has(eventId);
      
      if (isCurrentlyFavorite) {
        await api.delete(path('/attendee/favorites/:eventId', { eventId }), {
          data: { userId },
        });
      } else {
        await api.post(path('/attendee/favorites/:eventId', { eventId }), {
          userId,
        });
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
