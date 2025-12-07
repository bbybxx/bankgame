/**
 * Header Component for Home Screen
 * Displays user name with chevron and QR code button
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import { UserIcon, ChevronRightIcon, QRCodeIcon } from '../icons';
import { User } from '../../types';

interface HomeHeaderProps {
  user: User;
  onProfilePress?: () => void;
  onQRPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  user,
  onProfilePress,
  onQRPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onProfilePress}
        style={styles.profileButton}
      >
        <View style={styles.avatarContainer}>
          <UserIcon size={20} color={Colors.textPrimary} />
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <ChevronRightIcon size={20} color={Colors.textPrimary} />
      </TouchableOpacity>
      
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onQRPress}
        style={styles.qrButton}
      >
        <QRCodeIcon size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  userName: {
    ...Typography.bodySemibold,
    color: Colors.textPrimary,
    marginRight: 4,
  },
  qrButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
