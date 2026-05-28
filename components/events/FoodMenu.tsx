import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodItem {
  imageUrl?: string;
  name: string;
  dietaryRestrictions: string[];
}

interface FoodMenuData {
  items: FoodItem[];
  menuUrl?: string;
}

export function parseFoodMenu(description: string): FoodMenuData | null {
  if (!description.includes(':food:')) {
    return null;
  }

  const lines = description.split('\n');
  const foodStartIndex = lines.findIndex((line) => line.trim() === ':food:');

  if (foodStartIndex === -1) {
    return null;
  }

  const items: FoodItem[] = [];
  let menuUrl: string | undefined;

  for (let i = foodStartIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith(':')) {
      if (line.startsWith(':menu:')) {
        menuUrl = line.replace(':menu:', '').trim();
      }
      break;
    }

    if (!line) continue;

    const parts = line.split('|').map((part) => part.trim());
    if (parts.length >= 2) {
      let imageUrl: string | undefined;
      let name: string;
      let restrictions: string;

      if (parts.length === 3) {
        // Format: imageUrl | name | restrictions
        [imageUrl, name, restrictions] = parts;
      } else {
        // Format: name | restrictions (no image)
        [name, restrictions] = parts;
      }

      const dietaryRestrictions = restrictions.split(',').map((r) => r.trim());

      items.push({
        imageUrl,
        name,
        dietaryRestrictions,
      });
    }
  }

  return items.length > 0 ? { items, menuUrl } : null;
}

function getDietaryBadgeColor(restriction: string): string {
  const lowerRestriction = restriction.toLowerCase();

  if (lowerRestriction.includes('veg')) return '#4ade80'; // green
  if (lowerRestriction.includes('contains')) return '#f97316'; // orange
  if (lowerRestriction.includes('gluten')) return '#eab308'; // yellow
  if (lowerRestriction.includes('dairy')) return '#06b6d4'; // cyan

  return '#6b7280'; // gray
}

function FoodMenuItem({ item }: { item: FoodItem }) {
  return (
    <View
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={{
            width: '100%',
            height: 160,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
          resizeMode="cover"
        />
      )}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'magistral-medium',
            color: '#fff',
            marginBottom: 12,
          }}
        >
          {item.name}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {item.dietaryRestrictions.map((restriction, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: getDietaryBadgeColor(restriction),
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: '600',
                }}
              >
                {restriction}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function FoodMenu({ description }: { description: string }) {
  const foodMenu = parseFoodMenu(description);

  const handleMenuPress = () => {
    if (foodMenu && foodMenu.menuUrl) {
      Linking.openURL(foodMenu.menuUrl);
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 50 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: 'ProRacing',
            color: '#fff',
          }}
        >
          Food Menu
        </Text>
        {foodMenu && foodMenu.menuUrl && (
          <TouchableOpacity
            onPress={handleMenuPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'rgba(59, 130, 246, 0.3)',
            }}
          >
            <Text
              style={{
                color: '#60a5fa',
                fontSize: 14,
                fontFamily: 'Inter',
                marginRight: 6,
              }}
            >
              Full Menu
            </Text>
            <Ionicons name="open-outline" size={16} color="#60a5fa" />
          </TouchableOpacity>
        )}
      </View>

      <View>
        {foodMenu && foodMenu.items && foodMenu.items.length > 0 ? (
          foodMenu.items.map((item: FoodItem, index: number) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <FoodMenuItem item={item} />
            </View>
          ))
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Magistral', fontWeight: '600' }}>
            No items available :/
          </Text>
        )}
      </View>
    </View>
  );
}
