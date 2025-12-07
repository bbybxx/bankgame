# 🏆 Elite Banking App - Comprehensive Design System
## Premium Financial Dashboard Architecture

> **Философия:** Элитный банкинг требует изысканности, не минимализма. Каждый пиксель должен излучать статус, доверие и финансовую мощь.

---

## 📐 Архитектурные Принципы

### 1. **Visual Hierarchy (Визуальная Иерархия)**

**Проблема текущего дизайна:** Все элементы имеют одинаковый визуальный вес. Нет фокуса.

**Решение:**
```
Уровень 1 (Hero): Баланс + аватар пользователя
  ↓ 90% внимания в первые 2 секунды
  
Уровень 2 (Critical): Метрики (Happiness, Stress, Prospects, Credit)
  ↓ Критические индикаторы здоровья
  
Уровень 3 (Context): Expenses, Salary, Rent
  ↓ Контекстная информация
  
Уровень 4 (Actions): Кнопки навигации
  ↓ Призывы к действию
```

### 2. **Depth & Layering (Глубина и Слои)**

**Проблема:** Плоские карточки без ощущения пространства.

**Решение:**
- **Z-axis:** 5 слоев глубины (от -2 до +3)
- **Elevation System:**
  - Background: z-0 (canvas)
  - Cards: z-1 (4px shadow, 0.08 opacity)
  - Interactive: z-2 (8px shadow, 0.12 opacity, scale on hover)
  - Modals: z-3 (16px shadow, 0.18 opacity)
  - Tooltips: z-4 (24px shadow, 0.24 opacity)

### 3. **Motion & Animation**

**Проблема:** Статичные переходы без жизни.

**Решение:**
- **Micro-interactions:** 
  - Card hover: scale(1.02) + glow (150ms ease-out)
  - Button press: scale(0.98) + haptic (80ms)
  - Number change: count-up animation (500ms)
  - Modal open: slide + fade (300ms cubic-bezier)
  
---

## 🎨 Visual Design Language

### **Color System v2.0 (Elite Edition)**

#### **Primary Palette**
```typescript
export const EliteColors = {
  // Signature Color (Brand Identity)
  gold: {
    primary: '#D4AF37',        // Metallic gold
    light: '#E5C158',          // Light gold (hover)
    dark: '#B8941F',           // Deep gold (pressed)
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #E5C158 50%, #B8941F 100%)',
  },
  
  // Accent (Secondary Brand)
  copper: {
    primary: '#B87333',        // Rose gold / copper
    light: '#D4915A',
    dark: '#8B5A2B',
  },
  
  // Status (Semantic)
  wealth: {
    profit: '#00C853',         // Vibrant green (gains)
    loss: '#D32F2F',           // Deep red (losses)
    neutral: '#5E8C8C',        // Teal (stable)
  },
  
  // Surfaces (OLED-optimized with subtle gradients)
  surface: {
    background: '#000000',     // Pure black (OLED)
    card: {
      default: '#0F0F0F',      // Almost black
      elevated: '#1A1A1A',     // Slightly lighter
      hero: 'linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 100%)',
    },
    glass: 'rgba(255, 255, 255, 0.03)', // Glassmorphism
    overlay: 'rgba(0, 0, 0, 0.85)',
  },
  
  // Text (Hierarchy)
  text: {
    hero: '#FFFFFF',           // Pure white (hero numbers)
    primary: '#F5F5F5',        // Off-white (main text)
    secondary: '#A0A0A0',      // Gray (labels)
    tertiary: '#6B6B6B',       // Dark gray (metadata)
    disabled: '#404040',       // Very dark gray
    gold: '#D4AF37',           // Gold text (highlights)
  },
  
  // Borders (Subtle accents)
  border: {
    default: 'rgba(255, 255, 255, 0.08)',
    focus: 'rgba(212, 175, 55, 0.4)',    // Gold focus
    divider: 'rgba(255, 255, 255, 0.05)',
  },
};
```

#### **Gradient Library**
```typescript
export const EliteGradients = {
  // Hero backgrounds
  heroBalance: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
  heroCard: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
  
  // Status overlays
  positive: 'linear-gradient(90deg, rgba(0, 200, 83, 0.1) 0%, transparent 100%)',
  negative: 'linear-gradient(90deg, rgba(211, 47, 47, 0.1) 0%, transparent 100%)',
  
  // Metric cards
  happiness: 'linear-gradient(135deg, rgba(0, 200, 83, 0.15) 0%, transparent 100%)',
  stress: 'linear-gradient(135deg, rgba(211, 47, 47, 0.15) 0%, transparent 100%)',
  prospects: 'linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, transparent 100%)',
  credit: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, transparent 100%)',
  
  // Glass effect
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
};
```

### **Typography System v2.0**

