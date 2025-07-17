import '@/global.css';
import React, { useState } from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SvgProps } from 'react-native-svg';

import CurvedBottomBar from '../../components/misc/curvedBottomBar';
import HomeScreen from './home';
import EventsScreen from './events';
import PointsShopScreen from './points_shop';
import ProfileScreen from './profile';
import ScannerScreen from './scanner';

import HomeIcon from '@/assets/icons/tabIcons/final_homeIcon.svg';
import EventsIcon from '@/assets/icons/tabIcons/final_eventsIcon.svg';
import QrCodeIcon from '@/assets/icons/tabIcons/rp_qr.svg';
import PointsIcon from '@/assets/icons/tabIcons/final_shopIcon.svg';
import ProfileIcon from '@/assets/icons/tabIcons/final_leaderIcon.svg';

import FilledHomeIcon from '@/assets/icons/tabIcons/filled/filled_homeIcon.svg';
import FilledEventsIcon from '@/assets/icons/tabIcons/filled/filled_eventsIcon.svg';
import FilledPointsIcon from '@/assets/icons/tabIcons/filled/filled_shopIcon.svg';
import FilledProfileIcon from '@/assets/icons/tabIcons/filled/filled_leaderIcon.svg';

const { width, height } = Dimensions.get('window');
const HEIGHT = 0.15 * height;
const BUTTON_SIZE = Math.min(width, height) * 0.2;
const ICON_SIZE = 36;

const TABS: { key: string; icon: React.FC<SvgProps>; filledIcon: React.FC<SvgProps> }[] = [
  { key: 'home', icon: HomeIcon, filledIcon: FilledHomeIcon },
  { key: 'events', icon: EventsIcon, filledIcon: FilledEventsIcon },
  { key: 'points', icon: PointsIcon, filledIcon: FilledPointsIcon },
  { key: 'profile', icon: ProfileIcon, filledIcon: FilledProfileIcon },
];

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'events':
        return <EventsScreen />;
      case 'points':
        return <PointsShopScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'scanner':
        return <ScannerScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View className="flex-1">
      {renderContent()}

      <View className="absolute left-0 right-0 bottom-0 items-center pb-8">
        <View className="absolute left-0 right-0 bottom-0">
          <CurvedBottomBar />
        </View>

        <View className="flex-1 flex-row">
          {TABS.map((tab, idx) => {
            if (idx === 2) {
              return (
                <React.Fragment key="spacer">
                  <View style={{ width: BUTTON_SIZE  }} />
                  <TabButton
                    key={tab.key}
                    tab={tab}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                </React.Fragment>
              );
            }
            return (
              <TabButton
                key={tab.key}
                tab={tab}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                width={tab.key === 'home' ? 50 : 40}
                height={tab.key === 'home' ? 50 : 40}
              />
            );
          })}
        </View>

        <TouchableOpacity
          className="absolute justify-center items-center"
          style={{
            bottom: HEIGHT - BUTTON_SIZE * 1.11,
            left: width / 2 - (BUTTON_SIZE) / 2,
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            zIndex: 2,
          }}
          onPress={() => {
            setActiveTab('scanner');
          }}
        >
          <View
            style={{
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              borderRadius: (BUTTON_SIZE) / 2,
              backgroundColor: '#E5E5E5',
              borderWidth: 4,
              borderColor: '#DF4F44',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <QrCodeIcon width={ICON_SIZE} height={ICON_SIZE} color={activeTab === 'scanner' ? '#00ADB5' : '#DF4F44'} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type TabButtonProps = {
  tab: { key: string; icon: React.FC<SvgProps>; filledIcon: React.FC<SvgProps> };
  activeTab: string;
  setActiveTab: (key: string) => void;
  width?: number;
  height?: number;
};
function TabButton({ tab, activeTab, setActiveTab, width = 40, height = 40 }: TabButtonProps) {
  const isActive = activeTab === tab.key;
  const Icon = isActive ? tab.filledIcon : tab.icon;
  return (
    <TouchableOpacity
      className="flex-1 justify-center items-center"
      onPress={() => setActiveTab(tab.key)}
    >
      <View className={`tab-icon ${isActive ? 'tab-icon-active' : ''}`}>
        <Icon
          width={width}
          height={height}
          color={isActive ? '#DF4F44' : '#00ADB5'}
        />
      </View>
    </TouchableOpacity>
  );
}
