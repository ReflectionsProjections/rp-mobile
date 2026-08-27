import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Event } from '@/api/types';
import { formatAMPM } from '@/lib/utils';
import { parseEventLink, stripEventFood, stripEventLinks } from '@/lib/linkUtils';
import FoodMenuBottomSheet from '@/components/events/FoodMenuBottomSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const EXPANDED_CARD_WIDTH = 375;
const EXPANDED_CARD_HEIGHT = 483;

interface EventDetailModalProps {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
  isFlagged?: boolean;
  onToggleFlag?: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  visible,
  event,
  onClose,
  isFlagged,
  onToggleFlag,
}) => {
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const modalEntrance = useRef(new Animated.Value(0)).current;
  const foodMenuOpacity = useRef(new Animated.Value(1)).current;
  const expandedScale = Math.min(
    (SCREEN_WIDTH - 26) / EXPANDED_CARD_WIDTH,
    (SCREEN_HEIGHT - 220) / EXPANDED_CARD_HEIGHT,
    1,
  );

  useEffect(() => {
    if (event) {
      foodMenuOpacity.setValue(1);
    }
  }, [event]);

  useEffect(() => {
    if (visible) {
      modalEntrance.setValue(0);
      Animated.timing(modalEntrance, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      modalEntrance.setValue(0);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(modalEntrance, {
      toValue: 0,
      duration: 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setShowFoodMenu(false);
      onClose();
    });
  };

  const handleFoodMenuPress = () => {
    if (event && event.eventType === 'MEALS') {
      setShowFoodMenu(true);
    }
  };

  const handleCloseFoodMenu = () => {
    setShowFoodMenu(false);
  };

  const handleLinkPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Cannot Open Link',
          text2: 'This link cannot be opened on your device.',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to open link.',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <>
      <Modal visible={visible && !showFoodMenu} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFillObject} />
          <Pressable style={StyleSheet.absoluteFillObject} onPress={handleClose} />
          <Animated.View
            style={{
              transform: [
                {
                  translateY: modalEntrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
                {
                  scale: modalEntrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.98, 1],
                  }),
                },
              ],
              opacity: modalEntrance,
            }}
          >
            {event && (
              <View
                style={[
                  styles.expandedScaleFrame,
                  {
                    width: EXPANDED_CARD_WIDTH * expandedScale,
                    height: EXPANDED_CARD_HEIGHT * expandedScale,
                  },
                ]}
              >
                <View
                  style={[
                    styles.expandedScaledContents,
                    {
                      transform: [{ scale: expandedScale }],
                    },
                  ]}
                >
                  <View style={styles.expandedTabs}>
                    <View style={styles.expandedTab} />
                    <View style={styles.expandedTab} />
                  </View>
                  <View style={styles.expandedCard}>
                    <View pointerEvents="none" style={styles.expandedBottomInset} />
                    <View style={styles.expandedScrollBar} />

                    <View style={styles.expandedPaperWrap}>
                      <View style={styles.expandedPaper}>
                        <LinearGradient
                          pointerEvents="none"
                          colors={['rgba(0,0,0,0.22)', 'rgba(0,0,0,0)']}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={[styles.expandedPaperSideShade, styles.expandedPaperLeftShade]}
                        />
                        <LinearGradient
                          pointerEvents="none"
                          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.22)']}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={[styles.expandedPaperSideShade, styles.expandedPaperRightShade]}
                        />
                        <LinearGradient
                          colors={['#0F062D', '#7C1493']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={styles.expandedHeader}
                        >
                          <View style={styles.expandedTitleBox}>
                            <Text
                              style={styles.expandedTitle}
                              numberOfLines={2}
                              adjustsFontSizeToFit
                              minimumFontScale={0.72}
                            >
                              {event.name}
                            </Text>
                          </View>
                          <View style={styles.pinkRule} />
                        </LinearGradient>

                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          style={styles.detailsScroll}
                          contentContainerStyle={styles.detailsScrollContent}
                          nestedScrollEnabled
                        >
                            <View style={styles.expandedMetaRow}>
                              <View style={styles.expandedIconSlot}>
                                <MaterialCommunityIcons name="alarm" size={25} color="#080808" />
                              </View>
                              <Text
                                style={styles.expandedMetaText}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.72}
                              >
                                {formatAMPM(new Date(event.startTime))
                                  .replace('pm', ' PM')
                                  .replace('am', ' AM')}
                              </Text>
                            </View>
                            <View style={styles.expandedMetaRow}>
                              <View style={styles.expandedIconSlot}>
                                <MaterialCommunityIcons
                                  name="map-marker-outline"
                                  size={28}
                                  color="#080808"
                                />
                              </View>
                              <Text
                                style={styles.expandedMetaText}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.72}
                              >
                                {event.location}
                              </Text>
                            </View>

                            <Text style={styles.descriptionTitle}>DESCRIPTION</Text>
                            <Text style={styles.descriptionText}>
                              {event.description === 'none'
                                ? 'No description available'
                                : stripEventFood(stripEventLinks(event.description || ''))}
                            </Text>
                          </ScrollView>
                      </View>
                    </View>

                    <View style={styles.expandedFooter}>
                      <LinearGradient
                        colors={['#373792', '#F52DBC']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.expandedBadge}
                      >
                        <View style={styles.expandedBadgeInner}>
                          <Text
                            style={styles.expandedBadgeText}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.68}
                          >
                            {event.points || 0} POINTS
                          </Text>
                        </View>
                      </LinearGradient>
                      <LinearGradient
                        colors={['#373792', '#F52DBC']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={styles.expandedBadgeWide}
                      >
                        <View style={styles.expandedBadgeInner}>
                          <Text
                            style={styles.expandedBadgeText}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.68}
                          >
                            {event.eventType === 'SPECIAL' ? 'WORKSHOP' : event.eventType}
                          </Text>
                        </View>
                      </LinearGradient>
                      <View style={styles.pauseBars}>
                        <View style={styles.pauseBar} />
                        <View style={styles.pauseBar} />
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      {event.eventType === 'MEALS' && (
                        <Animated.View style={{ opacity: foodMenuOpacity }}>
                          <TouchableOpacity onPress={handleFoodMenuPress} style={styles.modalActionButton}>
                            <Text style={styles.modalActionText}>FOOD MENU</Text>
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                      {parseEventLink(event.description) && (
                        <Animated.View style={{ opacity: foodMenuOpacity }}>
                          <TouchableOpacity
                            onPress={() => {
                              const link = parseEventLink(event.description);
                              if (link) {
                                handleLinkPress(link.url);
                              }
                            }}
                            style={styles.modalActionButton}
                          >
                            <Text style={styles.modalActionText}>
                              {parseEventLink(event.description)?.title || 'OPEN LINK'}
                            </Text>
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                      {onToggleFlag && (
                        <Animated.View style={{ opacity: foodMenuOpacity }}>
                          <TouchableOpacity
                            onPress={() => onToggleFlag(event.eventId)}
                            style={styles.modalActionButton}
                          >
                            <Text style={styles.modalActionText}>
                              {isFlagged ? 'UNFLAG' : 'FLAG EVENT'}
                            </Text>
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>

      <FoodMenuBottomSheet
        isVisible={showFoodMenu}
        onClose={handleCloseFoodMenu}
        eventDescription={event?.description || ''}
        eventName={event?.name || ''}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 13,
  },
  expandedScaleFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  expandedScaledContents: {
    width: EXPANDED_CARD_WIDTH,
    height: EXPANDED_CARD_HEIGHT,
    overflow: 'visible',
  },
  expandedCard: {
    width: EXPANDED_CARD_WIDTH,
    height: EXPANDED_CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#373792',
    borderTopWidth: 4,
    borderTopColor: '#D7D7FF',
    overflow: 'visible',
    zIndex: 2,
  },
  expandedBottomInset: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#27266D',
  },
  expandedTabs: {
    position: 'absolute',
    top: -36,
    right: 11,
    flexDirection: 'row',
    gap: 8,
    zIndex: 1,
  },
  expandedTab: {
    width: 52,
    height: 52,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#D7D7D7',
    borderWidth: 2,
    borderColor: '#F2F2F2',
  },
  expandedScrollBar: {
    position: 'absolute',
    right: 11,
    top: 55,
    width: 9,
    height: 73,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  expandedPaperWrap: {
    position: 'absolute',
    left: 17,
    top: 28,
    width: 327,
    height: 380,
    borderRadius: 12,
    backgroundColor: '#BBBBB7',
    paddingTop: 18,
    paddingHorizontal: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
  },
  expandedPaper: {
    width: 307,
    height: 362,
    borderRadius: 6,
    backgroundColor: '#FDFDF9',
    overflow: 'hidden',
  },
  expandedPaperSideShade: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 10,
    zIndex: 4,
  },
  expandedPaperLeftShade: {
    left: 0,
  },
  expandedPaperRightShade: {
    right: 0,
  },
  expandedHeader: {
    height: 76,
    borderRadius: 4,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 8,
    zIndex: 1,
  },
  expandedTitle: {
    color: '#fff',
    fontFamily: 'Ethnocentric',
    fontSize: 16,
    lineHeight: 20,
  },
  expandedTitleBox: {
    height: 40,
    justifyContent: 'flex-end',
  },
  pinkRule: {
    marginTop: 5,
    width: 98,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F52DBC',
  },
  detailsScroll: {
    flex: 1,
  },
  detailsScrollContent: {
    paddingHorizontal: 11,
    paddingTop: 19,
    paddingBottom: 36,
  },
  expandedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minHeight: 22,
    marginBottom: 10,
  },
  expandedIconSlot: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedMetaText: {
    color: '#050505',
    fontFamily: 'Ethnocentric',
    fontSize: 17,
    lineHeight: 22,
    flexShrink: 1,
  },
  descriptionTitle: {
    marginTop: 7,
    marginBottom: 9,
    color: '#050505',
    fontFamily: 'Ethnocentric',
    fontSize: 13,
    lineHeight: 18,
  },
  descriptionText: {
    color: '#050505',
    fontFamily: 'ShareTechMono',
    fontSize: 14,
    lineHeight: 16,
  },
  expandedFooter: {
    position: 'absolute',
    left: 28,
    right: 31,
    top: 429,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedBadge: {
    width: 106,
    height: 28,
    borderRadius: 14,
    padding: 4,
  },
  expandedBadgeWide: {
    width: 106,
    height: 28,
    marginLeft: 25,
    borderRadius: 14,
    padding: 4,
  },
  expandedBadgeInner: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#150935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedBadgeText: {
    color: '#fff',
    fontFamily: 'Ethnocentric',
    fontSize: 9,
    lineHeight: 18,
  },
  pauseBars: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 5,
  },
  pauseBar: {
    width: 9,
    height: 33,
    borderRadius: 5,
    backgroundColor: '#B9C8FF',
  },
  actionRow: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: -56,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modalActionButton: {
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: '#150935',
    borderBottomWidth: 4,
    borderColor: '#F52DBC',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionText: {
    color: '#fff',
    fontFamily: 'Ethnocentric',
    fontSize: 10,
  },
});

export default EventDetailModal;
