/**
 * Color palette for the Finance App
 * Based on a dark theme with orange accent colors
 */

export const Colors = {
  // Primary colors
  primary: '#FF6B00',
  primaryLight: '#FF8534',
  primaryDark: '#E55A00',
  
  // Background colors
  background: '#0D0D0D',
  backgroundSecondary: '#1A1A1A',
  backgroundTertiary: '#242424',
  backgroundCard: '#1C1C1E',
  
  // Surface colors
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  surfaceElevated: '#3A3A3C',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  textDisabled: '#48484A',
  
  // Status colors
  success: '#34C759',
  warning: '#FFD60A',
  error: '#FF3B30',
  info: '#0A84FF',
  
  // Transaction colors
  income: '#34C759',
  expense: '#FF3B30',
  transfer: '#FF6B00',
  
  // Card colors
  cardOrange: '#FF6B00',
  cardGray: '#2C2C2E',
  
  // Border colors
  border: '#38383A',
  borderLight: '#48484A',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Tab bar
  tabBarBackground: '#0D0D0D',
  tabBarActive: '#FF6B00',
  tabBarInactive: '#8E8E93',
  
  // Notification dot
  notificationDot: '#FF6B00',
} as const;

export type ColorName = keyof typeof Colors;
