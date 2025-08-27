// screens/PointsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Background from '../../assets/pointshop/point_background.svg';
import { PointsGauge } from '@/components/pointshop/PointsGuage';
import { QuestionMarker } from '@/components/pointshop/QuestionMarker';
import { api } from '@/api/api';

const { width, height } = Dimensions.get('window');
const SPEEDO_WIDTH = width * 0.7;

export default function PointsScreen() {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorString, setErrorString] = useState<string | null>(null);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const fetchPoints = async () => {
      const start = Date.now();
      try {
        const response = await api.get('/attendee/points');
        setPoints(response.data.points || 0);
      } catch (err) {
        setError('Failed to fetch points');
        console.error('Failed to fetch points:', err);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = 500 - elapsed;
        timeoutId = setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
      }
    };
    fetchPoints();
  }, []);

  return (
    <View className="flex-1 bg-rpRed relative">
      <Background
        width={width}
        height={height}
        className="absolute inset-0 z-0"
        preserveAspectRatio="xMidYMin slice"
      />

      <View className="absolute inset-x-0 top-16 items-center z-10">
        <PointsGauge points={points} width={SPEEDO_WIDTH} />
      </View>

      <QuestionMarker
        count={15}
        className="z-10"
        style={{ top: height * 0.32, left: width * 0.3 }}
      />
      <QuestionMarker
        count={50}
        className="z-10"
        style={{ top: height * 0.63, left: width * 0.04 }}
      />
      <QuestionMarker
        count={100}
        className="z-10"
        style={{ top: height * 0.76, left: width * 0.52 }}
      />

      <Text
        className="absolute z-10 text-[16px] font-bold text-black font-RacingSansOne"
        style={{
          top: height * 0.63,
          left: width * 0.64,
          width: width * 0.33,
        }}
      >
        {error
          ? 'Make sure you have registered for R|P to track your points!'
          : 'Attend events to earn points and unlock prizes!'}
      </Text>
    </View>
  );
}
