import { IconColorType } from '@/api/types';

export const ICON_COLOR_MAP: { [key in IconColorType]: string } = {
  BLUE: '#3B82F6',
  RED: '#EF4444',
  GREEN: '#4A9E68',
  PINK: '#EC4899',
  PURPLE: '#8B5CF6',
  ORANGE: '#F59E0B',
  YELLOW: '#EAB308',
  BLACK: '#1F2937',
};

export const HEX_TO_ICON_MAP: { [key: string]: IconColorType } = {
  '#3B82F6': 'BLUE',
  '#EF4444': 'RED',
  '#4A9E68': 'GREEN',
  '#EC4899': 'PINK',
  '#8B5CF6': 'PURPLE',
  '#F59E0B': 'ORANGE',
  '#EAB308': 'YELLOW',
  '#1F2937': 'BLACK',
};

export const getColorFromIcon = (icon: IconColorType): string => {
  return ICON_COLOR_MAP[icon] || '#EF4444';
};

export const getIconFromColor = (hexColor: string): IconColorType | null => {
  return HEX_TO_ICON_MAP[hexColor] || null;
};
