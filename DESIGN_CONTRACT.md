# 🎨 Design Contract - Mandatory Rules for Every Component

> This contract MUST be included in every component creation request. It serves as the "contextual anchor" to prevent style drift.

---

## 🔴 CRITICAL: Read This Before Every Component Request

This document defines the non-negotiable design rules. Copy the **ABBREVIATED CONTRACT** (below) into every prompt to IA to prevent context loss.

---

## 📋 ABBREVIATED CONTRACT (Copy This Into Every Request)

```
[DESIGN CONTRACT v1.0]

LANGUAGE: TypeScript + React Native (Expo)
STYLING: React Native StyleSheet.create()
THEME: Dark Mode (OLED Optimized) + Fintech Minimalism

MANDATORY COLORS (NEVER hardcode):
  • Primary (Orange): Colors.primary (#FF6B00)
  • Text Primary: Colors.textPrimary (#FFFFFF)
  • Text Secondary: Colors.textSecondary (#8E8E93)
  • Background: Colors.background (#0D0D0D)
  • Card Background: Colors.backgroundCard (#1A1A1A)
  • Surface: Colors.surface (#1C1C1E)
  • Success: Colors.success (#34C759)
  • Error: Colors.error (#FF3B30)
  • Warning: Colors.warning (#FFD60A)

MANDATORY IMPORTS:
  import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

SPACING (NEVER hardcode):
  • xs: 4px | sm: 8px | base: 12px | md: 16px | lg: 20px | xl: 24px | xxl: 32px
  • Use: Spacing.xs, Spacing.sm, Spacing.base, etc.

TYPOGRAPHY (NEVER hardcode font sizes):
  • Display (48px): Typography.displayLarge
  • Headline (24px): Typography.headlineLarge
  • Title (16px): Typography.titleLarge
  • Body (14px): Typography.bodyMedium
  • Label (12px): Typography.labelMedium
  • Always use: ...Typography.typeName in StyleSheet

BORDER RADIUS:
  • Small: BorderRadius.md (12px)
  • Large: BorderRadius.lg (16px)
  • Cards: BorderRadius.lg
  • Buttons: BorderRadius.lg
  • Full Circle: BorderRadius.full (9999px)

DISABLED STATES:
  • Opacity: 0.5
  • Color: Colors.textDisabled (#48484A)
  • Use ActionButton pattern for all CTAs

HAPTICS (EVERY user interaction):
  • Button press: await triggerHaptic('tapLight')
  • Form submit: await triggerHaptic('tapMedium')
  • Success: await triggerHaptic('success')
  • Error: await triggerHaptic('error')
  • Import: import { triggerHaptic } from '../../utils/haptics'

ANIMATIONS (if needed):
  • Use Reanimated: import Animated from 'react-native-reanimated'
  • Spring for pop-in: withSpring(1, { damping: 8 })
  • Fade: withTiming(1, { duration: 150 })

STATE MANAGEMENT:
  • Use Zustand: import { useGameStore } from '../../store/gameStore'
  • NEVER use useState for game state
  • Read-only: useGameStore(s => s.playerStats)
  • Actions: useGameStore(s => s.nextTurn)

MODAL PATTERN:
  • Children first (content)
  • Footer buttons last
  • Background: Colors.overlay ('rgba(0, 0, 0, 0.5)')
  • Container: Colors.backgroundElevated (#252525)

NO:
  ❌ Hardcoded colors (white, #fff, gray, blue)
  ❌ Hardcoded spacing (16, 20, 24 as raw numbers)
  ❌ Hardcoded font sizes
  ❌ Missing haptics on interactions
  ❌ UI state in useState (game state only in Zustand)
  ❌ Missing disabled state handling
  ❌ Colors without a11y contrast ratio ≥ 4.5:1

YES:
  ✅ All colors from Colors object
  ✅ All spacing from Spacing object
  ✅ All typography from Typography object
  ✅ Every button has haptic feedback
  ✅ Disabled states implemented
  ✅ High contrast ratios
  ✅ Imports from src/theme and src/utils/haptics
```

