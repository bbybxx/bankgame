# 🎨 Frontend Architecture & Design System v2
## Bank Game - React Native (Expo) Complete Frontend Blueprint

> Production-grade fintech UI based on Monzo/Revolut aesthetic with comprehensive data binding, animations, and haptic feedback.

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Component Library](#3-component-library)
4. [Screen Specifications](#4-screen-specifications)
5. [Data Binding & State Flow](#5-data-binding--state-flow)
6. [Animations & Haptics](#6-animations--haptics)
7. [Navigation Structure](#7-navigation-structure)

---

## 1. Design System

### 1.1 Color Palette (Dark Theme for OLED)

```typescript
// src/theme/colors.ts
export const Colors = {
  // Primary (Accent)
  primary: '#FF6B00',          // Orange - CTA buttons, highlights
  primaryLight: '#FF8534',     // Lighter shade for hover states
  primaryDark: '#E55A00',      // Darker shade for pressed states
  
  // Backgrounds (OLED optimized)
  background: '#0D0D0D',       // True black (0.5% luminosity)
  backgroundCard: '#1A1A1A',   // Card backgrounds (~2% luminosity)
  backgroundElevated: '#252525', // Modal/overlay backgrounds (~4% luminosity)
  
  // Surfaces
  surface: '#1C1C1E',          // Interactive elements
  surfaceLight: '#2C2C2E',     // Elevated surfaces
  surfaceElevated: '#3A3A3C',  // Top surfaces
  
  // Text
  textPrimary: '#FFFFFF',      // Primary text
  textSecondary: '#8E8E93',    // Secondary/helper text
  textTertiary: '#636366',     // Tertiary/disabled text
  textDisabled: '#48484A',     // Very disabled state
  
  // Status Colors
  success: '#34C759',          // Positive transactions, gains
  warning: '#FFD60A',          // Warnings, alerts
  error: '#FF3B30',            // Errors, losses, red zone
  critical: '#FF1744',         // Critical alerts
  info: '#0A84FF',             // Information
  
  // Transaction Colors
  income: '#34C759',           // Income transactions
  expense: '#FF3B30',          // Expense transactions
  transfer: '#FF6B00',         // Transfers
  
  // Sentiment Colors
  stressHigh: '#FF3B30',       // High stress (red)
  stressMedium: '#FFD60A',     // Medium stress (yellow)
  stressLow: '#34C759',        // Low stress (green)
  
  // Border
  border: '#38383A',           // Subtle borders
  borderLight: '#48484A',      // Light borders
  borderAccent: '#FF6B00',     // Accent borders
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.8)',
};
```

### 1.2 Typography

```typescript
// src/theme/typography.ts
export const Typography = {
  // DISPLAY - Large numbers (balance, amounts)
  displayLarge: {
    fontSize: 48,
    fontWeight: '700',           // Bold
    lineHeight: 56,
    letterSpacing: -0.5,
    fontFamily: '-apple-system',
  },
  
  displayMedium: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.2,
  },
  
  displaySmall: {
    fontSize: 28,
    fontWeight: '600',           // Semibold
    lineHeight: 34,
  },
  
  // HEADLINE - Section titles
  headlineLarge: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
  },
  
  headlineMedium: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  
  // TITLE - Component titles
  titleLarge: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  
  titleMedium: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  
  titleSmall: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  
  // BODY - Main content
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',           // Regular
    lineHeight: 24,
  },
  
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  
  // LABEL - Small labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',           // Medium
    lineHeight: 20,
  },
  
  labelMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  
  labelSmall: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
};
```

### 1.3 Spacing & Layout

```typescript
// src/theme/spacing.ts
export const Spacing = {
  // Base unit: 4px
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  
  // Screen padding
  screenPadding: 12,
  screenPaddingLarge: 16,
  
  // Component padding
  buttonPadding: 12,
  cardPadding: 16,
  inputPadding: 12,
};

export const BorderRadius = {
  xs: 4,      // Subtle corners
  sm: 8,      // Small radius
  md: 12,     // Medium radius
  lg: 16,     // Large radius
  xl: 20,     // Extra large
  full: 9999, // Completely round
};

export const Elevation = {
  // iOS shadows
  ios: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  },
  // Android elevation
  android: {
    small: { elevation: 2 },
    medium: { elevation: 4 },
    large: { elevation: 8 },
  },
};
```

### 1.4 Animations

```typescript
// src/theme/animations.ts
export const AnimationConfig = {
  // Durations
  micro: 150,          // 150ms - Quick feedback
  short: 250,          // 250ms - Standard interaction
  medium: 400,         // 400ms - Noticeable transition
  long: 600,           // 600ms - Dramatic effect
  
  // Easing curves
  easing: {
    default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',      // Smooth
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Opacity transitions
  fadeIn: 150,
  fadeOut: 150,
  
  // Scale transitions
  scaleIn: 200,
  scaleOut: 150,
};
```

---

## 2. Architecture & Technology Stack

### 2.1 Tech Stack

| Layer | Technology | Reasoning |
|-------|-----------|-----------|
| **Framework** | React Native (Expo) | Already configured, native performance |
| **Styling** | React Native StyleSheet | Optimal performance, no runtime overhead |
| **State** | Zustand + persist() | Minimal boilerplate, perfect for game state |
| **Navigation** | Expo Router (file-based) | Built-in, type-safe, simple routing |
| **Animations** | React Native Animated + Reanimated | Lightweight, gesture support for advanced |
| **Icons** | Lucide React Native | Comprehensive set, lightweight, consistent |
| **Storage** | AsyncStorage (via Zustand) | Native persistence, sufficient for game |
| **Haptics** | expo-haptics | Native haptic engine, great user feedback |

### 2.2 Project Structure

```
src/
├── animations/
│   ├── index.ts                    # Animation presets
│   └── useAnimationEngine.ts       # Reanimated hooks
│
├── components/
│   ├── common/                     # Reusable UI components
│   │   ├── Header.tsx              # App header with profile + notifications
│   │   ├── BalanceDisplay.tsx      # Large balance with trend
│   │   ├── MetricBadge.tsx         # Metric with color coding
│   │   ├── ActionButton.tsx        # Primary CTA button
│   │   ├── Toast.tsx               # Toast notification
│   │   ├── RedZoneWarning.tsx      # Red zone alert overlay
│   │   └── LoadingSpinner.tsx
│   │
│   ├── cards/
│   │   ├── BankCard.tsx            # Horizontal scrollable card
│   │   ├── StatCard.tsx            # Stat card with trend
│   │   ├── EventCard.tsx           # Event with actions
│   │   └── LoanCard.tsx            # Loan with refinance button
│   │
│   ├── modals/
│   │   ├── BuyAssetModal.tsx       # Housing/vehicle purchase
│   │   ├── PayDownDebtModal.tsx    # Loan early payment
│   │   ├── RefinanceLoanModal.tsx  # Refinance options
│   │   ├── InvestModal.tsx         # Buy investment
│   │   ├── ApplyJobModal.tsx       # Job application
│   │   └── EventActionModal.tsx    # Event choice dialog
│   │
│   ├── sections/
│   │   ├── BalanceSection.tsx      # Balance + cards carousel
│   │   ├── MetricsSection.tsx      # Happiness, stress, prospects
│   │   ├── AssetsSection.tsx       # Housing, vehicle, investments
│   │   ├── LoansSection.tsx        # Active loans
│   │   ├── TransactionsSection.tsx # Recent transactions
│   │   ├── JobSection.tsx          # Job info + apply button
│   │   └── EventsSection.tsx       # Pending events
│   │
│   └── inputs/
│       ├── InputSlider.tsx         # Slider with numeric input
│       ├── AmountPicker.tsx        # Dollar amount input
│       └── SegmentedControl.tsx
│
├── screens/
│   ├── HomeScreen.tsx              # Main dashboard
│   ├── AssetsScreen.tsx            # Housing, vehicles, investments
│   ├── LoansScreen.tsx             # Debt management
│   ├── JobScreen.tsx               # Career + performance
│   ├── HistoryScreen.tsx           # Transaction history
│   ├── ChatsScreen.tsx             # NPC chats (reputations)
│   └── SettingsScreen.tsx
│
├── store/
│   └── gameStore.ts                # Zustand game state + actions
│
├── engine/
│   ├── gameLogic.ts                # All game logic (imported from backend)
│   └── eventSystem.ts              # Event generation
│
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── animations.ts
│
├── types/
│   └── index.ts                    # TS interfaces (mirrored from backend)
│
├── utils/
│   ├── haptics.ts                  # Haptic feedback utilities
│   ├── formatting.ts               # Number/currency formatting
│   └── analytics.ts                # Event tracking
│
└── navigation/
    ├── AppNavigator.tsx            # Main navigation setup
    └── CustomTabBar.tsx            # Custom bottom tab bar
```

---

## 3. Component Library

### 3.1 Header Component

```typescript
// src/components/common/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, User, ChevronRight } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

interface HeaderProps {
  title: string;
  userName: string;
  notificationCount?: number;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  userName,
  notificationCount = 0,
  onProfilePress,
  onNotificationsPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={onProfilePress}
          style={styles.profileButton}
          activeOpacity={0.7}
        >
          <View style={styles.avatar}>
            <User size={20} color={Colors.textPrimary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Hello</Text>
            <View style={styles.userRow}>
              <Text style={styles.userName}>{userName}</Text>
              <ChevronRight size={18} color={Colors.textPrimary} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onNotificationsPress}
        style={styles.notificationButton}
        activeOpacity={0.7}
      >
        <Bell size={24} color={Colors.primary} />
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  leftSection: {
    flex: 1,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  greeting: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    ...Typography.titleLarge,
    color: Colors.textPrimary,
    marginRight: Spacing.xs,
  },
  notificationButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...Typography.labelSmall,
    color: Colors.textPrimary,
    fontSize: 10,
  },
});
```

### 3.2 Balance Display Component

```typescript
// src/components/common/BalanceDisplay.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

interface BalanceDisplayProps {
  balance: number;
  previousBalance: number;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  previousBalance,
  isHidden = false,
  onToggleVisibility,
}) => {
  const scale = useSharedValue(1);
  const balanceTrend = balance - previousBalance;
  const isPositive = balanceTrend >= 0;

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 8,
      mass: 1,
      overshootClamping: true,
    });
  }, [balance]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatCurrency = (value: number) => {
    return `$${Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Total Balance</Text>
        <TouchableOpacity
          onPress={onToggleVisibility}
          activeOpacity={0.7}
        >
          {isHidden ? (
            <EyeOff size={20} color={Colors.textSecondary} />
          ) : (
            <Eye size={20} color={Colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.balanceContainer, animatedStyle]}>
        <Text style={styles.amount}>
          {isHidden ? '••••••' : formatCurrency(balance)}
        </Text>
      </Animated.View>

      <View style={styles.trendContainer}>
        <View
          style={[
            styles.trendBadge,
            {
              backgroundColor: isPositive
                ? Colors.success + '20'
                : Colors.error + '20',
            },
          ]}
        >
          {isPositive ? (
            <TrendingUp size={14} color={Colors.success} />
          ) : (
            <TrendingDown size={14} color={Colors.error} />
          )}
          <Text
            style={[
              styles.trendText,
              {
                color: isPositive ? Colors.success : Colors.error,
              },
            ]}
          >
            {isPositive ? '+' : ''}{formatCurrency(balanceTrend)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.screenPadding,
    marginVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.labelLarge,
    color: Colors.textSecondary,
  },
  balanceContainer: {
    marginBottom: Spacing.md,
  },
  amount: {
    ...Typography.displayLarge,
    color: Colors.textPrimary,
  },
  trendContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  trendText: {
    ...Typography.labelMedium,
  },
});
```

### 3.3 Action Button Component (with Disabled States)

```typescript
// src/components/common/ActionButton.tsx
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { AlertCircle } from 'lucide-react-native';
import { triggerHaptic } from '../../utils/haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

interface ActionButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  disabledReason?: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  disabled = false,
  disabledReason,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
  icon,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSharedValue(1);

  const handlePress = async () => {
    if (disabled) {
      await triggerHaptic('warning');
      return;
    }

    setIsPressed(true);
    await triggerHaptic('tapMedium');

    try {
      scale.value = withSpring(0.95, {
        damping: 10,
      });
      await onPress();
      scale.value = withSpring(1);
    } catch (error) {
      scale.value = withSpring(1);
      await triggerHaptic('error');
    } finally {
      setIsPressed(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const buttonStyle: ViewStyle = {
    ...getVariantStyle(variant, disabled),
    ...getSizeStyle(size),
    width: fullWidth ? '100%' : 'auto',
  };

  const textStyle: TextStyle = {
    ...getTextVariantStyle(variant, disabled),
    ...getSizeTextStyle(size),
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={handlePress}
          disabled={disabled || loading}
          activeOpacity={disabled ? 1 : 0.7}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={variant === 'primary' ? Colors.textPrimary : Colors.primary}
            />
          ) : (
            <View style={styles.content}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={textStyle}>{label}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {disabled && disabledReason && (
        <View style={styles.disabledReasonContainer}>
          <AlertCircle size={14} color={Colors.warning} />
          <Text style={styles.disabledReasonText}>{disabledReason}</Text>
        </View>
      )}
    </View>
  );
};

const getVariantStyle = (variant: string, disabled: boolean) => {
  const baseStyle = {
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  };

  if (disabled) {
    return {
      ...baseStyle,
      backgroundColor: Colors.surfaceLight,
      opacity: 0.5,
    };
  }

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: Colors.primary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
      };
    case 'danger':
      return {
        ...baseStyle,
        backgroundColor: Colors.error,
      };
    default:
      return baseStyle;
  }
};

const getTextVariantStyle = (variant: string, disabled: boolean) => {
  if (disabled) {
    return {
      ...Typography.titleLarge,
      color: Colors.textDisabled,
    };
  }

  switch (variant) {
    case 'primary':
      return {
        ...Typography.titleLarge,
        color: Colors.background,
        fontWeight: '600' as const,
      };
    case 'secondary':
      return {
        ...Typography.titleLarge,
        color: Colors.textPrimary,
      };
    case 'danger':
      return {
        ...Typography.titleLarge,
        color: Colors.textPrimary,
      };
    default:
      return Typography.titleLarge;
  }
};

const getSizeStyle = (size: string) => {
  switch (size) {
    case 'small':
      return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md };
    case 'large':
      return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl };
    default:
      return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg };
  }
};

const getSizeTextStyle = (size: string) => {
  switch (size) {
    case 'small':
      return Typography.labelLarge;
    case 'large':
      return Typography.headlineSmall;
    default:
      return Typography.titleLarge;
  }
};

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    marginRight: Spacing.xs,
  },
  disabledReasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.warning + '15',
    borderRadius: BorderRadius.md,
  },
  disabledReasonText: {
    ...Typography.caption,
    color: Colors.warning,
    flex: 1,
  },
});
```

### 3.4 Metric Badge Component

```typescript
// src/components/common/MetricBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

