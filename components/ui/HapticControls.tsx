import React, { forwardRef, useCallback } from 'react';
import {
  Pressable as NativePressable,
  TouchableOpacity as NativeTouchableOpacity,
  type GestureResponderEvent,
  type PressableProps,
  type TouchableOpacityProps,
  type View,
} from 'react-native';

import { triggerIfEnabled } from '@/lib/haptics';
import { useAppSelector } from '@/lib/store';

type HapticControlProps = {
  hapticDisabled?: boolean;
};

export const Pressable = forwardRef<View, PressableProps & HapticControlProps>(
  ({ onPress, disabled, hapticDisabled = false, ...props }, ref) => {
    const enabled = useAppSelector((state) => state.settings?.hapticsEnabled ?? true);
    const handlePress = useCallback(
      (event: GestureResponderEvent) => {
        if (!hapticDisabled) void triggerIfEnabled(enabled, 'light');
        onPress?.(event);
      },
      [enabled, hapticDisabled, onPress],
    );

    return <NativePressable ref={ref} disabled={disabled} onPress={handlePress} {...props} />;
  },
);
Pressable.displayName = 'HapticPressable';

export const TouchableOpacity = forwardRef<
  View,
  TouchableOpacityProps & HapticControlProps
>(({ onPress, disabled, hapticDisabled = false, ...props }, ref) => {
  const enabled = useAppSelector((state) => state.settings?.hapticsEnabled ?? true);
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (!hapticDisabled) void triggerIfEnabled(enabled, 'light');
      onPress?.(event);
    },
    [enabled, hapticDisabled, onPress],
  );

  return <NativeTouchableOpacity ref={ref} disabled={disabled} onPress={handlePress} {...props} />;
});
TouchableOpacity.displayName = 'HapticTouchableOpacity';
