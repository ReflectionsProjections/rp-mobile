// SwipeDeck.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
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
  description?: string; // optional for modal
}

interface SwipeDeckProps {
  data: CardType[];
  onCardPress?: (item: CardType) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function SwipeDeck({
  data,
  onCardPress = () => {},
  containerStyle,
}: SwipeDeckProps) {
  const [cardIndex, setCardIndex] = useState(0);

  const renderCard = (item: CardType, idx: number) => {
    if (!item) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText variant="body" className='text-[14px] leading-[14px]'>{item.title}</ThemedText>

        </View>

        <ThemedText variant="body" className='text-[12px]'>{item.time}</ThemedText>
        <ThemedText variant="body" className='text-[10px]'>{truncate(item.location, 20)}</ThemedText>

        { idx === cardIndex % data.length && (
          <View style={styles.footer}>
            <View style={styles.points}>
              <ThemedText style={styles.pointsText}>{item.pts} PTS</ThemedText>
            </View>
          </View>
        )}

        {/* only show dots when this is the front card */}
        {idx === cardIndex % data.length && (
          <View style={styles.dots}>
            {data.map((_, dotIdx) => (
              <View
                key={dotIdx}
                style={[
                  styles.dot,
                  cardIndex % data.length === dotIdx && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Swiper
      cards={data}
      renderCard={renderCard}

      keyExtractor={(card) => card.id}

      stackSize={Math.min(data.length, 3)}
      
      key={data.length}

      stackSeparation={8}
      infinite
      cardIndex={cardIndex}
      onSwiped={(i) => setCardIndex(i + 1)}
      onTapCard={(i) => onCardPress(data[i])}
      backgroundColor="transparent"
      cardHorizontalMargin={0}
      cardVerticalMargin={0}
      containerStyle={
        containerStyle
          ? (StyleSheet.flatten(containerStyle) as object)
          : undefined
      }
      disableTopSwipe
      disableBottomSwipe
    />
  );
}

function truncate(str: string, maxLen: number) {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  time: { color: '#000', marginTop: 4 },
  location: { color: '#999', marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end' },
  points: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: { color: '#fff', fontSize: 12 },

  dots: {
    position: 'absolute',
    bottom: 8,
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
