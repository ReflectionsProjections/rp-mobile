import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setUserProfile, clearUserProfile } from '@/lib/slices/userSlice';
import { api } from '../api';
import type { RoleObject } from '../types';

export const USER_PROFILE_QK = ['user', 'profile'] as const;

async function fetchUserProfile(): Promise<RoleObject> {
  const response = await api.get('/auth/info');
  return response.data as RoleObject;
}

export function useUserProfile() {
  const dispatch = useAppDispatch();
  const reduxProfile = useAppSelector(state => state.user.profile);
  const reduxLastFetched = useAppSelector(state => state.user.lastFetched);

  const query = useQuery<RoleObject>({
    queryKey: USER_PROFILE_QK,
    queryFn: fetchUserProfile,
    enabled: !reduxProfile || !reduxLastFetched || (Date.now() - reduxLastFetched) > 5 * 60 * 1000, // 5 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Move dispatch to useEffect to avoid calling it during render
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

export function useUpdateUserProfile() { // for PATCH /icon and PATCH /tags endpoints
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
    
    // Clear all queries
    queryClient.clear();
  };
}
