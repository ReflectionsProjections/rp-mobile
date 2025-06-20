import React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { styled } from 'nativewind';
import { ThemedText } from '../themed/ThemedText';

const StyledPressable = styled(Pressable);
const StyledView = styled(View);

interface SlantedButtonProps extends PressableProps {
  children: React.ReactNode;
}

export function SlantedButton({ children, ...rest }: SlantedButtonProps) {
  return (
    <StyledPressable {...rest} className="relative min-w-[250px] h-[52px] bg-gray-200">
      <StyledView className="flex-1 items-center justify-center skew-x-12">
        <ThemedText variant="h3" className="text-black">{children}</ThemedText>
      </StyledView>
    </StyledPressable>
  );
}
