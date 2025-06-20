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

import HomeIcon from '@/assets/icons/tabIcons/rp_home.svg';
import EventsIcon from '@/assets/icons/tabIcons/rp_events.svg';
import QrCodeIcon from '@/assets/icons/tabIcons/rp_qr.svg';
import PointsIcon from '@/assets/icons/tabIcons/rp_points.svg';
import ProfileIcon from '@/assets/icons/tabIcons/rp_profile.svg';

const { width, height } = Dimensions.get('window');
const HEIGHT = 0.15 * height;
const BUTTON_SIZE = Math.min(width, height) * 0.2;

const TABS: { key: string; icon: React.FC<SvgProps> }[] = [
  { key: 'home', icon: HomeIcon },
  { key: 'events', icon: EventsIcon },
  { key: 'points', icon: PointsIcon },
  { key: 'profile', icon: ProfileIcon },
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
                  <View style={{ width: BUTTON_SIZE }} />
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
              />
            );
          })}
        </View>

        <TouchableOpacity
          className="absolute justify-center items-center rounded-full shadow-lg"
          style={{
            bottom: HEIGHT - BUTTON_SIZE,
            left: width / 2 - (BUTTON_SIZE * 0.9) / 2,
            width: BUTTON_SIZE * 0.9,
            height: BUTTON_SIZE * 0.9,
            backgroundColor: '#393E46',
            zIndex: 2,
          }}
        >
          <QrCodeIcon width={36} height={36} color={Colors.light.tabIconDefault} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

type TabButtonProps = {
  tab: { key: string; icon: React.FC<SvgProps> };
  activeTab: string;
  setActiveTab: (key: string) => void;
};
function TabButton({ tab, activeTab, setActiveTab }: TabButtonProps) {
  const Icon = tab.icon;
  const isActive = activeTab === tab.key;
  return (
    <TouchableOpacity
      className="flex-1 justify-center items-center"
      onPress={() => setActiveTab(tab.key)}
    >
      <View className={`tab-icon ${isActive ? 'tab-icon-active' : ''}`}>
        <Icon
          width={36}
          height={36}
          color={isActive ? Colors.light.tabIconSelected : Colors.light.tabIconDefault}
        />
      </View>
    </TouchableOpacity>
  );
}
