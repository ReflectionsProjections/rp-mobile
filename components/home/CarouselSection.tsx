import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import SwipeDeck from '@/components/home/SwipeDeck';
import { ThemedText } from '@/components/themed/ThemedText';
import { CardType } from './types';
import { ShiftCard } from '@/api/types';
import { useThemeColor } from '@/lib/theme';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height < 700 ? 95 : 100; // Smaller cards for iPhone SE
const STACK_SEPARATION = height < 700 ? 4 : 6; // Tighter spacing for small screens
const DOTS_HEIGHT = height < 700 ? 20 : 24; // Smaller dots area
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

  // Get racing icon for section
  const getRacingIcon = (sectionTitle: string) => {
    switch (sectionTitle.toUpperCase()) {
      case 'NEXT LAP':
        return 'flag-checkered';
      case 'UPCOMING':
        return 'road';
      case 'RECOMMENDED':
        return 'star';
      case 'FLAGGED':
        return 'bookmark';
      default:
        // Handle "SHIFTS (M/d)" format
        if (sectionTitle.toUpperCase().startsWith('SHIFTS')) {
          return 'clock-o';
        }
        return 'flag';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <FontAwesome
            name={getRacingIcon(title)}
            size={20}
            color={themeColor}
            style={styles.titleIcon}
          />
          <ThemedText variant="title" style={styles.title}>
            {title}
          </ThemedText>
        </View>
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
    marginBottom: height < 700 ? 0 : 12,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: height < 700 ? 12 : 16, // Tighter spacing for iPhone SE
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height < 700 ? 6 : 8, // Tighter spacing for iPhone SE
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: height < 700 ? 20 : 26, // Smaller title for iPhone SE
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'ProRacing',
    letterSpacing: height < 700 ? 0.5 : 1, // Tighter letter spacing for small screens
  },
  titleUnderline: {
    width: 80,
    height: 2,
    borderRadius: 1,
  },
  swipeContainer: {
    alignSelf: 'center',
  },
});
