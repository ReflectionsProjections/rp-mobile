import { Text, type TextProps } from 'react-native';
import { styled } from 'nativewind';

const StyledText = styled(Text);

export type ThemedTextProps = TextProps & {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'body-bold' | 'button';
  className?: string;
};

export function ThemedText({
  variant = 'body',
  className = '',
  ...rest
}: ThemedTextProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'h1':
        return 'font-racing text-[30px] tracking-wide';
      case 'h2':
        return 'font-racing text-[24px] tracking-wide';
      case 'h3':
        return 'font-racing text-[20px] tracking-wide';
      case 'body-bold':
        return 'font-inter font-bold text-base';
      case 'button':
        return 'font-racing text-lg tracking-wider text-white';
      case 'body':
        return 'font-inter font-normal text-base';
      default:
        return 'font-inter text-base';
    }
  };

  return <StyledText className={`${getVariantClass()} ${className}`} {...rest} />;
} 