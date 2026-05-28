import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { ResponseType } from '../types';

export const DAILY_LEADERBOARD_QK = (day: string, n?: number) =>
  ['leaderboard', 'daily', day, n] as const;
export const GLOBAL_LEADERBOARD_QK = (n?: number) => ['leaderboard', 'global', n] as const;

type DailyResponse = ResponseType<'/leaderboard/daily', 'GET'>;
type GlobalResponse = ResponseType<'/leaderboard/global', 'GET'>;

async function fetchDailyLeaderboard(day: string, n?: number): Promise<DailyResponse> {
  const res = await api.get('/leaderboard/daily', { params: { day, n } });
  return res.data as DailyResponse;
}

async function fetchGlobalLeaderboard(n?: number): Promise<GlobalResponse> {
  const res = await api.get('/leaderboard/global', { params: { n } });
  return res.data as GlobalResponse;
}

export function useDailyLeaderboard(day: string, n?: number) {
  return useQuery<DailyResponse>({
    queryKey: DAILY_LEADERBOARD_QK(day, n),
    queryFn: () => fetchDailyLeaderboard(day, n),
    enabled: !!day,
    staleTime: 60 * 1000,
  });
}

export function useGlobalLeaderboard(n?: number) {
  return useQuery<GlobalResponse>({
    queryKey: GLOBAL_LEADERBOARD_QK(n),
    queryFn: () => fetchGlobalLeaderboard(n),
    staleTime: 60 * 1000,
  });
}
