import React, { useState, useRef, useCallback } from 'react';
import { View, PanResponder, Animated, Pressable, Text, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import {
  LeaderboardTabs,
  LeaderboardList,
  FadeInWrapper,
  FloatingAnimation,
} from '@/components/leaderboard';
import { useAppDispatch } from '@/lib/store';
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
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { useThemeColor } from '@/lib/theme';
import { useAppSelector } from '@/lib/store';

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for Daily, 1 for Global
  const themeColor = useThemeColor();
  const attendee = useAppSelector((state) => state.attendee.attendee);
  const profile = useAppSelector((state) => state.user.profile);
  const dailyLeaderboard = useAppSelector((state) => state.leaderboard.daily);
  const globalLeaderboard = useAppSelector((state) => state.leaderboard.global);
  const dispatch = useAppDispatch();
  const today = new Date();
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

  // Reset loading state when switching tabs
  React.useEffect(() => {
    setHasLoadedMore(false);
    setIsLoadingMore(false);
  }, [activeTab]);
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

  const handleRankPress = () => {
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

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const loadMoreData = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Get current data length to determine how many more to fetch
      const currentData =
        activeTab === 0 ? dailyLeaderboard.leaderboard : globalLeaderboard.leaderboard;
      const newCount = currentData.length + 20;

      // Fetch more data from API
      if (activeTab === 0) {
        await dispatch(
          fetchDailyLeaderboard({
            day: dayStr,
            n: newCount,
            append: true,
          }),
        );
      } else {
        await dispatch(
          fetchGlobalLeaderboard({
            n: newCount,
            append: true,
          }),
        );
      }
      setHasLoadedMore(true);
    } catch (error) {
      console.error('Failed to load more leaderboard data:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    activeTab,
    dayStr,
    dispatch,
    dailyLeaderboard.leaderboard.length,
    globalLeaderboard.leaderboard.length,
  ]);

  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const isCloseToBottom =
        contentOffset.y + layoutMeasurement.height >= contentSize.height - 200;
      const isCloseToTop = contentOffset.y <= 200;

      if (isCloseToBottom && !isLoadingMore) {
        loadMoreData();
      }

      // Note: For now, we only load more data when scrolling down
      // Scrolling up to load more data would require more complex logic
      // to handle the user context positioning
    },
    [loadMoreData, isLoadingMore],
  );

  const { data, showSeparator, separatorIndex, peopleBetweenCount } = React.useMemo(() => {
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

    if (userIndex === -1) {
      const initialCount = hasLoadedMore ? mappedData.length : Math.min(20, mappedData.length);
      return {
        data: mappedData.slice(0, initialCount),
        showSeparator: false,
        separatorIndex: -1,
        peopleBetweenCount: 0,
      };
    }

    // If user is in top 20, return first 20 items (or more if loaded)
    if (userIndex < 20) {
      const initialCount = hasLoadedMore ? mappedData.length : Math.min(20, mappedData.length);
      return {
        data: mappedData.slice(0, initialCount),
        showSeparator: false,
        separatorIndex: -1,
        peopleBetweenCount: 0,
      };
    }

    const contextSize = 12; // 6 items before and 6 items after user
    const startIndex = Math.max(0, userIndex - 6);
    const endIndex = Math.min(mappedData.length, userIndex + 7);

    // Always show first 20, then user context
    const firstDisplayed = mappedData.slice(0, 20);
    const userContext = mappedData.slice(startIndex, endIndex);

    const userIds = new Set(firstDisplayed.map((item) => item.userId));
    const uniqueUserContext = userContext.filter((item) => !userIds.has(item.userId));

    // Calculate how many people are between rank 20 and user position
    const peopleBetweenCount = Math.max(0, userIndex - 20);

    if (mappedData.length <= 20) {
      return {
        data: mappedData,
        showSeparator: false,
        separatorIndex: -1,
        peopleBetweenCount: 0,
      };
    }

    // If we've loaded more data, show more items below the user context
    let dataToShow = [...firstDisplayed, ...uniqueUserContext];

    if (hasLoadedMore && endIndex < mappedData.length) {
      // Show more data below the user context
      const additionalData = mappedData.slice(endIndex);
      dataToShow = [...dataToShow, ...additionalData];
    }

    return {
      data: dataToShow,
      showSeparator: uniqueUserContext.length > 0,
      separatorIndex: 20,
      peopleBetweenCount,
    };
  }, [activeTab, dailyLeaderboard, globalLeaderboard, attendee?.userId, hasLoadedMore]);

  return (
    <View className="flex-1 bg-black">
      <AnimatedScrollView
        ref={outerScrollRef}
        showsVerticalScrollIndicator={false}
        headerMaxHeight={330}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
                showSeparator={showSeparator}
                separatorIndex={separatorIndex}
                peopleBetweenCount={peopleBetweenCount}
                isLoadingMore={isLoadingMore}
              />
              {isLoadingMore && data.length === 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator size="large" color="#EDE053" />
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: 16,
                      fontFamily: 'magistral-medium',
                      marginTop: 16,
                    }}
                  >
                    Loading leaderboard...
                  </Text>
                </View>
              )}
            </View>
          )}
        </FadeInWrapper>

        <View style={{ height: 100 }} />
      </AnimatedScrollView>
    </View>
  );
};

export default LeaderboardScreen;
