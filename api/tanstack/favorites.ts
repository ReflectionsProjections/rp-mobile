import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setFavorites, toggleFavorite as toggleFavoriteRedux } from '@/lib/slices/favoritesSlice';
import { api } from '../api';
import { path } from '../types';

export const USER_FAVORITES_QK = ['user', 'favorites'] as const;

async function fetchUserFavorites(userId: string): Promise<string[]> {
  const jwt = await import('expo-secure-store').then((store) => store.getItemAsync('jwt'));
  if (!jwt) {
    throw new Error('Not authenticated');
  }

  console.log('API: Fetching favorites for user:', userId);
  const response = await api.get(path('/attendee/favorites', { userId }));
  console.log('API: Favorites response:', response.data);
  const favorites = response.data.favoriteEvents as string[];
  console.log('API: Extracted favorites:', favorites);
  return favorites;
}

export function useUserFavorites(userId?: string) {
  const dispatch = useAppDispatch();
  const reduxFavorites = useAppSelector((state) => state.favorites.favoriteEventIds) || [];
  const reduxLastFetched = useAppSelector((state) => state.favorites.lastFetched);

  const query = useQuery<string[]>({
    queryKey: USER_FAVORITES_QK,
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      return fetchUserFavorites(userId);
    },
    enabled: false,
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
  const currentFavorites = useAppSelector((state) => state.favorites.favoriteEventIds) || [];

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const jwt = await import('expo-secure-store').then((store) => store.getItemAsync('jwt'));
      if (!jwt) {
        throw new Error('Not authenticated');
      }

      dispatch(toggleFavoriteRedux({ eventId, userId }));

      const isCurrentlyFavorite = currentFavorites.includes(eventId);

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
    onError: (error, _) => {
      console.error('Failed to toggle favorite:', error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_FAVORITES_QK });
    },
  });
}

export function useRefreshFavorites() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: USER_FAVORITES_QK });
}
