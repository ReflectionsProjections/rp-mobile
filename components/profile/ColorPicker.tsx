import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { updateAttendeeIcon, setOptimisticThemeColor } from '@/lib/slices/attendeeSlice';
import { IconColorType } from '@/api/types';
import { api } from '@/api/api';

const ColorPicker = () => {
  const themeColor = useAppSelector((state) => state.attendee.themeColor);
  const attendee = useAppSelector((state) => state.attendee.attendee);
  const dispatch = useAppDispatch();
  const [previousColor, setPreviousColor] = useState<{ color: string; icon: IconColorType } | null>(null);

  const colors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#4ADE80', // Green
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#F59E0B', // Orange
  ];

  const handleColorSelect = async (color: string) => {
    const colorMap: { [key: string]: IconColorType } = {
      '#3B82F6': 'BLUE',
      '#EF4444': 'RED',
      '#4ADE80': 'GREEN',
      '#EC4899': 'PINK',
      '#8B5CF6': 'PURPLE',
      '#F59E0B': 'ORANGE',
    };

    const apiColor = colorMap[color];

    if (apiColor) {
      const currentIcon = attendee?.icon || 'RED';
      const currentColor = themeColor;
      setPreviousColor({ color: currentColor, icon: currentIcon });

      dispatch(setOptimisticThemeColor({ color, icon: apiColor }));

      try {
        await dispatch(updateAttendeeIcon(apiColor));
        setPreviousColor(null);
      } catch (error: any) {
        if (previousColor) {
          dispatch(setOptimisticThemeColor(previousColor));
        }
        setPreviousColor(null);
        Alert.alert('Error updating theme color:', error.message);
      }
    } else {
      Alert.alert('No API color mapping found for:', color);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'ProRacing',
          marginBottom: 6,
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}
      >
        CUSTOMIZE
      </Text>
      <Text
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 12,
          fontFamily: 'Inter',
          marginBottom: 16,
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 1,
        }}
      >
        Choose your theme color
      </Text>

      {/* Color Picker */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}
      >
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleColorSelect(color)}
            activeOpacity={0.7}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: color,
              borderWidth: themeColor === color ? 3 : 0,
              borderColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default ColorPicker;
