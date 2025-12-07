/**
 * Transaction Item Component
 * Displays a single transaction with icon, title, category, amount, and date
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Transaction } from '../../types';
import { TransferIcon, StarbucksLogo, NetflixLogo } from '../icons';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
  const formatAmount = (amount: number, isIncome: boolean): string => {
    const prefix = isIncome ? '+' : '';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const transDate = new Date(date);
    
    const hours = transDate.getHours().toString().padStart(2, '0');
    const minutes = transDate.getMinutes().toString().padStart(2, '0');
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[transDate.getMonth()];
    const day = transDate.getDate();
    
    return `${month} ${day}, ${hours}:${minutes}`;
  };

  const renderIcon = () => {
    if (transaction.iconUrl === 'starbucks') {
      return <StarbucksLogo size={40} />;
    }
    if (transaction.iconUrl === 'netflix') {
      return <NetflixLogo size={40} />;
    }
    
    // Default transfer icon with avatar placeholder
    return (
      <View style={styles.avatarContainer}>
        <View style={styles.avatarInner}>
          <Text style={styles.avatarText}>
            {transaction.title.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <Text style={styles.title} numberOfLines={1}>
            {transaction.title}
          </Text>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(transaction.type) }]} />
            <Text style={styles.category}>{transaction.category}</Text>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <Text style={[styles.amount, transaction.isIncome && styles.incomeAmount]}>
            {formatAmount(transaction.amount, transaction.isIncome)}
          </Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getCategoryColor = (type: string): string => {
  switch (type) {
    case 'money-transfer':
      return Colors.primary;
    case 'food':
      return Colors.success;
    case 'entertainment':
      return Colors.error;
    default:
      return Colors.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarInner: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Typography.bodySemibold,
    color: Colors.textPrimary,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  title: {
    ...Typography.bodySemibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  category: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  amount: {
    ...Typography.bodySemibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  incomeAmount: {
    color: Colors.success,
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
