/**
 * Expense Progress Bar Component
 * Displays a horizontal bar showing expense distribution by category
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { MonthlyExpenses } from '../../types';

interface ExpenseProgressBarProps {
  data: MonthlyExpenses;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH - Spacing.base * 2;
const BAR_HEIGHT = 8;
const GAP = 4;

export const ExpenseProgressBar: React.FC<ExpenseProgressBarProps> = ({ data }) => {
  // Calculate widths accounting for gaps
  const totalGaps = (data.categories.length - 1) * GAP;
  const availableWidth = BAR_WIDTH - totalGaps;
  
  const categoryWidths = data.categories.map((cat) => ({
    ...cat,
    width: (cat.percentage / 100) * availableWidth,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Expenses in <Text style={styles.month}>{data.month}</Text>
        </Text>
        <Text style={styles.total}>${data.total.toLocaleString()}</Text>
      </View>
      
      <View style={styles.barContainer}>
        {categoryWidths.map((cat, index) => (
          <View
            key={cat.category}
            style={[
              styles.segment,
              {
                width: cat.width,
                backgroundColor: cat.color,
                marginLeft: index === 0 ? 0 : GAP,
                borderTopLeftRadius: index === 0 ? BorderRadius.full : 0,
                borderBottomLeftRadius: index === 0 ? BorderRadius.full : 0,
                borderTopRightRadius: index === categoryWidths.length - 1 ? BorderRadius.full : 0,
                borderBottomRightRadius: index === categoryWidths.length - 1 ? BorderRadius.full : 0,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.large,
    color: Colors.textPrimary,
  },
  month: {
    color: Colors.primary,
  },
  total: {
    ...Typography.large,
    color: Colors.textPrimary,
  },
  barContainer: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  segment: {
    height: BAR_HEIGHT,
  },
});
