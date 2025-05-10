import React from 'react';
import { Dimensions,View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// const WIDTH = 320; // Width of the screen
// const HEIGHT = 100; // Height of the bottom bar
// const CORNER_RADIUS = 12; // Corner radius
// const CUTOUT_RADIUS = 30; // Radius of the circular cutout
// const CUTOUT_LEFT_X = WIDTH / 2 - CUTOUT_RADIUS; // Left X position of cutout
// const CUTOUT_RIGHT_X = WIDTH / 2 + CUTOUT_RADIUS; // Right X position of cutout
const { width, height } = Dimensions.get('window'); // Get screen width and height

const WIDTH = width; // Use the full screen width
const HEIGHT = 0.10 * height; // Set the bottom bar height to 15% of the screen height
const CORNER_RADIUS = 0.05 * width; // Set corner radius relative to width (e.g., 5% of screen width)
const CUTOUT_RADIUS = 0.1 * width; // Radius of the circular cutout (e.g., 10% of screen width)

// Calculate cutout positions based on the dynamic width
const CUTOUT_LEFT_X = WIDTH / 2 - CUTOUT_RADIUS; // Left X position of cutout
const CUTOUT_RIGHT_X = WIDTH / 2 + CUTOUT_RADIUS; // Right X position of cutout

// The SVG path for the bottom bar with a circular cutout in the middle
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
        <Path d={d} fill="#8A8A8A" />
      </Svg>
      
      {/* Floating Action Button
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => alert('Button Pressed!')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View> */}
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
    bottom: HEIGHT / 2 - CUTOUT_RADIUS, // Center the FAB in the cutout
    left: WIDTH / 2 - 30, // Center horizontally
    zIndex: 1, // Ensure it stays on top of the SVG
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
