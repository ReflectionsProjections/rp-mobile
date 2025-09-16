// --- SwipeDeck.tsx ---
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
  PanResponder,
  ImageBackground,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { ThemedText } from '../themed/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/lib/theme';
import { ShiftCard } from '@/api/types';
import { useAppSelector, RootState } from '@/lib/store';
import { triggerIfEnabled } from '@/lib/haptics';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height < 700 ? 95 : 110; // Smaller cards for iPhone SE

// Keynote Speaker
const SPECIAL_EVENT_ID = '8852aff5-015a-40b2-a32b-f1f738db34c8';

export interface CardType {
  id: string;
  title: string;
  time: string;
  location: string;
  pts: number;
  description?: string;
}

interface SwipeDeckProps<T extends CardType | ShiftCard> {
  data: T[];
  onCardPress?: (item: T) => void;
  containerStyle?: StyleProp<ViewStyle>;
  onSwipeTouchStart?: () => void;
  onSwipeTouchEnd?: () => void;
  disableSwipeAway?: boolean;
}

export default function SwipeDeck<T extends CardType | ShiftCard>({
  data,
  onCardPress = () => {},
  containerStyle,
  onSwipeTouchStart = () => {},
  onSwipeTouchEnd = () => {},
  disableSwipeAway = false,
}: SwipeDeckProps<T>) {
  const [cardIndex, setCardIndex] = useState(0);
  const themeColor = useThemeColor();
  const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);

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
          {'No items to display!'}
        </ThemedText>
      </View>
    );
  }

  const safeIndex = data.length > 0 ? Math.min(cardIndex, data.length - 1) : 0;

  const renderCard = (item: T | null, idx: number) => {
    if (!item) return <View style={[styles.card, styles.emptyCard]} />;
    const backgroundImages = [
      require('@/assets/background/cardBackground.png'),
      require('@/assets/background/cardBackground2.png'),
      require('@/assets/background/cardBackground3.png'),
    ];
    const getImageForId = (id: string) => {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = (hash << 5) - hash + id.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      const idxSafe = Math.abs(hash) % backgroundImages.length;
      return backgroundImages[idxSafe];
    };

    const isSpecialEvent = (item as CardType|ShiftCard).id === SPECIAL_EVENT_ID;
    
    return (
      <ImageBackground
        source={getImageForId((item as any).id)}
        style={[
          styles.card,
          // Gold glow effect for special event
          isSpecialEvent && {
            shadowColor: '#FFD700',
            shadowOpacity: 0.6,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 0 },
            elevation: 15,
            borderWidth: 1,
            borderColor: '#FFD700',
          },
        ]}
        imageStyle={styles.cardImage}
      >
        <View style={styles.cardHeader}>
          <ThemedText
            variant="body-bold"
            style={{
              color: '#000',
              fontSize: 20,
              fontFamily: 'magistral-medium',
              maxWidth: '90%',
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </ThemedText>
          {'acknowledged' in item &&
            (item.acknowledged ? (
              <FontAwesome name="check-circle" size={22} color={themeColor} />
            ) : (
              <FontAwesome name="exclamation-circle" size={22} color="#ff3b30" />
            ))}
        </View>

        <View className="flex-row justify-between">
          <View style={styles.timeContainer}>
            <FontAwesome name="clock-o" size={14} color="#666" style={styles.timeIcon} />
            <ThemedText
              variant="body"
              style={{
                color: '#000',
                fontSize: 16,
                marginBottom: 4,
                fontFamily: 'magistral',
              }}
            >
              {item.time}
            </ThemedText>
          </View>
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={14} color="#666" style={styles.locationIcon} />
            <ThemedText
              variant="body"
              style={{
                color: '#000',
                fontSize: 16,
                fontFamily: 'magistral',
              }}
            >
              {truncate(item.location, 20)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          {'pts' in item ? (
            <View style={[styles.points, { backgroundColor: themeColor }]}>
              <FontAwesome name="trophy" size={12} color="#fff" style={styles.pointsIcon} />
              <ThemedText style={styles.pointsText}>{item.pts} PTS</ThemedText>
            </View>
          ) : (
            <View style={[styles.role, { backgroundColor: themeColor }]}>
              <FontAwesome name="flag-checkered" size={12} color="#fff" style={styles.roleIcon} />
              <ThemedText style={styles.roleText}>{item.role}</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.dots} pointerEvents="none">
          {data.map((_, dotIdx) => (
            <View
              key={dotIdx}
              style={[
                styles.dot,
                dotIdx === idx && { ...styles.dotActive, backgroundColor: themeColor },
              ]}
            />
          ))}
        </View>
      </ImageBackground>
    );
  };

  return (
    <View style={[containerStyle, { paddingHorizontal: 20 }]} {...panResponder.panHandlers}>
      <Swiper
        key={`swiper-${themeColor}-${data.length}-${data[0]?.id ?? 'none'}-${
          data[data.length - 1]?.id ?? 'none'
        }`} // Force re-render when theme or dataset changes
        cards={data}
        renderCard={renderCard}
        keyExtractor={(card) => card.id}
        stackSize={Math.min(data.length, 3)}
        stackSeparation={0}
        infinite
        cardIndex={safeIndex}
        onSwipedLeft={async () => {
          await triggerIfEnabled(hapticsEnabled, 'light');
          setCardIndex((prev) => (prev + 1) % data.length);
        }}
        onSwipedRight={async () => {
          await triggerIfEnabled(hapticsEnabled, 'light');
          setCardIndex((prev) => (prev - 1 + data.length) % data.length);
        }}
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
    padding: height < 700 ? 8 : 12, // Smaller padding for iPhone SE
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overlayColor: 'rgba(255, 255, 255, 0.01)',
  },
  emptyCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    borderWidth: 0,
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  racingStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.8,
    width: '99%',
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: height < 700 ? 6 : 8, // Tighter spacing for iPhone SE
    marginTop: height < 700 ? 2 : 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeIcon: {
    marginRight: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  locationIcon: {
    marginRight: 6,
  },
  footer: {
    position: 'absolute',
    bottom: -10,
    right: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  points: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    marginRight: 4,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'ProRacing',
    fontWeight: 'bold',
  },
  role: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    marginRight: 4,
  },
  roleText: {
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
    // backgroundColor will be set dynamically using themeColor
  },
  cardImage: {
    opacity: 0.1,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  cardDecor: {
    position: 'absolute',
    left: -CARD_WIDTH * 0.3,
    top: -6,
    opacity: 0.5,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
});
