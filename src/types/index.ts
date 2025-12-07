/**
 * Type definitions for the Finance App
 */

// Core Game Types (from Plan)
export interface ITransaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  date: string;
}

// ===== TURN SYSTEM TYPES =====
export interface GameTurn {
  turnNumber: number;           // 1, 2, 3, ... (infinite)
  weekNumber: number;           // 1-52 (within year)
  monthNumber: number;          // 1-12
  year: number;                 // 2024, 2025, etc.
  dayOfWeek: string;            // "Monday", "Friday", etc.
  turnType: 'weekly' | 'monthly_close';
}

// ===== LOAN SYSTEM TYPES =====
export interface Loan {
  id: string;
  type: 'asset_mortgage' | 'personal_loan' | 'payday_loan';
  originalAmount: number;        // Initial amount borrowed
  remainingBalance: number;      // Current outstanding balance
  annualInterestRate: number;    // Depends on creditScore
  monthlyPayment: number;        // Minimum monthly payment
  startDate: Date;
  maturityDate: Date;            // When loan is fully paid
  collateral?: string;           // Asset ID if secured loan
  isDelinquent: boolean;         // Payment overdue?
  daysDelinquent: number;        // How many days overdue
}

// ===== INVESTMENT SYSTEM TYPES =====
export interface Investment {
  id: string;
  symbol: string;               // "AAPL", "VTSAX", "BTC"
  type: 'stock' | 'etf' | 'bond' | 'crypto' | 'real_estate';
  sharePrice: number;           // Current price per share
  sharesOwned: number;          // Quantity owned
  totalValue: number;           // sharePrice * sharesOwned
  volatility: number;           // Annual volatility (0.15 = 15%)
  dividendYield?: number;       // Annual dividend yield (0.02 = 2%)
  lastPriceUpdate: Date;
  purchasePrice: number;        // Original purchase price (for P&L calc)
  name?: string;                // Optional: full name
}

// ===== JOB PERFORMANCE TYPES =====
export interface JobMetrics {
  currentPerformance: number;   // 0-100 (calculated from happiness/stress)
  monthlyPerformanceHistory: number[]; // Last 12 months
  monthsAtCurrentJob: number;   // Months in current position
  promotionEligibility: number; // -100 to +100
  riskOfLayoff: number;         // 0-100 (risk percentage)
  lastReviewDate: Date;
  currentJobTitle: string;
}

// ===== NPC RELATIONSHIP TYPES =====
export interface NPCRelationship {
  npcId: string;               // "karen", "sam", "emma"
  npcName: string;
  reputation: number;          // -100 to +100
  lastInteraction: Date;
  totalInteractions: number;
  gifts?: {
    giftValue: number;
    date: Date;
  }[];
}

// ===== SCHEDULED EFFECTS =====
export interface ScheduledEffect {
  id: string;
  description: string;
  triggerDate: Date;
  effectType: 'gift' | 'penalty' | 'opportunity' | 'crisis';
  impact: {
    balanceChange?: number;
    stressChange?: number;
    happinessChange?: number;
  };
  linkedNPC?: string;           // If related to NPC
}

// ===== HOUSING TIER SYSTEM =====
export interface HousingTier {
  id: string;
  tier: number;                 // 1 = rental, 5 = luxury
  name: string;
  monthlyRent: number;
  purchasePrice?: number;       // Null if rental only
  maintenanceCost: number;      // Monthly cost to maintain
  happinessBonus: number;       // +0 to +30
  stressReduction: number;      // -0 to -15
  commuteDamage?: number;       // Minutes/stress per week
  resaleValue?: number;         // If purchased
  unlocks?: string[];           // Career opportunities
  propertyTax?: number;         // If owned
  canRent?: boolean;            // Can generate passive income
  rentalIncome?: number;        // Monthly if rented to tenant
}

