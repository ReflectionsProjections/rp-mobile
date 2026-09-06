import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';

interface ModeSwitchProps {
  isGeneralCheckinMode: boolean;
  onModeChange: (isGeneralCheckin: boolean) => void;
}

function ModeButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="items-center justify-center rounded-xl"
      style={{
        width: 156,
        height: 58,
        borderWidth: 4,
        backgroundColor: active ? '#ff4ccc' : '#150935',
        borderColor: active ? '#373792' : '#0f062d',
      }}
    >
      <Text
        className="text-white text-center"
        style={{ fontFamily: 'Ethnocentric', fontSize: 12, lineHeight: 16 }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function ModeSwitch({ isGeneralCheckinMode, onModeChange }: ModeSwitchProps) {
  return (
    <View className="px-4">
      <Text
        className="text-white text-center mt-2 mb-5"
        style={{
          fontFamily: 'Ethnocentric',
          fontSize: 32,
          lineHeight: 38,
          textShadowColor: '#a511b4',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 18,
        }}
      >
        Staff{'\n'}Scanner
      </Text>

      <View className="flex-row items-center justify-between px-2">
        <ModeButton
          label={'General\nCheck-In'}
          active={isGeneralCheckinMode}
          onPress={() => onModeChange(true)}
        />
        <ModeButton
          label={'Event\nCheck-In'}
          active={!isGeneralCheckinMode}
          onPress={() => onModeChange(false)}
        />
      </View>
    </View>
  );
}
