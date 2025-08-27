import React from 'react';
import { View, Text, Dimensions } from 'react-native';

const CARD_WIDTH = Math.round(Dimensions.get('window').width * 0.92);

interface LeaderboardItemProps {
    rank: number;
    name: string;
    points: number;
    color: string;
    Avatar: React.ComponentType<{ width: number; height: number }>;
    isUser?: boolean;
}

export const LeaderboardItem = ({ rank, name, points, color, Avatar, isUser }: LeaderboardItemProps) => (
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
            borderWidth: isUser ? 4 : 0,
            borderColor: isUser ? 'white' : 'transparent',
            transform: isUser ? [{ scale: 1.05 }] : [],
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
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'proRacingSlant',
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
            {Avatar ? <Avatar width={50} height={50} /> : null}
            <Text
                style={{
                    fontSize: 18,
                    color: 'white',
                    fontFamily: 'magistral',
                    marginLeft: 10,
                    flex: 1,
                    textAlign: 'left',
                    paddingRight: 6,
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
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'magistral',
                textAlign: 'center',
            }}>
                {points}
            </Text>
            <Text style={{
                fontSize: 10,
                color: '#E0E0E0',
                fontFamily: 'magistral',
                textAlign: 'center',
                marginTop: 4,
            }}>
                LAP POINTS
            </Text>
        </View>
    </View>
);
