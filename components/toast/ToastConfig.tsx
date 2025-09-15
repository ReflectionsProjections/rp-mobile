import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

type ToastProps = {
  text1?: string;
  text2?: string;
  props?: any;
};

const BaseToast = ({
  text1 = '',
  text2 = '',
  accent = '#CA2523',
  icon,
}: {
  text1?: string;
  text2?: string;
  accent: string;
  icon: React.ReactNode;
}) => {
  const progress = useRef(new Animated.Value(1)).current;
  const sheenX = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 1800,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sheenX, {
          toValue: 220,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sheenX, { toValue: -80, duration: 0, useNativeDriver: true }),
      ]),
      { iterations: 1 },
    ).start();
  }, []);

  return (
    <Pressable
      onPress={() => Toast.hide()}
      accessibilityRole="button"
      accessibilityLabel={text1}
      style={{ width: '100%' }}
    >
      <View
        style={{
          width: '100%',
          marginHorizontal: 0,
          marginTop: 8,
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.82)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.14)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 12,
        }}
      >
        {/* Animated racing stripe */}
        <LinearGradient
          colors={[accent, accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 3, opacity: 0.95 }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              overflow: 'hidden',
            }}
          >
            {icon}
            {/* Sheen */}
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 24,
                transform: [{ translateX: sheenX }],
                opacity: 0.25,
              }}
            >
              <LinearGradient
                colors={['transparent', '#fff', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
          <View style={{ flex: 1 }}>
            {!!text1 && (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: 'ProRacing',
                  marginBottom: text2 ? 4 : 0,
                }}
                numberOfLines={3}
              >
                {text1}
              </Text>
            )}
            {!!text2 && (
              <Text
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 13,
                  fontFamily: 'Magistral',
                }}
                numberOfLines={3}
              >
                {text2}
              </Text>
            )}
          </View>
        </View>
        {/* Animated bottom progress bar */}
        <Animated.View
          style={{
            height: 2,
            backgroundColor: accent,
            width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>
    </Pressable>
  );
};

export const toastConfig = {
  success: ({ text1, text2 }: ToastProps) => (
    <BaseToast
      text1={text1}
      text2={text2}
      accent="#4CD964"
      icon={<Ionicons name="checkmark" size={20} color="#000" />}
    />
  ),
  error: ({ text1, text2 }: ToastProps) => (
    <BaseToast
      text1={text1}
      text2={text2}
      accent="#ff3b30"
      icon={<Ionicons name="alert" size={20} color="#000" />}
    />
  ),
  info: ({ text1, text2 }: ToastProps) => (
    <BaseToast
      text1={text1}
      text2={text2}
      accent="#EDE053"
      icon={<MaterialCommunityIcons name="flag-checkered" size={20} color="#000" />}
    />
  ),
};

export default toastConfig;