```typescript
export const EliteTypography = {
  // Hero Numbers (Balance, Large Amounts)
  hero: {
    fontSize: 64,              // Увеличено с 48
    fontWeight: '700',
    lineHeight: 72,
    letterSpacing: -1.5,       // Tight spacing
    fontFamily: 'SF Pro Display',
    textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)', // Gold glow
  },
  
  // Monetary Values
  currency: {
    large: {
      fontSize: 42,
      fontWeight: '700',
      letterSpacing: -0.8,
      fontVariant: 'tabular-nums', // Monospace numbers
    },
    medium: {
      fontSize: 28,
      fontWeight: '600',
      letterSpacing: -0.5,
    },
    small: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0,
    },
  },
  
  // Headings
  heading: {
    h1: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
    h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
    h3: { fontSize: 20, fontWeight: '600', letterSpacing: 0 },
    h4: { fontSize: 16, fontWeight: '600', letterSpacing: 0.1 },
  },
  
  // Body
  body: {
    large: { fontSize: 17, fontWeight: '400', lineHeight: 26 },
    medium: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
    small: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  },
  
  // Labels (uppercase, tracking)
  label: {
    large: { 
      fontSize: 13, 
      fontWeight: '700', 
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    medium: { 
      fontSize: 11, 
      fontWeight: '700', 
      textTransform: 'uppercase',
      letterSpacing: 1.0,
    },
    small: { 
      fontSize: 10, 
      fontWeight: '600', 
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
  },
  
  // Metadata (timestamps, etc)
  metadata: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B6B6B',
    fontVariant: 'small-caps',
  },
};
```

### **Spacing System v2.0**

```typescript
export const EliteSpacing = {
  // Component spacing
  xs: 6,
  sm: 12,
  base: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  
  // Section spacing
  section: {
    small: 24,
    medium: 32,
    large: 48,
  },
  
  // Card spacing
  card: {
    padding: {
      compact: 16,
      default: 20,
      spacious: 24,
      hero: 32,
    },
    gap: 16,
  },
  
  // Layout
  layout: {
    screenPadding: 20,
    maxWidth: 1200,
    gridGap: 16,
  },
};
```

### **Shadow System (Elevation)**

```typescript
export const EliteShadows = {
  // iOS-style shadows
  none: 'none',
  
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
    elevation: 12,
  },
  
  // Special: Gold glow
  goldGlow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Special: Inner shadow (inset)
  inner: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 0,
  },
};
```

---

## 📱 Screen Architecture (Детальная Структура)

### **1. Home Screen (Главная) - "Classic Banking Dashboard"**

> **Философия:** Чистое банковское приложение. Баланс, расходы, транзакции. Без метрик счастья - это для отдельного экрана.

#### **Layout Structure (По вашему скетчу)**
```
┌─────────────────────────────────────┐
│ @ Name >        [🏪][💼][📊][⚙️]  │ <- Top Nav (Name + 4 icons)
│                                     │
│ ┌─────────────────────────────────┐ │ <- Balance Cards (3 балансa)
│ │ $1000        $11000      $2003  │ │
│ │ Debt         Expenses    [Свой] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ <- Expenses Progress
│ │ Expenses       $2003            │ │
│ │ [████████████░░░░░░░░]          │ │
│ │                                 │ │
│ │ Recent                          │ │ <- Recent Transactions
│ │ ───────────────────────────────│ │
│ │ @ Salary            +$1600     │ │
│ │ @ Rent              -$1000     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠]  [▣]  [🔍]                     │ <- Bottom Nav (3 кнопки)
└─────────────────────────────────────┘
```

**Структура по секциям:**
1. **Top Navigation** - имя + 4 иконки быстрого доступа
2. **Balance Cards** - 3 карточки ($1000 Debt, $11000, $2003)
3. **Expenses Overview** - большая карточка с прогресс-баром
4. **Recent Transactions** - последние 2-3 операции (Salary, Rent)
5. **Bottom Navigation** - Home, другие экраны

#### **Top Navigation Bar**

**Структура (как на скетче):**
```tsx
<View style={styles.topNav}>
  {/* Left: Name with @ symbol and chevron */}
  <TouchableOpacity style={styles.nameButton} onPress={goToProfile}>
    <Text style={styles.atSymbol}>@</Text>
    <Text style={styles.playerName}>{playerName}</Text>
    <ChevronRight size={16} color={EliteColors.text.secondary} />
  </TouchableOpacity>
  
  {/* Right: 4 Quick Action Icons */}
  <View style={styles.quickIcons}>
    <IconButton 
      icon={<ShoppingBag />} 
      onPress={() => router.push('/marketplace')}
      label="Market"
    />
    <IconButton 
      icon={<Briefcase />} 
      onPress={() => router.push('/jobs')}
      label="Job"
    />
    <IconButton 
      icon={<BarChart3 />} 
      onPress={() => router.push('/stats')}
      label="Stats"
    />
    <IconButton 
      icon={<Settings />} 
      onPress={() => router.push('/settings')}
      label="Settings"
    />
  </View>
</View>
```

**Styling:**
```typescript
const topNavStyles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: EliteColors.surface.background,
  },
  
  nameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: EliteColors.surface.card.elevated,
    borderRadius: 12,
  },
  
  atSymbol: {
    ...EliteTypography.heading.h4,
    color: EliteColors.gold.primary,
    fontWeight: '700',
  },
  
  playerName: {
    ...EliteTypography.heading.h4,
    color: EliteColors.text.primary,
  },
  
  quickIcons: {
    flexDirection: 'row',
    gap: 8,
  },
});
```

---

#### **Balance Cards Row (3 карточки)**

**По скетчу: $1000 Debt | $11000 Expenses | $2003**