interface MetricBadgeProps {
  label: string;
  value: number;
  maxValue?: number;
  icon?: React.ReactNode;
  color?: string;
  size?: 'small' | 'medium';
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  maxValue = 100,
  icon,
  color,
  size = 'medium',
}) => {
  const percentage = Math.min(value / maxValue, 1);

  // Color determination
  let badgeColor = color;
  if (!badgeColor) {
    if (percentage > 0.7) badgeColor = Colors.success;
    else if (percentage > 0.4) badgeColor = Colors.warning;
    else badgeColor = Colors.error;
  }

  const containerSize = size === 'small' ? 60 : 80;
  const circleSize = containerSize - 4;
  const circumference = 2 * Math.PI * (circleSize / 2);
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <View style={[styles.container, { width: containerSize }]}>
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.value, { fontSize: size === 'small' ? 18 : 24 }]}>
          {Math.round(value)}
        </Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View
        style={[
          styles.progressRing,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderColor: badgeColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  icon: {
    marginBottom: Spacing.xs,
  },
  value: {
    ...Typography.headlineSmall,
    color: Colors.textPrimary,
  },
  label: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  progressRing: {
    position: 'absolute',
    borderWidth: 3,
    opacity: 0.2,
  },
});
```

### 3.5 Input Slider (with Real-time Display)

```typescript
// src/components/inputs/InputSlider.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Slider,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { triggerHaptic } from '../../utils/haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

