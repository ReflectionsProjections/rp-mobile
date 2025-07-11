import React from 'react';
import { Dimensions, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const WIDTH = width;
const HEIGHT = 0.1 * height;
const CORNER_RADIUS = 0.05 * width;
const CUTOUT_RADIUS = 0.09 * width;

const CUTOUT_LEFT_X = WIDTH / 2 - CUTOUT_RADIUS;
const CUTOUT_RIGHT_X = WIDTH / 2 + CUTOUT_RADIUS;

const d = `
  M0,${HEIGHT}
  L0,${CORNER_RADIUS} Q0,0 ${CORNER_RADIUS},0
  L${CUTOUT_LEFT_X},0
  A${CUTOUT_RADIUS},${CUTOUT_RADIUS} 0 0 0 ${CUTOUT_RIGHT_X},0
  L${WIDTH - CORNER_RADIUS},0 Q${WIDTH},0 ${WIDTH},${CORNER_RADIUS}
  L${WIDTH},${HEIGHT}
  Z
`;

const CurvedBottomBar = () => {
  return (
    <View style={styles.container}>
      {/* Bottom Bar SVG */}
      <Svg width={WIDTH} height={HEIGHT} style={styles.svg}>
        <Path d={d} fill="#473737" />
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
  fabContainer: {
    position: 'absolute',
    bottom: HEIGHT / 2 - CUTOUT_RADIUS,
    left: WIDTH / 2 - 30,
    zIndex: 1,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: '#6200EE',
  },
});

export default CurvedBottomBar;
