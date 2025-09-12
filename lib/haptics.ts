import * as Haptics from 'expo-haptics';
import { RootState } from '@/lib/store';

export const triggerHaptic = async (
  state: RootState,
  type: 'light' | 'medium' | 'success' | 'warning' | 'error' = 'light',
) => {
  const enabled = state.settings?.hapticsEnabled ?? true;
  if (!enabled) return;
  // Expo Haptics does not expose isAvailableAsync on web; try/catch to be safe
  try {
    // @ts-ignore
    if (typeof Haptics.isAvailableAsync === 'function') {
      // @ts-ignore
      const available = await Haptics.isAvailableAsync();
      if (!available) return;
    }
  } catch {}
  try {
    switch (type) {
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'light':
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch {}
};

export const triggerIfEnabled = async (
  enabled: boolean,
  type: 'light' | 'medium' | 'success' | 'warning' | 'error' = 'light',
) => {
  if (!enabled) return;
  try {
    // @ts-ignore
    if (typeof Haptics.isAvailableAsync === 'function') {
      // @ts-ignore
      const available = await Haptics.isAvailableAsync();
      if (!available) return;
    }
  } catch {}
  try {
    switch (type) {
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'light':
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch {}
};


