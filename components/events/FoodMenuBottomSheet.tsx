import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import FoodMenu from './FoodMenu';

interface FoodMenuBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  eventDescription: string;
  eventName: string;
}

export default function FoodMenuBottomSheet({
  isVisible,
  onClose,
  eventDescription,
  eventName,
}: FoodMenuBottomSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['85%'], []);
  const testDescription = `Join us for a delicious lunch from Shwarma Joint!

:food:
https://ooni.com/cdn/shop/articles/20220211142347-margherita-9920_ba86be55-674e-4f35-8094-2067ab41a671.jpg?v=1737104576&width=1080 | Pizza Margherita | Vegetarian, Contains Dairy

https://www.burgerartist.com/wp-content/uploads/2016/11/pizza-burger-thumb.jpg | Classic Burger | Contains Gluten, Beef

Caesar Salad | Vegetarian, Gluten-Free, Contains Eggs

https://ooni.com/cdn/shop/articles/20220211142347-margherita-9920_ba86be55-674e-4f35-8094-2067ab41a671.jpg?v=1737104576&width=1080 | Pizza Margherita | Vegetarian, Contains Dairy

:menu: https://www.shawarma-joint.com/  `;

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={onClose}
      />
    ),
    [onClose]
  );

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onDismiss={onClose}
      enableDynamicSizing={false}
      backgroundStyle={{
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleIndicatorStyle={{
        backgroundColor: '#fff',
        width: 40,
      }}
    >
      <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                fontFamily: 'ProRacing',
                color: '#fff',
                marginBottom: 4,
              }}
            >
              {eventName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Food Menu Content */}
        <FoodMenu description={eventDescription} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
