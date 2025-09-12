import '@/global.css';
import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, View, TouchableOpacity, Pressable } from 'react-native';
import { SvgProps } from 'react-native-svg';
import * as SecureStore from 'expo-secure-store';
import { useThemeColor } from '@/lib/theme';

import CurvedBottomBar from '../../components/misc/curvedBottomBar';
import HomeScreen from './home';
import EventsScreen from './events';
import PointsShopScreen from './points_shop';
import StatsScreen from './stats';
import ScannerStaffScreen from './scanner/scanner_staff';
import ScannerUserScreen from './scanner/scanner_user';
import LeaderboardScreen from './leaderboard/leaderboard';

import HomeIcon from '@/assets/icons/tabIcons/final_homeIcon.svg';
import EventsIcon from '@/assets/icons/tabIcons/final_eventsIcon.svg';
import QrCodeIcon from '@/assets/icons/tabIcons/rp_qr.svg';
import PointsIcon from '@/assets/icons/tabIcons/final_shopIcon.svg';
import LeaderboardIcon from '@/assets/icons/tabIcons/final_leaderIcon.svg';

import FilledHomeIcon from '@/assets/icons/tabIcons/filled/filled_homeIcon.svg';
import FilledEventsIcon from '@/assets/icons/tabIcons/filled/filled_eventsIcon.svg';
import FilledPointsIcon from '@/assets/icons/tabIcons/filled/filled_shopIcon.svg';
import FilledProfileIcon from '@/assets/icons/tabIcons/filled/filled_leaderIcon.svg';
import ScannerGuestScreen from './scanner/scanner_guest';
import { useAppSelector } from '@/lib/store';
import LeaderboardGuestScreen from './leaderboard/leaderboard_guest';

const { width, height } = Dimensions.get('window');
const HEIGHT = 0.15 * height;
const BUTTON_SIZE = Math.min(width, height) * 0.21;
const ICON_SIZE = 36;

const TABS: { key: string; icon: React.FC<SvgProps>; filledIcon: React.FC<SvgProps> }[] = [
  { key: 'home', icon: HomeIcon, filledIcon: FilledHomeIcon },
  { key: 'events', icon: EventsIcon, filledIcon: FilledEventsIcon },
  { key: 'points', icon: PointsIcon, filledIcon: FilledPointsIcon },
  { key: 'leaderboard', icon: LeaderboardIcon, filledIcon: FilledProfileIcon },
];

// Separate component to handle scanner routing with user data
function ScannerRouter() {
  const jwt = SecureStore.getItemAsync('jwt');

  const profile = useAppSelector((state) => state.user.profile);

  if (jwt === null || profile === null) {
    return <ScannerGuestScreen />;
  }

  if (!profile || !profile.roles || profile.roles.length === 0) {
    return <ScannerGuestScreen />;
  }

  if (profile.roles.includes('STAFF')) {
    return <ScannerStaffScreen />;
  }

  if (profile.roles.includes('USER')) {
    return <ScannerUserScreen />;
  }

  return <ScannerGuestScreen />;
}

function LeaderboardRouter({ scrollRef }: { scrollRef: React.RefObject<any> }) {
  const profile = useAppSelector((state) => state.user.profile);
  if (profile && profile.roles && profile.roles.includes('USER')) {
    return <LeaderboardScreen scrollRef={scrollRef} />;
  }
  return <LeaderboardGuestScreen />;
}

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const themeColor = useThemeColor();
  const profile = useAppSelector((state) => state.user.profile);
  const leaderboardScrollRef = useRef<any>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'events':
        return <EventsScreen />;
      case 'points':
        // Show stats for staff, points shop for everyone else
        if (profile && profile.roles && profile.roles.includes('STAFF')) {
          return <StatsScreen />;
        } else {
          return <PointsShopScreen />;
        }
      case 'leaderboard':
        return <LeaderboardRouter scrollRef={leaderboardScrollRef} />;
      case 'scanner':
        return <ScannerRouter />;
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

        <View className={`flex-1 flex-row ${height < 700 ? 'top-5' : ''}`}>
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
                    themeColor={themeColor}
                    leaderboardScrollRef={leaderboardScrollRef}
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
                themeColor={themeColor}
                width={tab.key === 'home' ? 50 : 40}
                height={tab.key === 'home' ? 50 : 40}
                leaderboardScrollRef={leaderboardScrollRef}
              />
            );
          })}
        </View>

        <Pressable
          className="absolute justify-center items-center"
          style={{
            bottom: HEIGHT - BUTTON_SIZE * 1.11 + (height < 700 ? 10 : 0),
            left: width / 2 - BUTTON_SIZE / 2,
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
              borderRadius: BUTTON_SIZE / 2,
              backgroundColor: activeTab === 'scanner' ? themeColor : '#E5E5E5',
              borderWidth: 5,
              borderColor: themeColor,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <QrCodeIcon
              width={ICON_SIZE}
              height={ICON_SIZE}
              color={activeTab === 'scanner' ? '#FFF' : themeColor}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

type TabButtonProps = {
  tab: { key: string; icon: React.FC<SvgProps>; filledIcon: React.FC<SvgProps> };
  activeTab: string;
  setActiveTab: (key: string) => void;
  themeColor: string;
  width?: number;
  height?: number;
  leaderboardScrollRef?: React.RefObject<any>;
};
function TabButton({
  tab,
  activeTab,
  setActiveTab,
  themeColor,
  width = 40,
  height = 40,
  leaderboardScrollRef,
}: TabButtonProps) {
  const isActive = activeTab === tab.key;
  const Icon = isActive ? tab.filledIcon : tab.icon;
  
  const handlePress = () => {
    if (tab.key === 'leaderboard' && isActive && leaderboardScrollRef?.current) {
      // If leaderboard tab is already active, scroll to top
      leaderboardScrollRef.current.scrollTo({ y: 0, animated: true });
    } else {
      setActiveTab(tab.key);
    }
  };
  
  return (
    <TouchableOpacity
      className="flex-1 justify-center items-center shadow-sm shadow-black shadow-opacity-50"
      onPress={handlePress}
    >
      <View className={`tab-icon ${isActive ? 'tab-icon-active' : ''}`}>
        <Icon width={width} height={height} color={isActive ? themeColor : '#00ADB5'} />
      </View>
    </TouchableOpacity>
  );
}
