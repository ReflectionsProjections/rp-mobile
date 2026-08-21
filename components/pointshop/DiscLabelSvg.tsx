import React from 'react';
import Svg, { Defs, Path, Text as SvgText, TextPath } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

type DiscLabelSvgProps = SvgProps & {
  itemName: string;
};

function DiscLabelSvg({ itemName, ...props }: DiscLabelSvgProps) {
  const circularLabel = `${itemName} • ${itemName} • ${itemName} •`;

  return (
    <Svg width={199} height={199} viewBox="0 0 199 199" fill="none" {...props}>
      <Defs>
        <Path
          id="discItemNamePath"
          d="M64.145 134.855A50 50 0 1 1 134.855 134.855A50 50 0 1 1 64.145 134.855"
        />
      </Defs>
      <SvgText
        fill="#FFFFFF"
        fontFamily="ShareTechMono"
        fontSize={7}
        letterSpacing={0.7}
        textLength={220}
        lengthAdjust="spacing"
      >
        <TextPath href="#discItemNamePath" startOffset={0}>
          {circularLabel}
        </TextPath>
      </SvgText>
    </Svg>
  );
}

export default React.memo(DiscLabelSvg);
