import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width } = Dimensions.get('window');
// Calculate image size based on 75% of screen width
const IMAGE_SIZE = width * 0.75;

// Static image assets
const images = [require('../../assets/images/merc.jpeg'), require('../../assets/images/merc.jpeg')];

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Update active dot on scroll
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / IMAGE_SIZE);
    setActiveIndex(newIndex);
  };

  return (
    <View className="items-center my-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="overflow-hidden"
        style={{ width: IMAGE_SIZE }}
        snapToInterval={IMAGE_SIZE}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
      >
        {images.map((src, i) => (
          <Image
            key={i}
            source={src}
            style={{ width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 8 }}
          />
        ))}
      </ScrollView>
      <View className="flex-row mt-2">
        {images.map((_, i) => (
          <View
            key={i}
            className={`w-2 h-2 rounded-full mx-1 ${i === activeIndex ? 'bg-gray-600' : 'bg-gray-400'}`}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;
