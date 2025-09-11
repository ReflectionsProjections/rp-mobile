import React from 'react';
import { View, Text } from 'react-native';
import RedPTS from '@/assets/images/red_pts.svg';
import BluePTS from '@/assets/images/blue_pts.svg';
import GreenPTS from '@/assets/images/green_pts.svg';
import PinkPTS from '@/assets/images/pink_pts.svg';
import PurplePTS from '@/assets/images/purple_pts.svg';
import OrangePTS from '@/assets/images/orange_pts.svg';
import { useThemeColor } from '@/lib/theme';

type ProfileHeaderProps = {
  points: number;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ points }) => {
  const themeColor = useThemeColor();

  const getPTSComponent = (color: string) => {
    const ptsMap: { [key: string]: React.FC<any> } = {
      '#3B82F6': BluePTS, // Blue
      '#EF4444': RedPTS, // Red
      '#4A9E68': GreenPTS, // Green
      '#EC4899': PinkPTS, // Pink
      '#8B5CF6': PurplePTS, // Purple
      '#F59E0B': OrangePTS, // Orange
    };

    return ptsMap[color] || RedPTS;
  };

  const PTSComponent = getPTSComponent(themeColor);

  return (
    <View className="flex-row justify-end items-center pr-5">
      <View className="items-end">
        <Text className="font-proRacing text-3xl font-bold text-white">{points}</Text>
        <PTSComponent width={94} height={23} />
      </View>
    </View>
  );
};

export default ProfileHeader;
