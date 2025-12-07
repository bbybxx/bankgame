/**
 * Category Navigation Component
 * Horizontal navigation for Travel, Delivery, Bonuses, Support
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { TravelIcon, DeliveryIcon, BonusesIcon, SupportIcon } from '../icons';

interface CategoryNavProps {
  onCategoryPress?: (category: string) => void;
}

const categories = [
  { id: 'travel', label: 'Travel', Icon: TravelIcon },
  { id: 'delivery', label: 'Delivery', Icon: DeliveryIcon },
  { id: 'bonuses', label: 'Bonuses', Icon: BonusesIcon },
  { id: 'support', label: 'Support', Icon: SupportIcon },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({ onCategoryPress }) => {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          activeOpacity={0.7}
          onPress={() => onCategoryPress?.(category.id)}
          style={styles.categoryItem}
        >
          <View style={styles.iconContainer}>
            <category.Icon size={24} color={Colors.primary} />
          </View>
          <Text style={styles.label}>{category.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  categoryItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
