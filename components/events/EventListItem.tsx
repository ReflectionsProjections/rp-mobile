import React from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedAnimated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Event } from '@/api/types';
import { formatAMPM } from '@/lib/utils';

const cardColors = ['#B9C8FF', '#ECB9FF', '#FFBEB9'];

type Props = {
  item: Event;
  index: number;
  width: number;
  anim: Animated.Value;
  onPress: () => void;
  onFlag?: (eventId: string) => void;
  isFlagged?: boolean;
};

export const getEventCardColor = (index: number) => cardColors[index % cardColors.length];

export const EventListItem: React.FC<Props> = ({
  item,
  index,
  width,
  anim,
  onPress,
  onFlag,
  isFlagged = false,
}) => {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const translateX = useSharedValue(0);
  const accentColor = getEventCardColor(index);
  const start = new Date(item.startTime);
  const startStr = formatAMPM(start).replace('pm', ' PM').replace('am', ' AM');
  const cleanType = item.eventType === 'SPECIAL' ? 'WORKSHOP' : item.eventType;
  const pointsLabel = `${item.points || 0} POINTS`;
  const cardWidth = Math.min(width, 365);

  const triggerFlagAndReset = () => {
    if (onFlag) {
      runOnJS(onFlag)(item.eventId);
    }
    translateX.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([12, 999])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, 116);
      }
    })
    .onEnd((event) => {
      if (event.translationX > 78 || event.velocityX > 500) {
        translateX.value = withTiming(96, { duration: 140 }, () => {
          runOnJS(triggerFlagAndReset)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedBgStyle = useAnimatedStyle(() => ({
    width: translateX.value,
    opacity: interpolate(translateX.value, [0, 78], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View
      style={[
        styles.animatedWrap,
        {
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.row, { width: cardWidth }]}>
        <ReanimatedAnimated.View style={[styles.flagReveal, animatedBgStyle]}>
          <MaterialCommunityIcons
            name={isFlagged ? 'flag' : 'flag-outline'}
            size={20}
            color="#fff"
          />
          <Text style={styles.flagText}>{isFlagged ? 'UNFLAG' : 'FLAG'}</Text>
        </ReanimatedAnimated.View>

        <GestureDetector gesture={panGesture}>
          <ReanimatedAnimated.View style={animatedCardStyle}>
            <View pointerEvents="none" style={styles.sideTabs}>
              <View style={styles.sideTab} />
              <View style={styles.sideTab} />
            </View>
            <TouchableOpacity
              onPress={onPress}
              activeOpacity={0.88}
              style={[styles.card, { width: cardWidth, backgroundColor: accentColor }]}
            >
              <View style={styles.plate}>
                <ImageBackground
                  source={require('@/assets/images/eventpillbg.png')}
                  resizeMode="stretch"
                  style={styles.paper}
                  imageStyle={styles.paperImage}
                >
                  <View style={styles.titleBox}>
                    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <View style={styles.iconSlot}>
                      <MaterialCommunityIcons name="clock-outline" size={21} color="#070707" />
                    </View>
                    <Text style={styles.metaText} numberOfLines={1} adjustsFontSizeToFit>
                      {startStr}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <View style={styles.iconSlot}>
                      <MaterialCommunityIcons name="map-marker-outline" size={23} color="#070707" />
                    </View>
                    <Text
                      style={styles.metaText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.72}
                    >
                      {item.location}
                    </Text>
                  </View>
                </ImageBackground>
              </View>

              <View style={styles.footer}>
                <LinearGradient
                  colors={['#373792', '#F52DBC']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.badgeShadow}
                >
                  <View style={styles.badgeInner}>
                    <Text
                      style={styles.badgeText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.68}
                    >
                      {pointsLabel}
                    </Text>
                  </View>
                </LinearGradient>
                <LinearGradient
                  colors={['#373792', '#F52DBC']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.badgeShadowWide}
                >
                  <View style={styles.badgeInner}>
                    <Text
                      style={styles.badgeText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.68}
                    >
                      {cleanType}
                    </Text>
                  </View>
                </LinearGradient>
                <MaterialCommunityIcons name="play" size={36} color="#25106F" style={styles.play} />
              </View>
            </TouchableOpacity>
          </ReanimatedAnimated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedWrap: {
    alignItems: 'center',
  },
  row: {
    minHeight: 185,
    marginBottom: 24,
  },
  flagReveal: {
    position: 'absolute',
    left: 0,
    top: 34,
    bottom: 24,
    borderRadius: 12,
    backgroundColor: '#F52DBC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
  flagText: {
    marginTop: 4,
    color: '#fff',
    fontFamily: 'Ethnocentric',
    fontSize: 10,
  },
  card: {
    zIndex: 1,
    height: 185,
    borderRadius: 10,
    paddingTop: 14,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'visible',
  },
  sideTabs: {
    position: 'absolute',
    right: -8,
    top: 26,
    gap: 5,
    zIndex: 0,
  },
  sideTab: {
    width: 11,
    height: 34,
    borderRadius: 2,
    backgroundColor: '#F52DBC',
  },
  plate: {
    height: 115,
    borderRadius: 10,
    backgroundColor: '#373792',
    paddingHorizontal: 11,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.24,
    shadowRadius: 0,
  },
  paper: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#F8F8F4',
    paddingHorizontal: 14,
    paddingTop: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
  },
  paperImage: {
    borderRadius: 4,
  },
  titleBox: {
    height: 44,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  title: {
    color: '#050505',
    fontFamily: 'Ethnocentric',
    fontSize: 16,
    lineHeight: 22,
  },
  metaRow: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  iconSlot: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    color: '#050505',
    fontFamily: 'Ethnocentric',
    fontSize: 12,
    lineHeight: 22,
    flexShrink: 1,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeShadow: {
    width: 96,
    height: 34,
    borderRadius: 14,
    padding: 4,
  },
  badgeShadowWide: {
    width: 110,
    height: 34,
    marginLeft: 10,
    borderRadius: 14,
    padding: 4,
  },
  badgeInner: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#150935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontFamily: 'Ethnocentric',
    fontSize: 10,
    lineHeight: 22,
  },
  play: {
    marginLeft: 'auto',
    marginRight: 12,
  },
});
