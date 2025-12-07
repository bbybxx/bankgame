import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { GameEvent, EventAction } from '../types';

interface EventCardProps {
  event: GameEvent;
  onActionSelect?: (event: GameEvent, actionId: string) => void;
  onDismiss?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onActionSelect,
  onDismiss,
}) => {
  const getEventColor = (type: GameEvent['eventType']): string => {
    const colors: Record<GameEvent['eventType'], string> = {
      career: Colors.info,
      financial: Colors.warning,
      social: Colors.success,
      crisis: Colors.error,
      opportunity: Colors.warning,
      system: Colors.textSecondary,
    };
    return colors[type];
  };

  const getEventIcon = (type: GameEvent['eventType']): string => {
    const icons: Record<GameEvent['eventType'], string> = {
      career: '🎯',
      financial: '💰',
      social: '🤝',
      crisis: '🚨',
      opportunity: '⭐',
      system: '⚙️',
    };
    return icons[type];
  };

  return (
    <View style={[styles.container, { borderLeftColor: getEventColor(event.eventType) }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getEventIcon(event.eventType)}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>
            {new Date(event.date).toLocaleDateString()}
          </Text>
        </View>
        {onDismiss && (
          <TouchableOpacity
            onPress={() => onDismiss(event.id)}
            style={styles.dismissButton}
          >
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.message}>{event.message}</Text>

      {event.messages && event.messages.length > 0 && (
        <View style={styles.additionalMessages}>
          {event.messages.map((msg, idx) => (
            <Text key={idx} style={styles.additionalMessage}>
              {msg}
            </Text>
          ))}
        </View>
      )}

      {event.impact && (
        <View style={styles.impactSection}>
          {event.impact.balance && (
            <Text style={[
              styles.impactText,
              { color: event.impact.balance > 0 ? Colors.success : Colors.error }
            ]}>
              💰 {event.impact.balance > 0 ? '+' : ''}{event.impact.balance}
            </Text>
          )}
          {event.impact.happiness && (
            <Text style={[
              styles.impactText,
              { color: event.impact.happiness > 0 ? Colors.success : Colors.error }
            ]}>
              😊 {event.impact.happiness > 0 ? '+' : ''}{event.impact.happiness}
            </Text>
          )}
          {event.impact.stress && (
            <Text style={[
              styles.impactText,
              { color: event.impact.stress < 0 ? Colors.success : Colors.error }
            ]}>
              😰 {event.impact.stress > 0 ? '+' : ''}{event.impact.stress}
            </Text>
          )}
          {event.impact.income && (
            <Text style={[
              styles.impactText,
              { color: event.impact.income > 0 ? Colors.success : Colors.error }
            ]}>
              💼 {event.impact.income > 0 ? '+' : ''}{event.impact.income}
            </Text>
          )}
        </View>
      )}

      {event.actions && event.actions.length > 0 && (
        <View style={styles.actionsSection}>
          {event.actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={() => onActionSelect?.(event, action.id)}
            >
              <Text style={styles.actionLabel}>{action.label}</Text>
              {action.description && (
                <Text style={styles.actionDescription}>{action.description}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dismissButton: {
    padding: Spacing.sm,
  },
  dismissText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  additionalMessages: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingLeft: Spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: Colors.border,
  },
  additionalMessage: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  impactSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionsSection: {
    gap: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  actionDescription: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Spacing.xs,
  },
});
