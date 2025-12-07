import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Briefcase,
  Home as HomeIconLucide,
  Car,
  TrendingUp,
  Heart,
  Brain,
  CreditCard,
  Award,
  Clock,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../src/store/gameStore';
import { triggerHaptic } from '../src/utils/haptics';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';
import { BorderRadius } from '../src/theme/spacing';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const playerStats = useGameStore((s) => s.playerStats);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  const getJobTenure = () => {
    const months = playerStats.jobMetrics?.monthsAtCurrentJob || 0;
    if (months === 0) return 'Not employed';
    if (months < 1) return 'Less than 1 month';
    return `${months} month${months !== 1 ? 's' : ''}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.back();
            }}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header Card */}
          <LinearGradient
            colors={[Colors.gold.primary, Colors.gold.dark]}
            style={styles.profileCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarLarge}>
              <User size={48} color={Colors.surface.background} />
            </View>
            <Text style={styles.profileName}>{playerStats.playerName || 'Player'}</Text>
            <Text style={styles.profileSubtitle}>
              Playing • Turn {Math.floor((new Date().getTime() - new Date(playerStats.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000))}
            </Text>
          </LinearGradient>

          {/* Employment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employment</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Briefcase size={20} color={Colors.gold.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Current Job</Text>
                  <Text style={styles.infoValue}>
                    {playerStats.jobMetrics?.currentJobTitle || 'Unemployed'}
                  </Text>
                </View>
              </View>

              {playerStats.jobMetrics?.currentJobTitle && (
                <>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <TrendingUp size={20} color={Colors.status.success} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Salary</Text>
                      <Text style={styles.infoValue}>
                        ${playerStats.income?.toLocaleString() || 0}/week
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoDivider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Clock size={20} color={Colors.text.secondary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Tenure</Text>
                      <Text style={styles.infoValue}>{getJobTenure()}</Text>
                    </View>
                  </View>

                  <View style={styles.infoDivider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Award size={20} color={Colors.gold.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Performance</Text>
                      <Text style={styles.infoValue}>
                        {formatPercentage(playerStats.jobMetrics?.currentPerformance || 0)}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Living Situation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Living Situation</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <HomeIconLucide size={20} color={Colors.gold.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Housing</Text>
                  <Text style={styles.infoValue}>
                    {playerStats.currentHousing?.housingId || 'Homeless'}
                  </Text>
                </View>
              </View>

              {playerStats.currentVehicle && (
                <>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <Car size={20} color={Colors.gold.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Vehicle</Text>
                      <Text style={styles.infoValue}>
                        {playerStats.currentVehicle.vehicleId}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Well-being */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Well-being</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Heart size={20} color={Colors.status.success} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Happiness</Text>
                  <Text style={styles.infoValue}>
                    {Math.round(playerStats.happiness || 0)}/100
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Brain size={20} color={Colors.status.warning} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Stress</Text>
                  <Text style={styles.infoValue}>
                    {Math.round(playerStats.stress || 0)}/100
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <CreditCard size={20} color={Colors.gold.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Credit Score</Text>
                  <Text style={styles.infoValue}>
                    {Math.round(playerStats.creditScore || 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Game Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Progress</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Calendar size={20} color={Colors.text.secondary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Started</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(playerStats.startDate)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Clock size={20} color={Colors.text.secondary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Total Turns</Text>
                  <Text style={styles.infoValue}>
                    {Math.floor((new Date().getTime() - new Date(playerStats.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000))}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navItem}
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/');
            }}
          >
            <View style={styles.navIconContainer}>
              <HomeIconLucide size={22} color={Colors.text.secondary} />
            </View>
            <Text style={styles.navLabel}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/investments');
            }}
          >
            <View style={styles.navIconContainer}>
              <TrendingUp size={22} color={Colors.text.secondary} />
            </View>
            <Text style={styles.navLabel}>Investments</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/chats');
            }}
          >
            <View style={styles.navIconContainer}>
              <Mail size={22} color={Colors.text.secondary} />
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface.card.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  profileCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(13, 13, 13, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  profileName: {
    ...Typography.display.large,
    color: Colors.surface.background,
    marginBottom: Spacing.xs,
  },
  profileSubtitle: {
    ...Typography.body.medium,
    color: 'rgba(13, 13, 13, 0.7)',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    ...Typography.body.large,
    color: Colors.text.primary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.border.default,
    marginVertical: Spacing.sm,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.surface.card.default,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
  },
});
