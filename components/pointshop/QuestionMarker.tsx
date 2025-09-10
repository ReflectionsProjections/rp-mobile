import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import QuestionSvg from '../../assets/images/question.svg';
import { TierType } from '@/api/types';

interface QuestionMarkerProps {
  tier: TierType;
  className?: string;
  style?: ViewStyle;
}

export const QuestionMarker: React.FC<QuestionMarkerProps> = ({
  tier,
  className = '',
  style = {},
}) => (
  <View className={`absolute items-end flex-row ${className}`.trim()} style={style}>
    <QuestionSvg width={70} height={70} />
    {/* */}
    <Text className="text-[22px] font-RacingSansOne italic font-bold text-[#FFFFFF] -ml-7">
      ×{tier}
    </Text>
  </View>
);
