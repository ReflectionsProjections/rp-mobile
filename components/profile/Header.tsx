import React from 'react';
import { View, Text } from 'react-native';
import PTS from '../../assets/images/pts.svg';

const ProfileHeader = () => {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="font-proRacingSlant text-4xl font-bold">TIER 1</Text>
      <View className="items-end">
        <Text className="font-proRacing text-3xl font-bold">99</Text>
        <PTS width={94} height={23} />
      </View>
    </View>
  );
};

export default ProfileHeader;
