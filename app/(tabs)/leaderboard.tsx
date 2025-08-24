import React, { useEffect, useState, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    Dimensions,
    PanResponder,
    Animated
} from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import RpLeaderboardCar from '@/assets/images/leaderboard/rpcar.svg';
import HelmetPurple from '@/assets/images/leaderboard/helmet-purple.svg';
import HelmetGreen from '@/assets/images/leaderboard/helmet-green.svg';
import HelmetRed from '@/assets/images/leaderboard/helmet-red.svg';

const CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.92);



const globalLeaderboardData = [
    { rank: 1, name: 'Ava Chen', points: 500, color: '#8B1C13', avatar: HelmetPurple },
    { rank: 2, name: 'Liam Patel', points: 485, color: '#B89B2B', avatar: HelmetGreen },
    { rank: 3, name: 'Noah Kim', points: 330, color: '#1B1742', avatar: HelmetPurple },
    { rank: 4, name: 'Sofia Martinez', points: 295, color: '#8B1C13', avatar: HelmetRed },
    { rank: 5, name: 'Mateo Rossi', points: 285, color: '#3A7D2C', avatar: HelmetGreen },
    { rank: 6, name: 'Isla Ahmed', points: 270, color: '#B89B2B', avatar: HelmetGreen },
    { rank: 7, name: 'Ethan Zhao', points: 260, color: '#1B1742', avatar: HelmetPurple },
    { rank: 8, name: 'Leila Johnson', points: 250, color: '#3A7D2C', avatar: HelmetRed },
    { rank: 9, name: 'Kai Nakamura', points: 240, color: '#8B1C13', avatar: HelmetPurple },
    { rank: 10, name: 'Maya Rivera', points: 230, color: '#B89B2B', avatar: HelmetGreen },
    { rank: 11, name: 'Leo Schmidt', points: 225, color: '#1B1742', avatar: HelmetGreen },
    { rank: 12, name: 'Chloe Diallo', points: 215, color: '#3A7D2C', avatar: HelmetRed },
    { rank: 13, name: 'Arjun Mehta', points: 210, color: '#8B1C13', avatar: HelmetPurple },
    { rank: 14, name: 'Emma Novak', points: 205, color: '#B89B2B', avatar: HelmetGreen },
    { rank: 15, name: 'Zoe Laurent', points: 200, color: '#1B1742', avatar: HelmetPurple },
    { rank: 16, name: 'Omar El-Sayed', points: 300, color: '#3A7D2C', avatar: HelmetGreen }
];

const dailyLeaderboardData = [
    { rank: 1, name: 'Leo Schmidt', points: 85, color: '#1B1742', avatar: HelmetGreen },
    { rank: 2, name: 'Chloe Diallo', points: 75, color: '#3A7D2C', avatar: HelmetRed },
    { rank: 3, name: 'Arjun Mehta', points: 70, color: '#8B1C13', avatar: HelmetPurple },
    { rank: 4, name: 'Emma Novak', points: 65, color: '#B89B2B', avatar: HelmetGreen },
    { rank: 5, name: 'Zoe Laurent', points: 60, color: '#1B1742', avatar: HelmetPurple },
    { rank: 6, name: 'Omar El-Sayed', points: 55, color: '#3A7D2C', avatar: HelmetGreen },
    { rank: 7, name: 'Ava Chen', points: 50, color: '#8B1C13', avatar: HelmetPurple },
    { rank: 8, name: 'Liam Patel', points: 45, color: '#B89B2B', avatar: HelmetGreen },
    { rank: 9, name: 'Noah Kim', points: 40, color: '#1B1742', avatar: HelmetPurple },
    { rank: 10, name: 'Sofia Martinez', points: 35, color: '#8B1C13', avatar: HelmetRed },
    { rank: 11, name: 'Mateo Rossi', points: 30, color: '#3A7D2C', avatar: HelmetGreen },
    { rank: 12, name: 'Isla Ahmed', points: 25, color: '#B89B2B', avatar: HelmetGreen },
    { rank: 13, name: 'Ethan Zhao', points: 20, color: '#1B1742', avatar: HelmetPurple },
    { rank: 14, name: 'Leila Johnson', points: 15, color: '#3A7D2C', avatar: HelmetRed },
    { rank: 15, name: 'Kai Nakamura', points: 10, color: '#8B1C13', avatar: HelmetPurple },
    { rank: 16, name: 'Maya Rivera', points: 5, color: '#B89B2B', avatar: HelmetGreen }
];

interface LeaderboardItemProps {
    rank: number;
    name: string;
    points: number;
    color: string;
    Avatar: React.ComponentType<{ width: number; height: number }>;
}

