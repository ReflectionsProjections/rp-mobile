import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import SwipeDeck from '@/components/home/SwipeDeck';
import { ThemedText } from '@/components/themed/ThemedText';
import { CardType } from './types';
import { ShiftCard } from '@/api/types';
import { useThemeColor } from '@/lib/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 100;
const STACK_SEPARATION = 6;
const DOTS_HEIGHT = 24;
const STACK_SIZE = 3;

interface CarouselSectionProps<T = CardType> {
  title: string;
  data: T[];
  flaggedIds: string[];
  onToggleFlag(id: string): void;
  onCardPress(item: T): void;
  /* Maximum number of cards to display */
  limit?: number;
  onSwipeTouchStart?: () => void;
  onSwipeTouchEnd?: () => void;
}

export const CarouselSection = <T extends CardType | ShiftCard>({
  title,
  data,
  flaggedIds,
  onToggleFlag,
  onCardPress,
  limit,
  onSwipeTouchStart,
  onSwipeTouchEnd,
}: CarouselSectionProps<T>) => {
  const displayData = typeof limit === 'number' ? data.slice(0, limit) : data;
  const themeColor = useThemeColor();

  const containerHeight = CARD_HEIGHT + STACK_SEPARATION * (STACK_SIZE - 1) + DOTS_HEIGHT;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText variant="title" style={styles.title}>
          {title}
        </ThemedText>
        <View style={[styles.titleUnderline, { backgroundColor: themeColor }]} />
      </View>

      <View style={[styles.swipeContainer, { width: CARD_WIDTH, height: containerHeight }]}>
        <SwipeDeck
          key={`swipedeck-${themeColor}`} // Force re-render when theme changes
          data={displayData}
          onCardPress={onCardPress}
          containerStyle={{ flex: 1 }}
          onSwipeTouchStart={onSwipeTouchStart}
          onSwipeTouchEnd={onSwipeTouchEnd}
          disableSwipeAway={displayData.length === 1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 80,
    height: 2,
    borderRadius: 1,
  },
  swipeContainer: {
    alignSelf: 'center',
  }
});
