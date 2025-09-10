import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { FadeInWrapper } from './LeaderboardAnimations';
import { useThemeColor } from '@/lib/theme';

interface LeaderboardTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

export const LeaderboardTabs = ({ activeTab, onTabChange }: LeaderboardTabsProps) => {
  const themeColor = useThemeColor();
  const slideAnimation = useRef(new Animated.Value(activeTab)).current;
  const tabWidth = 130;

  useEffect(() => {
    Animated.spring(slideAnimation, {
      toValue: activeTab,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [activeTab, slideAnimation]);

  const handleTabPress = (tabIndex: number) => {
    onTabChange(tabIndex);
  };

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
            padding: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            position: 'relative',
          }}
        >
          {/* Sliding background indicator */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 4,
              left: 4,
              width: tabWidth - 4,
              height: 32,
              backgroundColor: themeColor,
              borderRadius: 16,
              transform: [
                {
                  translateX: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, tabWidth],
                  }),
                },
              ],
              shadowColor: themeColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 12,
              elevation: 8,
            }}
          />

          <TouchableOpacity
            onPress={() => handleTabPress(0)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              width: tabWidth,
              alignItems: 'center',
              zIndex: 1,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: activeTab === 0 ? '#FFFFFF' : '#222',
                fontSize: 20,
                fontWeight: 'bold',
                fontFamily: 'magistral',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              DAILY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress(1)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 8,
              width: tabWidth,
              alignItems: 'center',
              zIndex: 1,
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: activeTab === 1 ? '#FFFFFF' : '#222',
                fontSize: 20,
                fontWeight: 'bold',
                fontFamily: 'magistral',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              GLOBAL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </FadeInWrapper>
  );
};
