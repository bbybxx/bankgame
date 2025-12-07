import React, { useMemo, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Bell,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Home as HomeIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';
import { useGameStore } from '../src/store/gameStore';
import { triggerHaptic } from '../src/utils/haptics';
import { showToast } from '../src/components/ToastManager';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';
import { BorderRadius } from '../src/theme/spacing';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const notifications = useGameStore((s) => s.notifications);
  const gameEvents = useGameStore((s) => s.playerStats.gameEvents || []);
  const markNotificationRead = useGameStore((s) => s.markNotificationRead);
  const handleNotificationAction = useGameStore((s) => s.handleNotificationAction);
  const [selectedActions, setSelectedActions] = useState<Record<string, string>>({});

  // Combine notifications and game events, sort by date
  const allNotifications = useMemo(() => {
    const notifs = notifications.map(n => ({
      ...n,
      source: 'notification' as const,
      timestamp: new Date(n.date).getTime(),
    }));

    const events = gameEvents.map(e => ({
      id: e.id,
      title: e.title,
      message: e.message,
      date: e.date.toISOString(),
      type: e.eventType === 'crisis' ? 'alert' : e.eventType === 'opportunity' ? 'info' : 'info',
      read: e.isRead,
      actions: e.actions?.map(a => ({
        label: a.label,
        actionId: a.id,
        style: 'default' as const,
        impact: a.impact,
        description: a.description,
      })),
      source: 'gameEvent' as const,
      timestamp: e.date.getTime(),
      eventType: e.eventType,
      impact: e.impact,
    }));

    return [...notifs, ...events].sort((a, b) => b.timestamp - a.timestamp);
  }, [notifications, gameEvents]);

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string, eventType?: string) => {
    if (eventType === 'crisis') return AlertCircle;
    if (eventType === 'opportunity') return TrendingUp;
    if (eventType === 'economic_shift') return DollarSign;
    if (eventType === 'job_event') return Briefcase;
    if (type === 'alert') return AlertCircle;
    return Info;
  };

  const getNotificationColor = (type: string, eventType?: string) => {
    if (eventType === 'crisis' || type === 'alert') return Colors.wealth.loss;
    if (eventType === 'opportunity') return Colors.wealth.profit;
    if (eventType === 'economic_shift') return Colors.gold.primary;
    return Colors.status.info;
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await triggerHaptic('impactLight');
    markNotificationRead(notificationId);
  };

  const handleAction = async (notificationId: string, actionId: string, action: any) => {
    await triggerHaptic('success');
    
    // Mark as selected
    setSelectedActions(prev => ({ ...prev, [notificationId]: actionId }));
    
    // Apply the action
    handleNotificationAction(notificationId, actionId);
    
    // Show feedback toast
    const impactParts: string[] = [];
    if (action.impact?.balance) {
      impactParts.push(`${action.impact.balance > 0 ? '+' : ''}$${action.impact.balance}`);
    }
    if (action.impact?.happiness) {
      impactParts.push(`😊 ${action.impact.happiness > 0 ? '+' : ''}${action.impact.happiness}`);
    }
    if (action.impact?.stress) {
      impactParts.push(`😰 ${action.impact.stress > 0 ? '+' : ''}${action.impact.stress}`);
    }
    
    showToast(
      impactParts.length > 0 
        ? `Choice Applied: ${impactParts.join(' • ')}` 
        : action.description || 'Your choice has been recorded',
      'success'
    );
    
    // Mark notification as read
    setTimeout(() => {
      markNotificationRead(notificationId);
    }, 500);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
          <View style={styles.headerTitleContainer}>
            <Bell size={24} color={Colors.gold.primary} />
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {allNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              You'll see game updates, economic news, and important events here
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {allNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type, (notification as any).eventType);
              const iconColor = getNotificationColor(notification.type, (notification as any).eventType);
              const impact = (notification as any).impact;

              return (
                <Pressable
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.notificationCardUnread,
                  ]}
                  onPress={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  {/* Icon */}
                  <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
                    <Icon size={24} color={iconColor} />
                  </View>

                  {/* Content */}
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationTime}>{formatDate(notification.date)}</Text>
                    </View>
                    
                    <Text style={styles.notificationMessage}>{notification.message}</Text>

                    {/* Impact Summary */}
                    {impact && (
                      <View style={styles.impactContainer}>
                        {impact.balanceChange !== undefined && impact.balanceChange !== 0 && (
                          <View style={styles.impactItem}>
                            <DollarSign size={14} color={impact.balanceChange > 0 ? Colors.wealth.profit : Colors.wealth.loss} />
                            <Text style={[
                              styles.impactText,
                              { color: impact.balanceChange > 0 ? Colors.wealth.profit : Colors.wealth.loss }
                            ]}>
                              {impact.balanceChange > 0 ? '+' : ''}{impact.balanceChange.toLocaleString()}
                            </Text>
                          </View>
                        )}
                        {impact.happinessChange !== undefined && impact.happinessChange !== 0 && (
                          <View style={styles.impactItem}>
                            <Text style={styles.impactText}>
                              😊 {impact.happinessChange > 0 ? '+' : ''}{impact.happinessChange}
                            </Text>
                          </View>
                        )}
                        {impact.stressChange !== undefined && impact.stressChange !== 0 && (
                          <View style={styles.impactItem}>
                            <Text style={styles.impactText}>
                              😰 {impact.stressChange > 0 ? '+' : ''}{impact.stressChange}
                            </Text>
                          </View>
                        )}
                        {impact.creditScoreChange !== undefined && impact.creditScoreChange !== 0 && (
                          <View style={styles.impactItem}>
                            <TrendingUp size={14} color={impact.creditScoreChange > 0 ? Colors.wealth.profit : Colors.wealth.loss} />
                            <Text style={[
                              styles.impactText,
                              { color: impact.creditScoreChange > 0 ? Colors.wealth.profit : Colors.wealth.loss }
                            ]}>
                              {impact.creditScoreChange > 0 ? '+' : ''}{impact.creditScoreChange} credit
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Actions */}
                    {notification.actions && notification.actions.length > 0 && (
                      <View style={styles.actionsContainer}>
                        {notification.actions.map((action) => {
                          const isSelected = selectedActions[notification.id] === action.actionId;
                          return (
                            <TouchableOpacity
                              key={action.actionId}
                              style={[
                                styles.actionButton,
                                action.style === 'destructive' && styles.actionButtonDestructive,
                                isSelected && styles.actionButtonSelected,
                              ]}
                              onPress={() => handleAction(notification.id, action.actionId, action)}
                              disabled={isSelected}
                            >
                              <View style={styles.actionButtonContent}>
                                {isSelected && <CheckCircle size={14} color={Colors.wealth.profit} />}
                                <Text
                                  style={[
                                    styles.actionButtonText,
                                    action.style === 'destructive' && styles.actionButtonTextDestructive,
                                    isSelected && styles.actionButtonTextSelected,
                                  ]}
                                >
                                  {action.label}
                                </Text>
                              </View>
                              {/* Impact Preview */}
                              {(action as any).impact && !isSelected && (
                                <View style={styles.actionImpact}>
                                  {(action as any).impact.balance && (
                                    <Text style={styles.actionImpactText}>
                                      {(action as any).impact.balance > 0 ? '+' : ''}${(action as any).impact.balance}
                                    </Text>
                                  )}
                                  {(action as any).impact.happiness && (
                                    <Text style={styles.actionImpactText}>
                                      😊{(action as any).impact.happiness > 0 ? '+' : ''}{(action as any).impact.happiness}
                                    </Text>
                                  )}
                                  {(action as any).impact.stress && (
                                    <Text style={styles.actionImpactText}>
                                      😰{(action as any).impact.stress > 0 ? '+' : ''}{(action as any).impact.stress}
                                    </Text>
                                  )}
                                </View>
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>
                </Pressable>
              );
            })}

            <View style={{ height: 100 }} />
          </ScrollView>
        )}

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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
  },
  headerBadge: {
    backgroundColor: Colors.wealth.loss,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs / 2,
  },
  headerBadgeText: {
    ...Typography.label.small,
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: '700',
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

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Notification Card
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  notificationCardUnread: {
    borderColor: Colors.gold.primary,
    backgroundColor: Colors.surface.card.elevated,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.xs,
    fontSize: 14,
  },
  notificationTime: {
    ...Typography.label.small,
    color: Colors.text.tertiary,
    fontSize: 11,
  },
  notificationMessage: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
    fontSize: 13,
  },

  // Impact
  impactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
    backgroundColor: Colors.surface.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
  },
  impactText: {
    ...Typography.label.small,
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 11,
  },

  // Actions
  actionsContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gold.primary,
  },
  actionButtonSelected: {
    backgroundColor: Colors.wealth.profit + '20',
    borderColor: Colors.wealth.profit,
  },
  actionButtonDestructive: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderColor: Colors.wealth.loss,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  actionButtonText: {
    ...Typography.label.small,
    color: Colors.gold.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  actionButtonTextSelected: {
    color: Colors.wealth.profit,
  },
  actionButtonTextDestructive: {
    color: Colors.wealth.loss,
  },
  actionImpact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs / 2,
    justifyContent: 'center',
  },
  actionImpactText: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    fontSize: 11,
  },

  // Unread Indicator
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gold.primary,
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
