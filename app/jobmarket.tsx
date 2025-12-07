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
import { ArrowLeft, Briefcase, Clock, TrendingUp, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import { jobCatalog } from '../src/engine/jobCatalog';
import { triggerHaptic } from '../src/utils/haptics';
import { showToast } from '../src/components/ToastManager';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';

const { width: screenWidth } = Dimensions.get('window');

interface JobListing {
  id: string;
  title: string;
  company: string;
  salary: number;
  hoursPerWeek: number;
  description: string;
  tier: number;
  requirements: string[];
  successChance: number;
  requiredCreditScore: number;
  requiredHousingTier: number;
}

// jobCatalog moved to `src/engine/jobCatalog.ts` to centralize backend job data

export default function JobMarketScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const playerStats = useGameStore((s) => s.playerStats);
  const applyForJob = useGameStore((s) => s.applyForJob);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const currentJobTitle = playerStats.jobMetrics?.currentJobTitle || 'Software Developer';

  const handleApply = async (jobId: string) => {
    // No reason to fetch a local copy here; centralize in store action

    const job = jobCatalog.find(j => j.id === jobId);
    if (!job) return;

    // Validation checks (UI-level, store will re-check)
    if (playerStats.stress > 80) {
      showToast(`Too stressed (${playerStats.stress}/100). Take a break first!`, 'warning', 3500);
      await triggerHaptic('warning');
      return;
    }

    if (playerStats.creditScore < (job.requiredCreditScore ?? 0)) {
      showToast(`Credit score too low (${playerStats.creditScore}). Need ${job.requiredCreditScore}+`, 'error', 3500);
      await triggerHaptic('error');
      return;
    }

    const currentHousingTier = playerStats.currentHousing?.tierLevel || 1;
    if (currentHousingTier < (job.requiredHousingTier ?? 1)) {
      showToast(`Upgrade housing to Tier ${job.requiredHousingTier} first`, 'warning', 3500);
      await triggerHaptic('warning');
      return;
    }

    // Success chance roll
    const roll = Math.random() * 100;
    if (roll > (job.successChance ?? 50)) {
      showToast(`Application rejected. Better luck next time!`, 'error', 2500);
      await triggerHaptic('error');
      return;
    }

    // Apply for job via store action using jobId
    const res = applyForJob(jobId);
    showToast(res.message, res.success ? 'success' : 'error', 3000);
    await triggerHaptic('success');
    setSelectedJobId(null);
  };

  const getTierColor = (tier: number) => {
    if (tier === 1) return '#8E8E93';
    if (tier === 2) return '#5856D6';
    if (tier === 3) return '#007AFF';
    if (tier === 4) return '#FF6B00';
    if (tier === 5) return '#D4AF37';
    return Colors.text.secondary;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
          <Text style={styles.headerTitle}>Job Market</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Current Job Info */}
        <View style={styles.currentJobCard}>
          <View style={styles.currentJobHeader}>
            <Briefcase size={20} color={Colors.gold.primary} />
            <Text style={styles.currentJobLabel}>Current Position</Text>
          </View>
          <Text style={styles.currentJobTitle}>{currentJobTitle}</Text>
          <View style={styles.currentJobStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Your Salary</Text>
              <Text style={styles.statValue}>${playerStats.income?.toLocaleString() || 0}/mo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Performance</Text>
              <Text style={styles.statValue}>{Math.round(playerStats.jobMetrics?.currentPerformance || 0)}%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Tenure</Text>
              <Text style={styles.statValue}>{playerStats.jobMetrics?.monthsAtCurrentJob || 0}mo</Text>
            </View>
          </View>
        </View>

        {/* Job Listings */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Available Positions</Text>
          {jobCatalog.map((job) => {
            const isCurrentJob = job.title === currentJobTitle;
            const tierColor = getTierColor(job.tier ?? 1);
            const canApply = 
              playerStats.stress <= 80 &&
              playerStats.creditScore >= (job.requiredCreditScore ?? 0) &&
              (playerStats.currentHousing?.tierLevel || 1) >= (job.requiredHousingTier ?? 1);

            return (
              <Pressable
                key={job.id}
                style={[styles.jobCard, isCurrentJob && styles.currentJobHighlight]}
                onPress={async () => {
                  await triggerHaptic('impactLight');
                  setSelectedJobId(selectedJobId === job.id ? null : job.id);
                }}
              >
                {/* Tier Badge */}
                <View style={[styles.tierBadge, { backgroundColor: `${tierColor}20` }]}>
                  <Text style={[styles.tierText, { color: tierColor }]}>Tier {job.tier}</Text>
                </View>

                {isCurrentJob && (
                  <View style={styles.currentBadgeInline}>
                    <Text style={styles.currentBadgeText}>CURRENT</Text>
                  </View>
                )}

                {/* Job Header */}
                <View style={styles.jobHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.company}</Text>
                  </View>
                </View>

                {/* Job Stats */}
                <View style={styles.jobStats}>
                  <View style={styles.jobStatItem}>
                    <Text style={styles.jobStatLabel}>Listing Salary</Text>
                    <Text style={styles.jobStatValue}>${job.salary.toLocaleString()}/mo</Text>
                  </View>
                  <View style={styles.jobStatItem}>
                    <Text style={styles.jobStatLabel}>Hours/week</Text>
                    <Text style={styles.jobStatValue}>{job.hoursPerWeek}h</Text>
                  </View>
                  <View style={styles.jobStatItem}>
                    <Text style={styles.jobStatLabel}>Success</Text>
                    <Text style={[styles.jobStatValue, { color: (job.successChance ?? 0) > 50 ? Colors.status.success : Colors.status.warning }]}> 
                      {job.successChance}%
                    </Text>
                  </View>
                </View>

                {/* Expanded Details */}
                {selectedJobId === job.id && (
                  <View style={styles.expandedDetails}>
                    <Text style={styles.description}>{job.description}</Text>
                    
                    <Text style={styles.requirementsTitle}>Requirements:</Text>
                    {(job.requirements || []).map((req, idx) => (
                      <Text key={idx} style={styles.requirement}>• {req}</Text>
                    ))}

                    <View style={styles.requirementChecks}>
                      <View style={styles.checkItem}>
                        <Text style={styles.checkLabel}>Credit Score:</Text>
                        <Text style={[styles.checkValue, playerStats.creditScore >= (job.requiredCreditScore ?? 0) ? styles.checkPass : styles.checkFail]}>
                          {playerStats.creditScore}/{job.requiredCreditScore}
                        </Text>
                      </View>
                      <View style={styles.checkItem}>
                        <Text style={styles.checkLabel}>Housing Tier:</Text>
                        <Text style={[styles.checkValue, (playerStats.currentHousing?.tierLevel || 1) >= (job.requiredHousingTier ?? 1) ? styles.checkPass : styles.checkFail]}>
                          {playerStats.currentHousing?.tierLevel || 1}/{job.requiredHousingTier}
                        </Text>
                      </View>
                      <View style={styles.checkItem}>
                        <Text style={styles.checkLabel}>Stress Level:</Text>
                        <Text style={[styles.checkValue, playerStats.stress <= 80 ? styles.checkPass : styles.checkFail]}>
                          {playerStats.stress}/80
                        </Text>
                      </View>
                    </View>

                    {!isCurrentJob && (
                      <TouchableOpacity
                        style={[styles.applyButton, !canApply && styles.applyButtonDisabled]}
                        onPress={() => handleApply(job.id)}
                        disabled={!canApply}
                      >
                        <LinearGradient
                          colors={canApply ? [Colors.gold.primary, '#E5C158'] : ['#3A3A3C', '#2C2C2E']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.applyButtonGradient}
                        >
                          <Text style={styles.applyButtonText}>Apply Now</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
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
    </View>
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
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  currentJobCard: {
    backgroundColor: Colors.surface.card.elevated,
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.gold.primary}30`,
  },
  currentJobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  currentJobLabel: {
    ...Typography.label.medium,
    color: Colors.gold.primary,
    marginLeft: Spacing.sm,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  currentJobTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  currentJobStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  jobCard: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  currentJobHighlight: {
    borderWidth: 2,
    borderColor: Colors.gold.primary,
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
  currentBadgeInline: {
    position: 'absolute',
    top: Spacing.base,
    left: Spacing.base,
    backgroundColor: Colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentBadgeText: {
    ...Typography.label.small,
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    marginTop: Spacing.base,
  },
  jobTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobCompany: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    fontSize: 13,
  },
  jobStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  jobStatItem: {
    flex: 1,
  },
  jobStatLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    fontSize: 11,
    marginBottom: 4,
  },
  jobStatValue: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  expandedDetails: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
  },
  description: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  requirementsTitle: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  requirement: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    fontSize: 13,
    marginBottom: 4,
  },
  requirementChecks: {
    backgroundColor: Colors.surface.card.elevated,
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  checkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  checkLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    fontSize: 13,
  },
  checkValue: {
    ...Typography.body.small,
    fontSize: 13,
    fontWeight: '600',
  },
  checkPass: {
    color: Colors.status.success,
  },
  checkFail: {
    color: Colors.status.error,
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    ...Typography.body.medium,
    color: '#000',
    fontSize: 15,
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
