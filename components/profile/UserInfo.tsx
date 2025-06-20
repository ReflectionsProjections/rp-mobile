import React from 'react';
import { View, Text } from 'react-native';
import LOGO from '../../assets/images/logo.svg';

interface UserInfoProps {
  name: {
    first: string;
    last: string;
  };
  foodWave: string;
}

const UserInfo = ({ name, foodWave }: UserInfoProps) => {
    return (
        <>
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <View className="w-2 bg-black h-[55px] mr-2.5" />
                    <View className="shrink">
                        <Text className="font-inter text-xl">{name.first}</Text>
                        <Text className="font-proRacing text-2xl font-bold">{name.last}</Text>
                    </View>
                </View>
                <LOGO width={40} height={40} />
            </View>

            <View className="h-0.5 bg-black my-3" />

            <Text className="font-inter text-xl italic mt-[-5px] mb-5">
                Food Wave: <Text className="font-bold not-italic">{foodWave}</Text>
            </Text>
        </>
    );
};

export default UserInfo; 