import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type DayTab = { label: string; dayNumber: number };

type Props = {
  tabs: DayTab[];
  selectedDay: number;
  onSelectDay: (dayNumber: number) => void;
};

export const DayTabs: React.FC<Props> = ({ tabs, selectedDay, onSelectDay }) => {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {tabs.map((tab) => {
          const isActive = tab.dayNumber === selectedDay;
          return (
            <TouchableOpacity
              key={tab.label}
              onPress={() => onSelectDay(tab.dayNumber)}
              activeOpacity={0.86}
              style={styles.touchTarget}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#F52DBC', '#E725B0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.tab, styles.activeGlow]}
                >
                  <Text
                    style={[styles.label, styles.activeLabel]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                  >
                    {tab.label}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveOuter}>
                  <LinearGradient
                    colors={['#373792', '#F52DBC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.border}
                  >
                    <View style={styles.inactiveInner}>
                      <Text
                        style={styles.label}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                      >
                        {tab.label}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    marginBottom: 20,
  },
  content: {
    gap: 17,
    paddingHorizontal: 18,
  },
  touchTarget: {
    minWidth: 78,
    height: 50,
    justifyContent: 'center',
  },
  tab: {
    height: 34,
    minWidth: 78,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeGlow: {
    shadowColor: '#F52DBC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 16,
    elevation: 8,
  },
  inactiveOuter: {
    height: 34,
    minWidth: 78,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  border: {
    flex: 1,
    borderRadius: 6,
    padding: 2,
  },
  inactiveInner: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#050505',
    fontFamily: 'Ethnocentric',
    fontSize: 14,
    lineHeight: 22,
  },
  activeLabel: {
    color: '#fff',
  },
});
