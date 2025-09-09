import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchMyShifts } from '@/lib/slices/shiftsSlice';

export function useMyShifts(enabled: boolean = true) {
  const dispatch = useAppDispatch();
  const shifts = useAppSelector((state) => state.shifts.shifts);
  const loading = useAppSelector((state) => state.shifts.loading);
  const error = useAppSelector((state) => state.shifts.error);
  const lastFetched = useAppSelector((state) => state.shifts.lastFetched);


  useEffect(() => {
    if (enabled && (!lastFetched || Date.now() - lastFetched > 2 * 60 * 1000)) {
      dispatch(fetchMyShifts());
    }
  }, [enabled, dispatch, lastFetched]);

  return {
    data: shifts,
    isLoading: loading,
    error,
  };
}
