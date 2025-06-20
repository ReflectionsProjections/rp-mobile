import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import BackgroundSVG from '../../assets/svgs/background.svg';
import PointCounterSVG from '../../assets/svgs/pointCounter.svg';

const { width, height } = Dimensions.get('window');
const LIFT = 0.06 * height;

// SVG sizing
const SPEEDO_NATIVE_W = 280;
const SPEEDO_NATIVE_H = 144.63;
const SPEEDO_ASPECT = SPEEDO_NATIVE_H / SPEEDO_NATIVE_W;
const SPEEDO_WIDTH = width * 0.7;
const SPEEDO_HEIGHT = SPEEDO_WIDTH * SPEEDO_ASPECT;

const PointsShopScreen = () => {
  const points = 20;  
  return (
    <View style={styles.container}>
      <BackgroundSVG
        width={width}
        height={height}
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateY: -LIFT }], zIndex: -1 },
        ]}
      />

      <View style={styles.speedoWrapper}>
        <PointCounterSVG
          width={SPEEDO_WIDTH}
          height={SPEEDO_HEIGHT}
        />

        <Text style={styles.speedoText}>
          YOUR POINTS: {points}
        </Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  speedoWrapper: {
    position: 'absolute',
    top: height * 0.05,
    left: (width - SPEEDO_WIDTH) / 2,  // center horizontally
    width: SPEEDO_WIDTH,
    height: SPEEDO_HEIGHT,
  },

  speedoText: {
    position: 'absolute',
    top: '50%',                      
    left: '50%',                     
    transform: [
      { translateX: -0.5 * SPEEDO_WIDTH * 0.5 },  
      { translateY: -0.5 * 20 }                  
    ],
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PointsShopScreen;
