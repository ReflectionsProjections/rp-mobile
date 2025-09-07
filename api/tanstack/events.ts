import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import type { Event } from '../types';

export const EVENTS_QK = ['events'] as const;

async function fetchEvents(): Promise<Event[]> {
  const res = await api.get('/events');
  return res.data as Event[];
}

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: EVENTS_QK,
    queryFn: fetchEvents,

    select: (rows) =>
      [...rows].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
  });
}

export function useRefreshEvents() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: EVENTS_QK });
}
