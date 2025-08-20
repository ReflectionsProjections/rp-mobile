import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import ProfileImage from '@/assets/profile/red_helmet.svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
// Calculate image size based on 75% of screen width
const IMAGE_SIZE = width * 0.55;

const ImageCarousel = () => {
  return (
    <View
      className="items-center my-4 rounded-lg overflow-hidden h-[50%] w-[85%] mx-auto"
      style={{ position: 'relative' }}
    >
      <LinearGradient
        colors={['#FF9D9D', '#000000']}
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
      <ProfileImage
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