export interface CurrentHousing {
  housingId: string;
  tierLevel: number;
  isOwned: boolean;
  purchaseDate?: Date;
  loanId?: string;              // Mortgage ID
  isRentedOut?: boolean;
  tenantReputation?: number;
  purchasePrice?: number;
  currentResaleValue?: number;
}

// ===== VEHICLE TIER SYSTEM =====
export interface VehicleTier {
  id: string;
  tier: number;                 // 1 = used beater, 5 = luxury
  name: string;
  purchasePrice: number;
  maintenanceCost: number;      // Monthly
  fuelCost: number;             // Weekly equivalent
  breakdownChance: number;      // % per month
  resaleValue: number;
  happinessBonus: number;
  stressReduction: number;      // From reliable transport
}

export interface CurrentVehicle {
  vehicleId: string;
  tierLevel: number;
  purchaseDate?: Date;
  loanId?: string;              // Vehicle loan ID
  currentResaleValue?: number;
  mileage: number;
  isOwned?: boolean;
}

// ===== PLAYER DECISION & FEEDBACK =====
export interface DecisionImpact {
  happiness?: number;
  stress?: number;
  balance?: number;
}

export interface DelayedImpact {
  reputation?: { npcId: string; change: number }[];
  events?: string[];
  metrics?: { [key: string]: number };
}

export interface PlayerDecision {
  actionId: string;
  immediateImpact: DecisionImpact;
  delayedImpact?: DelayedImpact;
  delayedTrigger?: 'nextWeek' | 'nextMonth' | 'never';
}

export interface ScheduledDecisionEffect extends ScheduledEffect {
  triggeredBy: string;          // decision.actionId
  triggerTurn: number;
  delayedImpact: DelayedImpact;
}

// ===== EVENT SYSTEM =====
export interface GameEvent {
  id: string;
  eventType: 'career' | 'financial' | 'social' | 'crisis' | 'opportunity' | 'system';
  title: string;
  message: string;
  messages?: string[];
  date: Date;
  triggerTurn?: number;
  isRead: boolean;
  actions?: EventAction[];
  impact?: {
    balance?: number;
    income?: number;
    stress?: number;
    happiness?: number;
    [key: string]: any;
  };
}

export interface EventAction {
  id: string;
  label: string;
  description?: string;
  impact: {
    balance?: number;
    stress?: number;
    happiness?: number;
    income?: number;
    [key: string]: any;
  };
}

// ===== BANKRUPTCY SYSTEM =====
export type BankruptcyOption = 'chapter_7' | 'chapter_13' | 'settlement' | 'none';

export interface BankruptcyRecovery {
  option: BankruptcyOption;
  title: string;
  description: string;
  effects: {
    debtWiped: number;
    balanceChange: number;
    creditScoreChange: number;
    stressChange: number;
    prospectChange: number;
    assetsLost?: string[];
  };
}

// ===== TOAST NOTIFICATIONS =====
export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'neutral';
  title?: string;
  message: string;
  duration: number;              // ms
  actions?: 'undo' | 'dismiss';
}

// ===== EXTENDED PLAYER STATS =====
export interface IPlayerStats {
  // Identification
  playerId: string;
  playerName: string;
  startDate: Date;
  currentDate: Date;

  // === FINANCIALS ===
  balanceDebit: number;
  balanceVirtual: number;       // Savings / Virtual Account
  income: number;               // Monthly salary or base income
  expenses: {
    rent: number;
    groceries: number;
    loanPayment: number;
    utilities: number;
  };

  // === METRICS ===
  happiness: number;            // 0-100
  stress: number;               // 0-100
  prospects: number;            // 0-100 (career advancement)
  health: number;               // Credit Score (300-850)

  // === DEBT SYSTEM ===
  loans: Loan[];                // All active loans
  totalMonthlyDebtPayment: number;
  creditScore: number;          // 300-850
  debtToIncomeRatio: number;    // totalDebtPayment / income
  interestPaidTotal: number;    // Lifetime interest paid
  debt: number;                 // Legacy field, kept for compatibility

