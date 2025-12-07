# 💻 INTEGRATION CODE TEMPLATES - Быстрые шаблоны для интеграции

## 🏠 TEMPLATE 1: HomeScreen Integration

### `app/(tabs)/index.tsx` (новый)

```tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { HomeScreenContent } from '../../src/components/screens/HomeScreenContent';
import { Colors } from '../../src/theme';

export default function HomeTab() {
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: Colors.primaryBg }}
      edges={['top']}
    >
      <StatusBar barStyle="light-content" />
      <HomeScreenContent />
    </SafeAreaView>
  );
}
```

### `src/components/screens/HomeScreenContent.tsx` (скопировать из Phase 2)

```tsx
// Просто скопируйте весь код из src/screens/HomeScreen.tsx
// Это уже полностью готовый компонент с:
// - AppHeader
// - BalanceCard
// - 4x MetricBadge
// - 5x TransactionRow with animations
// - RedZoneWarning (conditional)
// - ActionButton "Next Turn"
// - Pull-to-refresh with haptics
// - Все анимации и хапатики уже встроены
```

---

## 📊 TEMPLATE 2: AssetsScreen (NEW)

### `app/(tabs)/assets.tsx` (новый файл)

```tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useGameStore } from '../../src/store/gameStore';
import { Colors, Spacing } from '../../src/theme';
import { 
  AppHeader, 
  ActionButton, 
  BuyAssetModal 
} from '../../src/components';
import { AssetsScreenContent } from '../../src/components/screens/AssetsScreenContent';

export default function AssetsTab() {
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: Colors.primaryBg }}
      edges={['top']}
    >
      <StatusBar barStyle="light-content" />
      <AssetsScreenContent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
});
```

### `src/components/screens/AssetsScreenContent.tsx` (новый файл)

```tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { Colors, Spacing, Typography } from '../../theme';
import {
  AppHeader,
  ActionButton,
  BuyAssetModal,
} from '../common';
import { triggerHaptic } from '../../utils/haptics';

interface SelectedAsset {
  type: 'housing' | 'vehicle';
  tier: number;
  name: string;
  downPayment: number;
  monthlyPayment: number;
  description: string;
}

export const AssetsScreenContent: React.FC = () => {
  const playerStats = useGameStore((state) => state.playerStats);
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);

  const handleBuyAsset = (asset: SelectedAsset) => {
    setSelectedAsset(asset);
    setBuyModalVisible(true);
  };

  const handleConfirmBuy = async () => {
    if (!selectedAsset) return;
    
    // TODO: Вызвать gameStore.executePlayerDecision('buyAsset', {...})
    // await gameStore.executePlayerDecision('buyAsset', {
    //   assetType: selectedAsset.type,
    //   tierId: selectedAsset.tier,
    // });
    
    setBuyModalVisible(false);
    setSelectedAsset(null);
  };

  // Asset tier definitions
  const housingTiers = [
    {
      type: 'housing',
      tier: 1,
      name: 'Studio Apartment',
      downPayment: 5000,
      monthlyPayment: 250,
      description: 'Small studio in a convenient location',
    },
    {
      type: 'housing',
      tier: 2,
      name: 'One Bedroom Apartment',
      downPayment: 10000,
      monthlyPayment: 500,
      description: 'Comfortable apartment with separate rooms',
    },
    {
      type: 'housing',
      tier: 3,
      name: 'House',
      downPayment: 30000,
      monthlyPayment: 1200,
      description: 'Spacious house with yard and garage',
    },
  ];

  const isBuyDisabled = (downPayment: number) =>
    playerStats?.balanceDebit < downPayment ||
    playerStats?.creditScore < 600 ||
    playerStats?.gameStatus === 'red_zone';

  return (
    <ScrollView style={styles.container}>
      <AppHeader
        title="Your Assets"
        notificationBadgeCount={0}
        onAIPress={() => {}}
        onNotificationsPress={() => {}}
      />

      {/* Current Assets Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Assets</Text>
        <View style={styles.currentAssets}>
          {/* TODO: Render current housing/vehicle */}
        </View>
      </View>

      {/* Available Housing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Housing Options</Text>
        {housingTiers.map((asset) => (
          <View key={asset.tier} style={styles.assetCard}>
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetDescription}>{asset.description}</Text>
              <View style={styles.assetTerms}>
                <Text style={styles.termText}>
                  Down: ${asset.downPayment.toFixed(0)} | 
                  Monthly: ${asset.monthlyPayment.toFixed(0)}
                </Text>
              </View>
            </View>
            <ActionButton
              label="Buy"
              onPress={() => handleBuyAsset(asset as SelectedAsset)}
              disabled={isBuyDisabled(asset.downPayment)}
              disabledReason={
                playerStats?.balanceDebit < asset.downPayment
                  ? `Need $${(asset.downPayment - playerStats.balanceDebit).toFixed(0)} more`
                  : playerStats?.creditScore < 600
                  ? 'Credit score too low'
                  : ''
              }
              size="medium"
            />
          </View>
        ))}
      </View>

      {/* BuyAssetModal */}
      {selectedAsset && (
        <BuyAssetModal
          visible={buyModalVisible}
          onClose={() => {
            setBuyModalVisible(false);
            setSelectedAsset(null);
          }}
          onConfirm={handleConfirmBuy}
          assetName={selectedAsset.name}
          downPayment={selectedAsset.downPayment}
          monthlyPayment={selectedAsset.monthlyPayment}
          description={selectedAsset.description}
          currentBalance={playerStats?.balanceDebit || 0}
          creditScore={playerStats?.creditScore || 0}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.accentPrimary,
    marginBottom: Spacing.lg,
    fontWeight: '700',
  },
  currentAssets: {
    backgroundColor: Colors.cardBg,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
  },
  assetCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    ...Typography.h3,
    color: Colors.accentPrimary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  assetDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  assetTerms: {
    backgroundColor: Colors.surfaceBg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.sm,
  },
  termText: {
    ...Typography.bodyMedium,
    color: Colors.textTertiary,
  },
});
```

