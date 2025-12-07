/**
 * Notification Section Component
 * Groups notifications by date with a header
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import { Notification } from '../../types';
import { NotificationItem } from './NotificationItem';

interface NotificationSectionProps {
  title: string;
  notifications: Notification[];
  onNotificationPress?: (notification: Notification) => void;
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  notifications,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onPress={() => onNotificationPress?.(notification)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.tiny,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
});
