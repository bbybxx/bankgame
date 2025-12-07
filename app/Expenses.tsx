import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../src/theme';

export default function ExpensesRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Expenses Screen - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
  },
});
