# 🎨 Frontend Architecture & Data Binding Blueprint
## Bank Game - React Native (Expo) UI Implementation Guide

---

## 1. 🎨 Дизайн-Система (Aesthetics)

### 1.1 Философия Дизайна
- **Стиль:** Strict Minimalism + Fintech Aesthetic (Monzo, Revolut, N26)
- **Принципы:**
  - Data-first: Числовые данные в центре внимания
  - Dark Mode Only: Все экраны только в dark mode (OLED-friendly)
  - High Contrast: Максимальная читаемость на мобильных устройствах
  - Rapid Feedback: Каждое действие вызывает видимый ответ (анимация/звук)

### 1.2 Цветовая Палитра

```typescript
// src/theme/colors.ts - UPDATED
export const Colors = {
  // Backgrounds
  primaryBg: '#0D0D0D',        // Deep black, main background
  cardBg: '#1A1A1A',           // Dark gray for cards
  surfaceBg: '#252525',        // Slightly lighter surface
  
  // Semantic Colors
  accentPrimary: '#007AFF',    // Bright blue (iOS style)
  accentSecondary: '#5AC8FA',  // Light blue
  warningRed: '#FF3B30',       // Red for Red Zone
  successGreen: '#34C759',     // Green for profits/gains
  cautionOrange: '#FF9500',    // Orange for warnings
  
  // Text
  textPrimary: '#FFFFFF',      // Main text
  textSecondary: '#8E8E93',    // Secondary text (labels)
  textTertiary: '#636366',     // Tertiary (hints, metadata)
  textDisabled: '#3C3C3D',     // Disabled state
  
  // Status
  positive: '#34C759',         // Income, profit
  negative: '#FF3B30',         // Expense, loss
  neutral: '#8E8E93',          // Neutral state
  
  // Borders
  borderDefault: '#38383A',
  borderLight: '#48484A',
};

// Hex Values Reference
/*
Luminosity levels for OLED optimization:
- #0D0D0D: 0.5% luminosity (true black, no pixel drain)
- #1A1A1A: ~2% luminosity (card backgrounds)
- #252525: ~4% luminosity (elevated surfaces)
- #FFFFFF: 100% luminosity (text - use sparingly)
*/
```

### 1.3 Типографика

```typescript
// src/theme/typography.ts - UPDATED
export const Typography = {
  // Display Sizes (Numbers)
  displayLarge: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
    letterSpacing: -1,
  },
  
  displayMedium: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  
  // Headings
  headingLarge: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  
  headingMedium: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  
  headingSmall: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  
  // Body Text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
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
    lineHeight: 16,
  },
  
  // Labels & Tags
  labelMedium: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  
  labelSmall: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
};

// Font Family: SF Pro Display (system default on iOS)
// Fallback: -apple-system, BlinkMacSystemFont, system-ui
```

### 1.4 Spacing & Layout Grid

```typescript
// src/theme/spacing.ts - UPDATED
export const Spacing = {
  // Base grid: 4px
  xs: 4,      // Micro spacing
  sm: 8,      // Small
  md: 12,     // Medium (default card padding)
  lg: 16,     // Large
  xl: 20,     // Extra large
  xxl: 24,    // 2x extra large
  
  // Screen padding
  screenPaddingH: 16,    // Horizontal screen padding
  screenPaddingV: 12,    // Vertical screen padding
};

export const BorderRadius = {
  xs: 4,      // Subtle corners
  sm: 8,      // Small radius
  md: 12,     // Medium (default card radius)
  lg: 16,     // Large radius
  full: 9999, // Completely round
};

export const Elevation = {
  // Shadows for depth
  low: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  
  high: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};
```

### 1.5 Иконография

```typescript
// src/theme/icons.ts
// Используем Lucide React Native для всех иконок
export const ICONS = {
  // Navigation
  home: 'Home',
  wallet: 'Wallet',
  trending: 'TrendingUp',
  briefcase: 'Briefcase',
  message: 'MessageCircle',
  settings: 'Settings',
  
  // Actions
  plus: 'Plus',
  minus: 'Minus',
  send: 'Send',
  download: 'Download',
  upload: 'Upload',
  refresh: 'RefreshCw',
  
  // Status
  alert: 'AlertCircle',
  checkCircle: 'CheckCircle',
  xCircle: 'XCircle',
  info: 'Info',
  
  // Finance
  creditCard: 'CreditCard',
  dollar: 'DollarSign',
  barChart: 'BarChart3',
  pieChart: 'PieChart',
  
  // Meta
  smile: 'Smile',
  frown: 'Frown',
  zap: 'Zap',
};

// Размеры иконок (всегда квадратные)
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};
```

---

## 2. ⚙️ Технологический Стек для UI

### 2.1 Stack Selection & Justification

| Layer | Technology | Why? |
|-------|-----------|------|
| **Base Framework** | React Native (Expo) | Already configured, native performance, seamless iOS/Android |
| **Styling** | StyleSheet + Zustand hooks | Clean, no runtime overhead, integrates perfectly with game logic |
| **Navigation** | Expo Router (File-based) | Built-in to Expo, type-safe with TypeScript |
| **Animation** | React Native Animated API | Lightweight, built-in, no additional deps. Use Reanimated only for complex gestures |
| **State Management** | Zustand (gameStore.ts) | Already configured, minimal boilerplate, perfect for this use case |
| **Icons** | Lucide React Native | Comprehensive icon set, lightweight, consistent aesthetic |
| **Storage** | AsyncStorage (via Zustand persist) | Already integrated, sufficient for game data |

### 2.2 Why NOT certain libraries:

❌ **NativeBase/Gluestack**: Overkill for strict design system. We control every pixel.
❌ **Reanimated (as primary)**: Add complexity. Use only for Pull-to-Refresh, Red Zone pulse.
❌ **Redux**: Zustand is lighter and fits our data flow better.
❌ **Expo Router + TypeScript**: Already configured. Don't add React Navigation layer.

### 2.3 Dependencies to Add

```json
// package.json additions (if not already present)
{
  "dependencies": {
    "lucide-react-native": "^0.263.0",
    "react-native-reanimated": "^3.5.0",
    "expo-haptics": "^13.0.0"
  }
}
```

### 2.4 Architectural Pattern: Container + Presentational

```
src/
├── screens/           # Screen containers (read from store, orchestrate)
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   └── AssetsScreen.tsx
│
├── components/        # Reusable presentational components
│   ├── common/
│   │   ├── BalanceCard.tsx
│   │   ├── TransactionRow.tsx
│   │   └── MetricBadge.tsx
│   ├── cards/
│   │   ├── StatCard.tsx
│   │   └── EventCard.tsx
│   └── inputs/
│       ├── InputSlider.tsx
│       └── ActionButton.tsx
│
└── engine/
    └── gameLogic.ts   # Pure logic (no UI)
```

---

## 3. 🧩 Модульная Библиотека Компонентов

### 3.1 BalanceCard

**Purpose:** Display current balance in large, bold typography

```typescript
// src/components/common/BalanceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface BalanceCardProps {
  balance: number;
  label?: string;
  variant?: 'primary' | 'secondary' | 'warning';
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  label = 'Available Balance',
  variant = 'primary',
}) => {
  const variantColors = {
    primary: Colors.accentSecondary,
    secondary: Colors.textSecondary,
    warning: Colors.warningRed,
  };

  const isNegative = balance < 0;

  return (
    <View style={[
      styles.container,
      { borderLeftColor: variantColors[variant] },
    ]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[
        styles.balance,
        { color: isNegative ? Colors.warningRed : Colors.textPrimary },
      ]}>
        ${Math.abs(balance).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        {isNegative && <Text style={styles.negative}> (Deficit)</Text>}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderLeftWidth: 4,
  },
  label: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  balance: {
    ...Typography.displayMedium,
    color: Colors.textPrimary,
  },
  negative: {
    ...Typography.bodySmall,
    color: Colors.warningRed,
  },
});
```

