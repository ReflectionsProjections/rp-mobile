import { useAppSelector } from './store';
import { IconColorType } from '@/api/types';

/**
 * Hook to get the current theme color from Redux
 * @returns Current theme color in hex format (e.g., '#3B82F6')
 */
export const useThemeColor = () => {
  return useAppSelector((state) => state.attendee.themeColor || '#3B82F6');
};

/**
 * Helper to convert IconColorType to hex color
 */
export const iconColorToHex = (iconColor: IconColorType): string => {
  const colorMap: { [key in IconColorType]: string } = {
    BLUE: '#3B82F6',
    RED: '#EF4444',
    GREEN: '#4ADE80',
    PINK: '#EC4899',
    PURPLE: '#8B5CF6',
    ORANGE: '#F59E0B',
    YELLOW: '#EAB308',
    BLACK: '#1F2937',
  };

  return colorMap[iconColor] || '#3B82F6'; // Default to blue
};

/**
 * Helper to convert hex color to IconColorType
 */
export const hexToIconColor = (hexColor: string): IconColorType | null => {
  const colorMap: { [key: string]: IconColorType } = {
    '#3B82F6': 'BLUE',
    '#EF4444': 'RED',
    '#4ADE80': 'GREEN',
    '#EC4899': 'PINK',
    '#8B5CF6': 'PURPLE',
    '#F59E0B': 'ORANGE',
    '#EAB308': 'YELLOW',
    '#1F2937': 'BLACK',
  };

  return colorMap[hexColor] || null;
};
