import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import RedHelmet from '@/assets/profile/red_helmet.svg';
import BlueHelmet from '@/assets/profile/blue_helmet.svg';
import GreenHelmet from '@/assets/profile/green_helmet.svg';
import PinkHelmet from '@/assets/profile/pink_helmet.svg';
import PurpleHelmet from '@/assets/profile/purple_helmet.svg';
import OrangeHelmet from '@/assets/profile/orange_helmet.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/lib/theme';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.55;

const ImageCarousel = () => {
  const themeColor = useThemeColor();
  
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  const getAvatarComponent = (color: string) => {
    const avatarMap: { [key: string]: React.FC<any> } = {
      '#3B82F6': BlueHelmet,    // Blue
      '#EF4444': RedHelmet,     // Red  
      '#4ADE80': GreenHelmet,   // Green
      '#EC4899': PinkHelmet,    // Pink
      '#8B5CF6': PurpleHelmet,  // Purple
      '#F59E0B': OrangeHelmet,  // Orange
    };
    
    return avatarMap[color] || RedHelmet;
  };
  
  const lightThemeColor = hexToRgba(themeColor, 0.8);
  const AvatarComponent = getAvatarComponent(themeColor);
  
  return (
    <View
      className="items-center my-4 rounded-lg overflow-hidden h-[35%] w-[85%] mx-auto"
      style={{ position: 'relative' }}
    >
      <LinearGradient
        colors={[lightThemeColor, '#000000']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
      <AvatarComponent
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        style={{
          position: 'absolute',
          bottom: -15,
          zIndex: 1,
        }}
      />
    </View>
  );
};

export default ImageCarousel;
