import HelmetPurple from '@/assets/images/leaderboard/helmet-purple.svg';
import HelmetGreen from '@/assets/images/leaderboard/helmet-green.svg';
import HelmetRed from '@/assets/images/leaderboard/helmet-red.svg';

export interface LeaderboardData {
  rank: number;
  name: string;
  points: number;
  color: string;
  avatar: React.ComponentType<{ width: number; height: number }>;
}

export const globalLeaderboardData: LeaderboardData[] = [
  { rank: 1, name: 'Ava Chen', points: 500, color: '#8B1C13', avatar: HelmetPurple },
  { rank: 2, name: 'Liam Patel', points: 485, color: '#B89B2B', avatar: HelmetGreen },
  { rank: 3, name: 'Noah Kim', points: 330, color: '#1B1742', avatar: HelmetPurple },
  { rank: 4, name: 'Sofia Martinez', points: 295, color: '#8B1C13', avatar: HelmetRed },
  { rank: 5, name: 'Mateo Rossi', points: 285, color: '#3A7D2C', avatar: HelmetGreen },
  { rank: 6, name: 'Isla Ahmed', points: 270, color: '#B89B2B', avatar: HelmetGreen },
  { rank: 7, name: 'Ethan Zhao', points: 260, color: '#1B1742', avatar: HelmetPurple },
  { rank: 8, name: 'Leila Johnson', points: 250, color: '#3A7D2C', avatar: HelmetRed },
  { rank: 9, name: 'Kai Nakamura', points: 240, color: '#8B1C13', avatar: HelmetPurple },
  { rank: 10, name: 'Maya Rivera', points: 230, color: '#B89B2B', avatar: HelmetGreen },
  { rank: 11, name: 'Leo Schmidt', points: 225, color: '#1B1742', avatar: HelmetGreen },
  { rank: 12, name: 'Chloe Diallo', points: 215, color: '#3A7D2C', avatar: HelmetRed },
  { rank: 13, name: 'Arjun Mehta', points: 210, color: '#8B1C13', avatar: HelmetPurple },
  { rank: 14, name: 'Emma Novak', points: 205, color: '#B89B2B', avatar: HelmetGreen },
  { rank: 15, name: 'Zoe Laurent', points: 200, color: '#1B1742', avatar: HelmetPurple },
  { rank: 16, name: 'Omar El-Sayed', points: 300, color: '#3A7D2C', avatar: HelmetGreen },
];

export const dailyLeaderboardData: LeaderboardData[] = [
  { rank: 1, name: 'Leo Schmidt', points: 85, color: '#1B1742', avatar: HelmetGreen },
  { rank: 2, name: 'Chloe Diallo', points: 75, color: '#3A7D2C', avatar: HelmetRed },
  { rank: 3, name: 'Arjun Mehta', points: 70, color: '#8B1C13', avatar: HelmetPurple },
  { rank: 4, name: 'Emma Novak', points: 65, color: '#B89B2B', avatar: HelmetGreen },
  { rank: 5, name: 'Zoe Laurent', points: 60, color: '#1B1742', avatar: HelmetPurple },
  { rank: 6, name: 'Omar El-Sayed', points: 55, color: '#3A7D2C', avatar: HelmetGreen },
  { rank: 7, name: 'Ava Chen', points: 50, color: '#8B1C13', avatar: HelmetPurple },
  { rank: 8, name: 'Liam Patel', points: 45, color: '#B89B2B', avatar: HelmetGreen },
  { rank: 9, name: 'Noah Kim', points: 40, color: '#1B1742', avatar: HelmetPurple },
  { rank: 10, name: 'Sofia Martinez', points: 35, color: '#8B1C13', avatar: HelmetRed },
  { rank: 11, name: 'Mateo Rossi', points: 30, color: '#3A7D2C', avatar: HelmetGreen },
  { rank: 12, name: 'Isla Ahmed', points: 25, color: '#B89B2B', avatar: HelmetGreen },
  { rank: 13, name: 'Ethan Zhao', points: 20, color: '#1B1742', avatar: HelmetPurple },
  { rank: 14, name: 'Leila Johnson', points: 15, color: '#3A7D2C', avatar: HelmetRed },
  { rank: 15, name: 'Kai Nakamura', points: 10, color: '#8B1C13', avatar: HelmetPurple },
  { rank: 16, name: 'Maya Rivera', points: 5, color: '#B89B2B', avatar: HelmetGreen },
];
