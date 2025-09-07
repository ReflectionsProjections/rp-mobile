import React from 'react';
import { View, Text } from 'react-native';
import { FadeInWrapper } from './LeaderboardAnimations';
import { useThemeColor } from '@/lib/theme';

interface LeaderboardTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

export const LeaderboardTabs = ({ activeTab, onTabChange }: LeaderboardTabsProps) => {
  const themeColor = useThemeColor();
  
  return (
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
            backgroundColor: activeTab === 0 ? themeColor : 'transparent',
            color: activeTab === 0 ? '#222' : '#222',
            borderRadius: 20,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'magistral',
            shadowColor: activeTab === 0 ? themeColor : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
            elevation: activeTab === 0 ? 8 : 0,
          }}
        >
          DAILY
        </Text>
        <Text
          onPress={() => onTabChange(1)}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: activeTab === 1 ? themeColor : 'transparent',
            color: activeTab === 1 ? '#222' : '#222',
            borderRadius: 20,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'magistral',
            shadowColor: activeTab === 1 ? themeColor : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
            elevation: activeTab === 1 ? 8 : 0,
          }}
        >
          GLOBAL
        </Text>
      </View>
    </View>
  </FadeInWrapper>
  );
};
