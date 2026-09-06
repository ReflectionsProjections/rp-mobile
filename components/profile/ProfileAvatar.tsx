import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useAppSelector } from '@/lib/store';
import { IconColorType } from '@/api/types';
import AvatarDarkBlue from '@/assets/profile/avatars/avatar_dark_blue.svg';
import AvatarPink from '@/assets/profile/avatars/avatar_pink.svg';
import AvatarPurple from '@/assets/profile/avatars/avatar_purple.svg';
import AvatarDarkTeal from '@/assets/profile/avatars/avatar_dark_teal.svg';
import AvatarMagenta from '@/assets/profile/avatars/avatar_magenta.svg';

type AvatarArt = React.FC<{ width: number; height: number }>;

export const PROFILE_AVATAR_OPTIONS: {
  icon: IconColorType;
  label: string;
  Art: AvatarArt;
}[] = [
  { icon: 'BLUE', label: 'Dark Blue', Art: AvatarDarkBlue },
  { icon: 'PINK', label: 'Pink', Art: AvatarPink },
  { icon: 'PURPLE', label: 'Purple', Art: AvatarPurple },
  { icon: 'GREEN', label: 'Dark Teal', Art: AvatarDarkTeal },
  { icon: 'RED', label: 'Magenta', Art: AvatarMagenta },
];

// Figma avatar set (Development Handoff (app): Avatar 1-5), keyed by the
// attendee's icon color from GET /attendee — the API has no dedicated avatar
// field. No orange art exists, so ORANGE shares the magenta avatar; users
// without attendee data get the purple default the profile has always shown.
const AVATAR_BY_ICON: Record<IconColorType, AvatarArt> = {
  BLUE: AvatarDarkBlue,
  PINK: AvatarPink,
  PURPLE: AvatarPurple,
  GREEN: AvatarDarkTeal,
  RED: AvatarMagenta,
  ORANGE: AvatarMagenta,
  YELLOW: AvatarMagenta,
  BLACK: AvatarDarkBlue,
};

interface ProfileAvatarProps {
  size: number;
  icon?: IconColorType;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

// The user's profile picture, resolved from their attendee data so every
// screen (profile, QR) shows the same art.
export function ProfileAvatar({
  size,
  icon: iconOverride,
  borderRadius = 2.4,
  style,
}: ProfileAvatarProps) {
  const savedIcon = useAppSelector((state) => state.attendee.attendee?.icon);
  const icon = iconOverride ?? savedIcon;
  const Art = (icon && AVATAR_BY_ICON[icon]) || AvatarPurple;
  return (
    <View style={[{ width: size, height: size, borderRadius, overflow: 'hidden' }, style]}>
      <Art width={size} height={size} />
    </View>
  );
}
