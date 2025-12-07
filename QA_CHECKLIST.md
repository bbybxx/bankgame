# ✅ Quality Assurance Checklist

> Post-generation verification checklist for every component created. Use this to catch violations before integration.

---

## 🔍 Pre-Integration Checklist (For Every Component)

Copy this checklist and verify **before** integrating a new component into the project.

---

## 1. Import Verification

- [ ] Imports are from correct paths:
  - [ ] `Colors` from `'../../theme'` (not `'../theme'` or relative to src)
  - [ ] `Typography` from `'../../theme'`
  - [ ] `Spacing` from `'../../theme'`
  - [ ] `BorderRadius` from `'../../theme'`
  - [ ] `triggerHaptic` from `'../../utils/haptics'` (if interactive)
  - [ ] `useGameStore` from `'../../store/gameStore'` (if using game state)

- [ ] No forbidden imports:
  - ❌ `import Colors from '...'` (should be destructured)
  - ❌ `const colors = require('...')`
  - ❌ Direct path imports like `from '../../src/theme'`

---

## 2. Color Hardcoding Scan

**Search the file for forbidden patterns:**

```bash
# Run this to find hardcoded colors:
grep -E "#[0-9A-Fa-f]{6}|'white'|'black'|'gray'|'blue'|'red'" [ComponentName].tsx
```

- [ ] ✅ ZERO matches (all colors should use Colors object)
- [ ] ✅ ZERO color names like 'white', 'gray', 'blue'
- [ ] ✅ ZERO RGB hex codes like '#FFFFFF'

**Every color should be:**
```typescript
color: Colors.textPrimary,        // ✅ GOOD
backgroundColor: Colors.primary,  // ✅ GOOD
color: 'white',                   // ❌ BAD
backgroundColor: '#FFFFFF',       // ❌ BAD
```

---

## 3. Spacing Hardcoding Scan

**Search for raw numbers:**

```bash
# Find hardcoded spacing:
grep -E ":\s*[0-9]+[,}]" [ComponentName].tsx | grep -E "padding|margin|gap|height|width"
```

- [ ] ✅ All padding values use `Spacing.xxx`
- [ ] ✅ All margin values use `Spacing.xxx`
- [ ] ✅ All gap values use `Spacing.xxx`
- [ ] ✅ No numbers like `16`, `20`, `24` for spacing

**Every spacing should be:**
```typescript
paddingHorizontal: Spacing.lg,    // ✅ GOOD
marginVertical: Spacing.md,       // ✅ GOOD
paddingHorizontal: 20,            // ❌ BAD
marginVertical: 16,               // ❌ BAD
```

---

## 4. Font Size Hardcoding Scan

**Search for font sizes:**

```bash
# Find hardcoded font sizes:
grep -E "fontSize:\s*[0-9]+" [ComponentName].tsx
```

- [ ] ✅ ZERO raw `fontSize: 16` values
- [ ] ✅ All typography uses `...Typography.xxx`

**Every text style should be:**
```typescript
const styles = StyleSheet.create({
  title: {
    ...Typography.headlineLarge,   // ✅ GOOD
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,                  // ❌ BAD
    fontWeight: '400',
  },
});
```

---

## 5. Border Radius Verification

- [ ] ✅ All border radius values use `BorderRadius.xxx`
- [ ] ✅ Cards use `BorderRadius.lg` (16px)
- [ ] ✅ Buttons use `BorderRadius.lg` (16px)
- [ ] ✅ Small elements use `BorderRadius.md` (12px)
- [ ] ✅ Circular elements use `BorderRadius.full` (9999px)

---

## 6. Disabled State Handling

**For interactive components (buttons, inputs, etc.):**

- [ ] ✅ Component accepts `disabled?: boolean` prop
- [ ] ✅ Component accepts `disabledReason?: string` prop
- [ ] ✅ When disabled:
  - [ ] Visual change (opacity: 0.5 OR different background)
  - [ ] Touch interaction blocked or no-op
  - [ ] Reason text displayed if provided