### 3.2 TransactionRow

**Purpose:** Display a single transaction (income/expense/transfer)

```typescript
// src/components/common/TransactionRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ITransaction } from '../../types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface TransactionRowProps {
  transaction: ITransaction;
  onPress?: () => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onPress,
}) => {
  const isIncome = transaction.type === 'income';
  const isExpense = transaction.type === 'expense';
  
  const amountColor = isIncome ? Colors.positive : Colors.negative;
  const amountPrefix = isIncome ? '+' : '-';

  const iconMap: Record<string, string> = {
    salary: '💰',
    expense: '💸',
    transfer: '↔️',
    investment: '📈',
    loan: '💳',
    dividend: '🎁',
  };

  const icon = iconMap[transaction.category] || '•';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
      
      <Text style={[styles.amount, { color: amountColor }]}>
        {amountPrefix}${Math.abs(transaction.amount).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  date: {
    ...Typography.labelSmall,
    color: Colors.textTertiary,
  },
  amount: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
});
```

### 3.3 InputSlider

**Purpose:** Budget/value adjustment slider with min/max constraints

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
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  suffix?: string;
}

export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onValueChange,
  suffix = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSliderChange = (newValue: number) => {
    onValueChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const numValue = parseFloat(text) || min;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    onValueChange(clampedValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={handleInputChange}
            keyboardType="decimal-pad"
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.value}>
              ${value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={handleSliderChange}
        minimumTrackTintColor={Colors.accentPrimary}
        maximumTrackTintColor={Colors.borderDefault}
        thumbTintColor={Colors.accentPrimary}
      />

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>${min}</Text>
        <Text style={styles.rangeLabel}>${max}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  value: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.accentPrimary,
  },
  input: {
    ...Typography.bodyMedium,
    color: Colors.accentPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accentPrimary,
    paddingVertical: Spacing.xs,
    minWidth: 60,
  },
  slider: {
    height: 40,
    marginVertical: Spacing.md,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    ...Typography.labelSmall,
    color: Colors.textTertiary,
  },
});
```

### 3.4 AppHeader

**Purpose:** Top header with AI icon and notification bell

```typescript
// src/components/common/AppHeader.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Bell, Zap } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface AppHeaderProps {
  title: string;
  onNotificationsPress?: () => void;
  onAIPress?: () => void;
  notificationBadgeCount?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onNotificationsPress,
  onAIPress,
  notificationBadgeCount,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onAIPress}
            activeOpacity={0.7}
          >
            <Zap
              size={20}
              color={Colors.accentPrimary}
              strokeWidth={2.5}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationsPress}
            activeOpacity={0.7}
          >
            <Bell
              size={20}
              color={Colors.textSecondary}
              strokeWidth={2.5}
            />
            {notificationBadgeCount && notificationBadgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationBadgeCount > 9 ? '9+' : notificationBadgeCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.primaryBg,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.textPrimary,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.warningRed,
    borderRadius: BorderRadius.full,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...Typography.labelSmall,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
```

### 3.5 MetricBadge

**Purpose:** Display compact metric with color coding (Happiness, Stress, etc.)

```typescript
// src/components/common/MetricBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface MetricBadgeProps {
  label: string;
  value: number;
  max?: number;
  type: 'happiness' | 'stress' | 'prospects' | 'creditScore';
  size?: 'small' | 'medium';
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  max = 100,
  type,
  size = 'medium',
}) => {
  const percentage = (value / max) * 100;
  
  const getColor = (type: string, percentage: number): string => {
    switch (type) {
      case 'happiness':
        return percentage > 60 ? Colors.successGreen : 
               percentage > 30 ? Colors.cautionOrange : 
               Colors.warningRed;
      case 'stress':
        return percentage > 60 ? Colors.warningRed : 
               percentage > 30 ? Colors.cautionOrange : 
               Colors.successGreen;
      case 'prospects':
        return percentage > 60 ? Colors.successGreen : Colors.textSecondary;
      case 'creditScore':
        return percentage > 70 ? Colors.successGreen : 
               percentage > 50 ? Colors.cautionOrange : 
               Colors.warningRed;
      default:
        return Colors.textSecondary;
    }
  };

  const color = getColor(type, percentage);
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.container,
      isSmall && styles.containerSmall,
    ]}>
      <View style={styles.content}>
        <Text style={[
          styles.label,
          isSmall && styles.labelSmall,
        ]}>
          {label}
        </Text>
        <Text style={[
          styles.value,
          { color },
          isSmall && styles.valueSmall,
        ]}>
          {value}
        </Text>
      </View>
      
      <View style={[
        styles.progressBar,
        isSmall && styles.progressBarSmall,
      ]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
            isSmall && styles.progressFillSmall,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  containerSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  content: {
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  labelSmall: {
    ...Typography.labelSmall,
    marginBottom: 0,
  },
  value: {
    ...Typography.headingSmall,
    fontWeight: '700',
  },
  valueSmall: {
    ...Typography.bodyMedium,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.surfaceBg,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  progressBarSmall: {
    height: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.xs,
  },
  progressFillSmall: {
    borderRadius: 2,
  },
});
```

### 3.6 ActionButton with Disabled State & Haptics

**Purpose:** Primary CTA button with comprehensive disabled state management

```typescript
// src/components/common/ActionButton.tsx - COMPLETE SPEC
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, { useShakeAnimation } from 'react-native-reanimated';
import { triggerHaptic } from '../../utils/haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface ActionButtonProps {
  label: string;
  onPress: () => Promise<void>;
  disabled?: boolean;
  disabledReason?: string;  // Tooltip for disabled state
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  disabled = false,
  disabledReason,
  variant = 'primary',
  isLoading = false,
  size = 'medium',
}) => {
  const [error, setError] = useState(false);

  const handlePress = async () => {
    // Block interaction if disabled or loading
    if (disabled || isLoading) {
      if (disabled) {
        await triggerHaptic('warning');
      }
      return;
    }

    try {
      // Visual feedback: light haptic on press
      await triggerHaptic('tapLight');

      // Show loading state
      setError(false);

      // Execute action
      await onPress();

      // Success haptic
      await triggerHaptic('success');
    } catch (err) {
      // Error haptic + shake animation
      setError(true);
      await triggerHaptic('error');

      // Reset error after animation
      setTimeout(() => setError(false), 500);
    }
  };

  const sizeStyles = {
    small: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    medium: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
    large: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: Colors.accentPrimary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: Colors.cardBg,
      borderWidth: 1,
      borderColor: Colors.borderDefault,
    },
    danger: {
      backgroundColor: Colors.warningRed,
      borderWidth: 0,
    },
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          sizeStyles[size],
          variantStyles[variant],
          disabled && styles.buttonDisabled,
          error && styles.buttonError,
          isLoading && styles.buttonLoading,
        ]}
        onPress={handlePress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={Colors.textPrimary}
          />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </TouchableOpacity>

      {/* Disabled reason tooltip */}
      {disabled && disabledReason && (
        <Text style={styles.disabledReasonText}>{disabledReason}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Apple HIG minimum touch target
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonError: {
    backgroundColor: Colors.warningRed,
  },
  buttonLoading: {
    opacity: 0.8,
  },
  label: {
    ...Typography.headingSmall,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  disabledReasonText: {
    ...Typography.labelSmall,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
```

---

## 4. 🗺️ Data Binding: Home Screen Architecture

### 4.1 Data Flow Diagram

```
┌─────────────────────────┐
│   gameStore.ts          │
│ (Zustand - Global State)│
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│  useGameStore hook      │
│  - getState()           │
│  - subscribe()          │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────┐
│  HomeScreen Container   │
│  (Orchestration Layer)  │
└────────────┬────────────┘
             │
      ┌──────┴──────┬──────────┬──────────┐
      ↓             ↓          ↓          ↓
  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
  │Balance │  │Header  │  │Trans   │  │Metrics │
  │ Card   │  │        │  │actions │  │ Panel  │
  │(Pure)  │  │(Pure)  │  │(Pure)  │  │(Pure)  │
  └────────┘  └────────┘  └────────┘  └────────┘
```

### 4.2 Comprehensive Data Binding Table

| UI Element | Data Source | Binding Type | Mutation/Action | Disabled When |
|---|---|---|---|---|
| **Balance Display** | `playerStats.balanceDebit` | Computed + Animated | N/A (Read-Only) | N/A |
| **Last 5 Transactions** | `playerStats.gameEvents` or `gameStore.transactions` | Array slice | N/A (Read-Only) | N/A |
| **Next Turn Button** | N/A | UI State | `gameStore.getState().nextTurn()` | `isLoading === true` |
| **spAI Status** | `playerStats.happiness`, `playerStats.stress` | Real-time hook | Opens Modal with detailed view | N/A |
| **Red Zone Warning** | `playerStats.gameStatus === 'red_zone'` | Boolean subscription | Triggers Red Zone UI overlay | N/A |
| **Credit Score Badge** | `playerStats.creditScore` | Real-time value | N/A (Read-Only) | N/A |
| **Header Title** | `calculateTurnInfo()` result | Computed (Week/Month/Year) | N/A (Read-Only) | N/A |
| **Metrics Panel** | `playerStats.{happiness,stress,prospects}` | Array of values | N/A (Read-Only) | N/A |

### 4.3 Action Mutations with UI Sequence Specifications

#### **Mutation 1: Buy Asset (Housing/Vehicle)**

```
DATA BINDING:
  Source: playerStats.balanceDebit
  Action: gameStore.executePlayerDecision('buyAsset', { assetType, tierId })

DISABLED STATE RULE:
  Button is DISABLED if:
    - playerStats.balanceDebit < assetDownPayment
    - playerStats.creditScore < 600 (for mortgage)
    - gameStatus === 'red_zone'
    - isLoading === true

UI SEQUENCE (SEE DIAGRAM):
  1. User taps "Buy Housing Tier 2" button
     ├─ [HAPTIC] Heavy impact (ImpactFeedbackStyle.Heavy)
     └─ Button disabled immediately (loading state)
  
  2. Process action in gameLogic:
     ├─ calculateDownPayment() → validate balance
     ├─ updatePlayerStats() → deduct from balance
     └─ updateHousingTier() → set currentHousing
  
  3. Show Toast notification:
     ├─ SUCCESS: "✅ Welcome to your new apartment! -$5,000"
     ├─ Color: Colors.successGreen
     └─ Duration: 2s
  
  4. Update UI in real-time:
     ├─ BalanceCard animates (FadeIn + Scale)
     ├─ Housing widget displays new tier
     └─ Button re-enabled
  
  5. Optional Navigation (if detailed view exists):
     ├─ Navigate to AssetsScreen after 1.5s
     └─ Show housing details

ERROR SEQUENCE:
  ❌ Insufficient Balance:
     1. [HAPTIC] Warning notification (NotificationFeedbackType.Warning)
     2. [TOAST] "❌ Insufficient funds. Need $X more"
     3. Color: Colors.warningRed
     4. Button remains enabled (user can retry)
  
  ❌ Low Credit Score:
     1. [HAPTIC] Warning notification
     2. [TOAST] "❌ Credit score too low for mortgage (need 600+)"
     3. Color: Colors.cautionOrange
     4. Show "Improve Credit" suggestion button
  
  ❌ Red Zone Active:
     1. [HAPTIC] Heavy impact (warning)
     2. Modal overlay: "Cannot make purchases in Red Zone"
     3. Color: Colors.warningRed
     4. Button disabled until Red Zone resolved
```

#### **Mutation 2: Apply for Job/Promotion**

```
DATA BINDING:
  Source: playerStats.jobMetrics, playerStats.stress
  Action: gameStore.executePlayerDecision('applyForJob', { jobId })

DISABLED STATE RULE:
  Button is DISABLED if:
    - playerStats.stress > 80 (too stressed to apply)
    - playerStats.jobMetrics.riskOfLayoff > 0.7 (job unstable)
    - isLoading === true
    - (currentJob.monthsAtCurrentJob < 3) for promotion

UI SEQUENCE:
  1. User taps "Apply for Senior Role" button
     ├─ [HAPTIC] Light impact (ImpactFeedbackStyle.Light)
     └─ Button shows loading spinner
  
  2. Animate button state change:
     ├─ Opacity transition to 0.6 (disabled appearance)
     ├─ Disable touch during processing
     └─ Show inline spinner
  
  3. Process in gameLogic:
     ├─ calculateJobPerformance() → check if qualified
     ├─ Random outcome (70% success)
     └─ Update playerStats.jobMetrics
  
  4. Show Toast result:
     ✅ SUCCESS: "🎉 Congratulations! New salary: $3,500/month (+$500)"
     ├─ Color: Colors.successGreen
     ├─ [HAPTIC] Success notification (NotificationFeedbackType.Success)
     └─ Add salary bonus to balance immediately
  
     ❌ REJECTION: "😞 Interview didn't go well. Stress +10"
     ├─ Color: Colors.cautionOrange
     ├─ [HAPTIC] Warning notification
     └─ Update stress level in UI

  5. Update Metrics Panel:
     ├─ New salary displayed in profile
     ├─ Stress value updated (if applicable)
     └─ Animation: Fade + Scale on income update

SIDE EFFECTS:
  - If promotion succeeds: Navigate to ProfileScreen to show new title
  - If rejection: Show retry button (available after 2 turns)
  - Stress mechanic: Each rejection increases stress by 10
```

#### **Mutation 3: Refinance Loan**

```
DATA BINDING:
  Source: playerStats.loans, playerStats.creditScore
  Action: gameStore.executePlayerDecision('refinanceLoan', { loanId, newTerm })

DISABLED STATE RULE:
  Button is DISABLED if:
    - playerStats.creditScore < 650 (refinance requires better score)
    - loanBalance < 1000 (too small to refinance)
    - isLoading === true
    - gameStatus === 'red_zone'

UI SEQUENCE:
  1. User opens Loan Details → taps "Refinance" button
     ├─ [HAPTIC] Light impact
     └─ Show modal with new terms (interest rate, monthly payment)
  
  2. Confirm Modal appears:
     ├─ Old rate: 12% → New rate: 9.5%
     ├─ Old payment: $250/mo → New payment: $240/mo
     ├─ Calculate savings and show prominently
     └─ User taps "Confirm Refinance"
  
  3. Process refinance:
     ├─ [HAPTIC] Medium impact (ImpactFeedbackStyle.Medium)
     ├─ Calculate new interest rate based on creditScore
     ├─ Update loan object in playerStats.loans[]
     └─ Apply origination fee (-$200 from balance)
  
  4. Show Multi-part Toast:
     ├─ First: "📋 Processing refinance..."
     ├─ Then (1.5s later): "✅ Refinance approved! Fee: -$200"
     ├─ Color sequence: cautionOrange → successGreen
     ├─ [HAPTIC] Success notification
     └─ Duration: 3s total
  
  5. Update Loan Panel:
     ├─ Monthly payment amount animates down
     ├─ Interest rate badge updates
     ├─ Total interest calculation updated
     └─ Balance deducted in BalanceCard

ERROR SEQUENCE:
  ❌ Credit Score Too Low:
     1. [HAPTIC] Warning notification
     2. [TOAST] "❌ Refinance requires 650+ credit score. Current: 620"
     3. Show path to improve (e.g., "Pay on time for 2 months")
  
  ❌ Insufficient Funds for Fee:
     1. [HAPTIC] Warning notification
     2. [TOAST] "❌ Need $200 for origination fee"
     3. Option: "Skip refinance" or "Borrow from line of credit"
```

#### **Mutation 4: Pay Down Debt (Manual Payment)**

```
DATA BINDING:
  Source: playerStats.balanceDebit, playerStats.loans
  Action: gameStore.executePlayerDecision('payDownDebt', { amount, loanId })

DISABLED STATE RULE:
  Button is DISABLED if:
    - playerStats.balanceDebit < amount (insufficient funds)
    - amount <= 0
    - isLoading === true

UI SEQUENCE:
  1. User enters amount in InputSlider component
     ├─ Real-time validation: max = min(playerStats.balanceDebit, loanBalance)
     ├─ Preview shows interest saved
     └─ Button enabled only if amount > 0 and < balance
  
  2. User taps "Pay $500" button
     ├─ [HAPTIC] Light impact
     └─ Button disabled + loading state
  
  3. Process payment:
     ├─ Deduct from playerStats.balanceDebit
     ├─ Apply to loan principal
     ├─ Calculate interest saved
     └─ Reduce loan interest rate (if applicable)
  
  4. Show Toast:
     ✅ "💪 Paid $500! Interest saved: $45"
     ├─ Color: Colors.successGreen
     ├─ [HAPTIC] Success notification
     └─ Duration: 2s
  
  5. Animate Updates:
     ├─ BalanceCard updates with fade animation
     ├─ Loan balance in list animates down
     ├─ Interest rate badge updates (if changed)
     └─ InputSlider resets to 0

SPECIAL BEHAVIOR:
  - If payment fully clears loan: Show celebration animation + bonus happiness +10
  - If payment triggers credit score improvement: Show "✨ Credit score: 720 (+10)"
```

#### **Mutation 5: Invest in Market**

```
DATA BINDING:
  Source: playerStats.balanceDebit, playerStats.investments
  Action: gameStore.executePlayerDecision('investInMarket', { investmentId, amount })

DISABLED STATE RULE:
  Button is DISABLED if:
    - playerStats.balanceDebit < amount
    - playerStats.gameStatus === 'red_zone' (risky in crisis)
    - amount < 100 (minimum investment)
    - isLoading === true

UI SEQUENCE:
  1. User selects investment in MarketScreen
     ├─ Shows risk level (Low/Medium/High)
     ├─ Shows expected return (5-15% annually)
     └─ Input amount to invest
  
  2. User taps "Invest $1,000" button
     ├─ [HAPTIC] Medium impact (ImpactFeedbackStyle.Medium)
     ├─ Confidence indicator: "You're about to invest"
     └─ Confirmation appears (if amount > 50% of balance)
  
  3. Process investment:
     ├─ Deduct from playerStats.balanceDebit
     ├─ Add to playerStats.investments[]
     ├─ Set purchase price and date
     └─ Schedule monthly dividend updates
  
  4. Show Toast Sequence:
     ├─ First: "📈 Buying 10 shares of Tech Fund..."
     ├─ Then (0.5s): "✅ Purchased! Entry price: $100"
     ├─ Color: Colors.accentSecondary
     ├─ [HAPTIC] Success notification
     └─ Duration: 2.5s
  
  5. Update Portfolio View:
     ├─ New investment animates into list (pop animation)
     ├─ BalanceCard updates with fade
     ├─ Total portfolio value recalculates
     └─ Show real-time price next to investment

ERROR SEQUENCE:
  ❌ Insufficient Funds:
     1. [HAPTIC] Warning notification
     2. [TOAST] "❌ Need $1,000 but only have $800"
     3. Suggest: "Reduce amount or pay down debt first"
  
  ❌ Red Zone Active (Warning, not blocking):
     1. [HAPTIC] Warning notification
     2. [TOAST] "⚠️ Investing in Red Zone is risky! Continue?"
     3. Show confirmation modal
     4. If confirmed: increase investment volatility (risk x1.5)
```

#### **Mutation 6: Accept/Reject Event Action**

```
DATA BINDING:
  Source: playerStats.gameEvents, current pending event
  Action: gameStore.executePlayerDecision('handleEventAction', { eventId, actionId })

DISABLED STATE RULE:
  Button is DISABLED if:
    - isLoading === true
    - Event already processed

UI SEQUENCE:
  1. Event Card displays with 2-3 action buttons
     ├─ Button 1: "Accept $500 bonus" (green)
     ├─ Button 2: "Decline bonus, rest" (gray)
     └─ Each button shows impact preview
  
  2. User taps "Accept $500 bonus"
     ├─ [HAPTIC] Light impact
     ├─ Button becomes loading state
     └─ Disable other action buttons
  
  3. Process action:
     ├─ Apply all impact values (balance, happiness, stress, etc.)
     ├─ Mark event as processed
     ├─ Remove EventCard from UI
     └─ Add to gameEvents.isRead = true
  
  4. Show Toast:
     ✅ "✅ Bonus received! +$500"
     ├─ Color: Colors.successGreen
     ├─ [HAPTIC] Success notification
     └─ Duration: 1.5s
  
  5. Update Relevant Metrics:
     ├─ BalanceCard animates new value
     ├─ Metrics panel updates (if happiness/stress changed)
     ├─ Event card animates out (fade + slide up)
     └─ Next event card animates in

SPECIAL CASES:
  Event with consequences (e.g., "Accept risky investment"):
    1. Show warning before confirmation
    2. [HAPTIC] Warning notification before processing
    3. If accepted: [HAPTIC] Heavy impact after action
    4. Show timeline: "Investment will mature in 6 turns"
```

### 4.4 HomeScreen Implementation Template

### 4.3 Disabled State Rules (CRITICAL)

#### **Universal Disabled State Pattern**

```
RULE: Любая кнопка действия (Buy, Apply, Refinance, Invest, Pay) должна быть 
      DISABLED, если это действие невозможно выполнить.
      
      При попытке нажать disabled кнопку:
      1. [HAPTIC] Warning notification (NotificationFeedbackType.Warning)
      2. [TOAST] Показать причину (e.g., "Need $500 more balance")
      3. Кнопка остается disabled (не переходит в активное состояние)
```

#### **Buy Action - Disabled When**

```typescript
const isBuyDisabled =
  // ❌ Insufficient balance
  playerStats.balanceDebit < downPaymentAmount ||
  // ❌ Low credit score
  (isHousingPurchase && playerStats.creditScore < 600) ||
  (isVehiclePurchase && playerStats.creditScore < 550) ||
  // ❌ Red Zone active (no major purchases allowed)
  playerStats.gameStatus === 'red_zone' ||
  // ❌ Already loading
  isLoading;

// Disabled reason text
const buyDisabledReason = 
  playerStats.balanceDebit < downPaymentAmount 
    ? `Need $${(downPaymentAmount - playerStats.balanceDebit).toFixed(2)} more`
    : playerStats.creditScore < 600
    ? `Credit score too low (need 600+, have ${playerStats.creditScore})`
    : playerStats.gameStatus === 'red_zone'
    ? 'Cannot purchase in Red Zone'
    : '';

// Component usage
<ActionButton
  label="Buy Housing Tier 2"
  onPress={handleBuy}
  disabled={isBuyDisabled}
  disabledReason={buyDisabledReason}
  variant="primary"
/>
```

#### **Apply for Job - Disabled When**

```typescript
const isApplyDisabled =
  // ❌ Stress too high (can't focus on interview)
  playerStats.stress > 80 ||
  // ❌ Job too unstable (risk of layoff)
  playerStats.jobMetrics.riskOfLayoff > 0.7 ||
  // ❌ Still at current job (can't apply for 3+ months)
  playerStats.jobMetrics.monthsAtCurrentJob < 3 ||
  // ❌ Already loading
  isLoading ||
  // ❌ Already applied this month
  playerStats.lastJobApplicationDate === currentMonth;

const applyDisabledReason =
  playerStats.stress > 80
    ? 'Too stressed to interview (need stress < 80)'
    : playerStats.jobMetrics.riskOfLayoff > 0.7
    ? 'Current job too unstable - focus on improving'
    : playerStats.jobMetrics.monthsAtCurrentJob < 3
    ? `Need ${3 - playerStats.jobMetrics.monthsAtCurrentJob} more months at current job`
    : playerStats.lastJobApplicationDate === currentMonth
    ? 'Already applied this month'
    : '';

<ActionButton
  label="Apply for Promotion"
  onPress={handleApply}
  disabled={isApplyDisabled}
  disabledReason={applyDisabledReason}
  variant="primary"
/>
```

#### **Refinance Loan - Disabled When**

```typescript
const isRefinanceDisabled =
  // ❌ Credit score too low
  playerStats.creditScore < 650 ||
  // ❌ Loan too small to refinance
  currentLoan.balance < 1000 ||
  // ❌ Recently refinanced (wait 6 months)
  monthsSinceLastRefinance < 6 ||
  // ❌ Red Zone active
  playerStats.gameStatus === 'red_zone' ||
  // ❌ Loading
  isLoading;

const refinanceDisabledReason =
  playerStats.creditScore < 650
    ? `Credit score too low (need 650+, have ${playerStats.creditScore})`
    : currentLoan.balance < 1000
    ? 'Loan too small to refinance (need $1000+)'
    : monthsSinceLastRefinance < 6
    ? `Must wait ${6 - monthsSinceLastRefinance} months before refinancing again`
    : playerStats.gameStatus === 'red_zone'
    ? 'Cannot refinance in Red Zone'
    : '';

<ActionButton
  label="Refinance Loan"
  onPress={handleRefinance}
  disabled={isRefinanceDisabled}
  disabledReason={refinanceDisabledReason}
  variant="secondary"
/>
```

#### **Pay Down Debt - Disabled When**

```typescript
const isPayDownDisabled =
  // ❌ Amount not entered or is 0
  paymentAmount <= 0 ||
  // ❌ Insufficient balance
  playerStats.balanceDebit < paymentAmount ||
  // ❌ Loading
  isLoading;

const payDownDisabledReason =
  paymentAmount <= 0
    ? 'Enter amount to pay'
    : playerStats.balanceDebit < paymentAmount
    ? `Need $${(paymentAmount - playerStats.balanceDebit).toFixed(2)} more`
    : '';

<InputSlider
  label="Payment Amount"
  value={paymentAmount}
  min={0}
  max={playerStats.balanceDebit}
  onValueChange={setPaymentAmount}
/>

<ActionButton
  label={`Pay $${paymentAmount.toFixed(2)}`}
  onPress={handlePayDown}
  disabled={isPayDownDisabled}
  disabledReason={payDownDisabledReason}
  variant="primary"
/>
```

#### **Invest - Disabled When**

```typescript
const isInvestDisabled =
  // ❌ Amount not entered
  investmentAmount <= 0 ||
  // ❌ Insufficient balance
  playerStats.balanceDebit < investmentAmount ||
  // ❌ Minimum investment not met
  investmentAmount < 100 ||
  // ❌ Red Zone (investments risky)
  playerStats.gameStatus === 'red_zone' ||
  // ❌ Loading
  isLoading;

const investDisabledReason =
  investmentAmount <= 0
    ? 'Enter amount to invest'
    : playerStats.balanceDebit < investmentAmount
    ? `Need $${(investmentAmount - playerStats.balanceDebit).toFixed(2)} more`
    : investmentAmount < 100
    ? 'Minimum investment is $100'
    : playerStats.gameStatus === 'red_zone'
    ? 'Risky to invest in Red Zone'
    : '';

<ActionButton
  label={`Invest $${investmentAmount}`}
  onPress={handleInvest}
  disabled={isInvestDisabled}
  disabledReason={investDisabledReason}
  variant="primary"
/>
```

#### **Accept Event Action - Disabled When**

```typescript
const isEventActionDisabled =
  // ❌ Event already processed
  eventCard.processed ||
  // ❌ Loading response
  isLoading ||
  // ❌ Time-limited action expired
  (eventAction.expiresAt && new Date() > eventAction.expiresAt);

<ActionButton
  label={eventAction.label}
  onPress={() => handleEventAction(eventAction.id)}
  disabled={isEventActionDisabled}
  variant={eventAction.actionType === 'positive' ? 'primary' : 'secondary'}
/>
```

### 4.4 Disabled State Visual Indicators

```typescript
// VISUAL TREATMENT IN StyleSheet
const disabledStyles = StyleSheet.create({
  // Button disabled appearance
  buttonDisabled: {
    opacity: 0.5,                    // Reduce opacity to 50%
    backgroundColor: Colors.cardBg,  // Fade to card background
  },
  
  // Text disabled appearance
  textDisabled: {
    color: Colors.textDisabled,      // Use disabled text color (#3C3C3D)
  },
  
  // Input disabled appearance
  inputDisabled: {
    backgroundColor: Colors.surfaceBg,
    borderColor: Colors.borderDefault,
    color: Colors.textDisabled,
  },
});

// UI FEEDBACK when trying to interact with disabled element:
// 1. Visual: Button opacity reduced to 0.5
// 2. Touch: No press animation (activeOpacity remains unchanged)
// 3. Haptic: Warning notification plays
// 4. Toast: Reason displayed below button (disabledReason prop)
// 5. Duration: Tooltip visible until user taps elsewhere
```

### 4.5 HomeScreen Implementation Template

```typescript
// src/screens/HomeScreen.tsx - WITH HAPTICS & DISABLED STATES
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { calculateTurnInfo } from '../engine/gameLogic';
import { triggerHaptic } from '../utils/haptics';

// Components
import { AppHeader } from '../components/common/AppHeader';
import { BalanceCard } from '../components/common/BalanceCard';
import { TransactionRow } from '../components/common/TransactionRow';
import { MetricBadge } from '../components/common/MetricBadge';
import { ActionButton } from '../components/common/ActionButton';
import { RedZoneWarning } from '../components/RedZoneWarning';

// Styles
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

export const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [spAIModalVisible, setSpAIModalVisible] = useState(false);

  // Subscribe to game store
  const playerStats = useGameStore(state => state.playerStats);
  const nextTurn = useGameStore(state => state.nextTurn);
  const transactions = useGameStore(state => state.transactions || []);
  const gameEvents = useGameStore(state => state.playerStats.gameEvents || []);

  // Compute derived values
  const turnInfo = calculateTurnInfo(playerStats.currentDate, playerStats.startDate);
  const isRedZone = playerStats.gameStatus === 'red_zone';
  const isGameOver = playerStats.gameStatus === 'game_over';
  const unreadEventsCount = gameEvents.filter(e => !e.isRead).length;

  // Handle pull-to-refresh WITH HAPTICS
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      // Trigger light haptic at start
      await triggerHaptic('tapLight');
      
      // Execute turn
      await nextTurn();
      
      // Success haptic at end
      await triggerHaptic('success');
    } catch (error) {
      // Error haptic
      await triggerHaptic('error');
      console.error('Turn error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Render red zone modal if active
  if (isRedZone) {
    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="slide"
      >
        <RedZoneWarning
          playerStats={playerStats}
          onDismiss={() => {
            // Continue playing in red zone
          }}
          onBankruptcyPressed={() => {
            // Open bankruptcy options modal
          }}
        />
      </Modal>
    );
  }

  // Render game over screen
  if (isGameOver) {
    return (
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverTitle}>🎮 GAME OVER</Text>
        <Text style={styles.gameOverMessage}>
          Your financial situation became unrecoverable.
        </Text>
        {/* Add restart button */}
      </View>
    );
  }

  // Recent transactions (last 5)
  const recentTransactions = [...transactions].reverse().slice(0, 5);

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader
        title={`Week ${turnInfo.weekNumber}, Month ${turnInfo.monthNumber}`}
        notificationBadgeCount={unreadEventsCount}
        onNotificationsPress={() => {
          // Navigate to events screen
        }}
        onAIPress={() => setSpAIModalVisible(true)}
      />

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accentPrimary}
            progressBackgroundColor={Colors.cardBg}
            title="Advancing turn..."
          />
        }
      >
        {/* Balance Card */}
        <View style={styles.section}>
          <BalanceCard
            balance={playerStats.balanceDebit}
            label="Debit Account"
            variant={playerStats.balanceDebit < 0 ? 'warning' : 'primary'}
          />
        </View>

        {/* Metrics Panel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCol}>
              <MetricBadge
                label="Happiness"
                value={Math.round(playerStats.happiness)}
                type="happiness"
              />
            </View>
            <View style={styles.metricCol}>
              <MetricBadge
                label="Stress"
                value={Math.round(playerStats.stress)}
                type="stress"
              />
            </View>
            <View style={styles.metricCol}>
              <MetricBadge
                label="Prospects"
                value={Math.round(playerStats.prospects)}
                type="prospects"
              />
            </View>
            <View style={styles.metricCol}>
              <MetricBadge
                label="Credit"
                value={playerStats.creditScore}
                max={850}
                type="creditScore"
              />
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.transactionList}>
            {recentTransactions.length > 0 ? (
              recentTransactions.map(tx => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No transactions yet</Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <ActionButton
            label="Pull to Refresh (or press)"
            onPress={handleRefresh}
            variant="primary"
            size="large"
            isLoading={refreshing}
            disabled={refreshing}
          />
          <Text style={styles.helpText}>Refresh to advance one turn</Text>
        </View>
      </ScrollView>

      {/* spAI Modal (placeholder) */}
      {/* <Modal
        visible={spAIModalVisible}
        transparent={true}
        animationType="slide"
      >
        <SpAIDetailModal
          playerStats={playerStats}
          onClose={() => setSpAIModalVisible(false)}
        />
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  metricCol: {
    flex: 1,
    minWidth: '48%',
  },
  transactionList: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyText: {
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  actionSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.warningRed,
    marginBottom: Spacing.md,
  },
  gameOverMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
});
```

### 4.6 Complete Data Binding Example: Buy Housing Flow

```typescript
// FULL FLOW: User buys housing (Buy Button → Toast → Update UI)

// 1. STATE CALCULATION (in component)
const isBuyDisabled = 
  playerStats.balanceDebit < downPayment ||
  playerStats.creditScore < 600 ||
  playerStats.gameStatus === 'red_zone';

// 2. BUTTON PRESS (with haptics)
const handleBuy = async () => {
  try {
    await triggerHaptic('tapLight');              // User feedback
    
    // Call mutation
    await gameStore.executePlayerDecision('buyAsset', {
      assetType: 'housing',
      tierId: 2,
    });
    
    // Success
    await triggerHaptic('success');               // Celebration
    
  } catch (err) {
    await triggerHaptic('error');                 // Failure
    showToast('❌ Purchase failed: ' + err.message);
  }
};

// 3. STATE UPDATE (in gameStore)
playerStats.balanceDebit -= downPayment;
playerStats.currentHousing = newHousingTier;
playerStats.netWorth = calculateNetWorth(playerStats);

// 4. UI RE-RENDERS (subscribed components update automatically)
// - BalanceCard animates new value
// - Housing widget shows new tier
// - Button re-enables

// 5. OPTIONAL TOAST (show result)
showToast({
  type: 'success',
  message: '✅ Moved to 2BR Apartment! -$5,000',
  duration: 2000,
});
```

---

## 5. ✨ UX и Анимации

### 5.1 Haptic Feedback Specification (Expo Haptics API)

#### **Haptic Types Reference**

```typescript
// src/utils/haptics.ts - COMPLETE SPEC
import * as Haptics from 'expo-haptics';

export const HapticFeedback = {
  // ============================================
  // IMPACT FEEDBACK STYLES
  // ============================================
  
  /**
   * Light impact - Quick, subtle tap
   * Usage: Button presses, toggling options, selection changes
   * Intensity: Minimal, barely noticeable
   */
  tapLight: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Medium impact - Standard feedback
   * Usage: Form submissions, list item selection, modal appear
   * Intensity: Normal, noticeable but not jarring
   */
  tapMedium: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /**
   * Heavy impact - Strong, attention-grabbing feedback
   * Usage: Purchase confirmation, promotion success, Red Zone entry, error states
   * Intensity: Strong, intentionally demands attention
   */
  tapHeavy: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  // ============================================
  // NOTIFICATION FEEDBACK STYLES
  // ============================================

  /**
   * Success notification - Celebrates achievement
   * Pattern: Short-long-short pulse (satisfying)
   * Usage: Payment successful, loan paid off, promotion accepted
   * Context: Positive outcomes only
   */
  success: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /**
   * Warning notification - Alerts to caution
   * Pattern: Double medium taps
   * Usage: Low balance warning, credit score drop, Red Zone activation
   * Context: Negative but not critical
   */
  warning: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  /**
   * Error notification - Indicates failure/problem
   * Pattern: Triple taps decreasing intensity
   * Usage: Purchase rejected, insufficient funds, server error
   * Context: Critical issues requiring user attention
   */
  error: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  // ============================================
  // SELECTION FEEDBACK
  // ============================================
  
  /**
   * Selection haptic - Used for picker/segmented control
   * Pattern: Single light tap on value change
   * Usage: Switching between tabs, changing slider value
   */
  selection: async () => {
    await Haptics.selectionAsync();
  },
};

// SAFE WRAPPER with error handling
export const triggerHaptic = async (
  type: 'tapLight' | 'tapMedium' | 'tapHeavy' | 'success' | 'warning' | 'error' | 'selection'
) => {
  try {
    if (type === 'tapLight') await HapticFeedback.tapLight();
    if (type === 'tapMedium') await HapticFeedback.tapMedium();
    if (type === 'tapHeavy') await HapticFeedback.tapHeavy();
    if (type === 'success') await HapticFeedback.success();
    if (type === 'warning') await HapticFeedback.warning();
    if (type === 'error') await HapticFeedback.error();
    if (type === 'selection') await HapticFeedback.selection();
  } catch (error) {
    // Silently fail on devices without haptic support
    console.warn('Haptic feedback not supported');
  }
};
```

#### **Haptic Mapping to Actions**

| Action | Haptic Type | When | Example |
|--------|---|---|---|
| **Button Press** | tapLight | Any standard button tap | "View Details", "Cancel" |
| **Slider Change** | selection | Real-time value adjustment | Budget slider, payment amount |
| **Toggle Switch** | tapLight | Switch on/off state | Settings toggle |
| **Form Submit** | tapMedium | Form submission starts | "Apply for Job" button |
| **Purchase Success** | tapHeavy + success | Asset purchased, payment sent | Buy housing, invest $1000 |
| **Event Action Accept** | tapMedium + success | Positive event action accepted | "Accept $500 bonus" |
| **Event Action Decline** | tapLight | Negative event action (optional) | "Decline risky investment" |
| **Low Balance Warning** | warning | Balance drops below threshold | Account balance < $500 |
| **Red Zone Activation** | tapHeavy + warning | Player enters Red Zone | Net worth goes negative |
| **Purchase Rejected** | error | Insufficient funds, low credit | "Buy failed - need $X more" |
| **Loan Rejection** | tapMedium + warning | Loan application denied | "Mortgage denied - score too low" |
| **Refinance Success** | tapMedium + success | Refinance processed | Loan terms updated |
| **Investment Update** | tapLight | Price volatility, dividend | Weekly investment update |
| **Promotion Success** | tapHeavy + success | Job promotion accepted | Salary increase applied |
| **Layoff/Fired** | tapHeavy + error | Negative job event | "You've been laid off" |
| **Game Over** | tapHeavy + error | Game lost (bankruptcy) | Final Red Zone failure |
| **Game Won** | tapHeavy + success | Game won (reached goal) | "You won! Net worth: $100k" |

### 5.2 Animation System with Reanimated

#### **Reanimated Setup & Configuration**

```typescript
// src/animations/useAnimationEngine.ts - REANIMATED SPEC
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export const AnimationConfig = {
  timings: {
    fast: 200,      // Micro interactions (0.2s)
    normal: 300,    // Standard transitions (0.3s)
    slow: 500,      // Deliberate animations (0.5s)
    pulse: 1000,    // Continuous pulse (1s)
  },
  easings: {
    easeOut: Easing.out(Easing.quad),
    easeInOut: Easing.inOut(Easing.quad),
    easeInOutCubic: Easing.inOut(Easing.cubic),
    elasticOut: Easing.out(Easing.elastic(1.2)),
  },
};

// ================================================
// FADE IN ANIMATION
// ================================================
export const useFadeInAnimation = (delay: number = 0) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: AnimationConfig.timings.normal,
      easing: AnimationConfig.easings.easeOut,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return animatedStyle;
};

// ================================================
// POP ANIMATION (Scale + Fade for new items)
// ================================================
export const usePopAnimation = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: AnimationConfig.timings.normal,
      easing: AnimationConfig.easings.elasticOut,
    });
    opacity.value = withTiming(1, {
      duration: AnimationConfig.timings.fast,
      easing: AnimationConfig.easings.easeOut,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

// ================================================
// PULSE ANIMATION (RED ZONE - CRITICAL)
// ================================================
/**
 * REANIMATED SPEC FOR RED ZONE PULSE:
 * 
 * Configuration:
 * - useSharedValue for scale (1 → 1.05 → 1)
 * - Duration: 1000ms per cycle
 * - Loop: withRepeat (infinite, restarts)
 * - Easing: Easing.inOut(Easing.quad) for smooth pulsing
 * - useAnimatedStyle for transform
 * 
 * Performance:
 * - Native thread execution (60fps guaranteed)
 * - No JS thread blocking
 * - Optimized for mobile devices
 * - Can run indefinitely without performance degradation
 */
export const usePulseAnimation = (intensity: number = 0.05) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1 + intensity, {
          duration: 500,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(1, {
          duration: 500,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1,
      true // reverse
    );
  }, [intensity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
};

// ================================================
// SLIDE UP ANIMATION
// ================================================
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
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

// ================================================
// SHAKE ANIMATION (Error states)
// ================================================
export const useShakeAnimation = () => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(10, { duration: 50, easing: Easing.linear }),
      withTiming(-10, { duration: 50, easing: Easing.linear }),
      withTiming(0, { duration: 50, easing: Easing.linear })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return animatedStyle;
};

// ================================================
// VALUE CHANGE ANIMATION (Balance updates)
// ================================================
export const useValueChangeAnimation = (targetValue: number) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(targetValue, {
      duration: AnimationConfig.timings.slow,
      easing: AnimationConfig.easings.easeInOut,
    });
  }, [targetValue]);

  return animatedValue;
};
```

#### **RedZoneWarning with Reanimated Pulse**

```typescript
// src/components/RedZoneWarning.tsx - REANIMATED INTEGRATION
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { usePulseAnimation } from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface RedZoneWarningProps {
  playerStats: IPlayerStats;
  daysRemaining: number;
  onDismiss?: () => void;
}

