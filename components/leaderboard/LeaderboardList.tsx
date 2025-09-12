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
  // Top separator
  showTopSeparator?: boolean;
  topSeparatorIndex?: number;
  peopleAboveCount?: number;

  // Bottom separator
  showBottomSeparator?: boolean;
  bottomSeparatorIndex?: number;
  peopleBelowCount?: number;
}

export type LeaderboardListHandle = {
  scrollToUser: () => void;
};

export const LeaderboardList = forwardRef<LeaderboardListHandle, LeaderboardListProps>(
  function LeaderboardList(
    {
      data,
      userId,
      showTopSeparator = false,
      topSeparatorIndex = -1,
      showBottomSeparator = false,
      peopleBelowCount = 0,
      peopleAboveCount = 0,
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
        } catch {}
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToUser,
    }));

    return (
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => String(item.userId)}
        // 👇 Android-only adjustments
        scrollEnabled={Platform.OS === 'android' ? true : false}
        removeClippedSubviews={Platform.OS === 'android' ? false : true}
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
                    {peopleAboveCount > 0 ? `${peopleAboveCount} attendees above here` : 'Your Position'}
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
              {/* Bottom separator moved to ListFooterComponent */}
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
        onScrollToIndexFailed={() => {
          setTimeout(scrollToUser, 100);
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
                {`${peopleBelowCount} more attendees below here`}
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
          ) : null
        }
      />
    );
  },
);
