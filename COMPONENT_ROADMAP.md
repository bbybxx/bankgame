# 📋 Component Implementation Roadmap
## Micro-Request Decomposition Strategy

> This document breaks down the entire frontend into micro-requests (small, independent component tasks). Each request is small enough to fit in context window without sacrificing quality.

---

## 🎯 Strategy Overview

**Never request:** "Create HomeScreen.tsx" or "Build entire Loans screen"  
**Always request:** Component-by-component with DESIGN_CONTRACT

Each request is **isolated** and **testable**:
- One component = one file = one request
- ~200-400 lines of code max per component
- Includes all required imports and styles
- Ready to integrate after creation

---

## 📊 Phase Breakdown

### Phase 1: Foundation & Theme (Week 1)
**Goal:** Establish design system and base components  
**Status:** ⏳ Ready to start

#### 1.1 Theme System
- [ ] **colors.ts** — All color constants (16 base colors)
- [ ] **typography.ts** — All font styles (14 variations)
- [ ] **spacing.ts** — Grid system + border radius (10 values)
- [ ] **animations.ts** — Animation presets (durations + easing)

#### 1.2 Utility Functions
- [ ] **haptics.ts** — 7 haptic feedback types
- [ ] **formatting.ts** — Currency, number, date formatting
- [ ] **validators.ts** — Input validation helpers

#### 1.3 Store Setup
- [ ] **gameStore.ts** — Zustand store with persist middleware
- [ ] **types/index.ts** — All TS interfaces (mirrored from backend)

**Requests for Phase 1:** 13 files
**Estimated time:** 2-3 days

---

### Phase 2: Base Components (Week 2-3)
**Goal:** Reusable UI building blocks  
**Status:** ⏳ Waiting on Phase 1

#### 2.1 Header & Navigation
- [ ] **Header.tsx** — Profile + notifications bell
- [ ] **CustomTabBar.tsx** — Bottom navigation (5 tabs)

#### 2.2 Text & Display
- [ ] **BalanceDisplay.tsx** — Large balance with trend + eye toggle
- [ ] **MetricBadge.tsx** — Happiness, Stress, Prospects, Credit Score (circular progress)
- [ ] **StatCard.tsx** — Generic stat card with icon + value

#### 2.3 Buttons & Inputs
- [ ] **ActionButton.tsx** — CTA with disabled state, loading, reason text, haptics
- [ ] **InputSlider.tsx** — Slider with numeric input + quick presets (25%, 50%, 75%, 100%)
- [ ] **AmountPicker.tsx** — Dollar amount input field

#### 2.4 Cards
- [ ] **TransactionRow.tsx** — Single transaction (income/expense/transfer)
- [ ] **LoanCard.tsx** — Loan with balance, rate, min payment, [Pay Early] + [Refinance] buttons
- [ ] **AssetCard.tsx** — Housing/vehicle with tier, value, equity, [Upgrade] button
- [ ] **EventCard.tsx** — Event with title, description, 2-3 action buttons

#### 2.5 Feedback
- [ ] **Toast.tsx** — Toast notification (success/error/warning)
- [ ] **RedZoneWarning.tsx** — Overlay warning for financial crisis

**Requests for Phase 2:** 14 files
**Estimated time:** 1-2 weeks

---

### Phase 3: Sections (Week 3-4)
**Goal:** Groupings of components for screens  
**Status:** ⏳ Waiting on Phase 2

#### 3.1 Home Screen Sections
- [ ] **MetricsSection.tsx** — 4 metric badges in grid (Happiness, Stress, Prospects, Credit Score)
- [ ] **LoansSection.tsx** — Active loans list with [See More] button
- [ ] **AssetsSection.tsx** — Housing, Vehicle, Investments grid
- [ ] **TransactionsSection.tsx** — Recent transactions list
- [ ] **EventsSection.tsx** — Pending events carousel
- [ ] **JobSection.tsx** — Current job card + performance + [Apply] button

**Requests for Phase 3:** 6 files
**Estimated time:** 3-5 days

---

### Phase 4: Modals (Week 4-5)
**Goal:** User interaction dialogs  
**Status:** ⏳ Waiting on Phase 3

#### 4.1 Asset Purchase Modals
- [ ] **BuyHousingModal.tsx** — Select tier, show down payment, monthly costs, [Buy] button
- [ ] **BuyVehicleModal.tsx** — Similar to housing
- [ ] **BuyInvestmentModal.tsx** — Investment catalog, amount selector, [Invest] button

#### 4.2 Debt Management Modals
- [ ] **PayDownDebtModal.tsx** — Select loan, amount slider, show interest saved, [Pay] button
- [ ] **RefinanceLoanModal.tsx** — Show new rates, savings, [Refinance] button

#### 4.3 Career Modals
- [ ] **ApplyForJobModal.tsx** — Show job details, requirements, [Apply] button

#### 4.4 Event Modals
- [ ] **EventActionModal.tsx** — Generic event with multiple choice buttons

