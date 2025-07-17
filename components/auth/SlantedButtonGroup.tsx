import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface SlantedButtonGroupProps {
  children: React.ReactNode;
}

export function SlantedButtonGroup({ children }: SlantedButtonGroupProps) {
  return (
    <StyledView className="-skew-x-12 rounded-md overflow-hidden my-2 items-center justify-center gap-1">
      {children}
    </StyledView>
  );
}
