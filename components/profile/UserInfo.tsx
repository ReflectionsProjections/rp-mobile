import React from 'react';
import { View, Text } from 'react-native';
import LOGO from '../../assets/images/logo.svg';
import { useThemeColor } from '@/lib/theme';

interface UserInfoProps {
  name: {
    first: string;
    last: string;
  };
  roles: string[];
  foodWave?: string;
}

const UserInfo = ({ name, roles, foodWave }: UserInfoProps) => {
  const themeColor = useThemeColor();

  return (
    <>
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          <View className="bg-[#D9D9D9] w-full py-1 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-3 h-[75px] mr-2.5" style={{ backgroundColor: themeColor }} />
              <View className="pl-1 flex-column">
                <Text className="font-proRacing text-2xl" style={{ color: themeColor }}>
                  {name.first}
                </Text>
                <Text className="font-proRacing text-2xl font-bold" style={{ color: themeColor }}>
                  {name.last}
                </Text>
              </View>
            </View>
            <View className="mr-4">
              <LOGO width={60} height={60} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default UserInfo;
