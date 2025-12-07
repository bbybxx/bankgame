import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { IPlayerStats } from '../types';

interface RedZoneWarningProps {
  playerStats: IPlayerStats;
  onBankruptcyPressed?: () => void;
  onDismiss?: () => void;
}

export const RedZoneWarning: React.FC<RedZoneWarningProps> = ({
  playerStats,
  onBankruptcyPressed,
  onDismiss,
}) => {
  const daysSinceRedZone = playerStats.redZoneStartDate
    ? Math.floor(
        (new Date(playerStats.currentDate).getTime() - 
         new Date(playerStats.redZoneStartDate).getTime()) / 
        (1000 * 60 * 60 * 24)
      )
    : 0;

  const daysRemaining = Math.max(0, 90 - daysSinceRedZone);
  const percentFilled = ((90 - daysRemaining) / 90) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Text style={styles.icon}>🚨</Text>
        <Text style={styles.title}>FINANCIAL CRISIS</Text>
        <Text style={styles.subtitle}>RED ZONE ACTIVATED</Text>
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>Critical Status</Text>
        <Text style={styles.warningText}>
          Your financial situation is severe. You have {daysRemaining} days to recover or face bankruptcy proceedings.
        </Text>
      </View>

      <View style={styles.countdownBox}>
        <Text style={styles.countdownLabel}>Time Remaining</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentFilled}%` },
            ]}
          />
        </View>
        <Text style={styles.countdownDays}>{daysRemaining} days left</Text>
      </View>

      <View style={styles.metricsBox}>
        <Text style={styles.metricsTitle}>Current Situation</Text>
        
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Net Worth:</Text>
          <Text style={[
            styles.metricValue,
            { color: Colors.error }
          ]}>
            ${playerStats.balanceDebit.toFixed(2)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Total Debt:</Text>
          <Text style={[
            styles.metricValue,
            { color: Colors.error }
          ]}>
            ${playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0).toFixed(2)}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Credit Score:</Text>
          <Text style={[
            styles.metricValue,
            { color: Colors.error }
          ]}>
            {playerStats.creditScore}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Stress Level:</Text>
          <Text style={[
            styles.metricValue,
            { color: Colors.error }
          ]}>
            {Math.round(playerStats.stress)}/100
          </Text>
        </View>
      </View>

      <View style={styles.consequencesBox}>
        <Text style={styles.consequencesTitle}>What's Happening</Text>
        
        <View style={styles.consequenceItem}>
          <Text style={styles.consequenceIcon}>💸</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.consequenceTitle}>Daily Penalties</Text>
            <Text style={styles.consequenceText}>$50 overdraft fees daily (~$1,500/month)</Text>
          </View>
        </View>

        <View style={styles.consequenceItem}>
          <Text style={styles.consequenceIcon}>📞</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.consequenceTitle}>Debt Collection</Text>
            <Text style={styles.consequenceText}>Aggressive collection calls and notices</Text>
          </View>
        </View>

        <View style={styles.consequenceItem}>
          <Text style={styles.consequenceIcon}>😰</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.consequenceTitle}>Maximum Stress</Text>
            <Text style={styles.consequenceText}>Stress is constantly at maximum</Text>
          </View>
        </View>

        <View style={styles.consequenceItem}>
          <Text style={styles.consequenceIcon}>⛔</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.consequenceTitle}>Forced Asset Sales</Text>
            <Text style={styles.consequenceText}>Creditors may seize assets at fire-sale prices</Text>
          </View>
        </View>
      </View>

      <View style={styles.recoveryBox}>
        <Text style={styles.recoveryTitle}>How to Escape</Text>
        
        <View style={styles.recoveryOption}>
          <Text style={styles.recoveryNumber}>1</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.recoveryLabel}>Get Net Worth Positive</Text>
            <Text style={styles.recoveryDesc}>Earn more or spend less to restore positive balance</Text>
          </View>
        </View>

        <View style={styles.recoveryOption}>
          <Text style={styles.recoveryNumber}>2</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.recoveryLabel}>Sustained Stability</Text>
            <Text style={styles.recoveryDesc}>Maintain positive balance for 30 days</Text>
          </View>
        </View>

        <View style={styles.recoveryOption}>
          <Text style={styles.recoveryNumber}>3</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.recoveryLabel}>Crisis Averted</Text>
            <Text style={styles.recoveryDesc}>Red Zone will exit automatically</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {daysRemaining <= 0 && (
          <TouchableOpacity
            style={styles.bankruptcyButton}
            onPress={onBankruptcyPressed}
          >
            <Text style={styles.bankruptcyButtonText}>
              Consider Bankruptcy Options
            </Text>
          </TouchableOpacity>
        )}

        {onDismiss && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
          >
            <Text style={styles.dismissButtonText}>
              Acknowledge
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.error,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  warningBox: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: Spacing.sm,
  },
  warningText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  countdownBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  countdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.error,
  },
  countdownDays: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.error,
    textAlign: 'center',
  },
  metricsBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  metricsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  metricLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  consequencesBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  consequencesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  consequenceItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  consequenceIcon: {
    fontSize: 20,
  },
  consequenceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  consequenceText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recoveryBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  recoveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: Spacing.md,
  },
  recoveryOption: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recoveryNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    color: '#000',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '700',
    fontSize: 14,
  },
  recoveryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  recoveryDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionButtons: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  bankruptcyButton: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  bankruptcyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  dismissButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dismissButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