```tsx
<View style={styles.balanceCardsRow}>
  {/* Card 1: Debt */}
  <BalanceCard
    label="Debt"
    amount={1000}
    type="negative"
    icon={<TrendingDown />}
  />
  
  {/* Card 2: Expenses (или Budget) */}
  <BalanceCard
    label="Expenses"
    amount={11000}
    type="neutral"
    icon={<DollarSign />}
  />
  
  {/* Card 3: Balance (или другой баланс) */}
  <BalanceCard
    label="Balance"
    amount={2003}
    type="positive"
    icon={<Wallet />}
  />
</View>
```

**BalanceCard Component:**
```tsx
interface BalanceCardProps {
  label: string;
  amount: number;
  type: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  label, amount, type, icon
}) => {
  const color = {
    positive: EliteColors.wealth.profit,
    negative: EliteColors.wealth.loss,
    neutral: EliteColors.text.secondary,
  }[type];
  
  return (
    <View style={styles.balanceCard}>
      {/* Icon */}
      <View style={[styles.cardIcon, { backgroundColor: `${color}15` }]}>
        {React.cloneElement(icon, { 
          size: 20, 
          color 
        })}
      </View>
      
      {/* Amount */}
      <Text style={[styles.cardAmount, { color }]}>
        ${amount.toLocaleString()}
      </Text>
      
      {/* Label */}
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
};

const balanceCardStyles = StyleSheet.create({
  balanceCardsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  
  balanceCard: {
    flex: 1,
    backgroundColor: EliteColors.surface.card.elevated,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...EliteShadows.sm,
  },
  
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  
  cardAmount: {
    ...EliteTypography.currency.medium,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  
  cardLabel: {
    ...EliteTypography.label.small,
    color: EliteColors.text.secondary,
  },
});
```

**Styling:**
```typescript
const heroStyles = StyleSheet.create({
  heroContainer: {
    marginHorizontal: -20, // Full bleed
    marginTop: -20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    ...EliteShadows.xl,
  },
  
  heroBackground: {
    paddingTop: 60, // Status bar
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: EliteColors.gold.primary,
    padding: 3,
    position: 'relative',
  },
  
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: EliteColors.wealth.profit,
    borderWidth: 2,
    borderColor: EliteColors.surface.card.elevated,
  },
  
  balanceSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  
  balanceLabel: {
    ...EliteTypography.label.medium,
    color: EliteColors.text.secondary,
    marginBottom: 8,
  },
  
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: EliteColors.surface.glass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: EliteColors.border.default,
  },
  
  trendText: {
    ...EliteTypography.body.small,
    color: EliteColors.wealth.profit,
    fontWeight: '600',
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
});
```

#### **Expenses Overview Card (с прогресс-баром)**

**По скетчу: большая карточка "Expenses $2003" с прогресс-баром**

```tsx
<View style={styles.expensesCard}>
  {/* Header */}
  <View style={styles.expensesHeader}>
    <View style={styles.expensesIconContainer}>
      <ShoppingCart size={24} color={EliteColors.gold.primary} />
    </View>
    <View style={styles.expensesTitleContainer}>
      <Text style={styles.expensesLabel}>Expenses</Text>
      <Text style={styles.expensesAmount}>
        ${totalExpenses.toLocaleString()}
      </Text>
    </View>
    <TouchableOpacity onPress={() => router.push('/expenses')}>
      <ChevronRight size={20} color={EliteColors.text.secondary} />
    </TouchableOpacity>
  </View>
  
  {/* Progress Bar */}
  <View style={styles.progressContainer}>
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: `${(totalExpenses / monthlyIncome) * 100}%`,
            backgroundColor: getExpenseColor(totalExpenses, monthlyIncome),
          }
        ]}
      />
    </View>
    <View style={styles.progressLabels}>
      <Text style={styles.progressLabel}>
        {Math.round((totalExpenses / monthlyIncome) * 100)}% of income
      </Text>
      <Text style={styles.progressRemaining}>
        ${(monthlyIncome - totalExpenses).toLocaleString()} left
      </Text>
    </View>
  </View>
  
  {/* Expense Breakdown (Compact) */}
  <View style={styles.expenseBreakdown}>
    <ExpenseChip label="Rent" amount={1000} color={EliteColors.wealth.loss} />
    <ExpenseChip label="Groceries" amount={800} color={EliteColors.text.secondary} />
    <ExpenseChip label="Other" amount={203} color={EliteColors.text.tertiary} />
  </View>
</View>
```

**ExpenseChip Component (маленькие теги):**
```tsx
const ExpenseChip: React.FC<{ label: string; amount: number; color: string }> = ({
  label, amount, color
}) => (
  <View style={styles.expenseChip}>
    <View style={[styles.chipDot, { backgroundColor: color }]} />
    <Text style={styles.chipLabel}>{label}</Text>
    <Text style={styles.chipAmount}>${amount}</Text>
  </View>
);
```

