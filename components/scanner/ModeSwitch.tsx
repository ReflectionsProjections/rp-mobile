import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ModeSwitchProps {
  isGeneralCheckinMode: boolean;
  onModeChange: (isGeneralCheckin: boolean) => void;
}

export default function ModeSwitch({ isGeneralCheckinMode, onModeChange }: ModeSwitchProps) {
  return (
    <View className="px-4 py-2">
      <Text
        className="text-white text-center text-[24px] font-bold tracking-wider mt-8 mb-4"
        style={{ fontFamily: 'ProRacing' }}
      >
        Staff Scanner
      </Text>

      {/* Mode Switch */}
      <LinearGradient colors={['#ffffff10', '#ffffff05']} className="rounded-xl p-[1px]">
        <View className="bg-[#121212] rounded-xl border border-white/10 p-1">
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${
                isGeneralCheckinMode ? 'bg-[#00adb5]' : 'bg-transparent'
              }`}
              onPress={() => onModeChange(true)}
            >
              <Text
                className={`text-center font-semibold ${
                  isGeneralCheckinMode ? 'text-white' : 'text-white/60'
                }`}
              >
                General Check-in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${
                !isGeneralCheckinMode ? 'bg-[#00adb5]' : 'bg-transparent'
              }`}
              onPress={() => onModeChange(false)}
            >
              <Text
                className={`text-center font-semibold ${
                  !isGeneralCheckinMode ? 'text-white' : 'text-white/60'
                }`}
              >
                Event Check-in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
