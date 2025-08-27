import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const colors = ['#75D46E', '#2E1C47', '#D69C2B', '#4450D6', '#F7D62A', '#FFFFFF'];

const ColorPicker = () => {
  return (
    <>
      <Text className="font-proRacing text-[22px] mt-0.5 mb-2 text-white">CUSTOMIZE</Text>
      {/* Elevation for Android, shadow for iOS */}
      <View className="self-stretch shadow-lg shadow-black/50" style={{ elevation: 5 }}>
        <View className="flex-row py-2">
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              className="w-[30px] h-[30px] rounded-full mr-3 border border-gray-300"
              style={{ backgroundColor: color }}
            />
          ))}
        </View>
      </View>
    </>
  );
};

export default ColorPicker;
