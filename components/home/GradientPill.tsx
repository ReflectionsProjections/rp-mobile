import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientPillProps {
  children: React.ReactNode;
  colors: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  borderRadius: number;
  borderWidth?: number;
  innerBackgroundColor: string;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
}

export function GradientPill({
  children,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  borderRadius,
  borderWidth = 2,
  innerBackgroundColor,
  style,
  innerStyle,
}: GradientPillProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[{ borderRadius, padding: borderWidth }, style]}
    >
      <View
        style={[
          { borderRadius: borderRadius - borderWidth, backgroundColor: innerBackgroundColor },
          innerStyle,
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
}
