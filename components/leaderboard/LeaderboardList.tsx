import React, { useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { FlatList } from 'react-native';
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
}

export type LeaderboardListHandle = {
  scrollToUser: () => void;
};

export const LeaderboardList = forwardRef<LeaderboardListHandle, LeaderboardListProps>(
  ({ data, userId }, ref) => {
    const listRef = useRef<FlatList<LeaderboardData>>(null);
    const ITEM_HEIGHT = 94;

    const userIndex = useMemo(() => data.findIndex((p) => p.userId === userId), [data, userId]);

    const scrollToUser = () => {
      if (userIndex !== -1 && listRef.current) {
        try {
          listRef.current.scrollToIndex({ index: userIndex, animated: true, viewPosition: 0.5 });
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
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        initialScrollIndex={userIndex >= 0 ? userIndex : undefined}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        removeClippedSubviews
        windowSize={7}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={16}
        renderItem={({ item, index }) => (
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
        onScrollToIndexFailed={() => {
          setTimeout(scrollToUser, 100);
        }}
      />
    );
  },
);
