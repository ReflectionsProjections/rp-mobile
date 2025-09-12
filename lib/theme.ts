import { useAppSelector } from './store';

export const useThemeColor = () => {
  return useAppSelector((state) => state.attendee.themeColor || '#E53F33');
};