interface InputSliderProps {
  label: string;
  value: number;
  minValue: number;
  maxValue: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  minValue,
  maxValue,
  step = 1,
  suffix = '',
  prefix = '',
  onValueChange,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSliderChange = (newValue: number) => {
    const rounded = Math.round(newValue / step) * step;
    onValueChange(rounded);
    setInputValue(rounded.toString());
    triggerHaptic('selection');
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const parsed = parseFloat(text) || 0;
    if (parsed >= minValue && parsed <= maxValue) {
      onValueChange(parsed);
    }
  };

  const handleQuickSet = (percentage: number) => {
    const newValue = minValue + (maxValue - minValue) * percentage;
    handleSliderChange(newValue);
  };

  const percentage = (value - minValue) / (maxValue - minValue);

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
        >
          <Text style={styles.editText}>
            {prefix}
            {value.toLocaleString()}
            {suffix}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditing && (
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleInputChange}
          keyboardType="decimal-pad"
          placeholder={minValue.toString()}
        />
      )}

      <Slider
        style={styles.slider}
        value={value}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={step}
        onValueChange={handleSliderChange}
        disabled={disabled}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.surfaceLight}
      />

      <View style={styles.quickOptions}>
        {[0.25, 0.5, 0.75, 1.0].map((pct) => (
          <TouchableOpacity
            key={pct}
            onPress={() => handleQuickSet(pct)}
            style={[
              styles.quickButton,
              Math.abs(percentage - pct) < 0.05 && styles.quickButtonActive,
            ]}
          >
            <Text
              style={[
                styles.quickButtonText,
                Math.abs(percentage - pct) < 0.05 &&
                  styles.quickButtonTextActive,
              ]}
            >
              {Math.round(pct * 100)}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.range}>
        <Text style={styles.rangeText}>
          {prefix}
          {minValue.toLocaleString()}
          {suffix}
        </Text>
        <Text style={styles.rangeText}>
          {prefix}
          {maxValue.toLocaleString()}
          {suffix}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
  },
  editText: {
    ...Typography.labelLarge,
    color: Colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  slider: {
    height: 40,
    marginVertical: Spacing.md,
  },
  quickOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  quickButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickButtonActive: {
    backgroundColor: Colors.primary,
  },
  quickButtonText: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
  },
  quickButtonTextActive: {
    color: Colors.background,
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
```

---

## 4. Screen Specifications

### 4.1 Home Screen (Main Dashboard)

**Key Elements:**
1. Header (profile + notifications)
2. Balance display with trend
3. Metrics section (Happiness, Stress, Prospects, Credit Score)
4. Active loans quick view
5. Recent transactions
6. Pending events with action buttons
7. Next turn button

**Data Sources:**
- `playerStats.balanceDebit` → Balance display
- `playerStats.{happiness, stress, prospects, creditScore}` → Metrics
- `playerStats.loans` → Loans section
- `playerStats.gameEvents` → Recent transactions
- `playerStats.pendingEvents` → Events section
- `calculateTurnInfo()` → Turn display

**Interactions:**
- Pull-to-refresh → Execute weekly turn
- Next Turn button → Execute turn manually
- Card taps → Navigate to detail screens
- Event buttons → Open modals

```typescript
// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { calculateTurnInfo } from '../engine/gameLogic';

// Components
import { Header } from '../components/common/Header';
import { BalanceDisplay } from '../components/common/BalanceDisplay';
import { MetricBadge } from '../components/common/MetricBadge';
import { ActionButton } from '../components/common/ActionButton';
import { Toast } from '../components/common/Toast';
import { RedZoneWarning } from '../components/common/RedZoneWarning';

// Sections
import {
  MetricsSection,
  LoansSection,
  TransactionsSection,
  EventsSection,
} from '../components/sections';

import { Colors, Spacing } from '../theme';

export const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const playerStats = useGameStore((s) => s.playerStats);
  const nextTurn = useGameStore((s) => s.nextTurn);
  const turn = calculateTurnInfo();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await nextTurn();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header
          title="Dashboard"
          userName={playerStats.playerName}
          notificationCount={playerStats.pendingEvents?.length || 0}
          onNotificationsPress={() => {}}
          onProfilePress={() => {}}
        />

        {/* Red Zone Warning (if active) */}
        {playerStats.gameStatus === 'red_zone' && (
          <RedZoneWarning
            message="Your net worth is negative. Financial crisis!"
            severity="critical"
          />
        )}

        {/* Balance Display */}
        <BalanceDisplay
          balance={playerStats.balanceDebit}
          previousBalance={playerStats.previousBalance || playerStats.balanceDebit}
        />

        {/* Turn Info */}
        <View style={styles.turnInfo}>
          <Text style={styles.turnText}>
            Week {turn.weekNumber} • {turn.dayOfWeek}
          </Text>
        </View>

        {/* Metrics */}
        <MetricsSection
          happiness={playerStats.happiness}
          stress={playerStats.stress}
          prospects={playerStats.prospects}
          creditScore={playerStats.creditScore}
        />

        {/* Loans Quick View */}
        <LoansSection loans={playerStats.loans} />

        {/* Recent Transactions */}
        <TransactionsSection
          transactions={playerStats.gameEvents?.slice(0, 5) || []}
        />

        {/* Pending Events */}
        {playerStats.pendingEvents && playerStats.pendingEvents.length > 0 && (
          <EventsSection events={playerStats.pendingEvents} />
        )}

        {/* Next Turn Button */}
        <ActionButton
          label="Next Week"
          onPress={handleRefresh}
          loading={refreshing}
          fullWidth
        />
      </ScrollView>

      {/* Toast notifications */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  turnInfo: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  turnText: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
  },
});
```

### 4.2 Assets Screen

**Purpose:** View and manage housing, vehicles, investments

**Structure:**
- Housing tier with upgrade button
- Vehicle tier with upgrade button
- Investment portfolio
- Buy/sell buttons

### 4.3 Loans Screen

**Purpose:** Full debt management dashboard

**Features:**
- List of all loans with details
- [Pay Early] button on each loan
- [Refinance] option if rates improved
- Total debt summary
- Schedule visualization

### 4.4 Job Screen

**Purpose:** Career management and NPC reputation

**Features:**
- Current job info
- Performance metrics
- [Apply for Promotion] button
- NPC reputation cards
- Salary breakdown

---

## 5. Data Binding & State Flow

### 5.1 Game Store Structure

```typescript
// src/store/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerStats, GameEvent, GameTurn } from '../types';
import * as gameLogic from '../engine/gameLogic';

