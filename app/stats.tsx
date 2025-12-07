import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Heart,
  Brain,
  Zap,
  DollarSign,
  Home as HomeIcon,
  Briefcase,
  CreditCard,
  Target,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import { triggerHaptic } from '../src/utils/haptics';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';
import { BorderRadius } from '../src/theme/spacing';

const { width: screenWidth } = Dimensions.get('window');

export default function PlayerStatsScreen() {
  const router = useRouter();
  const playerStats = useGameStore((s) => s.playerStats);
  const currentTurn = useGameStore((s) => s.currentTurn);

  // Calculate net worth
  const netWorth = useMemo(() => {
    const assets = playerStats.balanceDebit + (playerStats.balanceVirtual || 0) + (playerStats.investmentPortfolioValue || 0);
    const debt = playerStats.debt || 0;
    return assets - debt;
  }, [playerStats]);

  // Calculate metrics trend (last 5 data points)
  const getMetricTrend = (history: number[] | undefined) => {
    if (!history || history.length < 2) return 'neutral';
    const recent = history.slice(-5);
    const first = recent[0];
    const last = recent[recent.length - 1];
    if (last > first + 5) return 'up';
    if (last < first - 5) return 'down';
    return 'neutral';
  };

  const happinessTrend = getMetricTrend(playerStats.happinessHistory);
  const stressTrend = getMetricTrend(playerStats.stressHistory);

  // Calculate monthly burn rate
  const monthlyExpenses = useMemo(() => {
    const expenses = playerStats.expenses;
    return (expenses?.rent || 0) + (expenses?.groceries || 0) + (expenses?.utilities || 0) + (expenses?.loanPayment || 0);
  }, [playerStats.expenses]);

  const monthlySavings = playerStats.income - monthlyExpenses;
  const savingsRate = playerStats.income > 0 ? (monthlySavings / playerStats.income) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/');
            }}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>spAI</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Credit Score */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Metrics</Text>
            <View style={styles.metricCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricIconContainer}>
                  <Activity size={20} color={Colors.gold.primary} />
                </View>
                <View style={styles.metricContent}>
                  <Text style={styles.metricLabel}>Credit Score</Text>
                  <Text style={[styles.metricValue, { color: Colors.gold.primary }]}>
                    {playerStats.creditScore}
                  </Text>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${((playerStats.creditScore - 300) / (850 - 300)) * 100}%`,
                        backgroundColor: Colors.gold.primary,
                      }
                    ]} 
                  />
                </View>
                <View style={styles.creditScoreLabels}>
                  <Text style={styles.creditScoreLabel}>300</Text>
                  <Text style={styles.creditScoreLabel}>850</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Happiness */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Life Metrics</Text>
            <View style={styles.metricCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricIconContainer}>
                  <Heart size={20} color={Colors.wealth.profit} />
                </View>
                <View style={styles.metricContent}>
                  <Text style={styles.metricLabel}>Happiness</Text>
                  <View style={styles.metricValueRow}>
                    <Text style={[styles.metricValue, { color: Colors.wealth.profit }]}>
                      {Math.round(playerStats.happiness)}%
                    </Text>
                    {happinessTrend === 'up' && <TrendingUp size={16} color={Colors.wealth.profit} />}
                    {happinessTrend === 'down' && <TrendingDown size={16} color={Colors.wealth.loss} />}
                  </View>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${playerStats.happiness}%`,
                        backgroundColor: Colors.wealth.profit,
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>

            {/* Stress */}
            <View style={styles.metricCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricIconContainer}>
                  <Brain size={20} color={Colors.wealth.loss} />
                </View>
                <View style={styles.metricContent}>
                  <Text style={styles.metricLabel}>Stress</Text>
                  <View style={styles.metricValueRow}>
                    <Text style={[styles.metricValue, { color: Colors.wealth.loss }]}>
                      {Math.round(playerStats.stress)}%
                    </Text>
                    {stressTrend === 'up' && <TrendingUp size={16} color={Colors.wealth.loss} />}
                    {stressTrend === 'down' && <TrendingDown size={16} color={Colors.wealth.profit} />}
                  </View>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${playerStats.stress}%`,
                        backgroundColor: Colors.wealth.loss,
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Game Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Progress</Text>
            
            <View style={styles.metricCard}>
              <View style={styles.gameStatsGrid}>
                <View style={styles.gameStatItem}>
                  <Text style={styles.gameStatLabel}>Turn</Text>
                  <Text style={styles.gameStatValue}>{currentTurn?.turnNumber || 0}</Text>
                </View>
                <View style={styles.gameStatItem}>
                  <Text style={styles.gameStatLabel}>Week</Text>
                  <Text style={styles.gameStatValue}>{currentTurn?.weekNumber || 0}</Text>
                </View>
                <View style={styles.gameStatItem}>
                  <Text style={styles.gameStatLabel}>Month</Text>
                  <Text style={styles.gameStatValue}>{currentTurn?.monthNumber || 0}</Text>
                </View>
                <View style={styles.gameStatItem}>
                  <Text style={styles.gameStatLabel}>Year</Text>
                  <Text style={styles.gameStatValue}>{currentTurn?.year || new Date().getFullYear()}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navButton}
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/');
            }}
          >
            <View style={styles.navIcon}>
              <View style={styles.homeIconOutline} />
            </View>
            <Text style={styles.navLabel}>Home</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },

  // Hero Card
  heroCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  heroLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  trendBadge: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  trendPositive: {
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
  },
  trendNegative: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },
  heroAmount: {
    ...Typography.hero,
    marginBottom: Spacing.md,
  },
  heroBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heroBreakdownItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroBreakdownLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  heroBreakdownValue: {
    ...Typography.body.large,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  heroBreakdownDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.divider,
  },

  // Section
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },

  // Metric Card
  metricCard: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  metricValue: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metricDivider: {
    height: 1,
    backgroundColor: Colors.border.divider,
    marginVertical: Spacing.md,
  },

  // Progress Bar
  progressBarContainer: {
    marginTop: Spacing.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },

  // Credit Score Labels
  creditScoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  creditScoreLabel: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
  },

  // Savings Row
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  savingsAmount: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },

  // Career Stats
  careerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  careerStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  careerStatLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  careerStatValue: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
  },
  careerStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.divider,
  },

  // Game Stats
  gameStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  gameStatItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
  },
  gameStatLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  gameStatValue: {
    ...Typography.heading.h2,
    color: Colors.gold.primary,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 12,
    backgroundColor: Colors.surface.card.elevated,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  navIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  homeIconOutline: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: Colors.text.secondary,
    borderRadius: 4,
  },
  navIconText: {
    fontSize: 18,
  },
  navLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    fontSize: 9,
  },
});
