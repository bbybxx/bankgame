import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useGameStore } from '../src/store/gameStore';
import { ToastManager, showToast } from '../src/components/ToastManager';

export default function RootLayout() {
  const { isGameOver, nextTurn, playerStats } = useGameStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isGameOver) {
      router.replace('/gameover');
    }
  }, [isGameOver]);

  // Web-only: Press '0' to advance time, '9' to add $100k
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === '0') {
          console.log('Debug: Advancing time via keyboard shortcut');
          nextTurn();
        } else if (e.key === '9') {
          console.log('Debug: Adding $100,000 for testing');
          // Use store setState to apply change atomically
          useGameStore.setState((state) => ({
            playerStats: { ...state.playerStats, balanceDebit: state.playerStats.balanceDebit + 100000 }
          }));
          showToast('Added $100,000 for testing', 'success');
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [nextTurn, playerStats]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ToastManager />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="gameover" options={{ gestureEnabled: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
