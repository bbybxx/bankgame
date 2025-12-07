/**
 * Spacing system for consistent layout
 * Using 4px base unit
 * 
 * ✅ QA Sign-Off: December 7, 2025
 * - Matches Design Contract specifications
 * - 4px base unit system
 * - Border radius from md (12px) to full (9999px)
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,     // Small elements (design contract default)
  lg: 16,     // Cards, buttons (design contract default)
  xl: 20,
  '2xl': 24,
  full: 9999, // Circular elements
} as const;

export const IconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
} as const;
