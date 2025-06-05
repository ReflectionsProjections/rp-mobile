// components/AppText.tsx
import { Text, TextProps } from 'react-native';
export function AppText(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: 'ProRacing' }, props.style]} />;
}