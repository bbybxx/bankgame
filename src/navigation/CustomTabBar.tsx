/**
 * Tab Bar Component
 * Custom styled bottom tab bar matching the design
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import {
  HomeIconFilled,
  HomeIcon,
  PaymentsIcon,
  HistoryIcon,
  AnalyticsIcon,
  ChatsIcon,
} from '../components/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const tabIcons: { [key: string]: { active: React.FC<{ size?: number; color?: string }>; inactive: React.FC<{ size?: number; color?: string }> } } = {
  Home: { active: HomeIconFilled, inactive: HomeIcon },
  Payments: { active: PaymentsIcon, inactive: PaymentsIcon },
  History: { active: HistoryIcon, inactive: HistoryIcon },
  Analytics: { active: AnalyticsIcon, inactive: AnalyticsIcon },
  Chats: { active: ChatsIcon, inactive: ChatsIcon },
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconConfig = tabIcons[route.name];
          const IconComponent = isFocused
            ? iconConfig?.active || HomeIcon
            : iconConfig?.inactive || HomeIcon;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <IconComponent
                size={24}
                color={isFocused ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? Colors.primary : Colors.textSecondary },
                ]}
              >
                {typeof label === 'string' ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Home indicator bar for iOS-like design */}
      <View style={styles.homeIndicatorContainer}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  tabLabel: {
    ...Typography.tiny,
    marginTop: 4,
  },
  homeIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.textPrimary,
  },
});
