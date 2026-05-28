import RedHelmet from '@/assets/profile/red_helmet.svg';
import BlueHelmet from '@/assets/profile/blue_helmet.svg';
import GreenHelmet from '@/assets/profile/green_helmet.svg';
import PinkHelmet from '@/assets/profile/pink_helmet.svg';
import PurpleHelmet from '@/assets/profile/purple_helmet.svg';
import OrangeHelmet from '@/assets/profile/orange_helmet.svg';

export function getWeekday(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase() || '';
}

export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr}${ampm}`;
}

export const getAvatarComponent = (color: string) => {
  const avatarMap: { [key: string]: React.FC<any> } = {
    '#3B82F6': BlueHelmet, // Blue
    '#EF4444': RedHelmet, // Red
    '#4A9E68': GreenHelmet, // Green
    '#EC4899': PinkHelmet, // Pink
    '#8B5CF6': PurpleHelmet, // Purple
    '#F59E0B': OrangeHelmet, // Orange
  };

  return avatarMap[color] || RedHelmet;
};