interface GameStore {
  // State
  playerStats: PlayerStats;
  currentTurn: GameTurn;
  toastMessage: { type: 'success' | 'error' | 'warning'; text: string } | null;

  // Actions
  nextTurn: () => Promise<void>;
  buyAsset: (assetType: 'housing' | 'vehicle', tierId: number) => Promise<void>;
  applyForJob: (jobId: string) => Promise<void>;
  payDownDebt: (loanId: string, amount: number) => Promise<void>;
  refinanceLoan: (loanId: string) => Promise<void>;
  investInMarket: (investmentId: string, amount: number) => Promise<void>;
  handleEventAction: (eventId: string, actionId: string) => Promise<void>;
  showToast: (type: 'success' | 'error' | 'warning', text: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      playerStats: initializePlayerStats(),
      currentTurn: calculateTurnInfo(),
      toastMessage: null,

      nextTurn: async () => {
        const { playerStats } = get();
        const newStats = gameLogic.executeWeeklyTurn(playerStats);
        set({ playerStats: newStats, currentTurn: calculateTurnInfo() });
      },

      buyAsset: async (assetType, tierId) => {
        const { playerStats, showToast } = get();
        try {
          const result = gameLogic.buyAsset(playerStats, assetType, tierId);
          if (result.success) {
            set({ playerStats: result.updatedStats });
            showToast('success', result.message);
          } else {
            showToast('error', result.message);
          }
        } catch (error) {
          showToast('error', 'Failed to complete purchase');
        }
      },

      showToast: (type, text) => {
        set({ toastMessage: { type, text } });
        setTimeout(() => set({ toastMessage: null }), 3000);
      },

      // ... other actions
    }),
    {
      name: 'bankgame-store',
      storage: AsyncStorage,
    }
  )
);
```

### 5.2 Data Binding Table (Home Screen)

| UI Element | Data Source | Binding Type | User Action | Disabled When |
|---|---|---|---|---|
| Balance | `playerStats.balanceDebit` | Real-time | View only | N/A |
| Metrics (4 badges) | `playerStats.{happiness, stress, prospects, creditScore}` | Real-time | View only | N/A |
| Loans count | `playerStats.loans.length` | Real-time | Tap → Navigate | N/A |
| Transactions | `playerStats.gameEvents.slice(0, 5)` | Real-time | Tap → Detail | N/A |
| Events | `playerStats.pendingEvents` | Real-time | Button → Modal | Already processed |
| Next Turn | N/A | UI | Tap → Execute | `isLoading === true` |

### 5.3 Disabled State Rules

#### Buy Asset Button
```typescript
const isBuyDisabled = 
  playerStats.balanceDebit < downPaymentRequired ||
  playerStats.gameStatus === 'red_zone' ||
  isLoading;

