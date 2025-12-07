/**
 * Add Card Button Component
 * A button styled like a card to add new cards
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../theme';
import { PlusIcon } from '../icons';

interface AddCardButtonProps {
  onPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Match card height from BankCard component
const CARD_HEIGHT = 90;
const BUTTON_SIZE = 36;

export const AddCardButton: React.FC<AddCardButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.plusButton}>
        <PlusIcon size={20} color={Colors.textPrimary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BUTTON_SIZE,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
