/**
 * ELITE Color System - Billionaire Grade
 * Gold-based luxury palette for premium banking experience
 */

export const Colors = {
  // Gold System (Primary)
  gold: {
    primary: '#D4AF37',
    light: '#E5C158',
    dark: '#B8941F',
    glow: 'rgba(212, 175, 55, 0.3)',
  },

  // Background (OLED Optimized)
  surface: {
    background: '#0D0D0D',
    card: {
      default: '#1A1A1A',
      elevated: '#252525',
      glass: 'rgba(255, 255, 255, 0.08)',
    },
    highlight: '#2C2C2E',
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    tertiary: '#636366',
    disabled: '#48484A',
  },

  // Wealth Colors
  wealth: {
    profit: '#00C853',
    loss: '#FF3B30',
    neutral: '#8E8E93',
  },

  // Status
  status: {
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FFD60A',
    info: '#007AFF',
  },

  // Border
  border: {
    default: '#2C2C2E',
    divider: '#38383A',
    gold: 'rgba(212, 175, 55, 0.3)',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
} as const;
