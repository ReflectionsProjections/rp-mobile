import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import QuestionSvg from '../../assets/images/question.svg';

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
  <View className={`absolute items-end flex-row ${className}`.trim()} style={style}>
    <QuestionSvg width={70} height={70} />
    {/* */}
    <Text className="text-[24px] font-RacingSansOne italic font-bold text-[#FFFFFF] -ml-7">
      ×{count}
    </Text>
  </View>
);
