import React, { useState, useRef } from 'react';
import { View, PanResponder, Animated, Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import {
  LeaderboardTabs,
  LeaderboardList,
  globalLeaderboardData,
  dailyLeaderboardData,
  FadeInWrapper,
  FloatingAnimation,
} from '@/components/leaderboard';
import type { LeaderboardListHandle } from '@/components/leaderboard/LeaderboardList';
import {
  AnimatedScrollView,
  HeaderNavBar,
  HeaderComponentWrapper,
} from '@/components/headers/parallax';
import RpLeaderboardCar from '@/assets/images/leaderboard/rpcar.svg';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import BackgroundSvg from '@/assets/background/background_grate.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for Daily, 1 for Global
  const dailyUserRank = 14;
  const globalUserRank = 8;
  const userName = 'Leila Johnson'; // Replace with user id once data, or username...
  const dailyPoints = 15;
  const globalPoints = 250;

  const pan = useRef(new Animated.ValueXY()).current;
  const listRef = useRef<LeaderboardListHandle>(null);
  const outerScrollRef = useRef<any>(null);
  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const handleRankPress = () => {
    listRef.current?.scrollToUser();

    const userIndex = (activeTab === 0 ? dailyLeaderboardData : globalLeaderboardData).findIndex(
      (p) => p.name === userName,
    );

    if (userIndex !== -1 && outerScrollRef.current) {
      const ITEM_HEIGHT = 94;
      const HEADER_APPROX = 0;
      const scrollY = HEADER_APPROX + userIndex * ITEM_HEIGHT;
      try {
        outerScrollRef.current.scrollTo({ y: scrollY, animated: true });
      } catch {}
    }
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          setActiveTab(0);
        } else if (gestureState.dx < -50) {
          setActiveTab(1);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const data = activeTab === 0 ? dailyLeaderboardData : globalLeaderboardData;

  return (
    <View className="flex-1">
      <BackgroundSvg
          style={StyleSheet.absoluteFillObject}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          preserveAspectRatio="none"
        />
      <AnimatedScrollView
        ref={outerScrollRef}
        showsVerticalScrollIndicator={false}
        headerMaxHeight={360}
        renderHeaderNavBarComponent={() => (
          <HeaderNavBar isHeader={true} showTint={false}>
            <Header />
          </HeaderNavBar>
        )}
        renderHeaderComponent={() => (
          <HeaderComponentWrapper>
            <View
              style={{
                alignItems: 'center',
                marginTop: 110,
                zIndex: 10,
                marginBottom: 24,
              }}
            >
              <FadeInWrapper delay={200}>
                <FloatingAnimation amplitude={3} duration={2000}>
                  <RpLeaderboardCar />
                </FloatingAnimation>
              </FadeInWrapper>

              <FadeInWrapper delay={400}>
                <ThemedText
                  variant="bigName"
                  style={{
                    fontSize: 32,
                    textAlign: 'center',
                    marginTop: 16,
                    color: '#fff',
                    textShadowColor: 'rgba(0,0,0,0.5)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 6,
                  }}
                >
                  LEADERBOARD
                </ThemedText>
              </FadeInWrapper>

              <FadeInWrapper delay={600}>
                <Pressable
                  onPress={handleRankPress}
                  accessibilityRole="button"
                  accessibilityHint="Jumps to your position in the leaderboard"
                  hitSlop={12}
                  style={{ alignItems: 'center', marginTop: 24, marginBottom: 24 }}
                >
                  <View>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 24,
                        textShadowColor: 'rgba(0,0,0,0.5)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 6,
                        fontFamily: 'magistral-medium',
                      }}
                    >
                      You are{' '}
                      <Text style={{ color: '#CA2523' }}>
                        #{activeTab === 0 ? dailyUserRank : globalUserRank}
                      </Text>
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      marginTop: 10,
                      textShadowColor: 'rgba(0,0,0,0.5)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 6,
                      fontFamily: 'magistral',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#CA2523', fontSize: 24 }}>
                      {activeTab === 0 ? dailyPoints : globalPoints}
                    </Text>{' '}
                    LAP POINTS
                  </Text>
                  <Reanimated.View
                    style={[
                      { flexDirection: 'row', alignItems: 'center', marginTop: 6, opacity: 0.9 },
                      pulseStyle,
                    ]}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={16}
                      color="#fff"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'magistral-medium' }}>
                      Tap to jump
                    </Text>
                  </Reanimated.View>
                </Pressable>
              </FadeInWrapper>
            </View>
          </HeaderComponentWrapper>
        )}
        renderTopNavBarComponent={() => (
          <HeaderNavBar isHeader={true}>
            <View
              style={{
                position: 'relative',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <Header />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ThemedText
                  variant="bigName"
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    color: '#fff',
                    textShadowColor: 'rgba(0,0,0,0.5)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 6,
                  }}
                >
                  {activeTab === 0 ? 'DAILY' : 'GLOBAL'}
                </ThemedText>
              </View>
            </View>
          </HeaderNavBar>
        )}
      >
        <View {...panResponder.panHandlers}>
          <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </View>

        <FadeInWrapper delay={1000}>
          <LeaderboardList ref={listRef} data={data} userName={userName} />
        </FadeInWrapper>

        <View style={{ height: 100 }} />
      </AnimatedScrollView>
    </View>
  );
};

export default LeaderboardScreen;
