import { useEffect } from 'react';
import { Alert, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Path, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { validateAuthToken } from '@/lib/auth';
import { api } from '@/api/api';
import Logo from '@/assets/images/logo.svg';
import RPCityScape, { CITYSCAPE_HEIGHT, CITYSCAPE_WIDTH } from '@/components/loading/RPCityScape';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// "Lightcycle orbit" loading screen (option 1a, RP Loading Screen design).
// All fixed sizes are in the design's 402x874 reference frame, scaled by screen width.
const DESIGN_WIDTH = 402;
const RING_SIZE = 290;
const RING_PATH =
  'M 52 14 H 238 A 38 38 0 0 1 276 52 V 238 A 38 38 0 0 1 238 276 H 52 A 38 38 0 0 1 14 238 V 52 A 38 38 0 0 1 52 14 Z';
// Both dash patterns sum to 1060, so shifting by one period loops seamlessly.
const DASH_PERIOD = 1060;
const STRAIGHT = 186;
const ARC = (Math.PI * 38) / 2;
const RING_PERIMETER = 4 * (STRAIGHT + ARC);

// Position and tangent angle at a clockwise distance along the ring's rounded-rect path.
function ringPointAt(dist: number): { x: number; y: number; deg: number } {
  'worklet';
  let d = ((dist % RING_PERIMETER) + RING_PERIMETER) % RING_PERIMETER;
  if (d < STRAIGHT) return { x: 52 + d, y: 14, deg: 0 };
  d -= STRAIGHT;
  if (d < ARC) {
    const deg = -90 + (d / ARC) * 90;
    const a = (deg * Math.PI) / 180;
    return { x: 238 + 38 * Math.cos(a), y: 52 + 38 * Math.sin(a), deg: deg + 90 };
  }
  d -= ARC;
  if (d < STRAIGHT) return { x: 276, y: 52 + d, deg: 90 };
  d -= STRAIGHT;
  if (d < ARC) {
    const deg = (d / ARC) * 90;
    const a = (deg * Math.PI) / 180;
    return { x: 238 + 38 * Math.cos(a), y: 238 + 38 * Math.sin(a), deg: deg + 90 };
  }
  d -= ARC;
  if (d < STRAIGHT) return { x: 238 - d, y: 276, deg: 180 };
  d -= STRAIGHT;
  if (d < ARC) {
    const deg = 90 + (d / ARC) * 90;
    const a = (deg * Math.PI) / 180;
    return { x: 52 + 38 * Math.cos(a), y: 238 + 38 * Math.sin(a), deg: deg + 90 };
  }
  d -= ARC;
  if (d < STRAIGHT) return { x: 14, y: 238 - d, deg: 270 };
  d -= STRAIGHT;
  const deg = 180 + (d / ARC) * 90;
  const a = (deg * Math.PI) / 180;
  return { x: 52 + 38 * Math.cos(a), y: 52 + 38 * Math.sin(a), deg: deg + 90 };
}

export default function LoadingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const s = width / DESIGN_WIDTH;

  const progress = useSharedValue(0);
  const pulse = useSharedValue(0);
  const blink = useSharedValue(0);

  useEffect(() => {
    // This is a "the app is working" spinner, not decorative motion — it
    // needs to run even when the OS-level reduced motion setting is on,
    // otherwise Reanimated silently skips it and the screen looks frozen.
    progress.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.linear }),
      -1,
      false,
      undefined,
      ReduceMotion.Never,
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
      undefined,
      ReduceMotion.Never,
    );
    blink.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1,
      false,
      undefined,
      ReduceMotion.Never,
    );

    const checkAuthStatus = async () => {
      try {
        const jwt = await SecureStore.getItemAsync('jwt');

        if (jwt) {
          const isValid = await validateAuthToken();

          if (isValid) {
            const roles = await api.get('/auth/info').then((res) => res.data.roles);
            if (roles.length > 0) {
              router.replace('/(tabs)/home');
            } else {
              Alert.alert('Please sign in with a registered account!');
              router.replace('/(auth)/sign-in');
            }
          } else {
            await SecureStore.deleteItemAsync('jwt');
            router.replace('/(auth)/sign-in');
          }
        } else {
          router.replace('/(auth)/sign-in');
        }
      } catch (error) {
        router.replace('/(auth)/sign-in');
      }
    };

    setTimeout(() => {
      checkAuthStatus();
    }, 2000);
  }, [router, progress, pulse, blink]);

  const cyanDashProps = useAnimatedProps(() => ({ strokeDashoffset: -DASH_PERIOD * progress.value }));
  const cyanGlowProps = useAnimatedProps(() => ({ strokeDashoffset: -DASH_PERIOD * progress.value }));
  const pinkDashProps = useAnimatedProps(() => ({ strokeDashoffset: -DASH_PERIOD * progress.value }));
  const pinkGlowProps = useAnimatedProps(() => ({ strokeDashoffset: -DASH_PERIOD * progress.value }));

  const bikeStyle = useAnimatedStyle(() => {
    const p = ringPointAt(progress.value * RING_PERIMETER);
    return {
      transform: [{ translateX: p.x - 7 }, { translateY: p.y - 3 }, { rotate: `${p.deg}deg` }],
    };
  });

  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.6, 1]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.05]) }],
  }));

  const blinkStyle = useAnimatedStyle(() => ({ opacity: blink.value < 0.5 ? 1 : 0 }));

  const ringTop = height * 0.26;
  const ringLeft = (width - RING_SIZE * s) / 2;

  return (
    <View style={{ flex: 1, backgroundColor: '#0F062D' }}>
      <LinearGradient
        colors={['#0F062D', '#3D0B5E', '#7C1493']}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Magenta halo behind the circuit ring */}
      <Svg
        width={520 * s}
        height={520 * s}
        style={{
          position: 'absolute',
          left: width / 2 - 260 * s,
          top: ringTop + (RING_SIZE * s) / 2 - 260 * s,
        }}>
        <Defs>
          <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="rgb(199,49,214)" stopOpacity="0.35" />
            <Stop offset="0.62" stopColor="rgb(199,49,214)" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#halo)" />
      </Svg>

      {/* Circuit ring with lightcycle */}
      <View
        style={{
          position: 'absolute',
          left: ringLeft,
          top: ringTop,
          width: RING_SIZE * s,
          height: RING_SIZE * s,
        }}>
        <View
          style={{
            width: RING_SIZE,
            height: RING_SIZE,
            transformOrigin: 'top left',
            transform: [{ scale: s }],
          }}>
          <Svg width={RING_SIZE} height={RING_SIZE} viewBox="0 0 290 290" fill="none" style={StyleSheet.absoluteFill}>
            <Path d={RING_PATH} stroke="rgba(194,147,252,.28)" strokeWidth={2} />
            <AnimatedPath
              d={RING_PATH}
              stroke="#5CE1E6"
              strokeWidth={9}
              strokeOpacity={0.35}
              strokeLinecap="round"
              strokeDasharray="120 940"
              animatedProps={cyanGlowProps}
            />
            <AnimatedPath
              d={RING_PATH}
              stroke="#5CE1E6"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="120 940"
              animatedProps={cyanDashProps}
            />
            <AnimatedPath
              d={RING_PATH}
              stroke="#FF3B7C"
              strokeWidth={8}
              strokeOpacity={0.35}
              strokeLinecap="round"
              strokeDasharray="26 1034"
              animatedProps={pinkGlowProps}
            />
            <AnimatedPath
              d={RING_PATH}
              stroke="#FF3B7C"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="26 1034"
              animatedProps={pinkDashProps}
            />
          </Svg>
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                top: 0,
                width: 14,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#fff',
                boxShadow: '0px 0px 14px 4px #FF3B7C',
              },
              bikeStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: RING_SIZE / 2 - 52,
                top: RING_SIZE / 2 - 52,
                width: 104,
                height: 104,
                borderRadius: 52,
                boxShadow: '0px 0px 22px rgba(122,223,238,.6)',
              },
              logoStyle,
            ]}>
            <Logo width={104} height={104} />
          </Animated.View>
          <View style={{ position: 'absolute', left: 14, top: -16, width: 36, height: 2, backgroundColor: '#E5FF27', opacity: 0.7 }} />
          <View style={{ position: 'absolute', right: 14, bottom: -16, width: 36, height: 2, backgroundColor: '#E5FF27', opacity: 0.7 }} />
        </View>
      </View>

      {/* Cityscape pinned to the bottom edge */}
      <View
        style={{
          position: 'absolute',
          bottom: -42 * s,
          left: (width - CITYSCAPE_WIDTH * s) / 2 + 12 * s,
          width: CITYSCAPE_WIDTH * s,
          height: CITYSCAPE_HEIGHT * s,
        }}>
        <View style={{ transformOrigin: 'top left', transform: [{ scale: s }] }}>
          <RPCityScape />
        </View>
      </View>

      {/* Fade the skyline into the background */}
      <LinearGradient
        colors={['rgba(15,6,45,0)', 'rgba(15,6,45,0.5)', 'rgba(15,6,45,0.72)']}
        locations={[0, 0.62, 1]}
        style={{ position: 'absolute', left: 0, right: 0, top: '63.6%', height: '20.6%' }}
        pointerEvents="none"
      />

      <View style={{ position: 'absolute', left: 0, right: 0, top: height * 0.659, alignItems: 'center', gap: 14 }}>
        <Text
          style={{
            fontFamily: 'GeistPixel',
            fontSize: 15,
            letterSpacing: 3,
            color: '#fff',
            textShadowColor: 'rgba(255,59,124,.8)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 16,
          }}>
          R | P  2026
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: 'GeistPixel', fontSize: 13, letterSpacing: 2.5, color: 'rgba(194,147,252,.9)' }}>
            LOADING
          </Text>
          <Animated.Text
            style={[{ fontFamily: 'GeistPixel', fontSize: 13, color: 'rgba(194,147,252,.9)' }, blinkStyle]}>
            _
          </Animated.Text>
        </View>
      </View>

      {/* CRT scanlines */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Pattern id="scanlines" width="3" height="3" patternUnits="userSpaceOnUse">
            <Rect width="3" height="1" fill="rgba(255,255,255,0.045)" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#scanlines)" />
      </Svg>
    </View>
  );
}