**Styling:**
```typescript
const expensesStyles = StyleSheet.create({
  expensesCard: {
    backgroundColor: EliteColors.surface.card.elevated,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    ...EliteShadows.md,
  },
  
  expensesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  expensesIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${EliteColors.gold.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  expensesTitleContainer: {
    flex: 1,
  },
  
  expensesLabel: {
    ...EliteTypography.label.medium,
    color: EliteColors.text.secondary,
    marginBottom: 4,
  },
  
  expensesAmount: {
    ...EliteTypography.currency.large,
    fontSize: 28,
    color: EliteColors.text.primary,
  },
  
  progressContainer: {
    marginTop: 16,
  },
  
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  
  progressLabel: {
    ...EliteTypography.body.small,
    color: EliteColors.text.secondary,
  },
  
  progressRemaining: {
    ...EliteTypography.body.small,
    color: EliteColors.wealth.profit,
    fontWeight: '600',
  },
  
  expenseBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  
  expenseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EliteColors.surface.glass,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  chipLabel: {
    ...EliteTypography.label.small,
    color: EliteColors.text.secondary,
    fontSize: 11,
  },
  
  chipAmount: {
    ...EliteTypography.label.small,
    color: EliteColors.text.primary,
    fontSize: 11,
    fontWeight: '600',
  },
});
```

#### **Recent Transactions Section**

**По скетчу: "Recent" с двумя строками (@ Salary +$1600, @ Rent -$1000)**

```tsx
<View style={styles.recentSection}>
  {/* Section Header */}
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Recent</Text>
    <TouchableOpacity onPress={() => router.push('/history')}>
      <Text style={styles.seeAllButton}>See All →</Text>
    </TouchableOpacity>
  </View>
  
  {/* Transaction List */}
  <View style={styles.transactionList}>
    <TransactionRow
      icon="@"
      title="Salary"
      amount={+1600}
      date="Today"
      type="income"
    />
    <TransactionRow
      icon="@"
      title="Rent"
      amount={-1000}
      date="Yesterday"
      type="expense"
    />
  </View>
</View>
```

**TransactionRow Component:**
```tsx
interface TransactionRowProps {
  icon: string;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

const TransactionRow: React.FC<TransactionRowProps> = ({
  icon, title, amount, date, type
}) => {
  const isPositive = amount > 0;
  const color = isPositive ? EliteColors.wealth.profit : EliteColors.wealth.loss;
  
  return (
    <View style={styles.transactionRow}>
      {/* Left: Icon */}
      <View style={[styles.transactionIcon, { backgroundColor: `${color}15` }]}>
        <Text style={[styles.transactionIconText, { color }]}>
          {icon}
        </Text>
      </View>
      
      {/* Center: Title + Date */}
      <View style={styles.transactionContent}>
        <Text style={styles.transactionTitle}>{title}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
      
      {/* Right: Amount */}
      <Text style={[styles.transactionAmount, { color }]}>
        {isPositive ? '+' : ''}${Math.abs(amount).toLocaleString()}
      </Text>
    </View>
  );
};

const transactionStyles = StyleSheet.create({
  recentSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  sectionTitle: {
    ...EliteTypography.heading.h3,
    color: EliteColors.text.primary,
  },
  
  seeAllButton: {
    ...EliteTypography.body.medium,
    color: EliteColors.gold.primary,
    fontWeight: '600',
  },
  
  transactionList: {
    backgroundColor: EliteColors.surface.card.elevated,
    borderRadius: 16,
    overflow: 'hidden',
    ...EliteShadows.sm,
  },
  
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: EliteColors.border.divider,
  },
  
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  transactionIconText: {
    ...EliteTypography.heading.h4,
    fontWeight: '700',
  },
  
  transactionContent: {
    flex: 1,
  },
  
  transactionTitle: {
    ...EliteTypography.body.medium,
    color: EliteColors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  
  transactionDate: {
    ...EliteTypography.body.small,
    color: EliteColors.text.tertiary,
  },
  
  transactionAmount: {
    ...EliteTypography.currency.small,
    fontSize: 17,
    fontWeight: '700',
  },
});
```

#### **Bottom Navigation**

**По скетчу: 3 кнопки [🏠] [▣] [🔍]**

```tsx
<View style={styles.bottomNav}>
  <BottomNavButton
    icon={<Home />}
    label="Home"
    active={true}
    onPress={() => router.push('/')}
  />
  <BottomNavButton
    icon={<Grid />}
    label="Menu"
    active={false}
    onPress={() => router.push('/menu')}
  />
  <BottomNavButton
    icon={<Search />}
    label="Search"
    active={false}
    onPress={() => router.push('/search')}
  />
</View>
```

**BottomNavButton Component:**
```tsx
const BottomNavButton: React.FC<{
  icon: ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
}> = ({ icon, label, active, onPress }) => (
  <TouchableOpacity
    style={styles.bottomNavButton}
    onPress={async () => {
      await triggerHaptic('tapLight');
      onPress();
    }}
  >
    <View style={[styles.bottomNavIcon, active && styles.bottomNavIconActive]}>
      {React.cloneElement(icon, {
        size: 24,
        color: active ? EliteColors.gold.primary : EliteColors.text.secondary,
      })}
    </View>
    {active && (
      <Text style={styles.bottomNavLabel}>{label}</Text>
    )}
  </TouchableOpacity>
);

const bottomNavStyles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20, // Safe area
    backgroundColor: EliteColors.surface.card.elevated,
    borderTopWidth: 1,
    borderTopColor: EliteColors.border.default,
  },
  
  bottomNavButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  
  bottomNavIcon: {
    padding: 8,
  },
  
  bottomNavIconActive: {
    backgroundColor: `${EliteColors.gold.primary}15`,
    borderRadius: 12,
  },
  
  bottomNavLabel: {
    ...EliteTypography.label.small,
    color: EliteColors.gold.primary,
    marginTop: 4,
  },
});
```