- [ ] ✅ Disabled reason shows underneath button/input
- [ ] ✅ Disabled color uses `Colors.textDisabled`

**Example good disabled state:**
```typescript
disabled && {
  opacity: 0.5,
}

// Or in component logic:
if (disabled) {
  return <View style={[styles.button, styles.disabledButton]} />;
}
```

---

## 7. Haptic Feedback Verification

**For every interactive element:**

- [ ] ✅ Button press → `triggerHaptic('tapLight')` or `'tapMedium'`
- [ ] ✅ Slider change → `triggerHaptic('selection')`
- [ ] ✅ Form submit → `triggerHaptic('tapMedium')`
- [ ] ✅ Success action → `triggerHaptic('success')`
- [ ] ✅ Error → `triggerHaptic('error')`
- [ ] ✅ Disabled interaction → `triggerHaptic('warning')`

**Pattern to verify:**
```typescript
const handlePress = async () => {
  if (disabled) {
    await triggerHaptic('warning');  // ✅ GOOD
    return;
  }
  await triggerHaptic('tapMedium');   // ✅ GOOD
  try {
    await onPress();
  } catch (error) {
    await triggerHaptic('error');     // ✅ GOOD
  }
};

// ❌ BAD - No haptics
const handlePress = () => {
  onPress();
};
```

---

## 8. State Management Verification

**If component uses game state:**

- [ ] ✅ Uses `useGameStore(s => s.playerStats)` for reading
- [ ] ✅ Uses `useGameStore(s => s.actionName)` for actions
- [ ] ✅ NO `useState` for game state (only UI state like modals, temp values)
- [ ] ✅ State changes go through Zustand, not component state

**Correct pattern:**
```typescript
// ✅ GOOD - Game state from Zustand
const playerStats = useGameStore(s => s.playerStats);
const nextTurn = useGameStore(s => s.nextTurn);

// ✅ GOOD - UI state in useState (NOT game state)
const [isVisible, setIsVisible] = useState(false);

// ❌ BAD - Game state in useState
const [balance, setBalance] = useState(playerStats.balanceDebit);
```

---

## 9. TypeScript Verification

- [ ] ✅ Component has proper interface/props type:
  ```typescript
  interface ComponentNameProps {
    prop1: string;
    prop2: number;
    onAction?: () => void;
  }
  ```
- [ ] ✅ Component exported with `React.FC<Props>`
- [ ] ✅ No `any` types (use specific types)
- [ ] ✅ All props documented

---

## 10. StyleSheet Verification

- [ ] ✅ Uses `StyleSheet.create()` (not inline objects)
- [ ] ✅ All styles defined in single `styles` object at bottom
- [ ] ✅ No inline `style={}` (except spreads like `[styles.base, styles.variant]`)
- [ ] ✅ Responsive? Uses Dimensions if needed

**Correct pattern:**
```typescript
// ✅ GOOD
<View style={styles.container} />
<View style={[styles.button, disabled && styles.disabled]} />

// ❌ BAD
<View style={{ backgroundColor: '#fff', padding: 16 }} />
```

---

## 11. Accessibility Verification

