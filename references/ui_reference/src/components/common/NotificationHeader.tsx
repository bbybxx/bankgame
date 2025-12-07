/**
 * Notification Header Component
 * Header for notifications screen with back button and edit action
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import { ChevronLeftIcon, EditIcon } from '../icons';

interface NotificationHeaderProps {
  onBackPress?: () => void;
  onEditPress?: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onBackPress,
  onEditPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onBackPress}
        style={styles.backButton}
      >
        <ChevronLeftIcon size={28} color={Colors.primary} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Notifications</Text>
      
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onEditPress}
        style={styles.editButton}
      >
        <EditIcon size={22} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.large,
    color: Colors.textPrimary,
  },
  editButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
