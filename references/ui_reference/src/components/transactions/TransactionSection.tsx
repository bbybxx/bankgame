/**
 * Transaction Section Component
 * Groups transactions by date with a header
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../theme';
import { Transaction } from '../../types';
import { TransactionItem } from './TransactionItem';

interface TransactionSectionProps {
  title: string;
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
}

export const TransactionSection: React.FC<TransactionSectionProps> = ({
  title,
  transactions,
  onTransactionPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onPress={() => onTransactionPress?.(transaction)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
});
