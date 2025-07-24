import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, Text, View } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import { ProgressBar } from '@/components/home/ProgressBar';
import { CarouselSection } from '@/components/home/CarouselSection';
import { EventModal } from '@/components/home/EventModal';
import { CardType } from '@/components/home/types';
import { Event as ApiEvent } from '@/api/types';
import { api } from '@/api/api';
import RpLeaderboardCar from '@/assets/images/leaderboard/rp_leaderboard_car.svg';
import HelmetPurple from '@/assets/images/leaderboard/helmet-purple.svg';
import HelmetGreen from '@/assets/images/leaderboard/helmet-green.svg';
import HelmetRed from '@/assets/images/leaderboard/helmet-red.svg';


const leaderboardData = [
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
import { Dimensions } from 'react-native';

const CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.92);

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
                    flex: 1, // fill available width
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
    const userRank = 25;
    const userPoints = 100;

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#222' }}>
            {/* Top part: stays fixed */}
            <Header />
            <ThemedText
                variant="bigName"
                style={{ fontSize: 23, textAlign: 'center', marginTop: 16 }}
            >
                LEADERBOARD
            </ThemedText>
            <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 32, }}>
                <RpLeaderboardCar width={394} height={182} />

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

            {/* Leaderboard part: scrollable */}
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ paddingBottom: 80 }}>
                        {leaderboardData.map((person) => (
                            <LeaderboardItem
                                key={person.rank}
                                rank={person.rank}
                                name={person.name}
                                points={person.points}
                                color={person.color}
                                Avatar={person.avatar}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View >
        </SafeAreaView >

    );
};

export default LeaderboardScreen;
