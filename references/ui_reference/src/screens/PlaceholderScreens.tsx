/**
 * Placeholder Screens for Tab Navigation
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../theme';

interface PlaceholderScreenProps {
  title: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title }) => (
  <SafeAreaView style={styles.container} edges={['top']}>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  </SafeAreaView>
);

export const PaymentsScreen: React.FC = () => (
  <PlaceholderScreen title="Payments" />
);

export const HistoryScreen: React.FC = () => (
  <PlaceholderScreen title="History" />
);

export const AnalyticsScreen: React.FC = () => (
  <PlaceholderScreen title="Analytics" />
);

export const ChatsScreen: React.FC = () => (
  <PlaceholderScreen title="Chats" />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
