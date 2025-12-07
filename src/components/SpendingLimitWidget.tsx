import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SpendingLimitWidgetProps {
  limit: number;
  spent: number; // We might need to calculate this from transactions
}

export const SpendingLimitWidget: React.FC<SpendingLimitWidgetProps> = ({ limit, spent }) => {
  const percentage = Math.min(100, (spent / limit) * 100);
  const remaining = Math.max(0, limit - spent);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Daily Limit</Text>
        <Text style={styles.value}>${limit}</Text>
      </View>

      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.spent}>${spent.toFixed(0)} spent</Text>
        <Text style={styles.remaining}>${remaining.toFixed(0)} left</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'baseline',
  },
  label: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spent: {
    fontSize: 12,
    color: '#888',
  },
  remaining: {
    fontSize: 12,
    color: '#4CD964',
    fontWeight: '600',
  },
});
