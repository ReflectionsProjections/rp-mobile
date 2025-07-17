import React from 'react';
import { View, Dimensions } from 'react-native';
import SwipeDeck from '@/components/home/SwipeDeck';
import { ThemedText } from '@/components/themed/ThemedText';
import { CardType } from './types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 100;
const STACK_SEPARATION = 6;
const DOTS_HEIGHT = 24;
const STACK_SIZE = 3;

interface CarouselSectionProps {
  title: string;
  data: CardType[];
  flaggedIds: Set<string>;
  onToggleFlag(id: string): void;
  onCardPress(item: CardType): void;
  /* Maximum number of cards to display */
  limit?: number;
}

export const CarouselSection: React.FC<CarouselSectionProps> = ({
  title,
  data,
  flaggedIds,
  onToggleFlag,
  onCardPress,
  limit,
}) => {
  const displayData = typeof limit === 'number' ? data.slice(0, limit) : data;

  const containerHeight = CARD_HEIGHT + STACK_SEPARATION * (STACK_SIZE - 1) + DOTS_HEIGHT;

  return (
    <View className="mt-6 mb-6">
      <ThemedText variant="title" className="mx-4 mb-2">
        {title}
      </ThemedText>

      <View className="self-center mb-3" style={{ width: CARD_WIDTH, height: containerHeight }}>
        <SwipeDeck data={displayData} onCardPress={onCardPress} containerStyle={{ flex: 1 }} />
      </View>
    </View>
  );
};
