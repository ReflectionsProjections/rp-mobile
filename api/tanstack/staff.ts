import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { path, Staff } from '../types';

export const STAFF_QK = ['staff'] as const;

async function fetchStaff(email: string): Promise<Staff> {
  const res = await api.get(path('/staff/:email', { email: email }));
  return res.data as Staff;
}

export function useStaff(email: string) {
  return useQuery<Staff>({
    queryKey: STAFF_QK,
    queryFn: () => fetchStaff(email),
    staleTime: 60 * 1000,
  });
}


