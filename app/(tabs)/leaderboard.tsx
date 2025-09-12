import React, { useState, useRef, useCallback } from 'react';
import { View, PanResponder, Animated, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import {
  LeaderboardTabs,
  LeaderboardList,
  FadeInWrapper,
  FloatingAnimation,
} from '@/components/leaderboard';
import { useAppDispatch, useAppSelector, RootState } from '@/lib/store';
import { triggerIfEnabled } from '@/lib/haptics';
import { fetchDailyLeaderboard, fetchGlobalLeaderboard } from '@/lib/slices/leaderboardSlice';
import type { LeaderboardListHandle } from '@/components/leaderboard/LeaderboardList';
import {
  AnimatedScrollView,
  HeaderNavBar,
  HeaderComponentWrapper,
} from '@/components/headers/parallax';
import Fireworks from '@/assets/images/leaderboard/fireworks.svg';
import Pedestal from '@/assets/images/leaderboard/pedestals.svg';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useThemeColor } from '@/lib/theme';

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for Daily, 1 for Global
  const themeColor = useThemeColor();
  const attendee = useAppSelector((state) => state.attendee.attendee);
  const profile = useAppSelector((state) => state.user.profile);
  const dailyLeaderboard = useAppSelector((state) => state.leaderboard.daily);
  const globalLeaderboard = useAppSelector((state) => state.leaderboard.global);
  const dispatch = useAppDispatch();
  const today = new Date();
  const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);
  const dayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;

  React.useEffect(() => {
    if (!dailyLeaderboard.day || dailyLeaderboard.day !== dayStr) {
      dispatch(fetchDailyLeaderboard({ day: dayStr }));
    }
    if (globalLeaderboard.leaderboard.length === 0) {
      dispatch(fetchGlobalLeaderboard({}));
    }
  }, [dayStr]);

  const dailyUserRank =
    dailyLeaderboard.leaderboard.find((x) => x.userId === attendee?.userId)?.rank ?? 0;
  const globalUserRank =
    globalLeaderboard.leaderboard.find((x) => x.userId === attendee?.userId)?.rank ?? 0;
  const dailyPoints =
    dailyLeaderboard.leaderboard.find((x) => x.userId === attendee?.userId)?.points ?? 0;
  const globalPoints =
    globalLeaderboard.leaderboard.find((x) => x.userId === attendee?.userId)?.points ?? 0;

  const pan = useRef(new Animated.ValueXY()).current;
  const listRef = useRef<LeaderboardListHandle>(null);
  const outerScrollRef = useRef<any>(null);
  const pulse = useSharedValue(1);
  // const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  React.useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const handleRankPress = async () => {
    await triggerIfEnabled(hapticsEnabled, 'medium');
    listRef.current?.scrollToUser();

    const userIndex = data.findIndex((p: any) => p.userId === attendee?.userId);

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

  // No load-more. We'll compute top/user/bottom sections with separators.

  const {
    data,
    showTopSeparator,
    topSeparatorIndex,
    peopleAboveCount,
    showBottomSeparator,
    bottomSeparatorIndex,
    peopleBelowCount,
  } = React.useMemo(() => {
    const src =
      activeTab === 0
        ? (dailyLeaderboard.leaderboard ?? dailyLeaderboard.leaderboard)
        : (globalLeaderboard.leaderboard ?? globalLeaderboard.leaderboard);
    if (!src) return { data: [], showSeparator: false, separatorIndex: -1, peopleBetweenCount: 0 };

    const mappedData = src.map((p) => ({
      rank: p.rank,
      userId: p.userId,
      name: p.displayName,
      points: p.points,
      color: p.icon,
      currentTier: p.currentTier,
    }));

    const userIndex = mappedData.findIndex((item) => item.userId === attendee?.userId);

    const TOP_COUNT = 20;
    const CONTEXT_BEFORE = 6;
    const CONTEXT_AFTER = 6;
    const BOTTOM_COUNT = 20;

    // If no user found or list small, just show up to TOP_COUNT
    if (userIndex === -1 || mappedData.length <= TOP_COUNT) {
      return {
        data: mappedData.slice(0, Math.min(TOP_COUNT, mappedData.length)),
        showTopSeparator: false,
        topSeparatorIndex: -1,
        peopleAboveCount: 0,
        showBottomSeparator: false,
        bottomSeparatorIndex: -1,
        peopleBelowCount: 0,
      };
    }

    const top = mappedData.slice(0, TOP_COUNT);
    const contextStart = Math.max(0, userIndex - CONTEXT_BEFORE);
    const contextEnd = Math.min(mappedData.length, userIndex + CONTEXT_AFTER + 1);
    const userContext = mappedData.slice(contextStart, contextEnd);

    // Deduplicate overlaps
    const seen = new Set<string>();
    const pushUnique = (arr: typeof mappedData, into: typeof mappedData) => {
      for (const item of arr) {
        if (!seen.has(item.userId)) {
          seen.add(item.userId);
          into.push(item);
        }
      }
    };

    const assembled: typeof mappedData = [];
    pushUnique(top, assembled);
    pushUnique(userContext, assembled);

    // Count everyone before the user's context
    const peopleAboveCount = Math.max(0, contextStart);
    // Count everyone after the user's context
    const peopleBelowCount = Math.max(0, mappedData.length - contextEnd);

    const showTopSeparator = peopleAboveCount > 0;
    const topSeparatorIndex = showTopSeparator ? top.length : -1;

    const showBottomSeparator = peopleBelowCount > 0;
    // Place the bottom separator after the user context (end of assembled array)
    const bottomSeparatorIndex = showBottomSeparator ? assembled.length : -1;

    return {
      data: assembled,
      showTopSeparator,
      topSeparatorIndex,
      peopleAboveCount,
      showBottomSeparator,
      bottomSeparatorIndex,
      peopleBelowCount,
    };
  }, [activeTab, dailyLeaderboard, globalLeaderboard, attendee?.userId]);

  return (
    <View className="flex-1 bg-black">
      <AnimatedScrollView
        ref={outerScrollRef}
        showsVerticalScrollIndicator={false}
        headerMaxHeight={330}
        // No load-more scrolling
        renderHeaderNavBarComponent={() => (
          <HeaderNavBar isHeader={true} showTint={false}>
            <Header title={'STANDINGS'} bigText={false} />
          </HeaderNavBar>
        )}
        renderHeaderComponent={() => (
          <HeaderComponentWrapper>
            <View
              style={{
                alignItems: 'center',
                marginTop: 28,
                zIndex: 10,
                marginBottom: 24,
              }}
            >
              <FadeInWrapper delay={200}>
                <View>
                  <Fireworks
                    style={{ position: 'absolute', zIndex: 1, top: 40, alignSelf: 'center' }}
                  />
                </View>
                <FloatingAnimation style={{ alignSelf: 'center', zIndex: 2, marginTop: 110 }}>
                  <Pedestal style={{ alignSelf: 'center', zIndex: 2 }} />
                </FloatingAnimation>
              </FadeInWrapper>

              <FadeInWrapper delay={600}>
                <Pressable
                  onPress={profile?.roles?.includes('STAFF') ? undefined : handleRankPress}
                  accessibilityRole="button"
                  accessibilityHint="Jumps to your position in the leaderboard"
                  hitSlop={12}
                  style={{ alignItems: 'center', marginTop: 24, marginBottom: 24 }}
                >
                  <View>
                    <Text
                      style={{
                        color: '#F5B44C',
                        fontWeight: 'bold',
                        fontSize: 24,
                        textShadowColor: 'rgba(0,0,0,0.5)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 6,
                        fontFamily: 'magistral-medium',
                      }}
                    >
                      You are{' '}
                      <Text style={{ color: themeColor }}>
                        #{activeTab === 0 ? dailyUserRank : globalUserRank}
                      </Text>
                    </Text>
                  </View>
                  <View></View>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      marginTop: 10,
                      textShadowColor: 'rgba(0,0,0,0.5)',
                      textShadowOffset: { width: 0, height: 2 },
                      textShadowRadius: 6,
                      fontFamily: 'magistral',
                      alignItems: 'baseline',
                    }}
                  >
                    <Text style={{ color: themeColor, fontSize: 28 }}>
                      {activeTab === 0 ? dailyPoints : globalPoints}
                    </Text>{' '}
                    LAP POINTS
                  </Text>

                  {profile?.roles.includes('USER') && profile?.roles.length === 1 ? (
                    <Reanimated.View
                      style={[
                        { flexDirection: 'row', alignItems: 'center', marginTop: 6, opacity: 0.9 },
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
                  ) : null}
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
              <Header bigText={false} />
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
          {activeTab === 0 &&
          (!dailyLeaderboard || (dailyLeaderboard.leaderboard?.length ?? 0) === 0) ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'magistral-medium',
                  textAlign: 'center',
                }}
              >
                No leaderboard for today — check back tomorrow!
              </Text>
            </View>
          ) : activeTab === 1 &&
            (!globalLeaderboard || (globalLeaderboard.leaderboard?.length ?? 0) === 0) ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'magistral-medium',
                  textAlign: 'center',
                }}
              >
                No leaderboard found.
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <LeaderboardList
                ref={listRef}
                data={data}
                userId={attendee?.userId ?? ''}
                showTopSeparator={showTopSeparator}
                topSeparatorIndex={topSeparatorIndex}
                peopleAboveCount={peopleAboveCount}
                showBottomSeparator={showBottomSeparator}
                bottomSeparatorIndex={bottomSeparatorIndex}
                peopleBelowCount={peopleBelowCount}
              />
            </View>
          )}
        </FadeInWrapper>

        <View style={{ height: 100 }} />
      </AnimatedScrollView>
    </View>
  );
};

export default LeaderboardScreen;
