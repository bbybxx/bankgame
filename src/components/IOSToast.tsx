import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { triggerHaptic } from '../utils/haptics';

interface IOSToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  onDismiss?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const IOSToast: React.FC<IOSToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Entrance animation
    translateY.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, { duration: 250 });
    scale.value = withTiming(1, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });

    // Haptic feedback based on type
    if (type === 'success') {
      triggerHaptic('success');
    } else if (type === 'error') {
      triggerHaptic('error');
    } else if (type === 'warning') {
      triggerHaptic('warning');
    } else {
      triggerHaptic('impactLight');
    }

    // Auto dismiss
    const timer = setTimeout(() => {
      translateY.value = withTiming(-100, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.9, { duration: 300 });

      setTimeout(() => {
        onDismiss?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const getIcon = () => {
    const iconSize = 20;
    switch (type) {
      case 'success':
        return <CheckCircle size={iconSize} color={Colors.status.success} />;
      case 'error':
        return <XCircle size={iconSize} color={Colors.status.error} />;
      case 'warning':
        return <AlertCircle size={iconSize} color={Colors.status.warning} />;
      default:
        return <Info size={iconSize} color={Colors.text.primary} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return `${Colors.status.success}15`;
      case 'error':
        return `${Colors.status.error}15`;
      case 'warning':
        return `${Colors.status.warning}15`;
      default:
        return 'rgba(28, 28, 30, 0.9)';
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={[styles.content, { backgroundColor: getBackgroundColor() }]}>
            <View style={styles.iconContainer}>{getIcon()}</View>
            <Text style={styles.message}>{message}</Text>
          </View>
        </BlurView>
      ) : (
        <View style={[styles.content, { backgroundColor: Colors.surface.card.elevated }]}>
          <View style={styles.iconContainer}>{getIcon()}</View>
          <Text style={styles.message}>{message}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
    elevation: 9999,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: Spacing.base,
  },
  message: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});