---

## 💳 TEMPLATE 3: DebtsScreen (NEW)

### `app/(tabs)/debts.tsx` (новый файл)

```tsx
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Colors } from '../../src/theme';
import { DebtsScreenContent } from '../../src/components/screens/DebtsScreenContent';

export default function DebtsTab() {
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: Colors.primaryBg }}
      edges={['top']}
    >
      <StatusBar barStyle="light-content" />
      <DebtsScreenContent />
    </SafeAreaView>
  );
}
```

### `src/components/screens/DebtsScreenContent.tsx` (новый файл)

```tsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { Colors, Spacing, Typography } from '../../theme';
import {
  AppHeader,
  ActionButton,
  RefinanceLoanModal,
  PayDownDebtModal,
} from '../common';

interface SelectedLoan {
  id: string;
  balance: number;
  rate: number;
  monthlyPayment: number;
  name: string;
}

export const DebtsScreenContent: React.FC = () => {
  const playerStats = useGameStore((state) => state.playerStats);
  const [refinanceModalVisible, setRefinanceModalVisible] = useState(false);
  const [payDownModalVisible, setPayDownModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<SelectedLoan | null>(null);

  const handleRefinance = (loan: SelectedLoan) => {
    setSelectedLoan(loan);
    setRefinanceModalVisible(true);
  };

  const handlePayDown = (loan: SelectedLoan) => {
    setSelectedLoan(loan);
    setPayDownModalVisible(true);
  };

  const handleRefinanceConfirm = async () => {
    if (!selectedLoan) return;
    // TODO: gameStore.executePlayerDecision('refinanceLoan', {...})
    setRefinanceModalVisible(false);
    setSelectedLoan(null);
  };

  const handlePayDownConfirm = async (amount: number) => {
    if (!selectedLoan) return;
    // TODO: gameStore.executePlayerDecision('payDownDebt', {amount, loanId: selectedLoan.id})
    setPayDownModalVisible(false);
    setSelectedLoan(null);
  };

  // TODO: Get loans from playerStats.loans
  const loans = playerStats?.loans || [];

  return (
    <ScrollView style={styles.container}>
      <AppHeader
        title="Your Debts"
        notificationBadgeCount={0}
        onAIPress={() => {}}
        onNotificationsPress={() => {}}
      />

      {/* Debt Summary */}
      <View style={styles.summarySection}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Debt</Text>
          <Text style={styles.summaryValue}>
            ${loans.reduce((sum, l) => sum + l.remainingBalance, 0).toFixed(0)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Monthly Payment</Text>
          <Text style={styles.summaryValue}>
            ${loans.reduce((sum, l) => sum + l.monthlyPayment, 0).toFixed(0)}
          </Text>
        </View>
      </View>

      {/* Loans List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Loans</Text>
        {loans.map((loan) => (
          <View key={loan.id} style={styles.loanCard}>
            <View style={styles.loanInfo}>
              <Text style={styles.loanName}>{loan.type}</Text>
              <Text style={styles.loanDetails}>
                Balance: ${loan.remainingBalance.toFixed(0)} | 
                Rate: {(loan.annualInterestRate * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.loanActions}>
              <ActionButton
                label="Refinance"
                onPress={() => handleRefinance({
                  id: loan.id,
                  balance: loan.remainingBalance,
                  rate: loan.annualInterestRate,
                  monthlyPayment: loan.monthlyPayment,
                  name: loan.type,
                })}
                size="small"
                disabled={loan.remainingBalance < 1000}
              />
              <ActionButton
                label="Pay Down"
                onPress={() => handlePayDown({
                  id: loan.id,
                  balance: loan.remainingBalance,
                  rate: loan.annualInterestRate,
                  monthlyPayment: loan.monthlyPayment,
                  name: loan.type,
                })}
                size="small"
              />
            </View>
          </View>
        ))}
      </View>

      {/* Modals */}
      {selectedLoan && (
        <>
          <RefinanceLoanModal
            visible={refinanceModalVisible}
            onClose={() => {
              setRefinanceModalVisible(false);
              setSelectedLoan(null);
            }}
            onConfirm={handleRefinanceConfirm}
            loanId={selectedLoan.id}
            loanName={selectedLoan.name}
            currentRate={selectedLoan.rate}
            newRate={selectedLoan.rate * 0.9} // Example: 10% reduction
            currentPayment={selectedLoan.monthlyPayment}
            newPayment={selectedLoan.monthlyPayment * 0.95}
            refinanceFee={200}
            creditScore={playerStats?.creditScore || 0}
            loanBalance={selectedLoan.balance}
            monthsSinceLastRefinance={0} // TODO: from gameStore
          />

          <PayDownDebtModal
            visible={payDownModalVisible}
            onClose={() => {
              setPayDownModalVisible(false);
              setSelectedLoan(null);
            }}
            onConfirm={handlePayDownConfirm}
            loanName={selectedLoan.name}
            loanBalance={selectedLoan.balance}
            annualInterestRate={selectedLoan.rate}
            currentBalance={playerStats?.balanceDebit || 0}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
  },
  summarySection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
  },
  summaryLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    ...Typography.h2,
    color: Colors.warningRed,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.accentPrimary,
    marginBottom: Spacing.lg,
    fontWeight: '700',
  },
  loanCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanInfo: {
    flex: 1,
  },
  loanName: {
    ...Typography.h3,
    color: Colors.accentPrimary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  loanDetails: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  loanActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
```

