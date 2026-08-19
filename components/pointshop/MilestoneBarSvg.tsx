import React from 'react';
import Svg, {
  Defs,
  Image as SvgImage,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { getPointShopMilestoneStates, POINT_SHOP_MILESTONES } from '@/lib/pointShopProgress';

type MilestoneBarSvgProps = SvgProps & {
  points: number;
  progressWidth: SharedValue<number>;
};

const ACTIVE_TAG_IMAGE = require('../../assets/pointshop/milestone_tag_active.png');
const LOCKED_TAG_IMAGE = require('../../assets/pointshop/milestone_tag_locked.png');
const TAG_CENTERS = [51, 128, 202, 276, 350] as const;

const ACTIVE_TAG_PATH =
  'M42.499 23.8501C40.9528 24.7435 40 26.3934 40 28.1792V41.6704C40 41.6704 40.7034 46.1341 43.4219 47.7817C46.0356 49.3656 51 49.7378 51 49.7378C51.0235 49.7358 55.9481 49.3257 58.5771 47.7817C61.3734 46.1395 62 41.6704 62 41.6704V28.1792C62 26.3935 61.0471 24.7435 59.501 23.8501L51 18.938L42.499 23.8501Z';
const LOCKED_TAG_PATH =
  'M135.899 20.3085C137.446 21.2018 138.398 22.852 138.398 24.6376V36.9111C138.391 36.9586 137.733 41.0501 135.231 42.5663C132.823 44.0255 128.26 44.3737 128.218 44.3769C128.218 44.3769 123.643 43.9989 121.204 42.5663C118.63 41.0546 118.042 36.9557 118.036 36.9111V24.6376C118.036 22.852 118.989 21.2018 120.535 20.3085L128.218 15.8701L135.899 20.3085Z';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function ProgressFill({ progressWidth }: { progressWidth: SharedValue<number> }) {
  const animatedProps = useAnimatedProps(() => ({ width: progressWidth.value }));

  return (
    <AnimatedRect
      animatedProps={animatedProps}
      x={2}
      y={4.938}
      width={0}
      height={9}
      rx={4.5}
      fill="#05F3DB"
    />
  );
}

function MilestoneTag({
  center,
  reached,
  value,
}: {
  center: number;
  reached: boolean;
  value: number;
}) {
  const labelWidth = value < 10 ? 12 : 19;
  const labelY = reached ? 28 : 25;

  return (
    <>
      <Path
        d={reached ? ACTIVE_TAG_PATH : LOCKED_TAG_PATH}
        transform={`translate(${center - (reached ? 51 : 128)} 0)`}
        fill="white"
        stroke={reached ? '#FF4CCC' : '#373792'}
        strokeWidth={reached ? 1 : 1.3}
      />
      <SvgImage
        href={reached ? ACTIVE_TAG_IMAGE : LOCKED_TAG_IMAGE}
        x={center - 24.5}
        y={0}
        width={49}
        height={51}
        preserveAspectRatio="xMidYMid meet"
      />
      <Rect
        x={center - labelWidth / 2}
        y={labelY}
        width={labelWidth}
        height={13}
        rx={1}
        fill={reached ? '#310F78' : '#FFFFFF'}
      />
      <SvgText
        x={center}
        y={labelY + 10}
        fill={reached ? '#FFFFFF' : '#181818'}
        fontFamily="ShareTechMono"
        fontSize={10}
        textAnchor="middle"
      >
        {value}
      </SvgText>
    </>
  );
}

function MilestoneBarSvg({ points, progressWidth, ...props }: MilestoneBarSvgProps) {
  const milestoneStates = getPointShopMilestoneStates(points);

  return (
    <Svg width={363} height={51} viewBox="0 0 363 51" fill="none" {...props}>
      <Defs>
        <LinearGradient id="trackBorder" x1={179.5} y1={3} x2={179.5} y2={15.938}>
          <Stop stopColor="#373792" />
          <Stop offset={1} stopColor="#F52DBC" />
        </LinearGradient>
      </Defs>

      <Rect
        x={1}
        y={3.938}
        width={357}
        height={11}
        rx={5.5}
        fill="#B9C8FF"
        stroke="url(#trackBorder)"
        strokeWidth={2}
      />
      <ProgressFill progressWidth={progressWidth} />

      {POINT_SHOP_MILESTONES.map((value, index) => (
        <MilestoneTag
          key={value}
          center={TAG_CENTERS[index]}
          reached={milestoneStates[index]}
          value={value}
        />
      ))}
    </Svg>
  );
}

export default React.memo(MilestoneBarSvg);
