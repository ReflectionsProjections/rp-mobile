import { Text, type TextProps } from 'react-native';
import { styled } from 'nativewind';

const StyledText = styled(Text);

export type ThemedTextProps = TextProps & {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'body-bold' | 'button' | 'title' | 'bigName';
  className?: string;
};

export function ThemedText({ variant = 'body', className = '', ...rest }: ThemedTextProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'bigName':
        return 'font-proRacingSlant text-[40px] tracking-wide text-white font-italic';
      case 'h1':
        return 'font-proRacing text-[30px] tracking-wide';
      case 'h2':
        return 'font-proRacing text-[24px] tracking-wide';
      case 'h3':
        return 'font-proRacing font-bold text-[14px] tracking-wide';
      case 'body-bold':
        return 'font-inter font-bold text-base';
      case 'button':
        return 'font-racing text-lg tracking-wider text-white';
      case 'title':
        return 'font-proRacing text-[30px] text-white';
      case 'body':
        return 'font-inter font-normal text-base';
      default:
        return 'font-inter text-base';
    }
  };

  return <StyledText className={`${getVariantClass()} ${className}`} {...rest} />;
}
