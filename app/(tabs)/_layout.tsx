import React, {useState} from 'react';
import { Dimensions,StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import CurvedBottomBar from './curvedBottomBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import HomeScreen from './home';
import EventsScreen from './events';
import PointsShopScreen from './points_shop';
import ProfileScreen from './profile';

const { width, height } = Dimensions.get('window');
const WIDTH=width;
const HEIGHT=0.15*height; 
const BUTTON_SIZE = Math.min(width, height) * 0.15;
const TAB_SIZE=40; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  tabLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: height * 0.045,
  },
  tabRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: height * 0.045,
  },
  tabButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: TAB_SIZE,
    height: TAB_SIZE,
    borderRadius: TAB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: HEIGHT / 1.10 - BUTTON_SIZE,
    left: WIDTH / 2 - BUTTON_SIZE / 2,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#393E46',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

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
      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      <View style={styles.bottomBar}>
        <CurvedBottomBar />
        <View style={styles.tabLeft}>

          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('home')} >
            <View style={styles.tabIcon}>
              <MaterialIcons size={28} name="home" color="white" />
            </View>
            <Text style={styles.tabLabel}>Info</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('events')}>
            <View style={styles.tabIcon}>
              <MaterialIcons size={28} name="event" color="white" />
            </View>
            <Text style={styles.tabLabel}>Events</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.addButton} >
          <MaterialIcons size={28} name="qr-code-scanner" color="white" 
          />
        </TouchableOpacity>

        <View style={styles.tabRight}>

          <TouchableOpacity style={styles.tabButton } onPress={() => setActiveTab('points')} >
            <View style={styles.tabIcon}>
              <MaterialIcons size={28} name="storefront" color="white"/>
            </View>
            <Text style={styles.tabLabel}>Points Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton}  onPress={() => setActiveTab('profile')} >
            <View style={styles.tabIcon}>
              <MaterialIcons size={28} name="account-circle" color="white"/>
            </View>
            <Text style={styles.tabLabel}>Profile</Text>
          </TouchableOpacity>

        </View>

      </View>
    </>
  );
}