---

## 📐 Full Design Rules

### Rule 1: Import Structure

Every component MUST have these imports:

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { [IconName] } from 'lucide-react-native'; // If using icons
import Animated from 'react-native-reanimated'; // If animating
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { triggerHaptic } from '../../utils/haptics'; // If interactive
```

❌ DO NOT:
```typescript
import Colors from '../../theme'; // Wrong path
const colors = require('...'); // Never require
```

---

### Rule 2: Color Usage

✅ CORRECT:
```typescript
backgroundColor: Colors.primary,
color: Colors.textPrimary,
borderColor: Colors.border,
```

❌ WRONG:
```typescript
backgroundColor: '#FF6B00', // Hardcoded
color: 'white', // English color name
borderColor: '#333', // Hardcoded gray
```

---

### Rule 3: Spacing Usage

✅ CORRECT:
```typescript
paddingHorizontal: Spacing.lg,
marginVertical: Spacing.md,
gap: Spacing.sm,
```

❌ WRONG:
```typescript
paddingHorizontal: 20,
marginVertical: 16,
gap: 8,
```

---

### Rule 4: Typography Usage

✅ CORRECT:
```typescript
const styles = StyleSheet.create({
  title: {
    ...Typography.headlineLarge,
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
});
```

❌ WRONG:
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
  },
});
```

---

### Rule 5: Button Pattern (All CTAs)

Every button MUST follow this pattern:

```typescript
interface ActionButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  disabledReason?: string;
  loading?: boolean;
}

const handlePress = async () => {
  if (disabled) {
    await triggerHaptic('warning');
    return;
  }
  await triggerHaptic('tapMedium');
  try {
    await onPress();
  } catch (error) {
    await triggerHaptic('error');
  }
};

<TouchableOpacity
  onPress={handlePress}
  disabled={disabled || loading}
  style={[styles.button, disabled && styles.disabled]}
>
  <Text style={styles.buttonText}>{label}</Text>
</TouchableOpacity>
```

---

### Rule 6: Disabled State Pattern

✅ CORRECT:

```typescript
const isDisabled = playerStats.balanceDebit < requiredAmount;
const disabledReason = isDisabled 
  ? `Need $${requiredAmount - playerStats.balanceDebit} more` 
  : undefined;

<ActionButton
  label="Buy"
  onPress={handleBuy}
  disabled={isDisabled}
  disabledReason={disabledReason}
/>
```

---

### Rule 7: Haptic Feedback Mapping

| Action | Haptic | Code |
|--------|--------|------|
| Standard button press | `tapLight` | `await triggerHaptic('tapLight')` |
| Form submission | `tapMedium` | `await triggerHaptic('tapMedium')` |
| Success action | `success` | `await triggerHaptic('success')` |
| Error/invalid | `error` | `await triggerHaptic('error')` |
| Slider change | `selection` | `await triggerHaptic('selection')` |
| Warning (disabled) | `warning` | `await triggerHaptic('warning')` |

---

### Rule 8: State Management

✅ CORRECT:
```typescript
const playerStats = useGameStore(s => s.playerStats);
const nextTurn = useGameStore(s => s.nextTurn);

// Use in component
<Text>{playerStats.balanceDebit}</Text>
```

❌ WRONG:
```typescript
const [balance, setBalance] = useState(0); // Never useState for game state
```

---

### Rule 9: Modal Pattern

```typescript
<View style={styles.overlay}>
  <View style={styles.modal}>
    {/* Content */}
    <View style={styles.content}>
      <Text style={styles.title}>Title</Text>
      <Text style={styles.body}>Body text</Text>
    </View>

    {/* Footer with buttons */}
    <View style={styles.footer}>
      <ActionButton
        label="Cancel"
        onPress={onClose}
        variant="secondary"
      />
      <ActionButton
        label="Confirm"
        onPress={handleConfirm}
        variant="primary"
      />
    </View>
  </View>
</View>

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end', // or 'center'
  },
  modal: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
});
```

---

### Rule 10: No Accessibility Violations

✅ CORRECT:
```typescript
// Contrast ratio ≥ 4.5:1 for AA compliance
textColor: Colors.textPrimary, // #FFFFFF on #0D0D0D = 21:1 ✓
```

❌ WRONG:
```typescript
// Low contrast (will fail accessibility check)
textColor: Colors.textTertiary, // #636366 on #0D0D0D = 2.5:1 ✗
```

---

## 🚨 "Mute Buttons" Prevention

If a component has interactive elements, it MUST have haptic feedback. This prevents the "floating UI" feeling where users tap but nothing happens.

```typescript
// ❌ BAD - Silent button
<TouchableOpacity onPress={() => handleBuy()}>
  <Text>Buy Housing</Text>
</TouchableOpacity>

// ✅ GOOD - Haptic feedback
<TouchableOpacity onPress={async () => {
  await triggerHaptic('tapMedium');
  await handleBuy();
}}>
  <Text>Buy Housing</Text>
</TouchableOpacity>
```

---

## 📋 Component Checklist

Before requesting a component, verify it will have:

- [ ] All colors from `Colors` object
- [ ] All spacing from `Spacing` object
- [ ] All typography from `Typography` object
- [ ] All borders from `BorderRadius` object
- [ ] Haptic feedback on every interactive element
- [ ] Disabled state handling (if applicable)
- [ ] Disabled reason text (if applicable)
- [ ] State management via Zustand (not useState for game state)
- [ ] Proper imports from `src/theme` and `src/utils`
- [ ] StyleSheet.create() for styles
- [ ] No hardcoded colors, spacing, or font sizes
- [ ] Accessibility contrast ratio ≥ 4.5:1

---

## 🎯 How to Use This Contract

### When Requesting a Component:

1. Copy the **ABBREVIATED CONTRACT** above
2. Paste it into your request to the AI
3. Then describe what you need:

```
[DESIGN CONTRACT v1.0]
[paste abbreviated contract here]

---

CREATE: src/components/common/BalanceDisplay.tsx

Requirements:
- Display playerStats.balanceDebit in large orange text
- Show trend indicator (↑ green or ↓ red)
- Use eye icon to toggle visibility
- Animate balance change with spring effect
```

4. **CRITICAL:** After the component is generated, verify:
   - ✅ All colors use `Colors.xxx`
   - ✅ All spacing uses `Spacing.xxx`
   - ✅ All typography uses `Typography.xxx`
   - ✅ Haptics on every interaction
   - ✅ Disabled states handled

---

## 🔍 Example: Good vs Bad Component

### ❌ BAD (Style Drift)

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const BalanceDisplay = ({ balance }) => (
  <View style={styles.container}>
    <Text style={styles.amount}>${balance}</Text>
    <TouchableOpacity onPress={() => console.log('clicked')}>
      <Text>View</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a', // ❌ Hardcoded
    padding: 16, // ❌ Hardcoded
  },
  amount: {
    fontSize: 36, // ❌ Hardcoded
    fontWeight: '600', // ❌ Hardcoded
    color: 'white', // ❌ Hardcoded
  },
});
```

### ✅ GOOD (Contract-Compliant)

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import { triggerHaptic } from '../../utils/haptics';

interface BalanceDisplayProps {
  balance: number;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  const handlePress = async () => {
    await triggerHaptic('tapLight');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.amount}>${balance.toLocaleString()}</Text>
      <TouchableOpacity onPress={handlePress}>
        <Eye size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard, // ✅ From Colors
    padding: Spacing.lg, // ✅ From Spacing
    borderRadius: BorderRadius.lg, // ✅ From BorderRadius
  },
  amount: {
    ...Typography.displayLarge, // ✅ From Typography
    color: Colors.primary, // ✅ From Colors
  },
});
```

---

## 📞 Support

If you generate a component and it **violates the contract**, immediately:

1. Point out the violation
2. Request: `"Fix this component to comply with DESIGN_CONTRACT.md"`
3. The AI will know exactly what to fix

---

**Version:** 1.0  
**Status:** Mandatory for all component requests  
**Last Updated:** December 2025
