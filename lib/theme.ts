import { useAppSelector } from './store';

export const useThemeColor = () => {
  return useAppSelector((state) => state.attendee.themeColor || '#3B82F6');
};
