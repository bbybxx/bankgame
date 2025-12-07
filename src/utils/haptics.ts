import {
  impactAsync,
  notificationAsync,
  selectionAsync,
  ImpactFeedbackStyle,
  NotificationFeedbackType,
} from 'expo-haptics';

/**
 * Haptic Feedback System
 * Provides vibration feedback for user interactions
 * Includes error handling for devices without haptic support
 */

export const HapticFeedback = {
  /**
   * Light tap - used for button presses and interactions
   */
  tapLight: async () => {
    try {
      await impactAsync(ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail on unsupported devices
    }
  },

  /**
   * Medium tap - used for form submissions
   */
  tapMedium: async () => {
    try {
      await impactAsync(ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silently fail on unsupported devices
    }
  },

  /**
   * Heavy tap - used for critical events (purchase, promotion, Red Zone)
   */
  tapHeavy: async () => {
    try {
      await impactAsync(ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Silently fail on unsupported devices
    }
  },

  /**
   * Success notification pattern - short-long-short pulse
   */
  success: async () => {
    try {
      await notificationAsync(NotificationFeedbackType.Success);
    } catch (error) {
      // Silently fail on unsupported devices
    }
  },

  /**
   * Warning notification pattern - double tap
   */
  warning: async () => {
    try {
      await notificationAsync(NotificationFeedbackType.Warning);
    } catch (error) {
      // Silently fail on unsupported devices
    }
  },

  /**
   * Error notification pattern - triple tap
   */
  error: async () => {
    try {
      await notificationAsync(NotificationFeedbackType.Error);
    } catch (error) {
      // Silently fail on unsupported devices
    }
  },

  /**
   * Selection haptic - used for picker/slider changes
   */
  selection: async () => {
    try {
      await selectionAsync();
    } catch (error) {
      // Silently fail on unsupported devices
    }
  },
};

/**
 * Trigger haptic feedback by type
 * Safe wrapper with error handling
 * @param {string} type - Haptic type: 'tapLight', 'tapMedium', 'tapHeavy', 'success', 'warning', 'error', 'selection'
 */
export const triggerHaptic = async (type: string) => {
  try {
    switch (type) {
      case 'impactLight':
      case 'tapLight':
        await HapticFeedback.tapLight();
        break;
      case 'impactMedium':
      case 'tapMedium':
        await HapticFeedback.tapMedium();
        break;
      case 'tapHeavy':
        await HapticFeedback.tapHeavy();
        break;
      case 'success':
        await HapticFeedback.success();
        break;
      case 'warning':
        await HapticFeedback.warning();
        break;
      case 'error':
        await HapticFeedback.error();
        break;
      case 'selection':
        await HapticFeedback.selection();
        break;
      default:
        console.warn(`Unknown haptic type: ${type}`);
    }
  } catch (error) {
    console.warn('Haptic feedback not supported on this device');
  }
};

/**
 * HAPTIC MAPPING TABLE
 * Maps game actions to haptic feedback types
 *
 * | Action | Haptic Type |
 * |--------|------------|
 * | Button Press | tapLight |
 * | Slider Change | selection |
 * | Purchase Success | tapHeavy + success |
 * | Low Balance Warning | warning |
 * | Red Zone Activation | tapHeavy + warning |
 * | Purchase Rejected | error |
 * | Promotion Success | tapHeavy + success |
 * | Layoff/Fired | tapHeavy + error |
 * | Game Over | tapHeavy + error |
 * | Refinance Approved | tapMedium + success |
 * | Loan Paid Off | tapHeavy + success |
 * | Stress High | warning |
 * | Happiness Low | warning |
 * | Investment Gain | success |
 * | Investment Loss | error |
 * | Event Triggered | tapMedium |
 * | Pull to Refresh Start | tapLight |
 * | Pull to Refresh Complete | success |
 */
