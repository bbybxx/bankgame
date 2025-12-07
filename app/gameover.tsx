import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';

export default function GameOverScreen() {
  const { gameOverReason, resetGame } = useGameStore();
  const router = useRouter();

  const handleRestart = () => {
    resetGame();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={64} color="#FF3B30" />
        </View>
        
        <Text style={styles.title}>Account Frozen</Text>
        <Text style={styles.reason}>{gameOverReason || "Financial services suspended due to policy violation."}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.subtext}>
          Please contact support to restore your access.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleRestart}>
          <Text style={styles.buttonText}>Contact Support (Restart)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#1E1E1E',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  reason: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    width: '100%',
    marginBottom: 24,
  },
  subtext: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
