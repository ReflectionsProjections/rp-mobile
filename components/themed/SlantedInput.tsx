import React from 'react';
import { View, TextInput, type TextInputProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);

interface SlantedInputProps extends TextInputProps {
  
}

export function SlantedInput(props: SlantedInputProps) {
  return (
    <StyledView className="w-full h-[52px] my-2">
      <StyledView
        className="absolute inset-0 bg-gray-200 -skew-x-12"
      />
      <StyledTextInput
        {...props}
        className="w-full h-full font-inter text-lg text-black px-4"
      />
    </StyledView>
  );
} 