const disabledReason = 
  playerStats.balanceDebit < downPaymentRequired 
    ? `Need $${downPaymentRequired - playerStats.balanceDebit} more`
    : 'Cannot purchase during financial crisis';
```

#### Apply for Job Button
```typescript
const isApplyDisabled =
  playerStats.stress > 80 ||
  playerStats.lastJobApplicationMonth === currentMonth ||
  isLoading;

const disabledReason =
  playerStats.stress > 80
    ? 'Too stressed to interview (stress > 80%)'
    : 'Can only apply once per month';
```

#### Pay Down Debt Button
```typescript
const isPayDownDisabled =
  paymentAmount <= 0 ||
  paymentAmount > playerStats.balanceDebit ||
  isLoading;

const disabledReason =
  paymentAmount > playerStats.balanceDebit
    ? `Insufficient balance (have $${playerStats.balanceDebit})`
    : 'Enter a valid amount';
```

---

## 6. Animations & Haptics

### 6.1 Haptic Feedback Mapping

```typescript
// src/utils/haptics.ts
import * as Haptics from 'expo-haptics';

export const triggerHaptic = async (
  type:
    | 'tapLight'
    | 'tapMedium'
    | 'tapHeavy'
    | 'success'
    | 'warning'
    | 'error'
    | 'selection'
) => {
  try {
    switch (type) {
      case 'tapLight':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'tapMedium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'tapHeavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        break;
      case 'warning':
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
    }
  } catch (error) {
    // Haptics not available or failed silently
  }
};
```

### 6.2 Animation Hooks

```typescript
// src/animations/useAnimationEngine.ts
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { AnimationConfig } from '../theme/animations';