const LeaderboardItem = ({ rank, name, points, color, Avatar }: LeaderboardItemProps) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 80,
            overflow: 'hidden',
            marginBottom: 14,
            backgroundColor: color,
            width: CARD_WIDTH,
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
        }}
    >
        {/* Left: Rank */}
        <View style={{
            width: 70,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'Formula1-Bold',
            }}>
                {rank}
            </Text>
        </View>

        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            paddingLeft: 18,
            backgroundColor: 'rgba(0,0,0,0.15)',
            height: '100%',
        }}>
            {Avatar ? <Avatar width={56} height={56} /> : null}
            <Text
                style={{
                    fontSize: 16,
                    color: 'white',
                    fontFamily: 'Inter',
                    marginLeft: 10,
                    flex: 1,
                    textAlign: 'left',
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {name}
            </Text>
        </View>

        <View style={{
            width: 80,
            height: '100%',
            backgroundColor: '#2D2B2A',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
        }}>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'Formula1-Bold',
                textAlign: 'center',
            }}>
                +{points}
            </Text>
            <Text style={{
                fontSize: 8,
                color: '#E0E0E0',
                fontFamily: 'Inter',
                textAlign: 'center',
                marginTop: 0,
            }}>
                LAP POINTS
            </Text>
        </View>
    </View>
);

const LeaderboardScreen = () => {
    const [activeTab, setActiveTab] = useState(0); // 0 for Daily, 1 for Global
    const userRank = 7; // Replace with actual user rank from data
    const userName = 'Leila Johnson'; // Replace with user id once data, or username... 
    const userPoints = 69;
    const ITEM_HEIGHT = 94;
    const scrollRef = useRef<ScrollView>(null);
    const pan = useRef(new Animated.ValueXY()).current;
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
                    useNativeDriver: false
                }).start();
            }
        })
    ).current;

    useEffect(() => {
        const data = activeTab === 0 ? dailyLeaderboardData : globalLeaderboardData;
        const userIndex = data.findIndex(p => p.name === userName);
        if (userIndex !== -1 && scrollRef.current) {
            scrollRef.current.scrollTo({
                y: userIndex * ITEM_HEIGHT,
                animated: true,
            });
        }
    }, [activeTab]);

    const renderLeaderboard = () => {
        const data = activeTab === 0 ? dailyLeaderboardData : globalLeaderboardData;

        return (
            <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 80 }}
                onContentSizeChange={() => {
                    const userIndex = data.findIndex(p => p.name === userName);
                    if (userIndex !== -1 && scrollRef.current) {
                        scrollRef.current.scrollTo({
                            y: userIndex * ITEM_HEIGHT,
                            animated: true
                        });
                    }
                }}

            >
                {data.map((person) => (
                    <LeaderboardItem
                        key={person.rank}
                        rank={person.rank}
                        name={person.name}
                        points={person.points}
                        color={person.color}
                        Avatar={person.avatar}
                    />
                ))}
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#222' }}>
            <Header />

            <View style={{ flex: 1 }}>
                <View {...panResponder.panHandlers}>
                    <ThemedText
                        variant="bigName"
                        style={{ fontSize: 23, textAlign: 'center', marginTop: 16 }}
                    >
                        LEADERBOARD
                    </ThemedText>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 20,
                        marginBottom: 10
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: '#333',
                            borderRadius: 8,
                            padding: 4
                        }}>
                            <Text
                                onPress={() => setActiveTab(0)}
                                style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 8,
                                    backgroundColor: activeTab === 0 ? '#F5B44C' : 'transparent',
                                    color: activeTab === 0 ? '#222' : '#FFF',
                                    borderRadius: 6,
                                    fontWeight: 'bold',
                                }}
                            >
                                DAILY
                            </Text>
                            <Text
                                onPress={() => setActiveTab(1)}
                                style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 8,
                                    backgroundColor: activeTab === 1 ? '#F5B44C' : 'transparent',
                                    color: activeTab === 1 ? '#222' : '#FFF',
                                    borderRadius: 6,
                                    fontWeight: 'bold',
                                }}
                            >
                                GLOBAL
                            </Text>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 5 }}>
                        <RpLeaderboardCar />

                        <View style={{ alignItems: 'center', marginTop: 8 }}>
                            <Text style={{
                                color: '#F5B44C',
                                fontWeight: 'bold',
                                fontSize: 24,
                            }}>
                                You are #{userRank}
                            </Text>
                            <Text style={{
                                color: '#F5B44C',
                                fontSize: 14,
                                fontWeight: '500',
                                marginTop: 2,
                            }}>
                                +{userPoints} LAP POINTS
                            </Text>
                        </View>
                    </View>
                </View>


                {renderLeaderboard()}

            </View>
        </SafeAreaView>
    );
};

export default LeaderboardScreen;
