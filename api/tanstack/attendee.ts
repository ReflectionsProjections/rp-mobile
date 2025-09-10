import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setAttendeeProfile, clearAttendeeProfile, updatePoints } from '@/lib/slices/attendeeSlice';
import { api } from '../api';
import type { Attendee } from '../types';

export const ATTENDEE_PROFILE_QK = ['attendee', 'profile'] as const;
export const ATTENDEE_POINTS_QK = ['attendee', 'points'] as const;

async function fetchAttendeeProfile(): Promise<Attendee> {
  const jwt = await import('expo-secure-store').then(store => store.getItemAsync('jwt'));
  if (!jwt) {
    throw new Error('Not authenticated');
  }
  
  const response = await api.get('/attendee');
  return response.data as Attendee;
}

async function fetchAttendeePoints(): Promise<number> {
  const jwt = await import('expo-secure-store').then(store => store.getItemAsync('jwt'));
  if (!jwt) {
    throw new Error('Not authenticated');
  }
  
  const response = await api.get('/attendee/points');
  return response.data.points;
}

export function useAttendeeProfile(isAuthenticated?: boolean | null) {
  const dispatch = useAppDispatch();
  const reduxAttendee = useAppSelector((state) => state.attendee.attendee);
  const reduxLastFetched = useAppSelector((state) => state.attendee.lastFetched);

  const query = useQuery<Attendee>({
    queryKey: ATTENDEE_PROFILE_QK,
    queryFn: fetchAttendeeProfile,
    enabled:
      isAuthenticated === true &&
      (!reduxAttendee || !reduxLastFetched || Date.now() - reduxLastFetched > 5 * 60 * 1000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  useEffect(() => {
    if (query.data && !reduxAttendee) {
      dispatch(setAttendeeProfile(query.data));
    }
  }, [query.data, reduxAttendee, dispatch]);

  return {
    ...query,
    data: reduxAttendee || query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useAttendeePoints(isAuthenticated?: boolean | null) {
  const dispatch = useAppDispatch();
  const reduxAttendee = useAppSelector((state) => state.attendee.attendee);
  const reduxLastFetched = useAppSelector((state) => state.attendee.lastFetched);

  const query = useQuery<number>({
    queryKey: ATTENDEE_POINTS_QK,
    queryFn: fetchAttendeePoints,
    enabled:
      isAuthenticated === true &&
      (!reduxAttendee || !reduxLastFetched || Date.now() - reduxLastFetched > 2 * 60 * 1000),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (query.data !== undefined && reduxAttendee) {
      dispatch(updatePoints(query.data));
    }
  }, [query.data, reduxAttendee, dispatch]);

  return {
    ...query,
    data: reduxAttendee?.points ?? query.data ?? 0,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useRefreshAttendeeProfile() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ATTENDEE_PROFILE_QK });
}

export function useRefreshAttendeePoints() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ATTENDEE_POINTS_QK });
}
