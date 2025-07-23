import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface QuestionMarkerProps {
  count: number;
  className?: string;
  style?: ViewStyle;
}

export const QuestionMarker: React.FC<QuestionMarkerProps> = ({
  count,
  className = '',
  style = {},
}) => (
  <View
    className={`absolute items-center ${className}`.trim()}
    style={style}
  >
    <Text
      className="text-[40px] font-proRacing text-[#C49D00]"
    >
      ?
    </Text>
    <Text
      className="text-[16px] font-proRacing text-[#C49D00] -mt-1"
    >
      ×{count}
    </Text>
  </View>
);
