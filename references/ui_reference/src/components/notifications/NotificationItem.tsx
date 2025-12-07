/**
 * Notification Item Component
 * Displays a single notification with icon, title, description, and optional amount
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { Notification } from '../../types';
import { TransferIcon, GlobeIcon, ShieldIcon } from '../icons';

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const formatAmount = (amount: number, isIncome: boolean): string => {
    const sign = isIncome ? '+' : '-';
    return `${sign}$${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const getCategoryLabel = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const renderIcon = () => {
    // Payment notifications with avatar
    if (notification.category === 'payments' && notification.amount !== undefined) {
      const isIncome = notification.isIncome ?? false;
      return (
        <View style={[styles.avatarContainer, isIncome && styles.avatarIncome]}>
          <View style={styles.avatarInner}>
            {isIncome ? (
              <View style={styles.incomeAvatar}>
                <Text style={styles.incomeAvatarText}>A</Text>
              </View>
            ) : (
              <TransferIcon size={20} color={Colors.primary} />
            )}
          </View>
        </View>
      );
    }
    
    // Travel icon
    if (notification.icon === 'globe' || notification.category === 'travel') {
      return (
        <View style={styles.iconContainer}>
          <GlobeIcon size={24} color={Colors.primary} />
        </View>
      );
    }
    
    // Security/System icon
    if (notification.icon === 'shield' || notification.category === 'system') {
      return (
        <View style={styles.iconContainer}>
          <ShieldIcon size={24} color={Colors.info} />
        </View>
      );
    }
    
    return (
      <View style={styles.iconContainer}>
        <TransferIcon size={24} color={Colors.primary} />
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.iconWrapper}>
        {renderIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        
        {notification.amount !== undefined && (
          <Text style={[
            styles.amount,
            notification.isIncome ? styles.incomeAmount : styles.expenseAmount
          ]}>
            {formatAmount(notification.amount, notification.isIncome ?? false)}
          </Text>
        )}
        
        {notification.cardInfo && (
          <Text style={styles.cardInfo}>{notification.cardInfo}</Text>
        )}
        
        {notification.balance !== undefined && (
          <Text style={styles.balance}>${notification.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        )}
        
        {notification.description && (
          <Text style={styles.description} numberOfLines={2}>
            {notification.description}
          </Text>
        )}
        
        <Text style={styles.dateCategory}>
          {formatDate(notification.date)} · {getCategoryLabel(notification.category)}
        </Text>
      </View>
      
      {notification.isUnread && (
        <View style={styles.unreadDot} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    marginRight: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    overflow: 'hidden',
  },
  avatarIncome: {
    backgroundColor: 'transparent',
  },
  avatarInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeAvatarText: {
    ...Typography.bodySemibold,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.bodySemibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  amount: {
    ...Typography.bodySemibold,
    marginBottom: 4,
  },
  incomeAmount: {
    color: Colors.success,
  },
  expenseAmount: {
    color: Colors.primary,
  },
  cardInfo: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  balance: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dateCategory: {
    ...Typography.tiny,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
