import React from 'react';
import { View, Text } from 'react-native';
import LOGO from '../../assets/images/logo.svg';

interface UserInfoProps {
  name: {
    first: string;
    last: string;
  };
  roles: string[];
  foodWave?: string;
}

const UserInfo = ({ name, roles, foodWave }: UserInfoProps) => {
  return (
    <>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="bg-[#D9D9D9] w-full py-2 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-3 bg-[#CA2523] h-[75px] mr-2.5" />
              <View className="pl-1 flex-column">
                <Text className="font-proRacing text-2xl text-[#CA2523]">{name.first}</Text>
                <Text className="font-proRacing text-2xl font-bold text-[#CA2523]">
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
      <View className="h-0.5 bg-white mt-2 mb-3" />
      <Text className="font-inter text-xl italic mt-[-5px] mb-5 text-white">
        Roles: <Text className="font-bold not-italic">{roles.join(', ')}</Text>
      </Text>
      {foodWave && (
        <Text className="font-inter text-xl italic mt-[-5px] mb-5">
          Food Wave: <Text className="font-bold not-italic">{foodWave}</Text>
        </Text>
      )}
    </>
  );
};

export default UserInfo;
