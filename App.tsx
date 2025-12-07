/**
 * Finance App - Main Entry Point
 * A premium finance tracking application with elegant dark theme
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { Colors } from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.background}
        translucent={false}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
