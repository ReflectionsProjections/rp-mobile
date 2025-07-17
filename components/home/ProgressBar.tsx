import React from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View className="h-2 bg-[#555] mx-4 rounded overflow-hidden">
      <View className="h-full bg-[#ccc]" style={{ width: `${progress}%` }} />
    </View>
  );
};