// Fade in animation
export const useFadeInAnimation = (delay: number = 0) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, {
      duration: AnimationConfig.fadeIn,
      delay,
    });
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
};

// Pop animation (scale + fade)
export const usePopAnimation = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 8 });
    opacity.value = withTiming(1, { duration: AnimationConfig.scaleIn });
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
};

// Pulse animation (for red zone)
export const usePulseAnimation = () => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 600 }),
      withTiming(1, { duration: 600 })
    );
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
};
```

### 6.3 Haptic Mapping to Actions

| Action | Haptic | When | Example |
|--------|--------|------|---------|
| Button press | tapLight | Any standard button | Cancel, View |
| Slider change | selection | Real-time value adjust | Budget slider |
| Form submit | tapMedium | Form submission starts | "Pay" button |
| Purchase success | tapHeavy + success | Asset purchased | Housing bought |
| Event accept | tapMedium + success | Event action accepted | "+$500 bonus" |
| Insufficient funds | error | Purchase blocked | Buy failed |
| Red Zone activated | tapHeavy + warning | Financial crisis | Net worth < -$1000 |
| Game over | tapHeavy + error | Lost | Bankruptcy |
| Promotion success | tapHeavy + success | Career advancement | Salary +20% |

---

## 7. Navigation Structure

### 7.1 Tab Navigation

```
MainTabs (Bottom Tab Bar)
├── Home (Dashboard) [selected by default]
├── Assets (Housing, Vehicles, Investments)
├── Loans (Debt Management)
├── Job (Career & Reputation)
└── History (Transaction History)

