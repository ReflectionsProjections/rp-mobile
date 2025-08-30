// --- SwipeDeck.tsx ---
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle, PanResponder, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { ThemedText } from '../themed/ThemedText';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 130;

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
  flaggedIds?: Set<string>;
  onToggleFlag?: (id: string) => void;
}

export default function SwipeDeck({
  data,
  onCardPress = () => {},
  containerStyle,
  onSwipeTouchStart = () => {},
  onSwipeTouchEnd = () => {},
  disableSwipeAway = false,
  flaggedIds = new Set<string>(),
  onToggleFlag = () => {},
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
        <ThemedText
          variant="body"
          style={{
            color: '#000',
            fontSize: 16,
            textAlign: 'center',
            fontFamily: 'magistral',
          }}
        >
          No events flagged yet!
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
          <ThemedText
            variant="body-bold"
            style={{
              color: '#000',
              fontSize: 20,
              fontFamily: 'magistral-medium',
            }}
          >
            {item.title}
          </ThemedText>
          <TouchableOpacity onPress={() => onToggleFlag(item.id)} style={styles.flagButton}>
            <Ionicons
              name={flaggedIds.has(item.id) ? 'star' : 'star-outline'}
              size={20}
              color={flaggedIds.has(item.id) ? '#FFD700' : '#aaa'}
            />
          </TouchableOpacity>
        </View>
        <ThemedText
          variant="body"
          style={{
            color: '#000',
            fontSize: 14,
            marginBottom: 4,
            fontFamily: 'magistral',
          }}
        >
          {item.time}
        </ThemedText>
        <ThemedText
          variant="body"
          style={{
            color: '#000',
            fontSize: 12,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 1,
          }}
        >
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    borderWidth: 0,
  },
  flagButton: {
    padding: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  points: {
    backgroundColor: '#CA2523',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'ProRacing',
    fontWeight: 'bold',
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#CA2523',
  },
});
