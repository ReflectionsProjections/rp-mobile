// SwipeDeck.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { FontAwesome } from '@expo/vector-icons';
import { AppText } from './AppText';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 100;

export interface CardType {
  id: string;
  title: string;
  time: string;
  location: string;
  pts: number;
}

interface SwipeDeckProps {
  data: CardType[];
  flaggedIds: Set<string>;
  onToggleFlag: (id: string) => void;
  onCardPress?: (item: CardType) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function SwipeDeck({
  data,
  flaggedIds,
  onToggleFlag,
  onCardPress = () => {},
  containerStyle,
}: SwipeDeckProps) {
  const [cardIndex, setCardIndex] = useState(0);

  const renderCard = (item: CardType, idx: number) => {
    if (!item) return null;
    const isFlagged = flaggedIds.has(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AppText style={styles.title}>{item.title}</AppText>


          <TouchableOpacity onPress={() => onToggleFlag(item.id)}>
            <FontAwesome
              name={isFlagged ? 'flag' : 'flag-o'}
              size={18}
              color={isFlagged ? 'tomato' : '#000'}
            />
          </TouchableOpacity>
        </View>

        <AppText style={styles.time}>{item.time}</AppText>
        <AppText style={styles.location}>{item.location}</AppText>

        { idx === cardIndex % data.length && (
          <View style={styles.footer}>
            <View style={styles.points}>
              <AppText style={styles.pointsText}>{item.pts} PTS</AppText>
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

      // 1) stable keys
      keyExtractor={(card) => card.id}

      // 2) never ask for more cards than you have
      stackSize={Math.min(data.length, 3)}
      
      // 3) force remount when data length changes
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