#### 4.5 Settings
- [ ] **SettingsModal.tsx** — Game speed, sound, notifications toggle

**Requests for Phase 4:** 8 files
**Estimated time:** 1-2 weeks

---

### Phase 5: Screens (Week 5-6)
**Goal:** Full screen components  
**Status:** ⏳ Waiting on Phase 4

#### 5.1 Main Screens
- [ ] **HomeScreen.tsx** — Main dashboard (combines header + sections)
- [ ] **AssetsScreen.tsx** — Full asset management (housing upgrade, vehicle upgrade, investments)
- [ ] **LoansScreen.tsx** — Full debt dashboard (all loans, refinance options, payment history)
- [ ] **JobScreen.tsx** — Career screen (current job, NPC chats, reputation)
- [ ] **HistoryScreen.tsx** — Transaction history with filters

**Requests for Phase 5:** 5 files
**Estimated time:** 1 week

---

### Phase 6: Navigation Setup (Week 6)
**Goal:** Tie everything together  
**Status:** ⏳ Waiting on Phase 5

- [ ] **AppNavigator.tsx** — Tab navigation + modal stack
- [ ] **app.tsx** — Root setup with SafeAreaProvider, GestureHandlerRootView

**Requests for Phase 6:** 2 files
**Estimated time:** 2-3 days

---

## 📝 Request Template

Use this template for **every component request**:

```
[DESIGN CONTRACT v1.0]
[PASTE ABBREVIATED CONTRACT FROM DESIGN_CONTRACT.md]

---

CREATE: src/components/[path]/[ComponentName].tsx

DESCRIPTION:
[Brief 1-2 line description]

DATA BINDING:
- Source: [Where data comes from - useGameStore, props, etc.]
- State: [What state this component manages, if any]

INTERACTIONS:
- Action: [What happens on interaction]
- Haptic: [Which haptic triggers]
- Result: [What changes after action]

DISABLED STATE:
- When: [Condition for disabled]
- Reason text: [Example message shown to user]

REQUIRED IMPORTS:
- Colors, Typography, Spacing, BorderRadius from theme
- [Any specific icons from lucide-react-native]
- [Any game logic functions]

STYLING NOTES:
- Primary accent: Colors.primary (#FF6B00)
- Background: Colors.backgroundCard (#1A1A1A)
- [Any specific visual requirements]

EXAMPLE USAGE (in parent component):
<ComponentName prop1={value1} prop2={value2} onAction={handler} />
```

---

## 📋 Phase 1 Requests (Start Here)

### Request 1.1: colors.ts

```
[DESIGN CONTRACT v1.0]
[ABBREVIATED CONTRACT]

---

CREATE: src/theme/colors.ts

DESCRIPTION:
Export all color constants used in the application.

COLORS TO EXPORT:
- Primary: #FF6B00 (orange)
- Backgrounds: #0D0D0D (true black), #1A1A1A (card), #252525 (elevated)
- Text: #FFFFFF (primary), #8E8E93 (secondary), #636366 (tertiary), #48484A (disabled)
- Status: #34C759 (success), #FF3B30 (error), #FFD60A (warning), #0A84FF (info)
- Transaction: #34C759 (income), #FF3B30 (expense), #FF6B00 (transfer)
- Sentiment: #FF3B30 (stress high), #FFD60A (stress medium), #34C759 (stress low)
- Borders: #38383A (border), #48484A (border light), #FF6B00 (border accent)
- UI: rgba(0,0,0,0.5) (overlay), rgba(0,0,0,0.8) (overlay dark)

EXPORT AS: const Colors = { ... } (named export)
TYPE: export type ColorName = keyof typeof Colors

EXAMPLE USAGE:
import { Colors } from '../../theme';
backgroundColor: Colors.primary,
```

---

### Request 1.2: typography.ts

```
[DESIGN CONTRACT v1.0]
[ABBREVIATED CONTRACT]

---

CREATE: src/theme/typography.ts

DESCRIPTION:
Export all typography variants (font sizes, weights, line heights).

VARIANTS TO EXPORT (use -apple-system font):
- displayLarge: 48px, bold (700), 56 line height
- displayMedium: 36px, bold (700), 44 line height
- displaySmall: 28px, semibold (600), 34 line height
- headlineLarge: 24px, semibold (600), 30 line height
- headlineMedium: 20px, semibold (600), 26 line height
- headlineSmall: 18px, semibold (600), 24 line height
- titleLarge: 16px, semibold (600), 22 line height
- titleMedium: 14px, semibold (600), 20 line height
- titleSmall: 12px, semibold (600), 18 line height, uppercase
- bodyLarge: 16px, regular (400), 24 line height
- bodyMedium: 14px, regular (400), 20 line height
- bodySmall: 12px, regular (400), 18 line height
- labelLarge: 14px, medium (500), 20 line height
- labelMedium: 12px, medium (500), 16 line height
- labelSmall: 10px, medium (500), 14 line height

FONT FAMILY: -apple-system, BlinkMacSystemFont, system-ui (fallback)

EXPORT AS: const Typography = { [key]: TextStyle } (named export)

EXAMPLE USAGE:
import { Typography } from '../../theme';
const styles = StyleSheet.create({
  title: { ...Typography.headlineLarge, color: Colors.textPrimary }
});
```

