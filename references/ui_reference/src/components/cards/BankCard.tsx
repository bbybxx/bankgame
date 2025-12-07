/**
 * Bank Card Component
 * Displays a stylized bank card with balance and card info
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { BankCard as BankCardType } from '../../types';
import { MastercardIcon } from '../icons';

interface BankCardProps {
  card: BankCardType;
  isActive?: boolean;
  onPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Card dimensions matching Figma design - 2 cards + add button visible
const CARD_WIDTH = 140;
const CARD_HEIGHT = 90;

export const BankCard: React.FC<BankCardProps> = ({ card, isActive = false, onPress }) => {
  const formatBalance = (balance: number): string => {
    return `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCardGradient = (): [string, string] => {
    switch (card.cardColor) {
      case 'orange':
        return ['#FF6B00', '#FF8534'];
      case 'gray':
        return ['#2C2C2E', '#3A3A3C'];
      default:
        return ['#1C1C1E', '#2C2C2E'];
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, isActive && styles.activeCard]}
    >
      <LinearGradient
        colors={getCardGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.topRow}>
            <MastercardIcon size={20} />
          </View>
          
          <View style={styles.balanceContainer}>
            <Text style={[styles.balance, card.cardColor === 'gray' && styles.grayCardText]}>
              {formatBalance(card.balance)}
            </Text>
          </View>
          
          <View style={styles.bottomRow}>
            <Text style={[styles.cardType, card.cardColor === 'gray' && styles.grayCardSecondaryText]}>
              {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
            </Text>
            <Text style={[styles.cardNumber, card.cardColor === 'gray' && styles.grayCardSecondaryText]}>
              •• {card.lastFourDigits}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  activeCard: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    padding: Spacing.sm,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  balanceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardNumber: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  grayCardText: {
    color: Colors.textPrimary,
  },
  grayCardSecondaryText: {
    color: Colors.textSecondary,
  },
});
