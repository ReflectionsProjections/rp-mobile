import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, Platform } from 'react-native';
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
  const tabHeight = 40; // unified height (Android only)

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
            borderRadius: Platform.OS === 'android' ? tabHeight / 2 : 20,
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
              top: Platform.OS === 'android' ? 4 : 4,
              left: 4,
              width: Platform.OS === 'android' ? tabWidth : tabWidth - 4,
              height: Platform.OS === 'android' ? tabHeight : 32,
              backgroundColor: themeColor,
              borderRadius: Platform.OS === 'android' ? tabHeight / 2 : 16,
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

          {/* Daily Tab */}
          <TouchableOpacity
            onPress={() => handleTabPress(0)}
            style={{
              width: tabWidth,
              height: Platform.OS === 'android' ? tabHeight : undefined,
              paddingHorizontal: Platform.OS === 'android' ? 0 : 20,
              paddingVertical: Platform.OS === 'android' ? 0 : 8,
              alignItems: 'center',
              justifyContent: 'center',
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
              }}
            >
              DAILY
            </Text>
          </TouchableOpacity>

          {/* Global Tab */}
          <TouchableOpacity
            onPress={() => handleTabPress(1)}
            style={{
              width: tabWidth,
              height: Platform.OS === 'android' ? tabHeight : undefined,
              paddingHorizontal: Platform.OS === 'android' ? 0 : 20,
              paddingVertical: Platform.OS === 'android' ? 0 : 8,
              alignItems: 'center',
              justifyContent: 'center',
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