Modal Navigation (Overlays)
├── BuyAssetModal
├── PayDownDebtModal
├── RefinanceLoanModal
├── InvestModal
├── ApplyJobModal
└── EventActionModal
```

### 7.2 Custom Bottom Tab Bar

```typescript
// src/navigation/CustomTabBar.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  Home,
  TrendingUp,
  CreditCard,
  Briefcase,
  History,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const tabs = [
    { name: 'Home', icon: Home },
    { name: 'Assets', icon: TrendingUp },
    { name: 'Loans', icon: CreditCard },
    { name: 'Job', icon: Briefcase },
    { name: 'History', icon: History },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = state.index === index;
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => navigation.navigate(tab.name)}
            >
              <Icon
                size={24}
                color={
                  isActive ? Colors.primary : Colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive
                      ? Colors.primary
                      : Colors.textSecondary,
                  },
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
  },
  tab: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  label: {
    ...Typography.labelSmall,
  },
});
```

---

## 8. Implementation Checklist

### Phase 1: Foundation
- [ ] Color system & typography setup
- [ ] Base components (Header, Button, BalanceDisplay, MetricBadge)
- [ ] Home Screen skeleton
- [ ] Bottom navigation

### Phase 2: Sections
- [ ] MetricsSection component
- [ ] LoansSection component
- [ ] TransactionsSection component
- [ ] EventsSection component

### Phase 3: Modals & Actions
- [ ] BuyAssetModal with InputSlider
- [ ] PayDownDebtModal
- [ ] RefinanceLoanModal
- [ ] ApplyJobModal

### Phase 4: Animations & Haptics
- [ ] Integrate expo-haptics
- [ ] Add haptic feedback to buttons
- [ ] Implement Reanimated animations
- [ ] Red Zone pulse animation
- [ ] Success/error animation sequences

### Phase 5: Other Screens
- [ ] AssetsScreen
- [ ] LoansScreen
- [ ] JobScreen
- [ ] HistoryScreen

### Phase 6: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Edge case testing
- [ ] Performance optimization

---

## 9. Quick Reference

### Colors Quick Access
```
Primary: #FF6B00 (Orange - CTAs, highlights)
Background: #0D0D0D (True black)
Text: #FFFFFF (Primary), #8E8E93 (Secondary)
Success: #34C759
Error: #FF3B30
Warning: #FFD60A
```

### Common Spacing
```
xs: 4px | sm: 8px | base: 12px | md: 16px | lg: 20px | xl: 24px
```

### Typography Hierarchy
```
Display (48px) > Headline (24px) > Title (16px) > Body (14px) > Label (12px)
```

---

**Version:** 2.0  
**Status:** Production-Ready Blueprint  
**Last Updated:** December 2025
