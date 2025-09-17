import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setUserProfile, clearUserProfile } from '@/lib/slices/userSlice';
import { clearAttendeeProfile } from '@/lib/slices/attendeeSlice';
import { clearFavorites, clearEvents } from '@/lib/slices/favoritesSlice';
import { api } from '../api';
import type { RoleObject } from '../types';

export const USER_PROFILE_QK = ['user', 'profile'] as const;

async function fetchUserProfile(): Promise<RoleObject> {
  const jwt = await import('expo-secure-store').then((store) => store.getItemAsync('jwt'));
  if (!jwt) {
    throw new Error('Not authenticated');
  }

  const response = await api.get('/auth/info');
  return response.data as RoleObject;
}

export function useUserProfile(isAuthenticated?: boolean | null) {
  const dispatch = useAppDispatch();
  const reduxProfile = useAppSelector((state) => state.user.profile);
  const reduxLastFetched = useAppSelector((state) => state.user.lastFetched);

  const query = useQuery<RoleObject>({
    queryKey: USER_PROFILE_QK,
    queryFn: fetchUserProfile,
    enabled:
      isAuthenticated === true &&
        (!reduxProfile || !reduxLastFetched || Date.now() - reduxLastFetched > 1 * 60 * 1000),
    staleTime: 1 * 60 * 1000, // 1 minute (reduced from 5)
    gcTime: 5 * 60 * 1000, // 5 minutes (reduced from 30)
  });

  useEffect(() => {
    if (query.data && !reduxProfile) {
      dispatch(setUserProfile(query.data));
    }
  }, [query.data, reduxProfile, dispatch]);

  return {
    ...query,
    data: reduxProfile || query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useUpdateUserProfile() {
  // for PATCH /icon and PATCH /tags endpoints
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<RoleObject>) => {
      // Optimistic update
      if (updates.userId) {
        dispatch(setUserProfile(updates as RoleObject));
      }

      // Invalidate and refetch user profile
      await queryClient.invalidateQueries({ queryKey: USER_PROFILE_QK });

      return updates;
    },
    onError: (error, variables) => {
      // Revert optimistic update
      console.error('Failed to update user profile:', error);
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return () => {
    // Clear Redux state
    dispatch(clearUserProfile());
    dispatch(clearAttendeeProfile());
    dispatch(clearFavorites());
    dispatch(clearEvents());

    // Clear all queries
    queryClient.clear();
  };
}
