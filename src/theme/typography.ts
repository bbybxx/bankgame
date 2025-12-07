/**
 * ELITE Typography System - Billionaire Grade
 * Optimized for luxury financial displays
 */

import { TextStyle } from 'react-native';

export const Typography = {
  // Hero (64px - for main balance)
  hero: {
    fontSize: 64,
    fontWeight: '800' as TextStyle['fontWeight'],
    lineHeight: 72,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  } as TextStyle,

  // Display (Large amounts)
  display: {
    large: {
      fontSize: 48,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 56,
      letterSpacing: -1.5,
    } as TextStyle,
    medium: {
      fontSize: 36,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 44,
      letterSpacing: -1,
    } as TextStyle,
  },

  // Heading (Section titles)
  heading: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 40,
      letterSpacing: -0.5,
    } as TextStyle,
    h2: {
      fontSize: 28,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 36,
      letterSpacing: -0.5,
    } as TextStyle,
    h3: {
      fontSize: 24,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 32,
      letterSpacing: -0.5,
    } as TextStyle,
    h4: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 28,
      letterSpacing: -0.25,
    } as TextStyle,
  },

  // Body
  body: {
    large: {
      fontSize: 17,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 24,
      letterSpacing: 0,
    } as TextStyle,
    medium: {
      fontSize: 15,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 22,
      letterSpacing: 0,
    } as TextStyle,
    small: {
      fontSize: 13,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 18,
      letterSpacing: 0,
    } as TextStyle,
  },

  // Currency (Financial amounts)
  currency: {
    hero: {
      fontSize: 64,
      fontWeight: '800' as TextStyle['fontWeight'],
      lineHeight: 72,
      letterSpacing: -2,
      fontVariant: ['tabular-nums'],
    } as TextStyle,
    large: {
      fontSize: 28,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 36,
      letterSpacing: -0.5,
      fontVariant: ['tabular-nums'],
    } as TextStyle,
    medium: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 28,
      letterSpacing: -0.25,
      fontVariant: ['tabular-nums'],
    } as TextStyle,
    small: {
      fontSize: 15,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 20,
      letterSpacing: 0,
      fontVariant: ['tabular-nums'],
    } as TextStyle,
  },

  // Label
  label: {
    large: {
      fontSize: 15,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 20,
      letterSpacing: 0.1,
      textTransform: 'uppercase' as const,
    } as TextStyle,
    medium: {
      fontSize: 13,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 18,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    } as TextStyle,
    small: {
      fontSize: 11,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 14,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    } as TextStyle,
  },

  // Metadata
  metadata: {
    fontSize: 11,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 14,
    letterSpacing: 0.2,
  } as TextStyle,
} as const;
