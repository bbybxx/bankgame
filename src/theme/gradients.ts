/**
 * Elite Gradient Library
 * Luxury gradients for premium UI elements
 */

export const EliteGradients = {
  // Hero gradient (background for main balance section)
  hero: {
    colors: ['#1A1A1A', '#0D0D0D'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },

  // Gold gradient (primary actions, accents)
  gold: {
    colors: ['#D4AF37', '#E5C158', '#B8941F'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Gold subtle (for backgrounds)
  goldSubtle: {
    colors: ['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },

  // Profit gradient (positive amounts, gains)
  profit: {
    colors: ['#00C853', '#00E676'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },

  // Loss gradient (negative amounts, debts)
  loss: {
    colors: ['#FF3B30', '#FF6B6B'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },

  // Glass effect (for glassmorphism)
  glass: {
    colors: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },

  // Card elevated (premium card backgrounds)
  cardElevated: {
    colors: ['#252525', '#1C1C1E'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;

export type GradientKey = keyof typeof EliteGradients;
