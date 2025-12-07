import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGameStore } from '../../src/store/gameStore';
import { triggerHaptic } from '../../src/utils/haptics';
import { Colors } from '../../src/theme/colors';
import { Typography } from '../../src/theme/typography';
import { Spacing } from '../../src/theme/spacing';
import { BorderRadius } from '../../src/theme/spacing';
import { ArrowLeft, Bell, BellOff, Send, Plus } from 'lucide-react-native';

// Mock messages for the demo
const MOCK_MESSAGES = [
  { id: '1', text: 'Hey, did you get the transfer?', sender: 'them', type: 'text', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', text: 'Transfer Received', amount: 3200.00, sender: 'them', type: 'transfer', date: new Date(Date.now() - 86000000).toISOString() },
  { id: '3', text: 'Yes, thanks!', sender: 'me', type: 'text', date: new Date(Date.now() - 85000000).toISOString() },
  { id: '4', text: "Here's your pittance. Don't spend it all on avocado toast.", sender: 'them', type: 'text', date: new Date().toISOString() },
];

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const chatId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { chats } = useGameStore();
  const chat = chats.find((c: any) => c.id === chatId);
  
  const [isMuted, setIsMuted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const bellScale = useRef(new Animated.Value(1)).current;

  const toggleMute = async () => {
    await triggerHaptic('impactMedium');
    Animated.sequence([
      Animated.timing(bellScale, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(bellScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(bellScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setIsMuted(!isMuted);
  };

  if (!chat) return <View style={styles.container}><Text style={{color: 'white'}}>Chat not found</Text></View>;

  const renderMessage = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => {
    const isMe = item.sender === 'me';
    const isTransfer = item.type === 'transfer';

    if (isTransfer) {
      return (
        <View style={[styles.messageBubble, styles.transferBubble]}>
          <View style={styles.transferHeader}>
            <View style={styles.transferIcon}>
              <Plus size={16} color={Colors.wealth.profit} />
            </View>
            <Text style={styles.transferTitle}>Incoming Transfer</Text>
          </View>
          <Text style={styles.transferAmount}>+${item.amount?.toFixed(2)}</Text>
          <Text style={styles.transferText}>{item.text}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageBubble, 
        isMe ? styles.myMessage : styles.theirMessage
      ]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTime, isMe ? styles.myMessageTime : styles.theirMessageTime]}>
          {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={async () => {
          await triggerHaptic('impactLight');
          router.back();
        }} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{chat.sender.charAt(0)}</Text>
          </View>
          <Text style={styles.headerName}>{chat.sender}</Text>
        </View>

        <TouchableOpacity onPress={toggleMute}>
          <Animated.View style={{ transform: [{ scale: bellScale }] }}>
            {isMuted ? (
              <BellOff size={24} color={Colors.text.tertiary} />
            ) : (
              <Bell size={24} color={Colors.gold.primary} />
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.inputField} 
            onPress={() => setShowOptions(true)}
            activeOpacity={0.9}
          >
            <Text style={styles.placeholderText}>Select a response...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={async () => {
            await triggerHaptic('impactLight');
          }}>
            <Send size={20} color={Colors.surface.background} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={async () => {
            await triggerHaptic('impactLight');
            setShowOptions(false);
          }}
        >
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Choose Response</Text>
            {['Thanks!', 'Can I get an advance?', 'Who is this?'].map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.optionButton}
                onPress={async () => {
                  await triggerHaptic('impactMedium');
                  setShowOptions(false);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
    backgroundColor: Colors.surface.background,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface.card.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    ...Typography.body.medium,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerName: {
    ...Typography.heading.h3,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  messagesList: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xs,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.gold.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface.card.default,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...Typography.body.medium,
    lineHeight: 22,
  },
  myMessageText: {
    color: Colors.surface.background,
  },
  theirMessageText: {
    color: Colors.text.primary,
  },
  messageTime: {
    ...Typography.label.small,
    fontSize: 11,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(13, 13, 13, 0.6)',
  },
  theirMessageTime: {
    color: Colors.text.tertiary,
  },
  // Transfer Bubble Styles
  transferBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.wealth.profit + '20',
    borderWidth: 1,
    borderColor: Colors.wealth.profit,
    width: '70%',
  },
  transferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  transferIcon: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.wealth.profit + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  transferTitle: {
    ...Typography.body.small,
    color: Colors.wealth.profit,
    fontWeight: '600',
  },
  transferAmount: {
    ...Typography.heading.h2,
    color: Colors.wealth.profit,
    marginBottom: Spacing.xs,
  },
  transferText: {
    ...Typography.body.small,
    color: Colors.text.primary,
    opacity: 0.8,
  },
  // Input Area
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    backgroundColor: Colors.surface.background,
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    height: 44,
    justifyContent: 'center',
  },
  placeholderText: {
    ...Typography.body.medium,
    color: Colors.text.tertiary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gold.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    backgroundColor: Colors.surface.card.elevated,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  optionsTitle: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionButton: {
    backgroundColor: Colors.surface.card.default,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  optionText: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
