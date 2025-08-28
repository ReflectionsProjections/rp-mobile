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
          backgroundColor: '#333',
          borderRadius: 8,
          padding: 4,
        }}
      >
        <Text
          onPress={() => onTabChange(0)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: activeTab === 0 ? '#F5B44C' : 'transparent',
            color: activeTab === 0 ? '#222' : '#FFF',
            borderRadius: 6,
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
            backgroundColor: activeTab === 1 ? '#F5B44C' : 'transparent',
            color: activeTab === 1 ? '#222' : '#FFF',
            borderRadius: 6,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'magistral',
          }}
        >
          GLOBAL
        </Text>
      </View>
    </View>
  </FadeInWrapper>
);
