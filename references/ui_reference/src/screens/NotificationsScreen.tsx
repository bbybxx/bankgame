/**
 * Notifications Screen
 * Displays all notifications with filtering by category
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing } from '../theme';
import { RootStackParamList, Notification } from '../types';
import {
  NotificationHeader,
  FilterTabs,
  NotificationSection,
} from '../components';
import { notifications, notificationFilters } from '../data/mockData';

type NotificationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp;
}

interface GroupedNotifications {
  title: string;
  data: Notification[];
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') {
      return notifications;
    }
    return notifications.filter((n) => n.category === activeFilter);
  }, [activeFilter]);

  // Group notifications by date
  const groupedNotifications = useMemo((): GroupedNotifications[] => {
    const groups: { [key: string]: Notification[] } = {};
    
    filteredNotifications.forEach((notification) => {
      const date = new Date(notification.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey: string;
      
      if (date.toDateString() === today.toDateString()) {
        groupKey = `TODAY, ${date.getDate()} ${getMonthName(date.getMonth()).toUpperCase()}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = `YESTERDAY, ${date.getDate()} ${getMonthName(date.getMonth()).toUpperCase()}`;
      } else {
        groupKey = `${date.getDate()} ${getMonthName(date.getMonth()).toUpperCase()}, ${date.getFullYear()}`;
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });
    
    return Object.entries(groups).map(([title, data]) => ({
      title,
      data,
    }));
  }, [filteredNotifications]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <NotificationHeader
        onBackPress={handleBackPress}
        onEditPress={() => {}}
      />

      {/* Filter Tabs */}
      <FilterTabs
        tabs={notificationFilters}
        activeTab={activeFilter}
        onTabPress={setActiveFilter}
      />

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groupedNotifications.map((group) => (
          <NotificationSection
            key={group.title}
            title={group.title}
            notifications={group.data}
            onNotificationPress={(n) => console.log(n)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
});
