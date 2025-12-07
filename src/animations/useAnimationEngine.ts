import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

/**
 * Animation Configuration
 * Timing presets and easing functions for consistent animations
 */
export const AnimationConfig = {
  timings: {
    fast: 200,      // Micro interactions
    normal: 300,    // Standard transitions
    slow: 500,      // Deliberate animations
    pulse: 1000,    // Continuous effects (pulse cycle)
  },
  easings: {
    easeIn: Easing.in(Easing.quad),
    easeOut: Easing.out(Easing.quad),
    easeInOut: Easing.inOut(Easing.quad),
    linear: Easing.linear,
    elasticOut: Easing.bezier(0.34, 1.56, 0.64, 1),
  },
};

/**
 * Fade in animation hook
 * Animates opacity from 0 to 1
 * @returns Animated style for use with Animated.View
 */
export const useFadeInAnimation = () => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: AnimationConfig.timings.normal,
      easing: AnimationConfig.easings.easeOut,
    });
  }, [opacity]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }), [opacity]);
};

/**
 * Pop animation hook
 * Combines scale (0.8 -> 1) and opacity fade
 * Creates a "pop" effect on mount
 * @returns Animated style for use with Animated.View
 */
export const usePopAnimation = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: AnimationConfig.timings.normal,
      easing: AnimationConfig.easings.elasticOut,
    });
    opacity.value = withTiming(1, {
      duration: AnimationConfig.timings.normal,
      easing: AnimationConfig.easings.easeOut,
    });
  }, [scale, opacity]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }), [scale, opacity]);
};

/**
 * Pulse animation hook
 * Creates infinite scaling pulse effect
 * Used for Red Zone warning header
 * 
 * PERFORMANCE: Native thread execution, 60fps guaranteed
 * No JS blocking, can run indefinitely
 * 
 * @param {number} intensity - Scale intensity (0.05 = 5% pulse, 0.08 = 8% pulse)
 * @returns Animated style for use with Animated.View
 */
export const usePulseAnimation = (intensity = 0.05) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1 + intensity, {
          duration: AnimationConfig.timings.pulse / 2,
          easing: AnimationConfig.easings.easeInOut,
        }),
        withTiming(1, {
          duration: AnimationConfig.timings.pulse / 2,
          easing: AnimationConfig.easings.easeInOut,
        })
      ),
      -1,  // Infinite repeat
      true // Reverse
    );
  }, [scale]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }), [scale]);
};

/**
 * Slide up animation hook
 * Animates translateY from 50 to 0 with opacity fade
 * @returns Animated style for use with Animated.View
 */
export const useSlideUpAnimation = () => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: AnimationConfig.timings.normal,
      easing: AnimationConfig.easings.easeOut,
    });
    opacity.value = withTiming(1, {
      duration: AnimationConfig.timings.normal,
      easing: AnimationConfig.easings.easeOut,
    });
  }, [translateY, opacity]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }), [translateY, opacity]);
};

/**
 * Shake animation hook
 * Creates error state shake effect
 * Shakes ±10px horizontally 4 times
 * @returns Animated style for use with Animated.View
 */
export const useShakeAnimation = () => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(10, { duration: 50, easing: Easing.linear }),
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(10, { duration: 50, easing: Easing.linear }),
      withTiming(0, { duration: 50, easing: Easing.linear })
    );
  }, [translateX]);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }), [translateX]);
};

/**
 * Value change animation hook
 * Animates numeric values smoothly
 * Useful for balance updates, score changes
 * @param {number} targetValue - Target value to animate to
 * @param {number} duration - Animation duration in ms (default: normal)
 * @returns Animated shared value
 */
export const useValueChangeAnimation = (
  targetValue: number,
  duration = AnimationConfig.timings.normal
) => {
  const animatedValue = useSharedValue(targetValue);

  useEffect(() => {
    animatedValue.value = withTiming(targetValue, {
      duration,
      easing: AnimationConfig.easings.easeOut,
    });
  }, [targetValue, animatedValue]);

  return animatedValue;
};

/**
 * ANIMATION PERFORMANCE GUIDELINES
 * 
 * ✅ DO:
 * - Use Reanimated for continuous animations (pulse, scroll reactions)
 * - Use useNativeDriver=true for Animated API when available
 * - Test on low-end devices (iPhone SE, Pixel 4a)
 * - Profile with React DevTools Profiler
 * - Aim for 60 FPS (16ms per frame budget)
 * 
 * ❌ DON'T:
 * - Animate on JS thread (use Reanimated instead)
 * - Create complex calculations in animation loops
 * - Animate too many elements simultaneously
 * - Use opacity animations for show/hide (use display property)
 * - Forget to cleanup animations in useEffect
 * 
 * 📊 OPTIMIZATION:
 * - Use shared values for state that animates
 * - Memoize animated components with React.memo
 * - Use worklets for complex calculations
 * - Lazy load animated screens
 * - Test bundle size impact (Reanimated adds ~1MB)
 */
