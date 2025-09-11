import React from 'react';
import { View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/lib/theme';
import { getAvatarComponent } from '@/lib/utils';

const { height, width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.55;

const ImageCarousel = () => {
  const themeColor = useThemeColor();

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const lightThemeColor = hexToRgba(themeColor, 0.8);
  const AvatarComponent = getAvatarComponent(themeColor);

  return (
    <View
      className="items-center my-4 rounded-lg overflow-hidden w-[85%] mx-auto"
      style={{ position: 'relative', height: height * 0.3 }}
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
