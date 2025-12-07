import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { housingCatalog } from '../engine/gameLogic';
import { IPlayerStats, HousingTier } from '../types';

interface HousingTierWidgetProps {
  playerStats: IPlayerStats;
  onUpgrade: (housingId: string) => void;
}

export const HousingTierWidget: React.FC<HousingTierWidgetProps> = ({
  playerStats,
  onUpgrade,
}) => {
  const currentHousing = housingCatalog.find(
    h => h.id === playerStats.currentHousing.housingId
  );
  const playerHousing = playerStats.currentHousing;

  const getTierColor = (tier: number): string => {
    const colorMap: Record<number, string> = {
      1: Colors.textTertiary,
      2: Colors.textSecondary,
      3: Colors.info,
      4: Colors.warning,
      5: Colors.success,
    };
    return colorMap[tier] || Colors.textSecondary;
  };

  const handleUpgrade = (housingId: string) => {
    const housing = housingCatalog.find(h => h.id === housingId);
    if (!housing) return;

    if (housing.purchasePrice && playerStats.balanceDebit < housing.purchasePrice * 0.2) {
      Alert.alert('Insufficient Funds', 'You need a 20% down payment for this property');
      return;
    }

    if (housing.tier === playerStats.currentHousing.tierLevel) {
      Alert.alert('Already Here', 'You already live in this housing');
      return;
    }

    onUpgrade(housingId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Current Housing</Text>
      {currentHousing && (
        <View style={styles.currentHousing}>
          <Text style={[styles.housingName, { color: getTierColor(currentHousing.tier) }]}>
            {currentHousing.name}
          </Text>
          <View style={styles.housingDetails}>
            <Text style={styles.detailText}>
              Tier {currentHousing.tier} {playerHousing.isOwned ? '(Owned)' : '(Rented)'}
            </Text>
            <Text style={styles.detailText}>
              Monthly Cost: ${currentHousing.monthlyRent || (currentHousing.propertyTax! + (currentHousing.maintenanceCost || 0))}
            </Text>
            {currentHousing.happinessBonus > 0 && (
              <Text style={styles.bonusText}>+{currentHousing.happinessBonus} Happiness</Text>
            )}
          </View>
        </View>
      )}

      <Text style={styles.subtitle}>Available Upgrades</Text>
      <ScrollView style={styles.tierList} showsVerticalScrollIndicator={false}>
        {housingCatalog.map(housing => {
          const isCurrentHousing =
            housing.id === playerStats.currentHousing.housingId;
          const canAfford = !housing.purchasePrice ||
            playerStats.balanceDebit >= housing.purchasePrice * 0.2;

          return (
            <TouchableOpacity
              key={housing.id}
              style={[
                styles.tierCard,
                isCurrentHousing && styles.tierCardActive,
              ]}
              onPress={() => handleUpgrade(housing.id)}
              disabled={isCurrentHousing || !canAfford}
            >
              <View style={styles.tierHeader}>
                <Text style={[styles.tierName, { color: getTierColor(housing.tier) }]}>
                  Tier {housing.tier}: {housing.name}
                </Text>
                {isCurrentHousing && <Text style={styles.currentBadge}>✓ Current</Text>}
              </View>

              <View style={styles.tierStats}>
                <Text style={styles.tierStat}>
                  💰 {housing.purchasePrice ? `$${housing.purchasePrice.toLocaleString()}` : `$${housing.monthlyRent}/mo`}
                </Text>
                <Text style={styles.tierStat}>
                  😊 +{housing.happinessBonus}
                </Text>
                <Text style={styles.tierStat}>
                  😌 {housing.stressReduction > 0 ? '+' : ''}{housing.stressReduction}
                </Text>
              </View>

              {housing.unlocks && housing.unlocks.length > 0 && (
                <Text style={styles.unlocksText}>
                  Unlocks: {housing.unlocks.join(', ')}
                </Text>
              )}

              {!canAfford && (
                <Text style={styles.unaffordableText}>Insufficient funds</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  currentHousing: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  housingName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  housingDetails: {
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bonusText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tierList: {
    maxHeight: 400,
  },
  tierCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tierCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tierName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  currentBadge: {
    backgroundColor: Colors.success,
    color: '#000',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  tierStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tierStat: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  unlocksText: {
    fontSize: 11,
    color: Colors.info,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  unaffordableText: {
    fontSize: 11,
    color: Colors.error,
    fontWeight: '500',
  },
});
