// --- SwipeDeck.tsx ---
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle, PanResponder } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { ThemedText } from '../themed/ThemedText';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 120;

export interface CardType {
  id: string;
  title: string;
  time: string;
  location: string;
  pts: number;
  description?: string;
}

interface SwipeDeckProps {
  data: CardType[];
  onCardPress?: (item: CardType) => void;
  containerStyle?: StyleProp<ViewStyle>;
  onSwipeTouchStart?: () => void;
  onSwipeTouchEnd?: () => void;
  disableSwipeAway?: boolean;
}

export default function SwipeDeck({
  data,
  onCardPress = () => {},
  containerStyle,
  onSwipeTouchStart = () => {},
  onSwipeTouchEnd = () => {},
  disableSwipeAway = false,
}: SwipeDeckProps) {
  const [cardIndex, setCardIndex] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        onSwipeTouchStart();
        return false;
      },
      onPanResponderRelease: () => {
        onSwipeTouchEnd();
      },
      onPanResponderTerminate: () => {
        onSwipeTouchEnd();
      },
    }),
  ).current;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.card, { justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText variant="body" className="text-gray-500">
          No events available
        </ThemedText>
      </View>
    );
  }

  const safeIndex = data.length > 0 ? Math.min(cardIndex, data.length - 1) : 0;

  const renderCard = (item: CardType | null, idx: number) => {
    if (!item) return <View style={[styles.card, styles.emptyCard]} />;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText variant="body" className="text-[14px] leading-[14px]">
            {item.title}
          </ThemedText>
        </View>
        <ThemedText variant="body" className="text-[12px]">
          {item.time}
        </ThemedText>
        <ThemedText variant="body" className="text-[10px]">
          {truncate(item.location, 20)}
        </ThemedText>
        <View style={styles.footer}>
          <View style={styles.points}>
            <ThemedText style={styles.pointsText}>{item.pts} PTS</ThemedText>
          </View>
        </View>
        <View style={styles.dots} pointerEvents="none">
          {data.map((_, dotIdx) => (
            <View key={dotIdx} style={[styles.dot, dotIdx === idx && styles.dotActive]} />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[containerStyle, { paddingHorizontal: 20 }]} {...panResponder.panHandlers}>
      <Swiper
        cards={data}
        renderCard={renderCard}
        keyExtractor={(card) => card.id}
        stackSize={Math.min(data.length, 3)}
        stackSeparation={0}
        infinite
        cardIndex={safeIndex}
        onSwipedLeft={() => setCardIndex((prev) => (prev + 1) % data.length)}
        onSwipedRight={() => setCardIndex((prev) => (prev - 1 + data.length) % data.length)}
        onTapCard={(i) => {
          if (i < data.length) {
            onCardPress(data[i]);
          }
        }}
        backgroundColor="transparent"
        cardHorizontalMargin={0}
        cardVerticalMargin={0}
        disableTopSwipe
        disableBottomSwipe
        disableLeftSwipe={disableSwipeAway}
        disableRightSwipe={disableSwipeAway}
        horizontalThreshold={80}
        swipeAnimationDuration={250}
      />
    </View>
  );
}

function truncate(str: string, maxLen: number) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trimEnd() + '…';
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#dbdbdb',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  emptyCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  points: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#555',
    marginHorizontal: 2,
  },
  dotActive: {
    backgroundColor: '#eee',
  },
});
