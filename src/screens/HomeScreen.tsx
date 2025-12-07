/**
 * HOME SCREEN - Game Banking Interface
 * Adaptive, animated, synced with game store
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import {
  User,
  ChevronRight,
  Bell,
  ShoppingBag,
  Briefcase,
  Sparkles,
  Wallet,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, EliteShadows } from '../theme';
import { triggerHaptic } from '../utils/haptics';
import { useGameStore } from '../store/gameStore';

const CARD_BASE_WIDTH = 140;
const CARD_BASE_HEIGHT = 90;

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const playerStats = useGameStore((s) => s.playerStats);
  const notifications = useGameStore((s) => s.notifications);
  const nextTurn = useGameStore((s) => s.nextTurn);
  
  const [refreshing, setRefreshing] = React.useState(false);
  const refreshOpacity = useSharedValue(0);
  const refreshScale = useSharedValue(0.8);

  const screenWidth = Dimensions.get('window').width;
  const CARD_WIDTH = Math.min(CARD_BASE_WIDTH, screenWidth * 0.38);
  const CARD_HEIGHT = Math.min(CARD_BASE_HEIGHT, screenWidth * 0.24);

  const totalExpenses = Object.values(playerStats.expenses || {}).reduce(
    (sum, exp) => sum + exp,
    0
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const cards = React.useMemo(() => [
    {
      id: '1',
      type: 'debit',
      balance: playerStats.balanceDebit || 0,
      lastFour: '4385',
      gradient: ['#FF6B00', '#FF8534'] as const,
      textColor: '#FFFFFF',
    },
    {
      id: '2',
      type: 'virtual',
      balance: playerStats.balanceVirtual || 0,
      lastFour: '9081',
      gradient: ['#2C2C2E', '#3A3A3C'] as const,
      textColor: '#FFFFFF',
    },
    {
      id: '3',
      type: 'debt',
      balance: playerStats.debt || 0,
      lastFour: '0000',
      gradient: ['#FF3B30', '#FF6B6B'] as const,
      textColor: '#FFFFFF',
    },
  ], [playerStats.balanceDebit, playerStats.balanceVirtual, playerStats.debt]);

  const categories = React.useMemo(() => [
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, route: '/marketplace' },
    { id: 'jobmarket', label: 'Job Market', icon: Briefcase, route: '/jobmarket' },
    { id: 'stats', label: 'spAI', icon: Sparkles, route: '/stats' },
    { id: 'assets', label: 'Assets', icon: Wallet, route: '/assets' },
  ], []);

  const expenseCategories = React.useMemo(() => {
    const rent = playerStats.expenses?.rent || 0;
    const groceries = playerStats.expenses?.groceries || 0;
    const loanPayment = playerStats.expenses?.loanPayment || 0;
    const utilities = playerStats.expenses?.utilities || 0;
    const total = Math.max(totalExpenses, 1);

    return [
      {
        category: 'Rent',
        amount: rent,
        percentage: (rent / total) * 100,
        color: '#FF6B00',
      },
      {
        category: 'Groceries',
        amount: groceries,
        percentage: (groceries / total) * 100,
        color: '#FF8534',
      },
      {
        category: 'Loan',
        amount: loanPayment,
        percentage: (loanPayment / total) * 100,
        color: '#FF3B30',
      },
      {
        category: 'Utilities',
        amount: utilities,
        percentage: (utilities / total) * 100,
        color: '#0A84FF',
      },
    ].filter((cat) => cat.amount > 0);
  }, [playerStats.expenses, totalExpenses]);

  const transactions = React.useMemo(() => [
    {
      id: '1',
      title: 'Salary',
      category: 'Income',
      amount: playerStats.income || 0,
      isIncome: true,
      date: new Date(),
      icon: '$',
      color: '#34C759',
    },
    {
      id: '2',
      title: 'Rent',
      category: 'Housing',
      amount: playerStats.expenses?.rent || 0,
      isIncome: false,
      date: new Date(Date.now() - 86400000),
      icon: 'H',
      color: '#FF6B00',
    },
    {
      id: '3',
      title: 'Groceries',
      category: 'Food',
      amount: playerStats.expenses?.groceries || 0,
      isIncome: false,
      date: new Date(Date.now() - 86400000),
      icon: 'G',
      color: '#34C759',
    },
    {
      id: '4',
      title: 'Loan Payment',
      category: 'Debt',
      amount: playerStats.expenses?.loanPayment || 0,
      isIncome: false,
      date: new Date(Date.now() - 172800000),
      icon: 'L',
      color: '#FF3B30',
    },
    {
      id: '5',
      title: 'Utilities',
      category: 'Bills',
      amount: playerStats.expenses?.utilities || 0,
      isIncome: false,
      date: new Date(Date.now() - 259200000),
      icon: 'U',
      color: '#0A84FF',
    },
  ].filter((t) => t.amount > 0), [playerStats.income, playerStats.expenses]);

  const todayTrans = React.useMemo(() => 
    transactions.filter(
      (t) => new Date(t.date).toDateString() === new Date().toDateString()
    ), [transactions]
  );
  
  const yesterdayTrans = React.useMemo(() => 
    transactions.filter(
      (t) =>
        new Date(t.date).toDateString() ===
        new Date(Date.now() - 86400000).toDateString()
    ), [transactions]
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await triggerHaptic('impactMedium');
    
    // Анимация появления
    refreshOpacity.value = withTiming(1, { duration: 150 });
    refreshScale.value = withSequence(
      withSpring(1.1, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );
    
    // Выполняем nextTurn
    await new Promise(resolve => setTimeout(resolve, 300));
    nextTurn();
    await triggerHaptic('notificationSuccess');
    
    // Анимация исчезновения
    await new Promise(resolve => setTimeout(resolve, 200));
    refreshOpacity.value = withTiming(0, { duration: 150 });
    refreshScale.value = withTiming(0.8, { duration: 150 });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    setRefreshing(false);
  }, [nextTurn, refreshOpacity, refreshScale]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold.primary}
            colors={[Colors.gold.primary]}
            progressBackgroundColor={Colors.surface.card.default}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.profileButton}
            onPress={async () => {
              await triggerHaptic('tapLight');
              router.push('/profile');
            }}
          >
            <View style={styles.avatar}>
              <User size={20} color={Colors.text.primary} />
            </View>
            <Text style={styles.userName}>{playerStats.playerName || 'Player'}</Text>
            <ChevronRight size={20} color={Colors.text.primary} />
          </Pressable>

          <Pressable
            style={styles.notificationButton}
            onPress={async () => {
              await triggerHaptic('tapLight');
              router.push('/notifications');
            }}
          >
            <Bell size={24} color={Colors.gold.primary} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Categories */}
        <View style={styles.categoryNav}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              style={styles.categoryItem}
              onPress={async () => {
                await triggerHaptic('impactMedium');
                router.push(cat.route as any);
              }}
            >
              <View style={styles.categoryIcon}>
                <cat.icon size={24} color={Colors.gold.primary} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Cards */}
        <View style={styles.cardsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {cards.map((card, index) => (
              <View key={card.id} style={[styles.cardWrapper, index > 0 && styles.cardMargin]}>
                <Pressable
                  onPress={async () => {
                    await triggerHaptic('impactMedium');
                  }}
                >
                  <LinearGradient
                    colors={card.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.cardTop}>
                        <View style={styles.mastercardLogo}>
                          <View style={[styles.mastercardCircle, styles.redCircle]} />
                          <View style={[styles.mastercardCircle, styles.yellowCircle]} />
                        </View>
                      </View>
                      <View style={styles.cardCenter}>
                        <Text style={[styles.cardLabel, { color: card.textColor }]}>
                          {card.type === 'debit' ? 'Debit' : card.type === 'virtual' ? 'Virtual' : 'Debt'}
                        </Text>
                        <Text style={[styles.cardBalance, { color: card.textColor }]}>
                          ${(Math.round(card.balance * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </Text>
                      </View>
                      <View style={styles.cardBottom}>
                        <View />
                        <Text style={[styles.lastFour, { color: card.textColor }]}>••••{card.lastFour}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </Pressable>
              </View>
            ))}

            <Pressable
              style={[styles.addCardButton, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
              onPress={async () => {
                await triggerHaptic('tapLight');
              }}
            >
              <View style={styles.addCardIcon}>
                <Text style={styles.addCardPlus}>+</Text>
              </View>
            </Pressable>
          </ScrollView>
        </View>

        {/* Expenses */}
        <Pressable
          style={styles.expensesSection}
          onPress={async () => {
            await triggerHaptic('tapMedium');
            router.push('/Expenses');
          }}
        >
          <View style={styles.expensesHeader}>
            <Text style={styles.expensesTitle}>
              Expenses in <Text style={styles.expensesMonth}>December</Text>
            </Text>
            <Text style={styles.expensesTotal}>${totalExpenses.toLocaleString()}</Text>
          </View>

          <View style={styles.progressBarContainer}>
            {expenseCategories.map((cat, index) => {
              const barWidth = screenWidth - Spacing.lg * 2;
              const segmentWidth = Math.max((cat.percentage / 100) * barWidth, 4);
              const isFirst = index === 0;
              const isLast = index === expenseCategories.length - 1;

              return (
                <View
                  key={cat.category}
                  style={[
                    styles.progressSegment,
                    {
                      width: segmentWidth,
                      backgroundColor: cat.color,
                      borderTopLeftRadius: isFirst ? 4 : 0,
                      borderBottomLeftRadius: isFirst ? 4 : 0,
                      borderTopRightRadius: isLast ? 4 : 0,
                      borderBottomRightRadius: isLast ? 4 : 0,
                    },
                  ]}
                />
              );
            })}
          </View>
        </Pressable>

        {/* Today Transactions */}
        {todayTrans.length > 0 && (
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>TODAY</Text>
            {todayTrans.map((trans) => {
              const scale = useSharedValue(1);
              const animStyle = useAnimatedStyle(() => ({
                transform: [{ scale: scale.value }],
              }));

              return (
                <Animated.View key={trans.id} style={animStyle}>
                  <Pressable
                    style={styles.transactionItem}
                    onPressIn={() => {
                      scale.value = withTiming(0.97, { duration: 100 });
                      triggerHaptic('impactLight');
                    }}
                    onPressOut={() => {
                      scale.value = withTiming(1, { duration: 150 });
                    }}
                    onPress={async () => {
                      await triggerHaptic('impactLight');
                    }}
                  >
                    <View
                      style={[
                        styles.transactionIcon,
                        { backgroundColor: `${trans.color}20` },
                      ]}
                    >
                      <Text style={[styles.transactionIconText, { color: trans.color }]}>
                        {trans.icon}
                      </Text>
                    </View>

                    <View style={styles.transactionContent}>
                      <Text style={styles.transactionTitle}>{trans.title}</Text>
                      <View style={styles.transactionCategory}>
                        <View
                          style={[
                            styles.categoryDot,
                            { backgroundColor: trans.color },
                          ]}
                        />
                        <Text style={styles.transactionCategoryText}>
                          {trans.category}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.transactionRight}>
                      <Text
                        style={[
                          styles.transactionAmount,
                          trans.isIncome && styles.transactionAmountIncome,
                        ]}
                      >
                        {trans.isIncome ? '+' : '-'}${trans.amount.toFixed(2)}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(trans.date).toLocaleTimeString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* Yesterday Transactions */}
        {yesterdayTrans.length > 0 && (
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>YESTERDAY</Text>
            {yesterdayTrans.map((trans) => {
              const scale = useSharedValue(1);
              const animStyle = useAnimatedStyle(() => ({
                transform: [{ scale: scale.value }],
              }));

              return (
                <Animated.View key={trans.id} style={animStyle}>
                  <Pressable
                    style={styles.transactionItem}
                    onPressIn={() => {
                      scale.value = withTiming(0.97, { duration: 100 });
                      triggerHaptic('impactLight');
                    }}
                    onPressOut={() => {
                      scale.value = withTiming(1, { duration: 150 });
                    }}
                    onPress={async () => {
                      await triggerHaptic('impactLight');
                    }}
                  >
                    <View
                      style={[
                        styles.transactionIcon,
                        { backgroundColor: `${trans.color}20` },
                      ]}
                    >
                      <Text style={[styles.transactionIconText, { color: trans.color }]}>
                        {trans.icon}
                      </Text>
                    </View>

                    <View style={styles.transactionContent}>
                      <Text style={styles.transactionTitle}>{trans.title}</Text>
                      <View style={styles.transactionCategory}>
                        <View
                          style={[
                            styles.categoryDot,
                            { backgroundColor: trans.color },
                          ]}
                        />
                        <Text style={styles.transactionCategoryText}>
                          {trans.category}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.transactionRight}>
                      <Text
                        style={[
                          styles.transactionAmount,
                          trans.isIncome && styles.transactionAmountIncome,
                        ]}
                      >
                        {trans.isIncome ? '+' : '-'}${trans.amount.toFixed(2)}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(trans.date).toLocaleTimeString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navButton}
          onPress={async () => {
            await triggerHaptic('impactLight');
          }}
        >
          <View style={styles.navIconActive}>
            <View style={styles.homeIcon} />
          </View>
          <Text style={styles.navLabelActive}>Home</Text>
        </Pressable>

        <Pressable
          style={styles.navButton}
          onPress={async () => {
            await triggerHaptic('impactLight');
            router.push('/investments');
          }}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>📈</Text>
          </View>
          <Text style={styles.navLabel}>Investments</Text>
        </Pressable>

        <Pressable
          style={styles.navButton}
          onPress={async () => {
            await triggerHaptic('impactLight');
            router.push('/chats');
          }}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>💬</Text>
          </View>
          <Text style={styles.navLabel}>Chats</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface.card.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userName: {
    ...Typography.body.large,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.wealth.loss,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text.primary,
  },

  // Categories
  categoryNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  categoryItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surface.card.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    ...Typography.label.small,
    fontSize: 11,
    color: Colors.text.secondary,
  },

  // Cards
  cardsSection: {
    marginBottom: Spacing.xl,
  },
  cardsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  cardWrapper: {
    marginRight: 0,
  },
  cardMargin: {
    marginLeft: 12,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    ...EliteShadows.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mastercardCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  redCircle: {
    backgroundColor: '#EB001B',
    marginRight: -4,
    zIndex: 1,
  },
  yellowCircle: {
    backgroundColor: '#F79E1B',
  },
  cardCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lastFour: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'uppercase',
    opacity: 0.7,
    marginBottom: 4,
  },
  cardBalance: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardType: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  cardNumber: {
    fontSize: 10,
    fontWeight: '500',
  },

  // Add Card
  addCardButton: {
    borderRadius: 12,
    backgroundColor: Colors.surface.card.default,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
    marginLeft: 12,
  },
  addCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface.card.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardPlus: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.text.secondary,
  },

  // Expenses
  expensesSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expensesTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  expensesMonth: {
    color: Colors.gold.primary,
    fontWeight: '600',
  },
  expensesTotal: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressSegment: {
    height: 8,
  },

  // Recent History
  recentHistorySection: {
    marginBottom: Spacing.xl,
  },
  recentHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: 12,
  },
  recentHistoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  recentHistorySeeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gold.primary,
  },
  recentHistoryScroll: {
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  recentHistoryCard: {
    width: 100,
    backgroundColor: Colors.surface.card.default,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  recentHistoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recentHistoryIconText: {
    fontSize: 16,
    fontWeight: '600',
  },
  recentHistoryCardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  recentHistoryCardAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  recentHistoryCardAmountIncome: {
    color: Colors.wealth.profit,
  },

  // Transactions
  transactionsSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
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
    fontSize: 18,
    fontWeight: '600',
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  transactionCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
  transactionCategoryText: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  transactionAmountIncome: {
    color: Colors.wealth.profit,
  },
  transactionDate: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.text.tertiary,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingBottom: 12,
    backgroundColor: Colors.surface.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  navIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconActive: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.gold.primary}15`,
    borderRadius: 6,
  },
  homeIcon: {
    width: 18,
    height: 18,
    backgroundColor: Colors.gold.primary,
    borderRadius: 4,
  },
  navIconText: {
    fontSize: 18,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '400',
    color: Colors.text.secondary,
    marginTop: 2,
  },
  navLabelActive: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.gold.primary,
    marginTop: 2,
  },

  bottomSpacer: {
    height: 40,
  },
});
