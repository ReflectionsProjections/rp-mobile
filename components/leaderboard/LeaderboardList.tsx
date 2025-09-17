import React, { useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { FlatList, Platform, View, Text, ActivityIndicator } from 'react-native';
import { LeaderboardItem } from './LeaderboardItem';
import { StaggeredAnimation } from './LeaderboardAnimations';
import { IconColorType, TierType } from '@/api/types';

interface LeaderboardData {
  rank: number;
  userId: string;
  name: string;
  points: number;
  color: IconColorType;
  currentTier: TierType;
}

interface LeaderboardListProps {
  data: LeaderboardData[];
  userId: string;
  showTopSeparator?: boolean;
  topSeparatorIndex?: number;
  peopleAboveCount?: number;
  showBottomSeparator?: boolean;
  peopleBelowCount?: number;
  isLoading: boolean;
}

export type LeaderboardListHandle = {
  scrollToUser: () => void;
};

export const LeaderboardList = forwardRef<LeaderboardListHandle, LeaderboardListProps>(
  function LeaderboardList(
    {
      data,
      userId,
      showTopSeparator = true,
      topSeparatorIndex = -1,
      showBottomSeparator = true,
      peopleBelowCount = 0,
      peopleAboveCount = 0,
      isLoading,
    },
    ref,
  ) {
    const listRef = useRef<FlatList<LeaderboardData>>(null);
    const ITEM_HEIGHT = 94;

    const userIndex = useMemo(() => data.findIndex((p) => p.userId === userId), [data, userId]);

    const scrollToUser = () => {
      if (userIndex !== -1 && listRef.current) {
        try {
          listRef.current.scrollToIndex({
            index: userIndex,
            animated: true,
            viewPosition: 0.5,
          });
        } catch (error) {
          // Fallback in case the initial scroll fails
          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollToIndex({
                index: userIndex,
                animated: true,
                viewPosition: 0.5,
              });
            }
          }, 100);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToUser,
    }));

    // Logic to handle loading state and empty data
    if (isLoading && data.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      );
    }

    if (!isLoading && data.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ffffff', fontSize: 16 }}>No leaderboard data available.</Text>
        </View>
      );
    }

    return (
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => String(item.userId)}
        scrollEnabled={true}
        removeClippedSubviews={Platform.OS === 'android'}
        initialScrollIndex={
          Platform.OS === 'android'
            ? undefined
            : userIndex >= 0 && userIndex < data.length
              ? userIndex
              : undefined
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={16}
        initialNumToRender={15}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        onScrollToIndexFailed={(info) => {
          // This ensures a robust scroll, especially on Android
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            try {
              listRef.current?.scrollToIndex({ index: info.index, animated: true });
            } catch (e) {
              console.log("Scroll to index failed again: ", e);
            }
          });
        }}
        renderItem={({ item, index }) => {
          const shouldShowTopSeparator = showTopSeparator && index === topSeparatorIndex;

          return (
            <>
              {shouldShowTopSeparator && (
                <View
                  style={{
                    paddingVertical: 20,
                    alignItems: 'center',
                    marginHorizontal: 20,
                  }}
                >
                  <View
                    style={{
                      height: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      width: '100%',
                      marginBottom: 10,
                    }}
                  />
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: 14,
                      fontFamily: 'magistral-medium',
                      textAlign: 'center',
                    }}
                  >
                    {peopleAboveCount > 0 ? `...${peopleAboveCount} People Above` : 'Your Position'}
                  </Text>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      width: '100%',
                      marginTop: 10,
                    }}
                  />
                </View>
              )}
              {Platform.OS === 'android' ? (
                <LeaderboardItem
                  rank={item.rank}
                  name={item.name}
                  points={item.points}
                  color={item.color}
                  currentTier={item.currentTier}
                  isUser={item.userId === userId}
                />
              ) : (
                <StaggeredAnimation index={index} delay={index < 12 ? 900 : 0}>
                  <LeaderboardItem
                    rank={item.rank}
                    name={item.name}
                    points={item.points}
                    color={item.color}
                    currentTier={item.currentTier}
                    isUser={item.userId === userId}
                  />
                </StaggeredAnimation>
              )}
            </>
          );
        }}
        ListFooterComponent={() =>
          showBottomSeparator ? (
            <View
              style={{
                paddingVertical: 20,
                alignItems: 'center',
                marginHorizontal: 20,
              }}
            >
              <View
                style={{
                  height: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  width: '100%',
                  marginBottom: 10,
                }}
              />
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 14,
                  fontFamily: 'magistral-medium',
                  textAlign: 'center',
                }}
              >
                {`...${peopleBelowCount} People Below`}
              </Text>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  width: '100%',
                  marginTop: 10,
                }}
              />
            </View>
          ) : (
            <View
              style={{
                paddingVertical: 24,
                alignItems: 'center',
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: 13,
                  fontFamily: 'magistral',
                  textAlign: 'center',
                }}
              >
                You're at the end of the leaderboard
              </Text>
            </View>
          )
        }
      />
    );
  },
);