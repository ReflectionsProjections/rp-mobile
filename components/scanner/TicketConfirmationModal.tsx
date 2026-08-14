import React from 'react';
import { View, Text, Modal, Pressable, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import SealCheck from '@/assets/scanner/seal_check.svg';
import NameBracket from '@/assets/scanner/name_bracket.svg';
import StickerCurl from '@/assets/scanner/sticker_curl.svg';
import StickerBlob from '@/assets/scanner/sticker_blob.svg';
import StickerTicketEnd from '@/assets/scanner/sticker_ticket_end.svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Card is authored at Figma coordinates (291x340 on a 402pt-wide frame) and
// scaled uniformly to the current screen width.
const CARD_W = 291;
const CARD_H = 340;
const SCALE = Math.min(1, SCREEN_WIDTH / 402);

const PINK = '#ff4ccc';
const LAVENDER = '#b9c8ff';

interface TicketConfirmationModalProps {
  visible: boolean;
  eventName: string;
  points: number | null;
  onClose: () => void;
}

function Dashes() {
  return (
    <View className="flex-row justify-between" style={{ width: 216 }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View
          key={i}
          style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: 'white' }}
        />
      ))}
    </View>
  );
}

export default function TicketConfirmationModal({
  visible,
  eventName,
  points,
  onClose,
}: TicketConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={12} tint="dark" className="flex-1">
        <Pressable
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(37,37,37,0.5)' }}
          onPress={onClose}
        >
          <View style={{ width: CARD_W, height: CARD_H, transform: [{ scale: SCALE }] }}>
            {/* Lavender ticket tab sticking up behind the card */}
            <View
              style={{
                position: 'absolute',
                left: 222,
                top: -37,
                width: 40,
                height: 37,
                backgroundColor: LAVENDER,
              }}
            />

            {/* Ticket card body */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: CARD_W,
                height: CARD_H,
                backgroundColor: PINK,
                borderRadius: 24,
              }}
            />

            {/* Side notches over the dashed divider */}
            <View
              style={{
                position: 'absolute',
                left: -14,
                top: 221,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#131313',
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: -14,
                top: 221,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#131313',
              }}
            />

            {/* Seal / check badge */}
            <View style={{ position: 'absolute', left: 88, top: 13 }}>
              <SealCheck width={116} height={116} />
            </View>

            {/* Event name with corner brackets */}
            <View
              style={{
                position: 'absolute',
                left: 24,
                top: 138,
                width: CARD_W - 48,
                height: 66,
                justifyContent: 'center',
              }}
            >
              <NameBracket
                width={24}
                height={25}
                color="white"
                style={{ position: 'absolute', left: 4, top: 0 }}
              />
              <NameBracket
                width={24}
                height={25}
                color="white"
                style={{
                  position: 'absolute',
                  right: 4,
                  bottom: 0,
                  transform: [{ rotate: '180deg' }],
                }}
              />
              <Text
                numberOfLines={2}
                adjustsFontSizeToFit
                className="text-white text-center uppercase"
                style={{
                  fontFamily: 'Ethnocentric',
                  fontSize: 17,
                  lineHeight: 22,
                  paddingHorizontal: 30,
                }}
              >
                {eventName}
              </Text>
            </View>

            {/* Dashed divider */}
            <View style={{ position: 'absolute', left: 38, top: 233 }}>
              <Dashes />
            </View>

            {/* Earned points */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 259,
                alignItems: 'center',
              }}
            >
              <Text
                className="text-white text-center"
                style={{ fontFamily: 'ShareTechMono', fontSize: 16 }}
              >
                You’ve Earned
              </Text>
              {points != null && (
                <View
                  className="items-center justify-center"
                  style={{
                    marginTop: 7,
                    paddingHorizontal: 35,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: '#310f78',
                  }}
                >
                  <Text style={{ fontWeight: '700', fontSize: 16, color: 'white' }}>
                    {points} pts
                  </Text>
                </View>
              )}
            </View>

            {/* Sticker breaking through the top-right corner */}
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: 227, top: 18.9, width: 48, height: 48 }}
            >
              <View
                style={{
                  position: 'absolute',
                  left: (48 - 35.6) / 2,
                  top: (48 - 72.3) / 2,
                  transform: [{ rotate: '135deg' }],
                }}
              >
                <StickerCurl width={35.6} height={72.3} />
              </View>
            </View>
            <StickerBlob
              pointerEvents="none"
              width={43.2}
              height={52}
              style={{ position: 'absolute', left: 229.9, top: 19.1 }}
            />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 237.7,
                top: -31,
                width: 77,
                height: 83.3,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 74.3,
                  backgroundColor: LAVENDER,
                  transform: [{ rotate: '37.6deg' }],
                }}
              />
            </View>
            <StickerTicketEnd
              pointerEvents="none"
              width={46.7}
              height={43.8}
              style={{ position: 'absolute', left: 268, top: -31.2 }}
            />
            {/* Pink cap on the straight ticket tab */}
            <View
              style={{
                position: 'absolute',
                left: 222,
                top: -37,
                width: 40,
                height: 24,
                backgroundColor: PINK,
              }}
            />
          </View>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