---

### Request 1.3: spacing.ts

```
[DESIGN CONTRACT v1.0]
[ABBREVIATED CONTRACT]

---

CREATE: src/theme/spacing.ts

DESCRIPTION:
Export spacing grid system and border radius values.

SPACING (4px base grid):
- xs: 4
- sm: 8
- base: 12
- md: 16
- lg: 20
- xl: 24
- xxl: 32
- xxxl: 40

SCREEN PADDING:
- screenPadding: 12
- screenPaddingLarge: 16

BORDER RADIUS:
- xs: 4
- sm: 8
- md: 12
- lg: 16
- xl: 20
- full: 9999 (circle)

EXPORT:
- const Spacing = { ... } (named export)
- const BorderRadius = { ... } (named export)

EXAMPLE USAGE:
import { Spacing, BorderRadius } from '../../theme';
paddingHorizontal: Spacing.lg,
borderRadius: BorderRadius.lg,
```

---

### Request 1.4: animations.ts

```
[DESIGN CONTRACT v1.0]
[ABBREVIATED CONTRACT]

---

CREATE: src/theme/animations.ts

DESCRIPTION:
Export animation durations and easing curves.

DURATIONS:
- micro: 150ms (quick feedback)
- short: 250ms (standard)
- medium: 400ms (noticeable)
- long: 600ms (dramatic)

EASING CURVES (cubic-bezier format):
- default: cubic-bezier(0.25, 0.1, 0.25, 1) (smooth)
- easeIn: cubic-bezier(0.42, 0, 1, 1)
- easeOut: cubic-bezier(0, 0, 0.58, 1)
- easeInOut: cubic-bezier(0.42, 0, 0.58, 1)
- spring: cubic-bezier(0.68, -0.55, 0.265, 1.55) (bouncy)

EXPORT AS: const AnimationConfig = { timings: { ... }, easing: { ... } }

EXAMPLE USAGE:
import { AnimationConfig } from '../../theme';
withTiming(1, { duration: AnimationConfig.timings.short })
```

---

## 🎯 Execution Checklist

For each phase:

1. **Before starting:** Copy ABBREVIATED CONTRACT from DESIGN_CONTRACT.md
2. **Make request:** Paste contract + use request template
3. **After generation:**
   - [ ] Verify all colors use `Colors.xxx`
   - [ ] Verify all spacing uses `Spacing.xxx`
   - [ ] Verify all typography uses `Typography.xxx`
   - [ ] Check for hardcoded colors/spacing/fonts
   - [ ] Ensure haptics on interactions (if interactive)
   - [ ] Verify disabled states (if applicable)
4. **If violations found:** Request fix with specific violations cited

---

## ⏱️ Timeline Estimate

| Phase | Duration | Requests | Status |
|-------|----------|----------|--------|
| **Phase 1: Foundation** | 2-3 days | 13 | Ready |
| **Phase 2: Base Components** | 1-2 weeks | 14 | Waiting Phase 1 |
| **Phase 3: Sections** | 3-5 days | 6 | Waiting Phase 2 |
| **Phase 4: Modals** | 1-2 weeks | 8 | Waiting Phase 3 |
| **Phase 5: Screens** | 1 week | 5 | Waiting Phase 4 |
| **Phase 6: Navigation** | 2-3 days | 2 | Waiting Phase 5 |
| **TOTAL** | **4-5 weeks** | **48 files** | ⏳ |

---

## 🚀 How to Use This Document

### Day 1:
1. Read DESIGN_CONTRACT.md completely
2. Make Request 1.1 (colors.ts)
3. Verify the output
4. File created? ✅ Move to 1.2

### Day 2:
5. Make Requests 1.2 (typography.ts), 1.3 (spacing.ts), 1.4 (animations.ts)
6. Verify all three
7. All files good? ✅ Move to Phase 1 utilities

### Day 3:
8. Make utility requests (haptics.ts, formatting.ts, validators.ts)
9. Set up gameStore.ts with types/index.ts
10. Phase 1 complete? ✅ Ready for Phase 2!

---

## 📞 If a Component Violates the Contract

**Immediate fix request:**

```
VIOLATION DETECTED in [ComponentName].tsx:

Issues:
1. Line X: backgroundColor: '#1a1a1a' ← Should use Colors.backgroundCard
2. Line Y: padding: 16 ← Should use Spacing.md
3. Line Z: Missing haptic feedback on button press

REQUESTED FIX:
Please regenerate [ComponentName].tsx to comply with DESIGN_CONTRACT.md.
Ensure:
- All colors from Colors object
- All spacing from Spacing object
- All typography from Typography object
- Haptics on every interaction
- Disabled states properly implemented
```

---

**Version:** 1.0  
**Status:** Implementation Ready  
**Last Updated:** December 2025
