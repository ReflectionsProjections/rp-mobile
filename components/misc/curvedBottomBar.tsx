import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const WIDTH = width;
const HEIGHT = 0.1 * height;
const CORNER_RADIUS = 0.05 * width;

const d = `
  M0,${HEIGHT}
  L0,${CORNER_RADIUS} Q0,0 ${CORNER_RADIUS},0
  L${WIDTH - CORNER_RADIUS},0 Q${WIDTH},0 ${WIDTH},${CORNER_RADIUS}
  L${WIDTH},${HEIGHT}
  Z
`;

const CurvedBottomBar = () => {
  return (
    <View style={styles.container}>
      {/* Bottom Bar SVG */}
      <Svg width={WIDTH} height={HEIGHT} style={styles.svg}>
        <Path d={d} fill="#212121" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  svg: {
    position: 'absolute',
    bottom: 0,
  },
});

export default CurvedBottomBar;