---

## 🎛️ TEMPLATE 4: TabNavigator Update

### `app/(tabs)/_layout.tsx` (обновленный)

```tsx
import { Tabs } from 'expo-router';
import { Home, CreditCard, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react-native';
import { Colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.cardBg,
          borderTopColor: Colors.borderDefault,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.accentPrimary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <CreditCard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: 'Assets',
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          title: 'Debts',
          tabBarIcon: ({ color }) => <AlertCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

---

## 📋 TEMPLATE 5: Модальная интеграция в HomeScreen

```tsx
// ДОБАВИТЬ В HomeScreenContent.tsx:

import { BuyAssetModal, ApplyForJobModal } from '../modals';

export const HomeScreenContent: React.FC = () => {
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [applyModalVisible, setApplyModalVisible] = useState(false);

  // ... существующий код ...

  return (
    <SafeAreaView style={styles.container}>
      {/* Existing components */}
      
      {/* NEW: Modals */}
      <BuyAssetModal
        visible={buyModalVisible}
        onClose={() => setBuyModalVisible(false)}
        onConfirm={async () => {
          // TODO: Call gameStore
          setBuyModalVisible(false);
        }}
        assetName="Housing Tier 2"
        downPayment={10000}
        monthlyPayment={500}
        description="..."
        currentBalance={playerStats?.balanceDebit || 0}
        creditScore={playerStats?.creditScore || 0}
      />

      <ApplyForJobModal
        visible={applyModalVisible}
        onClose={() => setApplyModalVisible(false)}
        onConfirm={async () => {
          // TODO: Call gameStore
          setApplyModalVisible(false);
        }}
        jobTitle="Senior Developer"
        salaryIncrease={1000}
        currentSalary={3200}
        successProbability={0.75}
        stress={playerStats?.stress || 0}
        riskOfLayoff={playerStats?.jobMetrics?.riskOfLayoff || 0}
        monthsAtCurrentJob={playerStats?.jobMetrics?.monthsAtCurrentJob || 0}
      />
    </SafeAreaView>
  );
};
```

---

## ✅ QUICK CHECKLIST

```
Перед началом интеграции:

☐ Прочитать INTEGRATION_PLAN.md (25 KB)
☐ Прочитать INTEGRATION_SUMMARY.md (15 KB)  
☐ Скопировать шаблоны выше
☐ Убедиться что все Phase 1-3 компоненты в src/components/
☐ Убедиться что gameStore работает

Во время интеграции:

☐ ФАЗА 1: Обновить TabNavigator (1.5h)
☐ ФАЗА 2: Создать экраны (3-4h)
☐ ФАЗА 3: Интегрировать модали (2h)
☐ ФАЗА 4: Полировка (1-2h)

После интеграции:

☐ npx tsc = 0 errors
☐ Все анимации работают
☐ Все хапатики работают
☐ Тестировать на устройстве
☐ Закоммитить в git
```

---

**Все шаблоны готовы к использованию! Copy-paste и адаптируйте под ваши нужды.**
