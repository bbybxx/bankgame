import React from 'react';
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
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Home as HomeIcon,
} from 'lucide-react-native';
import { useGameStore } from '../src/store/gameStore';
import { triggerHaptic } from '../src/utils/haptics';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';
import { BorderRadius } from '../src/theme/spacing';

export default function ChatsScreen() {
  const router = useRouter();
  const chats = useGameStore((s) => s.chats);

  const handleChatPress = async (chatId: string) => {
    await triggerHaptic('impactLight');
    router.push(`/chat/${chatId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getAvatarInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Chat List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {chats.length === 0 ? (
            <View style={styles.emptyState}>
              <MessageSquare size={64} color={Colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No Messages</Text>
              <Text style={styles.emptyText}>
                Your conversations will appear here
              </Text>
            </View>
          ) : (
            chats.map((chat) => (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatItem}
                onPress={() => handleChatPress(chat.id)}
                activeOpacity={0.7}
              >
                {/* Avatar */}
                <View style={[
                  styles.avatar,
                  chat.unread && styles.avatarUnread
                ]}>
                  <Text style={styles.avatarText}>
                    {getAvatarInitials(chat.sender)}
                  </Text>
                </View>

                {/* Content */}
                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={[
                      styles.chatName,
                      chat.unread && styles.chatNameUnread
                    ]}>
                      {chat.sender}
                    </Text>
                    <Text style={[
                      styles.chatTime,
                      chat.unread && styles.chatTimeUnread
                    ]}>
                      {formatDate(chat.date)}
                    </Text>
                  </View>

                  <View style={styles.chatFooter}>
                    <Text 
                      style={[
                        styles.chatMessage,
                        chat.unread && styles.chatMessageUnread
                      ]}
                      numberOfLines={1}
                    >
                      {chat.lastMessage}
                    </Text>

                    {chat.amount && (
                      <View style={styles.amountBadge}>
                        {chat.type === 'incoming' ? (
                          <TrendingUp size={12} color={Colors.wealth.profit} />
                        ) : (
                          <TrendingDown size={12} color={Colors.wealth.loss} />
                        )}
                        <Text style={[
                          styles.amountText,
                          { color: chat.type === 'incoming' ? Colors.wealth.profit : Colors.wealth.loss }
                        ]}>
                          {chat.type === 'incoming' ? '+' : '-'}${chat.amount.toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Unread Indicator */}
                {chat.unread && (
                  <View style={styles.unreadDot} />
                )}
              </TouchableOpacity>
            ))
          )}

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
              // Already on chats
            }}
          >
            <View style={styles.navIcon}>
              <Text style={styles.navIconText}>💬</Text>
            </View>
            <Text style={[styles.navLabel, { color: Colors.gold.primary }]}>Chats</Text>
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

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Chat Item
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface.card.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarUnread: {
    borderWidth: 2,
    borderColor: Colors.gold.primary,
  },
  avatarText: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  chatName: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  chatNameUnread: {
    color: Colors.gold.primary,
    fontWeight: '700',
  },
  chatTime: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    fontSize: 11,
  },
  chatTimeUnread: {
    color: Colors.gold.primary,
    fontWeight: '600',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chatMessage: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    flex: 1,
  },
  chatMessageUnread: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
    backgroundColor: Colors.surface.card.elevated,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
  },
  amountText: {
    ...Typography.label.small,
    fontWeight: '700',
    fontSize: 11,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gold.primary,
    marginLeft: Spacing.sm,
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
