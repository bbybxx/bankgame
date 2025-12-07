import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Home as HomeIcon,
  Car,
  TrendingUp,
  Calendar,
  DollarSign,
  Wrench,
  Zap,
  ArrowUpRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import { triggerHaptic } from '../src/utils/haptics';
import { housingCatalog, vehicleCatalog } from '../src/engine/gameLogic';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';
import { BorderRadius } from '../src/theme/spacing';

export default function AssetsScreen() {
  const router = useRouter();
  const playerStats = useGameStore((s) => s.playerStats);

  // Get current housing details
  const currentHousing = useMemo(() => {
    if (!playerStats.currentHousing) return null;
    return housingCatalog.find(h => h.id === playerStats.currentHousing.housingId);
  }, [playerStats.currentHousing]);

  // Get current vehicle details
  const currentVehicle = useMemo(() => {
    if (!playerStats.currentVehicle) return null;
    return vehicleCatalog.find(v => v.id === playerStats.currentVehicle?.vehicleId);
  }, [playerStats.currentVehicle]);

  // Calculate total asset value
  const totalAssetValue = useMemo(() => {
    let value = 0;
    if (playerStats.currentHousing?.isOwned && currentHousing?.resaleValue) {
      value += currentHousing.resaleValue;
    }
    if (playerStats.currentVehicle?.isOwned && currentVehicle?.resaleValue) {
      value += currentVehicle.resaleValue;
    }
    return value;
  }, [playerStats.currentHousing, playerStats.currentVehicle, currentHousing, currentVehicle]);

  // Calculate housing purchase date
  const housingPurchaseDate = useMemo(() => {
    if (!playerStats.currentHousing?.purchaseDate) return null;
    const date = new Date(playerStats.currentHousing.purchaseDate);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }, [playerStats.currentHousing?.purchaseDate]);

  // Calculate vehicle purchase date
  const vehiclePurchaseDate = useMemo(() => {
    if (!playerStats.currentVehicle?.purchaseDate) return null;
    const date = new Date(playerStats.currentVehicle.purchaseDate);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }, [playerStats.currentVehicle?.purchaseDate]);

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
          <Text style={styles.headerTitle}>Assets</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Asset Value Card */}
          <LinearGradient
            colors={['#1A1A1A', '#0F0F0F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroHeader}>
              <Text style={styles.heroLabel}>TOTAL ASSET VALUE</Text>
              {totalAssetValue > 0 && (
                <View style={styles.trendBadge}>
                  <TrendingUp size={16} color={Colors.gold.primary} />
                </View>
              )}
            </View>
            <Text style={styles.heroAmount}>
              ${totalAssetValue.toLocaleString()}
            </Text>
            <Text style={styles.heroSubtext}>
              {playerStats.currentHousing?.isOwned && currentHousing ? '1 Property' : 'No Property'} • {playerStats.currentVehicle?.isOwned && currentVehicle ? '1 Vehicle' : 'No Vehicle'}
            </Text>
          </LinearGradient>

          {/* Housing Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HomeIcon size={20} color={Colors.gold.primary} />
              <Text style={styles.sectionTitle}>Housing</Text>
            </View>

            {currentHousing ? (
              <View style={styles.assetCard}>
                <View style={styles.assetHeader}>
                  <View style={styles.assetTitleRow}>
                    <Text style={styles.assetName}>{currentHousing.name}</Text>
                    <View style={[styles.tierBadge, { backgroundColor: Colors.gold.glow }]}>
                      <Text style={styles.tierText}>Tier {currentHousing.tier}</Text>
                    </View>
                  </View>
                  <View style={styles.ownershipBadge}>
                    <Text style={[styles.ownershipText, { 
                      color: playerStats.currentHousing.isOwned ? Colors.wealth.profit : Colors.status.info 
                    }]}>
                      {playerStats.currentHousing.isOwned ? 'OWNED' : 'RENTED'}
                    </Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                  {playerStats.currentHousing.isOwned && currentHousing.resaleValue ? (
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Current Value</Text>
                      <Text style={styles.statValue}>
                        ${currentHousing.resaleValue.toLocaleString()}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Monthly Rent</Text>
                      <Text style={[styles.statValue, { color: Colors.wealth.loss }]}>
                        ${currentHousing.monthlyRent.toLocaleString()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Maintenance</Text>
                    <Text style={styles.statValue}>
                      ${currentHousing.maintenanceCost}/mo
                    </Text>
                  </View>

                  {playerStats.currentHousing.isOwned && currentHousing.propertyTax && (
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Property Tax</Text>
                      <Text style={styles.statValue}>
                        ${currentHousing.propertyTax}/mo
                      </Text>
                    </View>
                  )}

                  {housingPurchaseDate && (
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>
                        {playerStats.currentHousing.isOwned ? 'Purchased' : 'Rented Since'}
                      </Text>
                      <Text style={styles.statValue}>{housingPurchaseDate}</Text>
                    </View>
                  )}
                </View>

                {/* Benefits */}
                <View style={styles.benefitsSection}>
                  <Text style={styles.benefitsTitle}>Benefits</Text>
                  <View style={styles.benefitsGrid}>
                    <View style={styles.benefitItem}>
                      <Zap size={16} color={Colors.wealth.profit} />
                      <Text style={styles.benefitText}>+{currentHousing.happinessBonus} Happiness</Text>
                    </View>
                    {currentHousing.stressReduction !== 0 && (
                      <View style={styles.benefitItem}>
                        <Zap size={16} color={currentHousing.stressReduction < 0 ? Colors.wealth.loss : Colors.wealth.profit} />
                        <Text style={styles.benefitText}>
                          {currentHousing.stressReduction > 0 ? '-' : '+'}{Math.abs(currentHousing.stressReduction)} Stress
                        </Text>
                      </View>
                    )}
                    {currentHousing.canRent && currentHousing.rentalIncome && (
                      <View style={styles.benefitItem}>
                        <DollarSign size={16} color={Colors.gold.primary} />
                        <Text style={styles.benefitText}>
                          ${currentHousing.rentalIncome}/mo rental potential
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Upgrade Button */}
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={async () => {
                    await triggerHaptic('impactMedium');
                    router.push('/marketplace');
                  }}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade Housing</Text>
                  <ArrowUpRight size={16} color={Colors.gold.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <HomeIcon size={48} color={Colors.text.tertiary} />
                <Text style={styles.emptyTitle}>No Housing</Text>
                <Text style={styles.emptyText}>Visit the Marketplace to find your first home</Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={async () => {
                    await triggerHaptic('impactMedium');
                    router.push('/marketplace');
                  }}
                >
                  <Text style={styles.emptyButtonText}>Browse Housing</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Vehicle Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Car size={20} color={Colors.gold.primary} />
              <Text style={styles.sectionTitle}>Vehicle</Text>
            </View>

            {currentVehicle ? (
              <View style={styles.assetCard}>
                <View style={styles.assetHeader}>
                  <View style={styles.assetTitleRow}>
                    <Text style={styles.assetName}>{currentVehicle.name}</Text>
                    <View style={[styles.tierBadge, { backgroundColor: Colors.gold.glow }]}>
                      <Text style={styles.tierText}>Tier {currentVehicle.tier}</Text>
                    </View>
                  </View>
                  <View style={styles.ownershipBadge}>
                    <Text style={[styles.ownershipText, { 
                      color: playerStats.currentVehicle?.isOwned ? Colors.wealth.profit : Colors.status.info 
                    }]}>
                      {playerStats.currentVehicle?.isOwned ? 'OWNED' : 'FINANCED'}
                    </Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Current Value</Text>
                    <Text style={styles.statValue}>
                      ${currentVehicle.resaleValue.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Mileage</Text>
                    <Text style={styles.statValue}>
                      {(playerStats.currentVehicle?.mileage || 0).toLocaleString()} mi
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Maintenance</Text>
                    <Text style={styles.statValue}>
                      ${currentVehicle.maintenanceCost}/mo
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Fuel Cost</Text>
                    <Text style={styles.statValue}>
                      ${currentVehicle.fuelCost}/wk
                    </Text>
                  </View>

                  {vehiclePurchaseDate && (
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Purchased</Text>
                      <Text style={styles.statValue}>{vehiclePurchaseDate}</Text>
                    </View>
                  )}

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Breakdown Risk</Text>
                    <Text style={[styles.statValue, { 
                      color: currentVehicle.breakdownChance > 5 ? Colors.wealth.loss : Colors.wealth.profit 
                    }]}>
                      {currentVehicle.breakdownChance}%
                    </Text>
                  </View>
                </View>

                {/* Benefits */}
                <View style={styles.benefitsSection}>
                  <Text style={styles.benefitsTitle}>Benefits</Text>
                  <View style={styles.benefitsGrid}>
                    <View style={styles.benefitItem}>
                      <Zap size={16} color={Colors.wealth.profit} />
                      <Text style={styles.benefitText}>+{currentVehicle.happinessBonus} Happiness</Text>
                    </View>
                    {currentVehicle.stressReduction !== 0 && (
                      <View style={styles.benefitItem}>
                        <Zap size={16} color={currentVehicle.stressReduction < 0 ? Colors.wealth.loss : Colors.wealth.profit} />
                        <Text style={styles.benefitText}>
                          {currentVehicle.stressReduction > 0 ? '-' : '+'}{Math.abs(currentVehicle.stressReduction)} Stress
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Upgrade Button */}
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={async () => {
                    await triggerHaptic('impactMedium');
                    router.push('/marketplace');
                  }}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade Vehicle</Text>
                  <ArrowUpRight size={16} color={Colors.gold.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Car size={48} color={Colors.text.tertiary} />
                <Text style={styles.emptyTitle}>No Vehicle</Text>
                <Text style={styles.emptyText}>Visit the Marketplace to buy your first car</Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={async () => {
                    await triggerHaptic('impactMedium');
                    router.push('/marketplace');
                  }}
                >
                  <Text style={styles.emptyButtonText}>Browse Vehicles</Text>
                </TouchableOpacity>
              </View>
            )}
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
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.gold,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  heroLabel: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
  trendBadge: {
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
  },
  heroAmount: {
    ...Typography.display.large,
    color: Colors.gold.primary,
    marginBottom: Spacing.xs,
  },
  heroSubtext: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },

  // Section
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
  },

  // Asset Card
  assetCard: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  assetHeader: {
    marginBottom: Spacing.lg,
  },
  assetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  assetName: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    flex: 1,
  },
  tierBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
  },
  tierText: {
    ...Typography.label.small,
    color: Colors.gold.primary,
    fontWeight: '600',
  },
  ownershipBadge: {
    alignSelf: 'flex-start',
  },
  ownershipText: {
    ...Typography.label.small,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
  },
  statLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  statValue: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
  },

  // Benefits
  benefitsSection: {
    marginBottom: Spacing.lg,
  },
  benefitsTitle: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  benefitsGrid: {
    gap: Spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    ...Typography.body.small,
    color: Colors.text.primary,
  },

  // Upgrade Button
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gold.primary,
  },
  upgradeButtonText: {
    ...Typography.body.medium,
    color: Colors.gold.primary,
    fontWeight: '600',
  },

  // Empty State
  emptyCard: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gold.primary,
  },
  emptyButtonText: {
    ...Typography.body.medium,
    color: Colors.gold.primary,
    fontWeight: '600',
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
