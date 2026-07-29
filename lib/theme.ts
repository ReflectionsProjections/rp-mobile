import { useAppSelector } from './store';

export const useThemeColor = () => {
  return useAppSelector((state) => state.attendee.themeColor || '#2d2d80');
};