---

### **Полная структура Home Screen (код сборки)**

```tsx
export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const playerStats = useGameStore((s) => s.playerStats);
  const [refreshing, setRefreshing] = useState(false);
  
  const totalExpenses = Object.values(playerStats.expenses).reduce((sum, exp) => sum + exp, 0);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation */}
      <TopNavigation playerName={playerStats.playerName} />
      
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Balance Cards Row */}
        <BalanceCardsRow
          debt={playerStats.debt}
          expenses={totalExpenses}
          balance={playerStats.balanceDebit}
        />
        
        {/* Expenses Overview */}
        <ExpensesOverviewCard
          totalExpenses={totalExpenses}
          monthlyIncome={playerStats.income}
          breakdown={playerStats.expenses}
        />
        
        {/* Recent Transactions */}
        <RecentTransactionsSection
          transactions={getRecentTransactions()} // Last 2-3
        />
        
        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="home" />
    </SafeAreaView>
  );
};
```

---

### **2. Personal Info Screen (Профиль)**

#### **Layout Structure**
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │ <- Hero Avatar Section
│ │    ┌─────────────┐              │ │
│ │    │   Avatar    │              │ │
│ │    │   (Large)   │              │ │
│ │    └─────────────┘              │ │
│ │         Name                     │ │
│ │    ID • Email                    │ │
│ │  [Change Picture] [Delete]      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ <- Info Cards
│ │ Email: example@x.x              │ │
│ │ [Change Password]               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Curriculum Vitae                │ │
│ │ • Icon...                       │ │
│ │ • Icon...                       │ │
│ │ • Icon...                       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Key Features:**
- **Avatar Circle:** 120px diameter, gold border (3px), shadow
- **Photo Actions:** Glassmorphic buttons below avatar
- **Info Cards:** Elevated cards with icon + text + edit button
- **CV Section:** Interactive list items with icons

---

### **3. Marketplace Screen**

#### **Layout**
```
┌─────────────────────────────────────┐
│ ← Back          Marketplace         │
│                                     │
│ ┌───────────────────────────────┐  │ <- Filter Tabs
│ │ Apartment│Vehicle│Estate│All   │  │
│ └───────────────────────────────┘  │
│                                     │
│ ┌─────────────────────────────────┐ │ <- Product Cards
│ │ 🏠 Shithole                     │ │
│ │ $1000                          │ │
│ │ [●] OK one $11500/mo           │ │ <- Radio buttons
│ │ [○] Luxurious $1000/mo         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Deposit] [▣] [🔍]                 │ <- Bottom Actions
└─────────────────────────────────────┘
```

**Product Card Design:**
```tsx
const ProductCard: React.FC<ProductCardProps> = ({
  type, title, price, options, onSelect
}) => (
  <View style={styles.productCard}>
    {/* Image/Icon Header */}
    <View style={styles.productHeader}>
      <View style={styles.productIcon}>
        {getProductIcon(type)}
      </View>
      <View style={styles.productBadge}>
        <Text style={styles.badgeText}>{type}</Text>
      </View>
    </View>
    
    {/* Title */}
    <Text style={styles.productTitle}>{title}</Text>
    
    {/* Price */}
    <View style={styles.priceContainer}>
      <Text style={styles.priceLabel}>Starting from</Text>
      <Text style={styles.priceValue}>
        ${price.toLocaleString()}
      </Text>
    </View>
    
    {/* Options (Radio list) */}
    <View style={styles.optionsList}>
      {options.map((option) => (
        <RadioOption
          key={option.id}
          label={option.name}
          price={option.price}
          period="mo"
          selected={selectedOption === option.id}
          onSelect={() => onSelect(option.id)}
        />
      ))}
    </View>
    
    {/* Action Button */}
    <ActionButton
      label="Purchase"
      variant="primary"
      onPress={() => handlePurchase()}
    />
  </View>
);
```

---