export const RedZoneWarning: React.FC<RedZoneWarningProps> = ({
  playerStats,
  daysRemaining,
  onDismiss,
}) => {
  // Use intense pulse for critical attention
  const pulseStyle = usePulseAnimation(0.08); // 8% scale pulse

  return (
    <View style={styles.container}>
      {/* PULSING RED ZONE HEADER */}
      <Animated.View style={[styles.headerSection, pulseStyle]}>
        <Text style={styles.icon}>🚨</Text>
        <Text style={styles.title}>FINANCIAL CRISIS</Text>
        <Text style={styles.subtitle}>RED ZONE ACTIVATED</Text>
      </Animated.View>

      {/* COUNTDOWN WITH PROGRESS */}
      <View style={styles.countdownSection}>
        <Text style={styles.countdownLabel}>Days to Recovery</Text>
        <Text style={styles.countdownDays}>{daysRemaining} days</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(daysRemaining / 90) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* METRICS DISPLAY */}
      <View style={styles.metricsSection}>
        <MetricDisplay
          label="Net Worth"
          value={playerStats.netWorth}
          status={playerStats.netWorth < 0 ? 'negative' : 'positive'}
        />
        <MetricDisplay
          label="Total Debt"
          value={playerStats.totalDebt}
          status="negative"
        />
      </View>

      {/* DISMISS BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={onDismiss}
      >
        <Text style={styles.buttonText}>I Understand</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    ...Typography.displayMedium,
    color: Colors.warningRed,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  countdownSection: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  countdownLabel: {
    ...Typography.labelMedium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  countdownDays: {
    ...Typography.displayLarge,
    color: Colors.warningRed,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.surfaceBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.warningRed,
  },
  metricsSection: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.accentPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.headingSmall,
    color: Colors.textPrimary,
  },
});
```

### 5.3 Pull-to-Refresh Animation

```typescript
// src/components/PullToRefreshComponent.tsx
import React from 'react';
import {
  View,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, { useFadeInAnimation } from 'react-native-reanimated';
import { Colors } from '../theme/colors';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  refreshing: boolean;
  children: React.ReactNode;
}

export const PullToRefreshComponent: React.FC<PullToRefreshProps> = ({
  onRefresh,
  refreshing,
  children,
}) => {
  const handleRefresh = async () => {
    try {
      // Trigger haptic at start
      await triggerHaptic('tapLight');
      
      // Execute the turn
      await onRefresh();
      
      // Trigger success haptic at end
      await triggerHaptic('success');
    } catch (error) {
      // Trigger error haptic
      await triggerHaptic('error');
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.accentPrimary}
          progressBackgroundColor={Colors.cardBg}
          // Accessibility label
          title="Fetching next turn..."
        />
      }
    >
      {children}
    </ScrollView>
  );
};
```

### 5.4 Transaction List with Staggered Animation

```typescript
// src/components/TransactionList.tsx - ANIMATED LIST
import React from 'react';
import { View, FlatList } from 'react-native';
import Animated, { usePopAnimation } from 'react-native-reanimated';
import { TransactionRow } from './TransactionRow';

interface TransactionListProps {
  transactions: ITransaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
}) => {
  return (
    <FlatList
      data={transactions}
      renderItem={({ item, index }) => (
        <AnimatedTransactionRow
          key={item.id}
          transaction={item}
          index={index}
        />
      )}
      scrollEnabled={false}
    />
  );
};

const AnimatedTransactionRow: React.FC<{
  transaction: ITransaction;
  index: number;
}> = ({ transaction, index }) => {
  const animStyle = usePopAnimation();

  return (
    <Animated.View
      style={[
        animStyle,
        {
          marginBottom: 8,
          // Stagger: each item animates 50ms after previous
          delay: index * 50,
        },
      ]}
    >
      <TransactionRow transaction={transaction} />
    </Animated.View>
  );
};
```

### 5.5 Complete Haptic + Animation Integration Example

```typescript
// src/components/ActionButton.tsx - FULL INTEGRATION
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useShakeAnimation,
} from 'react-native-reanimated';
import { triggerHaptic } from '../utils/haptics';
import { Colors } from '../theme/colors';

interface ActionButtonProps {
  label: string;
  onPress: () => Promise<void>;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  isLoading = false,
}) => {
  const [error, setError] = useState(false);
  const shakeStyle = useShakeAnimation();

  const handlePress = async () => {
    if (disabled || isLoading) return;

    try {
      // Visual feedback: light haptic on press
      await triggerHaptic('tapLight');

      // Show loading state
      setError(false);

      // Execute action
      await onPress();

      // Success haptic
      await triggerHaptic('success');
    } catch (err) {
      // Error haptic + shake animation
      setError(true);
      await triggerHaptic('error');

      // Reset error after animation
      setTimeout(() => setError(false), 500);
    }
  };

  const isErrorShaking = error;

  return (
    <Animated.View
      style={[
        styles.container,
        isErrorShaking && shakeStyle,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          styles[`button_${variant}`],
          disabled && styles.buttonDisabled,
          error && styles.buttonError,
        ]}
        onPress={handlePress}
        disabled={disabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={Colors.textPrimary}
          />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_primary: {
    backgroundColor: Colors.accentPrimary,
  },
  button_secondary: {
    backgroundColor: Colors.cardBg,
  },
  button_danger: {
    backgroundColor: Colors.warningRed,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonError: {
    backgroundColor: Colors.warningRed,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### 5.6 Animation Performance Guidelines

```
PERFORMANCE TARGETS:
✓ 60 FPS on all animations
✓ < 50ms animation startup delay
✓ Reanimated for continuous animations (pulse, scroll)
✓ Native Animated API for one-time transitions
✓ useNativeDriver: true on all animations

FORBIDDEN PRACTICES:
✗ DO NOT animate on JS thread (causes frame drops)
✗ DO NOT create new animation values in render
✗ DO NOT use setTimeout for animations (use withTiming)
✗ DO NOT animate color values (expensive - use opacity instead)
✗ DO NOT run multiple pulse animations simultaneously

OPTIMIZATION:
✓ Use worklets for complex calculations
✓ Memoize animated components
✓ Lazy load heavy animations
✓ Use interpolate() for value mapping
✓ Test on low-end devices (iPhone SE, Pixel 4a)
```

---

## 6. 📋 Integration Checklist

### 6.1 Component Implementation

- [ ] BalanceCard.tsx - Display current balance
- [ ] TransactionRow.tsx - List individual transactions
- [ ] InputSlider.tsx - Budget adjustment
- [ ] AppHeader.tsx - Top navigation bar
- [ ] MetricBadge.tsx - Metric display cards
- [ ] EventCard.tsx - Event/notification display
- [ ] RedZoneWarning.tsx - Crisis warning screen
- [ ] ActionButton.tsx - Primary CTA button

### 6.2 Animation Implementation

- [ ] useAnimationEngine.ts - Core animation hooks
- [ ] Fade-in animations on screen load
- [ ] Pop animations for new transactions
- [ ] Pulse animation for Red Zone warning
- [ ] Pull-to-refresh spinner

### 6.3 Screen Implementation

- [ ] HomeScreen.tsx - Main dashboard
- [ ] ProfileScreen.tsx - Character stats
- [ ] AssetsScreen.tsx - Housing/vehicle tier view
- [ ] MarketsScreen.tsx - Investment/loan marketplace
- [ ] EventsScreen.tsx - Event history/log

### 6.4 Data Binding Verification

- [ ] Zustand store properly initialized
- [ ] useGameStore hooks in all screens
- [ ] Real-time state updates on turn completion
- [ ] Haptic feedback on key actions
- [ ] Analytics tracking on major events

---

## 7. 🎯 Key Design Principles Summary

| Principle | Implementation |
|-----------|---|
| **Data-First UI** | Balance, numbers displayed prominently. UI secondary to information hierarchy |
| **Minimalist Dark Mode** | #0D0D0D primary bg, high contrast text. OLED-optimized |
| **Fintech Aesthetic** | Clean borders, generous spacing, no decoration. Focus on clarity |
| **Real-Time Feedback** | Animations + haptics on every interaction. No silent failures |
| **Mobile-First** | Portrait-only. Safe area awareness. Thumb-friendly button placement |
| **Performance** | Native Animated API. No unnecessary re-renders. <60ms frame drops |
| **Accessibility** | High contrast ratios. Large touch targets. Haptic alternatives for visual cues |

---

## 8. 📚 File Structure Reference

```
src/
├── theme/
│   ├── colors.ts           # Color palette
│   ├── typography.ts       # Font styles
│   ├── spacing.ts          # Layout grid
│   └── icons.ts            # Icon constants
│
├── animations/
│   └── useAnimationEngine.ts
│
├── components/
│   ├── common/
│   │   ├── BalanceCard.tsx
│   │   ├── TransactionRow.tsx
│   │   ├── AppHeader.tsx
│   │   ├── MetricBadge.tsx
│   │   └── ActionButton.tsx
│   │
│   ├── cards/
│   │   ├── EventCard.tsx
│   │   ├── StatCard.tsx
│   │   └── WarningCard.tsx
│   │
│   ├── inputs/
│   │   ├── InputSlider.tsx
│   │   └── NumberInput.tsx
│   │
│   ├── RedZoneWarning.tsx
│   └── HousingTierWidget.tsx
│
├── screens/
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── AssetsScreen.tsx
│   ├── MarketsScreen.tsx
│   └── EventsScreen.tsx
│
├── store/
│   └── gameStore.ts        # Zustand state (already exists)
│
├── engine/
│   └── gameLogic.ts        # Pure logic (already exists)
│
└── utils/
    ├── haptics.ts
    └── formatting.ts
```

---

## 9. 🚀 Implementation Priority (Phased)

### Phase 1: Core Components (Week 1)
- Theme system (colors, typography, spacing)
- BalanceCard, TransactionRow, MetricBadge
- AppHeader
- Basic HomeScreen layout

### Phase 2: Interactivity (Week 2)
- InputSlider component
- Pull-to-refresh with haptics
- Navigation between screens
- Animation engine integration

### Phase 3: Advanced UX (Week 3)
- Red Zone warning screen
- Event card system
- Housing tier widget
- Haptic feedback on all actions

### Phase 4: Polish (Week 4)
- Animation refinements
- Performance optimization
- Accessibility review
- Testing across devices

---

**Blueprint Created: 2025-12-06**
**Framework: React Native + Expo Router**
**Design System: Fintech Minimalism (Dark Mode OLED-Optimized)**
**State Management: Zustand**
