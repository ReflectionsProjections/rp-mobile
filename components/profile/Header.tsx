import React from 'react';
import { View, Text } from 'react-native';
import PTS from '@/assets/images/pts.svg';

type ProfileHeaderProps = {
  points: number;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ points }) => {
  return (
    <View className="flex-row justify-end items-center pr-5">
      <View className="items-end">
        <Text className="font-proRacing text-3xl font-bold text-white">{points}</Text>
        <PTS width={94} height={23} />
      </View>
    </View>
  );
};

export default ProfileHeader;
