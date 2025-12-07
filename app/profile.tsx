import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Edit3,
  RotateCcw,
  X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useGameStore } from '../src/store/gameStore';
import { triggerHaptic } from '../src/utils/haptics';
import { showToast } from '../src/components/ToastManager';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';
import { BorderRadius } from '../src/theme/spacing';

const AVATAR_EMOJIS = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💼', '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍🏫', '👩‍🏫', '🧑‍🏫', '👨‍💻', '👩‍💻', '🧑‍💻'];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const playerStats = useGameStore((s) => s.playerStats);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const updatePlayerName = useGameStore((s) => s.updatePlayerName);
  const updatePlayerAvatar = useGameStore((s) => s.updatePlayerAvatar);
  const resetGame = useGameStore((s) => s.resetGame);

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [newName, setNewName] = useState(playerStats.playerName || 'Player');

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

  const handleSaveName = async () => {
    if (newName.trim().length === 0) {
      await triggerHaptic('notificationError');
      showToast('Name cannot be empty', 'error');
      return;
    }
    await triggerHaptic('notificationSuccess');
    updatePlayerName(newName.trim());
    showToast('Name updated!', 'success');
    setNameModalVisible(false);
  };

  const handleSelectAvatar = async (emoji: string) => {
    await triggerHaptic('notificationSuccess');
    updatePlayerAvatar(emoji);
    showToast('Avatar updated!', 'success');
    setAvatarModalVisible(false);
  };

  const handleResetGame = () => {
    console.log('Reset button clicked!');
    triggerHaptic('impactMedium');
    setResetModalVisible(true);
  };

  const confirmReset = () => {
    console.log('Reset confirmed!');
    triggerHaptic('notificationSuccess');
    setResetModalVisible(false);
    
    // Полная очистка AsyncStorage
    console.log('Clearing AsyncStorage...');
    AsyncStorage.clear()
      .then(() => {
        console.log('AsyncStorage cleared successfully');
        showToast('Game reset! App will reload...', 'success');
        
        // Переход на несуществующий маршрут
        console.log('Navigating to error route...');
        setTimeout(() => {
          router.replace('/___reset___force___reload___');
        }, 500);
      })
      .catch((error) => {
        console.error('Reset error:', error);
        showToast('Failed to reset game', 'error');
      });
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
            <TouchableOpacity
              style={styles.avatarLarge}
              onPress={async () => {
                await triggerHaptic('impactLight');
                setAvatarModalVisible(true);
              }}
            >
              {playerStats.avatar ? (
                <Text style={styles.avatarEmoji}>{playerStats.avatar}</Text>
              ) : (
                <User size={48} color={Colors.surface.background} />
              )}
              <View style={styles.editBadge}>
                <Edit3 size={14} color={Colors.surface.background} />
              </View>
            </TouchableOpacity>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{playerStats.playerName || 'Player'}</Text>
              <TouchableOpacity
                style={styles.editNameButton}
                onPress={async () => {
                  await triggerHaptic('impactLight');
                  setNewName(playerStats.playerName || 'Player');
                  setNameModalVisible(true);
                }}
              >
                <Edit3 size={16} color={Colors.surface.background} />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileSubtitle}>
              Playing • Turn {currentTurn?.turnNumber || 0}
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
                    {currentTurn?.turnNumber || 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Reset Game Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetGame}
            >
              <RotateCcw size={20} color={Colors.status.error} />
              <Text style={styles.resetButtonText}>Reset Game</Text>
            </TouchableOpacity>
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
            <HomeIconLucide size={24} color={Colors.text.secondary} />
            <Text style={styles.navLabel}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/investments');
            }}
          >
            <TrendingUp size={24} color={Colors.text.secondary} />
            <Text style={styles.navLabel}>Investments</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/chats');
            }}
          >
            <Mail size={24} color={Colors.text.secondary} />
            <Text style={styles.navLabel}>Chats</Text>
          </Pressable>
        </View>
      </View>

      {/* Name Edit Modal */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <BlurView intensity={40} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Name</Text>
              <TouchableOpacity
                onPress={async () => {
                  await triggerHaptic('impactLight');
                  setNameModalVisible(false);
                }}
              >
                <X size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.text.tertiary}
              maxLength={20}
              autoFocus
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={async () => {
                  await triggerHaptic('impactLight');
                  setNameModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveName}
              >
                <Text style={styles.modalButtonTextPrimary}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Avatar Select Modal */}
      <Modal
        visible={avatarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <BlurView intensity={40} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Avatar</Text>
              <TouchableOpacity
                onPress={async () => {
                  await triggerHaptic('impactLight');
                  setAvatarModalVisible(false);
                }}
              >
                <X size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarGrid}>
              {AVATAR_EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.avatarOption,
                    playerStats.avatar === emoji && styles.avatarOptionSelected,
                  ]}
                  onPress={() => handleSelectAvatar(emoji)}
                >
                  <Text style={styles.avatarOptionEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={resetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <BlurView intensity={40} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Game</Text>
              <TouchableOpacity
                onPress={async () => {
                  await triggerHaptic('impactLight');
                  setResetModalVisible(false);
                }}
              >
                <X size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.resetWarningText}>
              This will permanently delete all your progress and restart the app. This action cannot be undone.
            </Text>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={async () => {
                  await triggerHaptic('impactLight');
                  setResetModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.resetButtonDanger]}
                onPress={confirmReset}
              >
                <Text style={styles.modalButtonTextDanger}>Reset Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
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
    backgroundColor: Colors.surface.background,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border.default,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  navIconContainer: {
    // Removed - icons displayed directly
  },
  navLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gold.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  editNameButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(13, 13, 13, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderWidth: 1,
    borderColor: Colors.status.error,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  resetButtonText: {
    ...Typography.body.medium,
    color: Colors.status.error,
    fontWeight: '600' as any,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface.card.elevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
  },
  nameInput: {
    ...Typography.body.large,
    color: Colors.text.primary,
    backgroundColor: Colors.surface.highlight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: Colors.surface.highlight,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.gold.primary,
  },
  modalButtonTextSecondary: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontWeight: '600' as any,
  },
  modalButtonTextPrimary: {
    ...Typography.body.medium,
    color: Colors.surface.background,
    fontWeight: '600' as any,
  },
  resetWarningText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  resetButtonDanger: {
    backgroundColor: Colors.status.error,
  },
  modalButtonTextDanger: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontWeight: '600' as any,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  avatarOption: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: Colors.gold.primary,
    backgroundColor: Colors.gold.glow,
  },
  avatarOptionEmoji: {
    fontSize: 36,
  },
});