- [ ] ✅ Text contrast ratio ≥ 4.5:1 (AA standard)
- [ ] ✅ Check: Text Primary (#FFFFFF) on Background (#0D0D0D) = 21:1 ✓
- [ ] ✅ Check: Text Secondary (#8E8E93) on Background (#0D0D0D) = 5.8:1 ✓
- [ ] ✅ Check: Text Tertiary (#636366) on Background = DO NOT USE on dark background ✗
- [ ] ✅ All buttons have `accessible={true}` with `accessibilityLabel`
- [ ] ✅ No color-only information (use text + icons)

**Avoid low-contrast combinations:**
```typescript
// ❌ BAD - Low contrast
color: Colors.textTertiary,      // #636366 = too dark on dark background

// ✅ GOOD - High contrast
color: Colors.textSecondary,     // #8E8E93 = sufficient contrast
```

---

## 12. Prop Documentation

- [ ] ✅ All props have JSDoc comments:
  ```typescript
  interface BalanceDisplayProps {
    /** Current balance in dollars */
    balance: number;
    /** Previous balance for trend calculation */
    previousBalance: number;
    /** Whether to hide balance with dots */
    isHidden?: boolean;
    /** Callback when visibility toggled */
    onToggleVisibility?: () => void;
  }
  ```

---

## 13. No Mute Buttons

- [ ] ✅ Every button has haptic feedback
- [ ] ✅ Every touchable has feedback (visual + haptic)
- [ ] ✅ Users FEEL their interactions

---

## 14. File Structure Verification

- [ ] ✅ File in correct folder:
  - Components: `src/components/[category]/[ComponentName].tsx`
  - Screens: `src/screens/[ScreenName].tsx`
  - Theme: `src/theme/[name].ts`
  - Utilities: `src/utils/[name].ts`

- [ ] ✅ Filename matches component name (PascalCase)
- [ ] ✅ Index exports exist: `src/components/[category]/index.ts`

---

## 15. Integration Ready Checklist

Final verification before adding to project:

- [ ] ✅ **All 14 checks above passed**
- [ ] ✅ Runs without console errors
- [ ] ✅ Renders correctly on device/emulator
- [ ] ✅ Disabled states work
- [ ] ✅ Haptics trigger on interaction
- [ ] ✅ All props optional or required (no undefined)
- [ ] ✅ Ready for integration

---

## 📋 Violation Quick-Fix Template

If violations found, use this template to request fixes:

```
VIOLATIONS FOUND in [ComponentName].tsx:

1. ❌ Line 15: backgroundColor: '#1a1a1a' 
   FIX: backgroundColor: Colors.backgroundCard

2. ❌ Line 32: padding: 16
   FIX: padding: Spacing.md

3. ❌ Line 48: fontSize: 24
   FIX: Add to Typography, then use ...Typography.headlineSmall

4. ❌ Line 56: Button has no haptic on press
   FIX: Add await triggerHaptic('tapLight') on press

5. ❌ Line 72: color: Colors.textTertiary (contrast issue)
   FIX: Use Colors.textSecondary instead

REQUEST:
Please regenerate [ComponentName].tsx fixing all violations above.
Verify against DESIGN_CONTRACT.md before returning.
```

---

## 🎯 Automated Check Script

Save as `verify-component.sh`:

```bash
#!/bin/bash

file=$1

echo "🔍 Scanning $file for violations..."

# Check hardcoded colors
echo ""
echo "1️⃣  Hardcoded colors:"
grep -n -E "#[0-9A-Fa-f]{6}|'white'|'black'|'gray'|'blue'" "$file" || echo "✅ None found"

# Check hardcoded spacing
echo ""
echo "2️⃣  Hardcoded spacing:"
grep -n -E "padding|margin|gap|width|height" "$file" | grep -E ":\s*[0-9]+[,}]" || echo "✅ None found"

# Check hardcoded font sizes
echo ""
echo "3️⃣  Hardcoded font sizes:"
grep -n "fontSize:" "$file" | grep -v "Typography" || echo "✅ None found"

# Check imports
echo ""
echo "4️⃣  Imports:"
grep -n "^import" "$file" | head -10

echo ""
echo "✅ Scan complete. Review violations above."
```

Usage:
```bash
bash verify-component.sh src/components/common/BalanceDisplay.tsx
```

---

## 📊 Component Sign-Off Template

After passing all checks, add this header comment to the component:

```typescript
/**
 * [ComponentName]
 * 
 * ✅ QA Sign-Off: [Date]
 * - All colors from Colors object
 * - All spacing from Spacing object
 * - All typography from Typography object
 * - Haptics implemented on interactions
 * - Disabled states handled
 * - TypeScript strict
 * - Accessibility compliant (4.5:1 contrast)
 * 
 * Props:
 * - [prop1]: [type] - [description]
 * - [prop2]: [type] - [description]
 * 
 * Example:
 * <ComponentName prop1={value1} prop2={value2} />
 */
```

---

**Version:** 1.0  
**Status:** Ready for use  
**Last Updated:** December 2025
