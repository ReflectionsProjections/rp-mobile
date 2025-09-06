import React from 'react';
import { View, Text } from 'react-native';
import { FadeInWrapper } from './LeaderboardAnimations';

interface LeaderboardTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

export const LeaderboardTabs = ({ activeTab, onTabChange }: LeaderboardTabsProps) => (
  <FadeInWrapper delay={800}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,

      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderRadius: 20,

          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text
          onPress={() => onTabChange(0)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: activeTab === 0 ? '#F23B3B' : 'transparent',
            color: activeTab === 0 ? '#FFF' : '#222',
            borderRadius: 20,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'magistral',

          }}
        >
          DAILY
        </Text>
        <Text
          onPress={() => onTabChange(1)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: activeTab === 1 ? '#F23B3B' : 'transparent',
            color: activeTab === 1 ? '#FFF' : '#222',
            borderRadius: 20,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'magistral',

          }}
        >
          GLOBAL
        </Text>
      </View>
    </View>
  </FadeInWrapper >
);
