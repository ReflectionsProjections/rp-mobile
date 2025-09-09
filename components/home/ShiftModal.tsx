import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { useThemeColor } from '@/lib/theme';
import { ShiftCard } from '@/api/types';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  shift: ShiftCard | null;
  onClose: () => void;
  onToggleAcknowledge: (shiftId: string) => void;
  disabled?: boolean;
};

export default function ShiftModal({ visible, shift, onClose, onToggleAcknowledge, disabled }: Props) {
  const themeColor = useThemeColor();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <ThemedText variant="h3" style={styles.title}>
            {shift?.title || 'Shift'}
          </ThemedText>
          {shift && (
            <>
              <ThemedText variant="body" className="font-magistral">Role: {shift.role}</ThemedText>
              <ThemedText variant="body" className="font-magistral">Time: {shift.time}</ThemedText>
              <ThemedText variant="body" className="font-magistral">Location: {shift.location}</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <ThemedText variant="body" className="font-magistral">Acknowledged:</ThemedText>
                {shift.acknowledged ? (
                  <FontAwesome name="check-circle" size={22} color={themeColor} />
                ) : (
                  <FontAwesome name="exclamation-circle" size={22} color="#ff3b30" />
                )}
              </View>
            </>
          )}

          <View style={styles.row}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <ThemedText style={styles.buttonText}>Close</ThemedText>
            </TouchableOpacity>
            {shift && (
              <TouchableOpacity
                onPress={() => onToggleAcknowledge(shift.id)}
                style={[styles.button, { backgroundColor: disabled ? '#999' : themeColor }]}
                disabled={disabled}
              >
                <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
                  {shift.acknowledged ? 'Unacknowledge' : 'Acknowledge'}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 4
  },
  title: {
    color: '#000',
    marginBottom: 8,
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  buttonText: {
    color: '#000',
    fontFamily: 'magistral-medium',
  },
});


