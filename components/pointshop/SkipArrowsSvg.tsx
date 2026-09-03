import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type SkipArrowsSvgProps = SvgProps & {
  direction: 'back' | 'forward';
  color: string;
};

// Extracted from the CD player artwork so the arrows can change color while pressed.
function SkipArrowsSvg({ direction, color, ...props }: SkipArrowsSvgProps) {
  return (
    <Svg viewBox="0 0 12.898 8.146" fill="none" {...props}>
      <Path
        d="M0 8.146V0L6.109 4.073L0 8.146ZM6.788 8.146V0L12.898 4.073L6.788 8.146Z"
        fill={color}
        transform={direction === 'back' ? 'translate(12.898 0) scale(-1 1)' : undefined}
      />
    </Svg>
  );
}

export default React.memo(SkipArrowsSvg);
