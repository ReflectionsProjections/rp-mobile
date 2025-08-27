import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ScrollView } from 'react-native';
import { LeaderboardItem } from './LeaderboardItem';
import { StaggeredAnimation } from './LeaderboardAnimations';

interface LeaderboardData {
    rank: number;
    name: string;
    points: number;
    color: string;
    avatar: React.ComponentType<{ width: number; height: number }>;
}

interface LeaderboardListProps {
    data: LeaderboardData[];
    userName: string;
}

export type LeaderboardListHandle = {
    scrollToUser: () => void;
};

export const LeaderboardList = forwardRef<LeaderboardListHandle, LeaderboardListProps>(({ data, userName }, ref) => {
    const scrollRef = useRef<ScrollView>(null);
    const ITEM_HEIGHT = 94;

    const scrollToUser = () => {
        const userIndex = data.findIndex(p => p.name === userName);
        if (userIndex !== -1 && scrollRef.current) {
            scrollRef.current.scrollTo({
                y: userIndex * ITEM_HEIGHT,
                animated: true,
            });
        }
    };

    useImperativeHandle(ref, () => ({
        scrollToUser,
    }));

    useEffect(() => {
        scrollToUser();
    }, [data, userName]);

    return (
        <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 80 }}
            onContentSizeChange={() => {
                scrollToUser();
            }}
        >
            {data.map((person, index) => (
                <StaggeredAnimation key={person.rank} index={index} delay={900}>
                    <LeaderboardItem
                        rank={person.rank}
                        name={person.name}
                        points={person.points}
                        color={person.color}
                        Avatar={person.avatar}
                        isUser={person.name === userName}
                    />
                </StaggeredAnimation>
            ))}
        </ScrollView>
    );
});