### **4. Job Market Screen**

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back       For You (Blue Collar)  │
│                                     │
│ ┌─────────────────────────────────┐ │ <- Job Cards (List)
│ │ □ Job 1   $X                    │ │
│ │   Salary: $X                    │ │
│ │   Internship: X mo              │ │
│ │   Hours/day: X                  │ │
│ │   Work Schedule: ...            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ □ Job 2   $X                    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠] [▣] [🔍]                       │ <- Bottom Nav
└─────────────────────────────────────┘
```

**Job Card Component:**
```tsx
const JobCard: React.FC<JobCardProps> = ({
  title, salary, internshipMonths, hoursPerDay, schedule, selected, onSelect
}) => (
  <TouchableOpacity 
    style={[styles.jobCard, selected && styles.jobCardSelected]}
    onPress={onSelect}
  >
    {/* Header Row */}
    <View style={styles.jobHeader}>
      <View style={styles.checkboxContainer}>
        <Checkbox checked={selected} />
      </View>
      <View style={styles.jobTitleContainer}>
        <Text style={styles.jobTitle}>{title}</Text>
        <View style={styles.salaryBadge}>
          <DollarSign size={16} color={EliteColors.gold.primary} />
          <Text style={styles.salaryText}>
            ${salary.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
    
    {/* Details Grid */}
    <View style={styles.jobDetails}>
      <DetailRow icon={<Clock />} label="Salary" value={`$${salary}`} />
      <DetailRow icon={<Calendar />} label="Internship" value={`${internshipMonths} mo`} />
      <DetailRow icon={<Users />} label="Hours/day" value={hoursPerDay} />
      <DetailRow icon={<Briefcase />} label="Schedule" value={schedule} />
    </View>
    
    {/* Apply Button (if not selected) */}
    {!selected && (
      <ActionButton
        label="Apply Now"
        variant="secondary"
        size="small"
        onPress={onSelect}
      />
    )}
  </TouchableOpacity>
);
```

---

### **5. AI Overview Screen (Stats) - "Metrics Dashboard"**

> **ВОТ ЗДЕСЬ живут метрики Happiness/Stress/Prospects!** Отдельный экран, доступный через иконку [📊] в топ-навигации.

**Layout (по вашему скетчу):**
```
┌─────────────────────────────────────┐
│ ← Back        "AI" Overview         │
│                                     │
│ ┌─────────────────────────────────┐ │ <- AI Avatar Section
│ │         🤖                       │ │
│ │  Based on our analysis           │ │
│ │  of your transactions...         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │ <- Metrics with Progress Bars
│ │ Happiness: 80%                  │ │
│ │ [███████████████░░░░]           │ │
│ │                                 │ │
│ │ Stress: 28%                     │ │
│ │ [█████░░░░░░░░░░░░░░]           │ │
│ │                                 │ │
│ │ Prospects: 45%                  │ │
│ │ [█████████░░░░░░░░░░]           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠] [▣] [🔍]                       │
└─────────────────────────────────────┘
```

**Структура:**

```tsx
export const AIOverviewScreen: React.FC = () => {
  const router = useRouter();
  const playerStats = useGameStore((s) => s.playerStats);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={EliteColors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>"AI" Overview</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* AI Insight Card */}
      <View style={styles.aiInsightCard}>
        <View style={styles.aiAvatar}>
          <Bot size={48} color={EliteColors.gold.primary} />
        </View>
        <Text style={styles.aiInsightText}>
          Based on our analysis of your transactions...
        </Text>
      </View>
      
      {/* Metrics List */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.metricsContainer}>
          <MetricBar
            label="Happiness"
            value={playerStats.happiness}
            maxValue={100}
            color={EliteColors.wealth.profit}
          />
          <MetricBar
            label="Stress"
            value={playerStats.stress}
            maxValue={100}
            color={EliteColors.wealth.loss}
            inverse={true} // Lower is better
          />
          <MetricBar
            label="Prospects"
            value={playerStats.prospects}
            maxValue={100}
            color={EliteColors.gold.primary}
          />
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="stats" />
    </SafeAreaView>
  );
};
```

**MetricBar Component (с анимированным прогресс-баром):**
```tsx
interface MetricBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  inverse?: boolean; // true если меньше = лучше (для Stress)
}

const MetricBar: React.FC<MetricBarProps> = ({
  label, value, maxValue, color, inverse = false
}) => {
  const percentage = (value / maxValue) * 100;
  const animatedWidth = useSharedValue(0);
  
  useEffect(() => {
    animatedWidth.value = withSpring(percentage, {
      damping: 15,
      stiffness: 100,
    });
  }, [percentage]);
  
  const getStatusColor = () => {
    if (inverse) {
      // For Stress: low is good
      if (value < 30) return EliteColors.wealth.profit;
      if (value < 60) return EliteColors.warning;
      return EliteColors.wealth.loss;
    } else {
      // For Happiness/Prospects: high is good
      if (value > 70) return EliteColors.wealth.profit;
      if (value > 40) return EliteColors.warning;
      return EliteColors.wealth.loss;
    }
  };
  
  const statusColor = getStatusColor();
  
  return (
    <View style={styles.metricBarContainer}>
      {/* Label + Value */}
      <View style={styles.metricBarHeader}>
        <Text style={styles.metricBarLabel}>{label}</Text>
        <Text style={[styles.metricBarValue, { color: statusColor }]}>
          {value}%
        </Text>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: statusColor,
            }
          ]}
        />
      </View>
      
      {/* Status Text */}
      <Text style={styles.metricBarStatus}>
        {getStatusText(label, value, inverse)}
      </Text>
    </View>
  );
};

const getStatusText = (label: string, value: number, inverse: boolean): string => {
  if (label === 'Happiness') {
    if (value > 70) return '😊 Great mood!';
    if (value > 40) return '😐 Okay';
    return '😔 Low spirits';
  }
  if (label === 'Stress') {
    if (value < 30) return '😌 Relaxed';
    if (value < 60) return '😰 Moderate';
    return '😫 High stress';
  }
  if (label === 'Prospects') {
    if (value > 70) return '🚀 Bright future';
    if (value > 40) return '📈 Improving';
    return '📉 Uncertain';
  }
  return '';
};