  // === INVESTMENTS ===
  investments: Investment[];
  investmentPortfolioValue: number;

  // === ASSETS ===
  currentHousing: CurrentHousing;
  currentVehicle?: CurrentVehicle;

  // === CAREER ===
  jobMetrics: JobMetrics;

  // === RELATIONSHIPS ===
  npcRelationships: NPCRelationship[];

  // === GAME STATE ===
  gameStatus: 'active' | 'red_zone' | 'game_over';
  negativeNetWorthMonths: number;
  redZoneStartDate?: Date;
  bankruptcyAttempts: number;   // Track bankruptcy uses

  // === EVENTS ===
  gameEvents: GameEvent[];
  pendingEventActions?: GameEvent; // Event awaiting player action

  // === SCHEDULED EFFECTS ===
  scheduledEffects: ScheduledEffect[];

  // === HISTORY ===
  happinessHistory: number[];
  stressHistory: number[];
  balanceHistory: number[];
}

// Legacy/UI Types (Keeping for compatibility during migration)
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface BankCard {
  id: string;
  type: 'debit' | 'virtual' | 'credit';
  balance: number;
  lastFourDigits: string;
  cardColor: 'orange' | 'gray' | 'dark';
  isActive?: boolean;
}

export interface MonthlyExpenses {
  month: string;
  total: number;
  categories: {
    category: string;
    percentage: number;
    color: string;
    amount: number;
  }[];
}

// UI Transaction type (extending core for compatibility)
export interface Transaction extends ITransaction {
  isIncome?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'alert' | 'info' | 'choice';
  read: boolean;
  actions?: { label: string; actionId: string; style?: 'default' | 'destructive' }[];
}

export interface Chat {
  id: string;
  sender: string;
  avatar?: string; // Initials or URL
  lastMessage: string;
  date: string;
  amount?: number; // If it's a transfer
  type: 'incoming' | 'outgoing' | 'text';
  unread: boolean;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Notifications: undefined;
  Chats: undefined;
  Expenses: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Payments: undefined;
  History: undefined;
  Analytics: undefined;
};

// ===== UI ARCHITECTURE TYPES =====

// Marketplace types
export interface MarketplaceAsset {
  id: string;
  type: 'apartment' | 'vehicle' | 'goods';
  tier: number;
  name: string;
  monthlyRent?: number;
  purchasePrice?: number;
  maintenanceCost?: number;
  image?: string;
  description?: string;
}

export interface MarketplaceCategory {
  id: 'apartments' | 'vehicles' | 'goods';
  label: string;
  items: MarketplaceAsset[];
}

// Job Market types
export interface JobListing {
  id: string;
  title: string;
  company?: string;
  salary: number;
  hoursPerWeek: number;
  description?: string;
  requirements?: string[];
  successChance?: number; // 0-100 based on player stats
  stressImpact?: number;
  happinessImpact?: number;
  tier?: number;
  requiredCreditScore?: number;
  requiredHousingTier?: number;
}

// AI Stats & Analytics types
export interface AIMetric {
  id: 'happiness' | 'stress' | 'prospects' | 'creditScore';
  label: string;
  value: number;
  max: number;
  trend?: 'up' | 'down' | 'stable';
  advice?: string;
}

// Player Profile types
export interface PlayerProfile {
  name: string;
  email?: string;
  level?: number; // Game progression level
  joinDate?: Date;
  biography?: string;
  avatar?: string;
  cv?: string; // Career history
}

// Quick Action types
export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  action: 'marketplace' | 'job_market' | 'ai_stats' | 'settings';
}

// Toast/Notification UI types
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ModalState {
  isVisible: boolean;
  type?: 'buy_asset' | 'apply_job' | 'pay_debt' | 'event_action';
  data?: any;
}
