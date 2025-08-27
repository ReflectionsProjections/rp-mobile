import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type DayTab = { label: string; dayNumber: number; barColor: string };

type Props = {
  tabs: DayTab[];
  selectedDay: number;
  onSelectDay: (dayNumber: number) => void;
};

export const DayTabs: React.FC<Props> = ({ tabs, selectedDay, onSelectDay }) => {
  return (
    <View className="flex-row justify-between mx-4 mt-6 mb-4">
      {tabs.map((tab) => {
        const isActive = tab.dayNumber === selectedDay;
        return (
          <TouchableOpacity
            key={tab.label}
            onPress={() => onSelectDay(tab.dayNumber)}
            className={`w-[17%] h-8 flex-row items-center rounded-md ${isActive ? 'bg-black' : 'bg-white'}`}
            activeOpacity={0.85}
          >
            <View
              className="h-[80%] pl-2 ml-1 rounded-sm"
              style={{
                width: 10,
                backgroundColor: tab.barColor,
              }}
            />
            <Text
              className={`ml-1.5 text-base font-bold italic ${isActive ? 'text-white' : 'text-black'}`}
              style={{ fontFamily: 'RacingSansOne-Regular' }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