const metricBarStyles = StyleSheet.create({
  metricsContainer: {
    padding: 20,
    gap: 24,
  },
  
  metricBarContainer: {
    backgroundColor: EliteColors.surface.card.elevated,
    borderRadius: 16,
    padding: 20,
    ...EliteShadows.sm,
  },
  
  metricBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  metricBarLabel: {
    ...EliteTypography.heading.h4,
    color: EliteColors.text.primary,
  },
  
  metricBarValue: {
    ...EliteTypography.currency.medium,
    fontSize: 24,
    fontWeight: '700',
  },
  
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  
  metricBarStatus: {
    ...EliteTypography.body.small,
    color: EliteColors.text.secondary,
    marginTop: 8,
  },
  
  aiInsightCard: {
    backgroundColor: `${EliteColors.gold.primary}10`,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${EliteColors.gold.primary}30`,
  },
  
  aiAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: EliteColors.surface.card.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  aiInsightText: {
    ...EliteTypography.body.large,
    color: EliteColors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
```

**Важно:** Этот экран теперь **отделен** от Home Screen и доступен через кнопку Stats в топ-навигации!

---

### **6. News/Events Screen**

**Layout:**
```
┌─────────────────────────────────────┐
│ ← Back          News & Events       │
│                                     │
│ ┌─────────────────────────────────┐ │ <- Event Cards
│ │ Sam injures (Fit)               │ │
│ │ [Details →]                     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Mom died (Sad)                  │ │
│ │ [Details →]                     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Trump inaugurates (Pol)         │ │
│ │ [Details →]                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠] [▣] [🔍]                       │
└─────────────────────────────────────┘
```

**Event Card Design:**
```tsx
const EventCard: React.FC<EventCardProps> = ({
  title, category, timestamp, icon, onPress
}) => (
  <TouchableOpacity style={styles.eventCard} onPress={onPress}>
    {/* Left: Icon Badge */}
    <View style={[styles.eventIcon, { backgroundColor: getCategoryColor(category) }]}>
      {icon}
    </View>
    
    {/* Center: Content */}
    <View style={styles.eventContent}>
      <Text style={styles.eventTitle}>{title}</Text>
      <View style={styles.eventMeta}>
        <Text style={styles.eventCategory}>({category})</Text>
        <Text style={styles.eventTime}>• {timestamp}</Text>
      </View>
    </View>
    
    {/* Right: Arrow */}
    <ChevronRight size={20} color={EliteColors.text.tertiary} />
  </TouchableOpacity>
);
```

---

## 🎭 Component Library (Elite Edition)

### **1. ActionButton (Enhanced)**

```tsx
interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  glow?: boolean; // Gold glow effect
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label, onPress, variant = 'primary', size = 'medium',
  icon, iconPosition = 'left', fullWidth, disabled, loading, glow
}) => {
  const [pressed, setPressed] = useState(false);
  
  const handlePressIn = async () => {
    setPressed(true);
    await triggerHaptic('tapLight');
  };
  
  const handlePressOut = () => {
    setPressed(false);
  };
  
  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    pressed && styles.pressed,
    glow && styles.glow,
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor(variant)} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[styles.buttonText, styles[`text_${variant}`]]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    transition: 'all 0.2s ease',
  },
  
  // Variants
  button_primary: {
    backgroundColor: EliteColors.gold.primary,
  },
  button_secondary: {
    backgroundColor: EliteColors.surface.card.elevated,
    borderWidth: 1,
    borderColor: EliteColors.border.default,
  },
  button_gold: {
    background: EliteGradients.heroCard, // Gradient
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_destructive: {
    backgroundColor: EliteColors.wealth.loss,
  },
  
  // Sizes
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
  
  // States
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.4,
  },
  glow: {
    ...EliteShadows.goldGlow,
  },
  
  // Text
  buttonText: {
    ...EliteTypography.label.large,
    fontWeight: '700',
  },
  text_primary: {
    color: '#000000', // Black text on gold
  },
  text_secondary: {
    color: EliteColors.text.primary,
  },
  text_gold: {
    color: '#000000',
  },
  text_ghost: {
    color: EliteColors.text.primary,
  },
  text_destructive: {
    color: '#FFFFFF',
  },
});
```

### **2. GlassCard (Glassmorphism)**

```tsx
interface GlassCardProps {
  children: ReactNode;
  blur?: number;
  opacity?: number;
  borderColor?: string;
  padding?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blur = 10,
  opacity = 0.05,
  borderColor = EliteColors.border.default,
  padding = 20,
}) => (
  <BlurView intensity={blur} style={styles.glassContainer}>
    <View style={[
      styles.glassCard,
      {
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        borderColor,
        padding,
      }
    ]}>
      {children}
    </View>
  </BlurView>
);
```

### **3. StatCard (с графиками)**

```tsx
interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  period?: string;
  icon?: ReactNode;
  chart?: 'sparkline' | 'bar' | 'pie';
  chartData?: number[];
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, change, period, icon, chart, chartData, color
}) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      {icon && (
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          {icon}
        </View>
      )}
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    
    <Text style={styles.statValue}>{value}</Text>
    
    {change !== undefined && (
      <View style={styles.changeContainer}>
        <TrendIcon trend={change} />
        <Text style={[
          styles.changeText,
          { color: change > 0 ? EliteColors.wealth.profit : EliteColors.wealth.loss }
        ]}>
          {change > 0 ? '+' : ''}{change}%
        </Text>
        {period && (
          <Text style={styles.changePeriod}>vs {period}</Text>
        )}
      </View>
    )}
    
    {chart && chartData && (
      <View style={styles.chartContainer}>
        {chart === 'sparkline' && (
          <SparklineChart data={chartData} color={color} />
        )}
      </View>
    )}
  </View>
);
```

---

## 🎬 Animation Guidelines

### **Micro-interactions**

```typescript
export const EliteAnimations = {
  // Card hover
  cardHover: {
    scale: 1.02,
    translateY: -4,
    shadowOpacity: 0.16,
    duration: 150,
    easing: Easing.out(Easing.ease),
  },
  
  // Button press
  buttonPress: {
    scale: 0.96,
    duration: 80,
    easing: Easing.inOut(Easing.ease),
  },
  
  // Number count-up
  countUp: {
    duration: 500,
    easing: Easing.out(Easing.cubic),
  },
  
  // Modal slide-in
  modalSlide: {
    translateY: [400, 0],
    opacity: [0, 1],
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  
  // Shimmer loading
  shimmer: {
    backgroundPosition: ['-200%', '200%'],
    duration: 1500,
    loop: true,
  },
};
```

### **Page Transitions**

```typescript
// Stack navigation transitions
const screenOptions = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      }),
    },
  }),
  transitionSpec: {
    open: { animation: 'spring', config: { damping: 15, mass: 0.6 } },
    close: { animation: 'timing', config: { duration: 200 } },
  },
};
```

---

## 📐 Layout Grid System

```typescript
export const EliteGrid = {
  // Breakpoints
  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1024,
  },
  
  // Grid
  columns: 12,
  gutter: 16,
  margin: 20,
  
  // Responsive padding
  responsive: {
    mobile: { padding: 16, margin: 16 },
    tablet: { padding: 24, margin: 24 },
    desktop: { padding: 32, margin: 32 },
  },
};
```

---

## 🎯 Implementation Priority

### **Phase 1 (Week 1): Foundation**
1. ✅ Update color system to Elite palette (gold primary)
2. ✅ Update typography with hero sizes
3. ✅ Implement shadow/elevation system
4. ✅ Create ActionButton Elite edition
5. ✅ Create GlassCard component

### **Phase 2 (Week 2): Hero Section**
1. ⏳ Rebuild Home screen hero section
2. ⏳ Implement avatar with online indicator
3. ⏳ Add balance with sparkline chart
4. ⏳ Create QuickAction buttons
5. ⏳ Add trend indicators with animations

### **Phase 3 (Week 3): Metrics & Stats**
1. ⏳ Redesign MetricBadge with gradients
2. ⏳ Add progress bars to metrics
3. ⏳ Implement QuickStats row
4. ⏳ Add insights/recommendations
5. ⏳ Create StatCard component

### **Phase 4 (Week 4): Screens**
1. ⏳ Rebuild Personal Info screen
2. ⏳ Implement Marketplace with product cards
3. ⏳ Create Job Market listings
4. ⏳ Build AI Overview screen
5. ⏳ Implement News/Events feed

### **Phase 5 (Week 5): Polish**
1. ⏳ Add all animations
2. ⏳ Implement haptics everywhere
3. ⏳ Add loading states
4. ⏳ Create empty states
5. ⏳ Final QA pass

---

## 📊 QA Checklist (Elite Edition)

### **Visual Quality**
- [ ] All shadows use EliteShadows system
- [ ] All colors from EliteColors palette
- [ ] All typography from EliteTypography
- [ ] Gold glow on primary actions
- [ ] Gradients applied to hero sections
- [ ] Icons consistent size (24px default)
- [ ] Borders subtle (0.08 opacity)
- [ ] Glass effects on overlays

### **Interaction Quality**
- [ ] All buttons have haptic feedback
- [ ] Hover states on web (scale 1.02)
- [ ] Press states on mobile (scale 0.96)
- [ ] Loading states implemented
- [ ] Disabled states visible
- [ ] Focus states for accessibility

### **Animation Quality**
- [ ] Page transitions smooth (300ms)
- [ ] Number count-ups animated
- [ ] Modal slide-ins natural
- [ ] Shimmer on loading cards
- [ ] Progress bars animate on mount

### **Content Quality**
- [ ] All numbers formatted with commas
- [ ] Currency displays $ symbol
- [ ] Dates formatted properly
- [ ] Trends show arrows + %
- [ ] Empty states have illustrations

---

## 🔥 Key Differences from "Плоское Говно"

| Aspect | Before (Плоское) | After (Elite) |
|--------|------------------|---------------|
| **Colors** | Blue primary, flat gray | Gold primary, gradient overlays |
| **Shadows** | Minimal/none | 5-level elevation system |
| **Typography** | Single font size | Hero (64px) to metadata (10px) |
| **Spacing** | Cramped | Generous whitespace |
| **Cards** | Flat rectangles | Elevated, rounded, glass effect |
| **Animations** | None | Hover, press, count-up, transitions |
| **Metrics** | Plain numbers | Progress bars, trends, insights |
| **Avatar** | None | Large, bordered, online indicator |
| **Balance** | Simple text | Hero size, sparkline, trend badge |
| **Hierarchy** | Everything equal | Clear focus (hero → critical → context) |

---

**Этот дизайн-система создана для элитного финансового приложения уровня private banking. Каждый элемент продуман до пикселя. Никакого "плоского говна".**

**Готов к имплементации. Ждите обновленные компоненты.**
