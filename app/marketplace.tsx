import React, { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Home as HomeIcon, Car, ShoppingBag, ChevronRight, TrendingUp, MessageCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import { housingCatalog, vehicleCatalog } from '../src/engine/gameLogic';
import { triggerHaptic } from '../src/utils/haptics';
import { showToast } from '../src/components/ToastManager';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';

const { width: screenWidth } = Dimensions.get('window');

type Category = 'housing' | 'vehicles';

export default function MarketplaceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState<Category>('housing');
  const playerStats = useGameStore((s) => s.playerStats);
    const purchaseHousing = useGameStore((s) => s.purchaseHousing);
    const purchaseVehicle = useGameStore((s) => s.purchaseVehicle);
  const updateState = useGameStore((s) => s.nextTurn); // Use any action to trigger re-render
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Page entrance animation
  const pageOpacity = useSharedValue(0);
  const pageTranslateY = useSharedValue(20);

  React.useEffect(() => {
    pageOpacity.value = withTiming(1, { duration: 300 });
    pageTranslateY.value = withTiming(0, { duration: 300 });
  }, []);

  const pageAnimatedStyle = {
    opacity: pageOpacity,
    transform: [{ translateY: pageTranslateY }],
  };

  const currentHousingId = playerStats.currentHousing?.housingId;
  const currentVehicleId = playerStats.currentVehicle?.vehicleId;

  const handleCategoryChange = async (category: Category) => {
    await triggerHaptic('impactLight');
    setActiveCategory(category);
    setSelectedItemId(null);
  };

  const handlePurchase = async (itemId: string, method: 'cash' | 'mortgage' | 'rent' | 'loan') => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    // Check affordability for cash purchases
    if (method === 'cash' && item.purchasePrice) {
      const downPayment = item.purchasePrice * 0.2;
      if (playerStats.balanceDebit < downPayment) {
        showToast(
          `Insufficient funds. Need $${downPayment.toLocaleString()} for down payment`,
          'error',
          3500
        );
        return;
      }
    }

    // Check credit score for mortgage/loan
    if ((method === 'mortgage' || method === 'loan') && playerStats.creditScore < 550) {
      showToast(
        `Credit score too low (${playerStats.creditScore}). Need 550+ for ${method === 'mortgage' ? 'mortgage' : 'auto loan'}`,
        'warning',
        3500
      );
      return;
    }

    await triggerHaptic('impactMedium');

    if (activeCategory === 'housing') {
      if (method === 'rent') {
        const res = purchaseHousing(itemId, 'rent');
        showToast(res.message, res.success ? 'success' : 'error');
        if (res.success) {
          setSelectedItemId(null);
          return;
        }
      } else if (method === 'cash' || method === 'mortgage') {
        const res = purchaseHousing(itemId, method === 'mortgage' ? 'mortgage' : 'cash');
        showToast(res.message, res.success ? 'success' : 'error');
        if (res.success) {
          setSelectedItemId(null);
          return;
        }
        return;
      }
    } else {
      // Vehicle purchase - implement basic purchase
      if (method === 'cash' && item.purchasePrice) {
        const downPayment = item.purchasePrice * 0.2;
        if (playerStats.balanceDebit >= downPayment) {
          const res = purchaseVehicle(itemId, 'cash');
          showToast(res.message, res.success ? 'success' : 'error');
          if (res.success) {
            setSelectedItemId(null);
            return;
          }
        }
      } else if (method === 'loan' && item.purchasePrice && playerStats.creditScore >= 550) {
        // Auto loan with down payment
        const downPayment = item.purchasePrice * 0.2;
        const loanAmount = item.purchasePrice * 0.8;
        if (playerStats.balanceDebit >= downPayment) {
          const res = purchaseVehicle(itemId, 'loan');
          showToast(res.message, res.success ? 'success' : 'error');
          if (res.success) {
            setSelectedItemId(null);
            return;
          }
        }
      }
      showToast('Vehicle purchase coming soon', 'info');
    }
  };

  const canAfford = (price?: number) => {
    if (!price) return true; // Rental
    return playerStats.balanceDebit >= price * 0.2; // 20% down payment
  };

  const items = activeCategory === 'housing' ? housingCatalog : vehicleCatalog;
  const currentItemId = activeCategory === 'housing' ? currentHousingId : currentVehicleId;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={[{ flex: 1 }, pageAnimatedStyle]}>
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
        <Text style={styles.headerTitle}>Marketplace</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        <CategoryTab
          icon={<HomeIcon size={20} />}
          label="Housing"
          active={activeCategory === 'housing'}
          onPress={() => handleCategoryChange('housing')}
        />
        <CategoryTab
          icon={<Car size={20} />}
          label="Vehicles"
          active={activeCategory === 'vehicles'}
          onPress={() => handleCategoryChange('vehicles')}
        />
      </View>

      {/* Balance Display */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          ${playerStats.balanceDebit.toLocaleString()}
        </Text>
        <Text style={styles.balanceHint}>
          {activeCategory === 'housing' ? '20% down payment required for owned properties' : 'Full payment required'}
        </Text>
      </View>

      {/* Items List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <MarketplaceCard
            key={item.id}
            item={item}
            category={activeCategory}
            isOwned={item.id === currentItemId}
            canAfford={canAfford(item.purchasePrice)}
            playerStats={playerStats}
            onPress={() => setSelectedItemId(item.id)}
            onPurchase={handlePurchase}
            isSelected={selectedItemId === item.id}
          />
        ))}
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
          <HomeIcon size={24} color={Colors.text.secondary} />
          <Text style={styles.navLabel}>Home</Text>
        </Pressable>

        <Pressable
          style={styles.navButton}
          onPress={async () => {
            await triggerHaptic('impactLight');
            router.push('/investments');
          }}
        >
          <TrendingUp size={24} color={Colors.text.secondary} />
          <Text style={styles.navLabel}>Investments</Text>
        </Pressable>

        <Pressable
          style={styles.navButton}
          onPress={async () => {
            await triggerHaptic('impactLight');
            router.push('/chats');
          }}
        >
          <MessageCircle size={24} color={Colors.text.secondary} />
          <Text style={styles.navLabel}>Chats</Text>
        </Pressable>
      </View>
      </Animated.View>
    </View>
  );
}

interface CategoryTabProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ icon, label, active, onPress }) => {
  const scale = useSharedValue(1);

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withTiming(0.95, { duration: 100 });
        triggerHaptic('impactLight');
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      onPress={onPress}
      style={[styles.categoryTab, active && styles.categoryTabActive]}
    >
      <Animated.View style={{ transform: [{ scale }], flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ opacity: 1 }}>
          {React.cloneElement(icon as any, {
            color: active ? Colors.gold.primary : Colors.text.secondary,
          })}
        </View>
        <Text style={[styles.categoryTabText, active && styles.categoryTabTextActive]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

interface MarketplaceCardProps {
  item: any;
  category: Category;
  isOwned: boolean;
  canAfford: boolean;
  playerStats: any;
  onPress: () => void;
  onPurchase: (itemId: string, method: 'cash' | 'mortgage' | 'rent' | 'loan') => void;
  isSelected: boolean;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  item,
  category,
  isOwned,
  canAfford,
  playerStats,
  onPress,
  onPurchase,
  isSelected,
}) => {
  const scale = useSharedValue(1);
  const expandHeight = useSharedValue(0);
  const [isPurchasing, setIsPurchasing] = useState(false);

  React.useEffect(() => {
    expandHeight.value = withTiming(isSelected ? 1 : 0, { duration: 300 });
  }, [isSelected]);

  const getTierColor = (tier: number) => {
    if (tier === 1) return '#8E8E93'; // Gray
    if (tier === 2) return '#5856D6'; // Purple
    if (tier === 3) return '#007AFF'; // Blue
    if (tier === 4) return '#FF6B00'; // Orange
    if (tier === 5) return '#D4AF37'; // Gold
    return Colors.text.secondary;
  };

  const tierColor = getTierColor(item.tier);
  const price = item.purchasePrice || item.monthlyRent;
  const priceType = item.purchasePrice ? 'Purchase' : 'Rent';
  const downPayment = item.purchasePrice ? item.purchasePrice * 0.2 : null;
  
  // Check if card has expandable content
  const hasExpandableContent = (item.unlocks && item.unlocks.length > 0) || item.canRent;
  
  // Determine available purchase methods
  const canBuyCash = item.purchasePrice && canAfford;
  const canMortgage = item.purchasePrice && playerStats.creditScore >= 550;
  const canRent = !item.purchasePrice && item.monthlyRent;

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 100 });
        triggerHaptic('impactLight');
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      onPress={hasExpandableContent ? onPress : undefined}
      disabled={!hasExpandableContent}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Tier Badge */}
        <View style={[styles.tierBadge, { backgroundColor: `${tierColor}20` }]}>
          <Text style={[styles.tierText, { color: tierColor }]}>Tier {item.tier}</Text>
        </View>

        {/* Card Content */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {isOwned && (
                <View style={styles.currentBadgeInline}>
                  <Text style={styles.currentBadgeText}>CURRENT</Text>
                </View>
              )}
            </View>
            {item.tier > 2 && (
              <Text style={styles.cardSubtitle}>✨ Premium</Text>
            )}
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>{priceType}</Text>
          <Text style={styles.priceAmount}>${price?.toLocaleString()}</Text>
          {downPayment && (
            <Text style={styles.downPaymentText}>
              Down payment: ${downPayment.toLocaleString()} (20%)
            </Text>
          )}
          {item.monthlyRent > 0 && (
            <Text style={styles.monthlyText}>${item.monthlyRent}/month</Text>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {category === 'housing' && (
            <>
              <StatItem label="Happiness" value={`${item.happinessBonus > 0 ? '+' : ''}${item.happinessBonus}`} />
              <StatItem label="Stress" value={`${item.stressReduction > 0 ? '+' : ''}${item.stressReduction}`} />
              <StatItem label="Commute" value={`${item.commuteDamage} min`} />
              {item.maintenanceCost > 0 && (
                <StatItem label="Maintenance" value={`$${item.maintenanceCost}/mo`} />
              )}
            </>
          )}
          {category === 'vehicles' && (
            <>
              <StatItem label="Happiness" value={`${item.happinessBonus > 0 ? '+' : ''}${item.happinessBonus}`} />
              <StatItem label="Fuel" value={`$${item.fuelCost}/mo`} />
              <StatItem label="Maintenance" value={`$${item.maintenanceCost}/mo`} />
              <StatItem label="Breakdown" value={`${item.breakdownChance}%`} />
            </>
          )}
        </View>

        {/* Expanded Details */}
        {isSelected && hasExpandableContent && (
          <Animated.View style={styles.expandedDetails}>
            {item.unlocks && item.unlocks.length > 0 && (
              <View style={styles.unlocksSection}>
                <Text style={styles.unlocksSectionTitle}>Unlocks:</Text>
                {item.unlocks.map((unlock: string, i: number) => (
                  <Text key={i} style={styles.unlockItem}>• {unlock.replace(/_/g, ' ')}</Text>
                ))}
              </View>
            )}

            {item.canRent && (
              <View style={styles.rentalSection}>
                <Text style={styles.rentalText}>
                  💰 Can rent for ${item.rentalIncome}/month
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Action Buttons */}
        {!isOwned && (
          <View style={styles.actionButtonsContainer}>
            {/* Buy with Cash */}
            {item.purchasePrice && (
              <AnimatedPurchaseButton
                label={`Buy $${downPayment?.toLocaleString()}`}
                onPress={() => onPurchase(item.id, 'cash')}
                disabled={!canBuyCash}
                isPrimary={true}
                isLoading={isPurchasing}
              />
            )}
            
            {/* Mortgage (for housing with purchase price) */}
            {category === 'housing' && item.purchasePrice && canMortgage && (
              <AnimatedPurchaseButton
                label="Mortgage"
                onPress={() => onPurchase(item.id, 'mortgage')}
                isPrimary={false}
              />
            )}
            
            {/* Rent (for housing without purchase price) */}
            {category === 'housing' && canRent && (
              <AnimatedPurchaseButton
                label={`Rent $${item.monthlyRent}/mo`}
                onPress={() => onPurchase(item.id, 'rent')}
                isPrimary={false}
              />
            )}
            
            {/* Loan (for vehicles) */}
            {category === 'vehicles' && item.purchasePrice && (
              <AnimatedPurchaseButton
                label="Auto Loan"
                onPress={() => onPurchase(item.id, 'loan')}
                disabled={playerStats.creditScore < 550}
                isPrimary={false}
              />
            )}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

interface AnimatedPurchaseButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isPrimary?: boolean;
  isLoading?: boolean;
}

const AnimatedPurchaseButton: React.FC<AnimatedPurchaseButtonProps> = ({
  label,
  onPress,
  disabled = false,
  isPrimary = false,
  isLoading = false,
}) => {
  const buttonScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.96, { duration: 100 });
    triggerHaptic('impactLight');
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, {
      damping: 12,
      stiffness: 200,
    });
  };

  const handlePress = async () => {
    if (disabled || isLoading) return;
    
    // Success pulse animation
    pulseScale.value = withSequence(
      withTiming(1.05, { duration: 150 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );
    
    await triggerHaptic('impactMedium');
    onPress();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value },
      { scale: pulseScale.value },
    ],
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || isLoading}
    >
      <Animated.View
        style={[
          styles.actionButton,
          isPrimary ? styles.actionButtonPrimary : styles.actionButtonSecondary,
          disabled && styles.actionButtonDisabled,
          buttonAnimatedStyle,
        ]}
      >
        {isPrimary ? (
          <LinearGradient
            colors={disabled ? ['#3A3A3C', '#2C2C2E'] : [Colors.gold.primary, '#E5C158']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            <Text
              style={[
                styles.actionButtonText,
                disabled && styles.actionButtonTextDisabled,
              ]}
            >
              {isLoading ? 'Processing...' : label}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.actionButtonGradient}>
            <Text
              style={[
                styles.actionButtonTextSecondary,
                disabled && styles.actionButtonTextDisabled,
              ]}
            >
              {label}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface.card.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface.card.default,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTabActive: {
    backgroundColor: `${Colors.gold.primary}20`,
  },
  categoryTabText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: Colors.gold.primary,
  },
  balanceCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface.card.default,
    borderRadius: 16,
    padding: Spacing.lg,
  },
  balanceLabel: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  balanceAmount: {
    ...Typography.display.large,
    color: Colors.gold.primary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  balanceHint: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  tierBadge: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tierText: {
    ...Typography.label.small,
    fontSize: 11,
    fontWeight: '700',
  },
  currentBadge: {
    position: 'absolute',
    top: Spacing.base,
    left: Spacing.base,
    backgroundColor: Colors.status.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: {
    ...Typography.label.small,
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
  currentBadgeInline: {
    backgroundColor: Colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardTitleContainer: {
    flex: 1,
    paddingRight: 60,
  },
  cardTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.body.small,
    color: Colors.gold.primary,
    fontSize: 12,
  },
  priceContainer: {
    marginBottom: Spacing.md,
  },
  priceLabel: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  priceAmount: {
    ...Typography.display.large,
    color: Colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  downPaymentText: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  monthlyText: {
    ...Typography.body.small,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statItem: {
    backgroundColor: Colors.surface.highlight,
    borderRadius: 8,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  statLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    fontSize: 10,
    marginBottom: 2,
  },
  statValue: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  expandedDetails: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  unlocksSection: {
    marginBottom: Spacing.sm,
  },
  unlocksSectionTitle: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  unlockItem: {
    ...Typography.body.small,
    color: Colors.gold.primary,
    fontSize: 12,
    marginBottom: 2,
  },
  rentalSection: {
    backgroundColor: `${Colors.status.success}15`,
    borderRadius: 8,
    padding: Spacing.sm,
  },
  rentalText: {
    ...Typography.body.small,
    color: Colors.status.success,
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonPrimary: {
    // Primary button (Buy with cash)
  },
  actionButtonSecondary: {
    // Secondary buttons (Mortgage, Rent, Loan)
    borderWidth: 1,
    borderColor: Colors.gold.primary,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  actionButtonText: {
    ...Typography.body.medium,
    color: '#000',
    fontSize: 15,
    fontWeight: '700',
  },
  actionButtonTextSecondary: {
    ...Typography.body.medium,
    color: Colors.gold.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  actionButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.surface.background,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border.default,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  navLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});
