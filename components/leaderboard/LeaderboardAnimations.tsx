import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface FadeInWrapperProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export const FadeInWrapper: React.FC<FadeInWrapperProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, fadeAnim, translateY]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

interface FloatingAnimationProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  style?: ViewStyle;
}

export const FloatingAnimation: React.FC<FloatingAnimationProps> = ({
  children,
  amplitude = 3,
  duration = 2000,
  style,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [floatAnim, duration]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -amplitude],
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

interface StaggeredAnimationProps {
  children: React.ReactNode;
  index: number;
  delay: number;
  style?: ViewStyle;
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  index,
  delay,
  style,
}) => {
  return (
    <FadeInWrapper delay={delay + index * 100} style={style}>
      {children}
    </FadeInWrapper>
  );
};
