import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { path } from '../types';
import type { DietaryRestrictionStats } from '../types';

// Query keys
export const STATS_QK = {
  checkIn: ['stats', 'check-in'] as const,
  priorityAttendee: ['stats', 'priority-attendee'] as const,
  dietaryRestrictions: ['stats', 'dietary-restrictions'] as const,
  attendance: (n: number) => ['stats', 'attendance', n] as const,
  registrations: ['stats', 'registrations'] as const,
  tierCounts: ['stats', 'tier-counts'] as const,
  tagCounts: ['stats', 'tag-counts'] as const,
} as const;

// API functions
async function fetchCheckInCount(): Promise<number> {
  const response = await api.get('/stats/check-in');
  return response.data.count;
}

async function fetchPriorityAttendeeCount(): Promise<number> {
  const response = await api.get('/stats/priority-attendee');
  return response.data.count;
}

async function fetchDietaryStats(): Promise<DietaryRestrictionStats> {
  const response = await api.get('/stats/dietary-restrictions');
  return response.data;
}

async function fetchAttendanceCounts(n: number): Promise<number[]> {
  const response = await api.get(path('/stats/attendance/:n', { n: n.toString() }));
  return response.data.attendanceCounts;
}

async function fetchRegistrationCount(): Promise<number> {
  const response = await api.get('/stats/registrations');
  return response.data.count;
}

async function fetchTierCounts(): Promise<{
  TIER1: number;
  TIER2: number;
  TIER3: number;
  TIER4: number;
}> {
  const response = await api.get('/stats/tier-counts');
  return response.data;
}

async function fetchTagCounts(): Promise<Record<string, number>> {
  const response = await api.get('/stats/tag-counts');
  return response.data;
}

// Hooks
export function useCheckInCount() {
  return useQuery({
    queryKey: STATS_QK.checkIn,
    queryFn: fetchCheckInCount,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePriorityAttendeeCount() {
  return useQuery({
    queryKey: STATS_QK.priorityAttendee,
    queryFn: fetchPriorityAttendeeCount,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useDietaryStats() {
  return useQuery({
    queryKey: STATS_QK.dietaryRestrictions,
    queryFn: fetchDietaryStats,
    staleTime: 1 * 60 * 1000, // 5 minutes (dietary stats change less frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useAttendanceCounts(n: number = 7) {
  return useQuery({
    queryKey: STATS_QK.attendance(n),
    queryFn: () => fetchAttendanceCounts(n),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRegistrationCount() {
  return useQuery({
    queryKey: STATS_QK.registrations,
    queryFn: fetchRegistrationCount,
    staleTime: 1 * 60 * 1000, // 5 minutes (registrations change less frequently)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useTierCounts() {
  return useQuery({
    queryKey: STATS_QK.tierCounts,
    queryFn: fetchTierCounts,
    staleTime: 1 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useTagCounts() {
  return useQuery({
    queryKey: STATS_QK.tagCounts,
    queryFn: fetchTagCounts,
    staleTime: 1 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Combined hook for all stats (useful for the stats screen)
export function useAllStats() {
  const checkIn = useCheckInCount();
  const priorityAttendee = usePriorityAttendeeCount();
  const dietary = useDietaryStats();
  const attendance = useAttendanceCounts(7);
  const registrations = useRegistrationCount();
  const tierCounts = useTierCounts();
  const tagCounts = useTagCounts();

  return {
    checkIn,
    priorityAttendee,
    dietary,
    attendance,
    registrations,
    tierCounts,
    tagCounts,
    isLoading:
      checkIn.isLoading ||
      priorityAttendee.isLoading ||
      dietary.isLoading ||
      attendance.isLoading ||
      registrations.isLoading ||
      tierCounts.isLoading ||
      tagCounts.isLoading,
    error:
      checkIn.error ||
      priorityAttendee.error ||
      dietary.error ||
      attendance.error ||
      registrations.error ||
      tierCounts.error ||
      tagCounts.error,
  };
}
