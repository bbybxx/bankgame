import { 
  ITransaction, 
  Notification, 
  IPlayerStats, 
  MonthlyExpenses,
  GameTurn,
  Loan,
  Investment,
  ScheduledEffect,
  HousingTier,
  CurrentHousing,
  VehicleTier,
  CurrentVehicle,
  PlayerDecision,
  ToastNotification,
  ScheduledDecisionEffect,
  GameEvent,
  EventAction,
  BankruptcyRecovery,
  BankruptcyOption,
} from '../types';

export const CONSTANTS = {
  SALARY: 3200,
  RENT: 1500,
  GROCERIES_MIN: 300,
  GROCERIES_MAX: 600,
  TRANSPORT_MIN: 50,
  TRANSPORT_MAX: 150,
  ENTERTAINMENT_MIN: 100,
  ENTERTAINMENT_MAX: 400,
};

const CATEGORIES = {
  INCOME: 'Income',
  HOUSING: 'Housing',
  FOOD: 'Food & Drink',
  TRANSPORT: 'Transport',
  ENTERTAINMENT: 'Entertainment',
  SHOPPING: 'Shopping',
};

const VENDORS = {
  FOOD: ['Whole Foods', 'Trader Joe\'s', 'Local Market', 'Uber Eats', 'Starbucks'],
  TRANSPORT: ['Uber', 'Lyft', 'Shell Station', 'Metro Card'],
  ENTERTAINMENT: ['Netflix', 'Spotify', 'Cinema City', 'Steam Games', 'Bar & Grill'],
  SHOPPING: ['Amazon', 'Target', 'Apple Store', 'Uniqlo'],
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const getRandomAmount = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(2));
};

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const calculateProjectedExpenses = (expenses?: { rent?: number; groceries?: number; loanPayment?: number; utilities?: number }) => {
  // Prefer explicit expenses passed from the store; otherwise fall back to constants
  const rent = expenses && typeof expenses.rent === 'number' ? expenses.rent : CONSTANTS.RENT;
  const groceries = expenses && typeof expenses.groceries === 'number'
    ? expenses.groceries
    : (CONSTANTS.GROCERIES_MIN + CONSTANTS.GROCERIES_MAX) / 2;
  const loanPayment = expenses && typeof expenses.loanPayment === 'number'
    ? expenses.loanPayment
    : 0;
  const utilities = expenses && typeof expenses.utilities === 'number'
    ? expenses.utilities
    : 0;

  const breakdown = [
    { category: 'Housing', amount: rent, color: '#FF3B30' },
    { category: 'Food', amount: groceries, color: '#FF9500' },
    { category: 'Loan Payment', amount: loanPayment, color: '#5856D6' },
    { category: 'Utilities', amount: utilities, color: '#007AFF' },
  ];

  const total = breakdown.reduce((sum, b) => sum + (b.amount || 0), 0);

  // Attach percentage values
  const breakdownWithPercent = breakdown.map(b => ({
    ...b,
    percentage: total > 0 ? Math.round((b.amount / total) * 100) : 0,
  }));

  return {
    total,
    breakdown: breakdownWithPercent,
  };
};

export interface FinancialOverview {
  income: number;
  totalExpenses: number;
  netAfterExpenses: number;
  expensesBreakdown: {
    category: string;
    amount: number;
    color: string;
    percentage: number;
  }[];
  monthlyExpensesData: MonthlyExpenses;
}

export const calculateFinancialOverview = (playerStats: IPlayerStats): FinancialOverview => {
  const income = playerStats.income ?? CONSTANTS.SALARY;
  const projected = calculateProjectedExpenses(playerStats.expenses);

  const monthlyExpensesData: MonthlyExpenses = {
    month: 'Next Month',
    total: projected.total,
    categories: projected.breakdown,
  };

  const netAfterExpenses = income - projected.total;

  return {
    income,
    totalExpenses: projected.total,
    netAfterExpenses,
    expensesBreakdown: projected.breakdown,
    monthlyExpensesData,
  };
};

const splitAmountIntoParts = (total: number, parts: number) => {
  if (parts <= 1) return [Number(total.toFixed(2))];
  const base = total / parts;
  const variation = base * 0.2; // +/-20% variation per part
  const amounts: number[] = [];
  let remaining = total;

  for (let i = 0; i < parts - 1; i++) {
    const randomAdj = getRandomAmount(-variation, variation);
    const val = Math.max(0, base + randomAdj);
    amounts.push(Number(val.toFixed(2)));
    remaining -= val;
  }
  amounts.push(Number(remaining.toFixed(2)));
  return amounts;
};

export const generateMonthlyTransactions = (date: Date, playerStats: IPlayerStats): ITransaction[] => {
  const transactions: ITransaction[] = [];
  const dateStr = date.toISOString();
  const { income = CONSTANTS.SALARY, expenses } = playerStats;

  // 1. Salary (Income)
  transactions.push({
    id: generateId(),
    title: 'Tech Corp Salary',
    amount: income,
    date: dateStr,
    type: 'income',
    category: CATEGORIES.INCOME,
  });

  // 2. Core expenses from store
  const rent = expenses?.rent ?? CONSTANTS.RENT;
  const groceries = expenses?.groceries ?? ((CONSTANTS.GROCERIES_MIN + CONSTANTS.GROCERIES_MAX) / 2);
  const loanPayment = expenses?.loanPayment ?? 0;
  const utilities = expenses?.utilities ?? 0;

  if (rent > 0) {
    transactions.push({
      id: generateId(),
      title: 'Rent',
      amount: Number(rent.toFixed(2)),
      date: dateStr,
      type: 'expense',
      category: CATEGORIES.HOUSING,
    });
  }

  // Split groceries into 2-3 purchases for realism
  const groceryParts = splitAmountIntoParts(groceries, Math.floor(Math.random() * 2) + 2);
  groceryParts.forEach((amt) => {
    transactions.push({
      id: generateId(),
      title: getRandomItem(VENDORS.FOOD),
      amount: amt,
      date: dateStr,
      type: 'expense',
      category: CATEGORIES.FOOD,
    });
  });

  if (loanPayment > 0) {
    transactions.push({
      id: generateId(),
      title: 'Loan Payment',
      amount: Number(loanPayment.toFixed(2)),
      date: dateStr,
      type: 'expense',
      category: CATEGORIES.SHOPPING,
    });
  }

  if (utilities > 0) {
    transactions.push({
      id: generateId(),
      title: 'Utilities',
      amount: Number(utilities.toFixed(2)),
      date: dateStr,
      type: 'expense',
      category: CATEGORIES.TRANSPORT,
    });
  }

  return transactions;
};

export const generateRandomEvent = (date: Date): Notification | null => {
  if (Math.random() > 0.4) return null; // 40% chance of event

  const events: Partial<Notification>[] = [
    {
      title: 'Suspicious Activity',
      message: 'We detected an unusual login attempt from a new device. Was this you?',
      type: 'alert',
      actions: [
        { label: 'Yes, it was me', actionId: 'approve_login' },
        { label: 'No, block account', actionId: 'block_account', style: 'destructive' }
      ]
    },
    {
      title: 'Credit Limit Increase',
      message: 'You are eligible for a credit limit increase to $5,000. This may improve your credit score.',
      type: 'choice',
      actions: [
        { label: 'Accept Offer', actionId: 'accept_limit' },
        { label: 'Decline', actionId: 'decline_limit' }
      ]
    },
    {
      title: 'Subscription Renewal',
      message: 'Your annual subscription to "Pro Dev Tools" is about to renew for $299.',
      type: 'info',
      actions: [
        { label: 'Cancel Subscription', actionId: 'cancel_sub' },
        { label: 'Keep it', actionId: 'keep_sub' }
      ]
    }
  ];

  const event = getRandomItem(events);
  
  return {
    id: generateId(),
    title: event.title!,
    message: event.message!,
    date: date.toISOString(),
    type: event.type!,
    read: false,
    actions: event.actions
  };
};

export const calculateCreditScoreUpdate = (
  currentBalance: number,
  currentScore: number,
  hasMissedPayments: boolean = false
): number => {
  let change = 0;

  // Logic: High balance improves score, low balance hurts it
  if (currentBalance > 2000) {
    change += 5;
  } else if (currentBalance > 500) {
    change += 1;
  } else if (currentBalance < 0) {
    change -= 15;
  } else {
    change -= 5;
  }

  // Cap changes
  if (currentScore + change > 850) return 850 - currentScore;
  if (currentScore + change < 300) return 300 - currentScore;

  return change;
};

// ===== RANDOM EXPENSES SYSTEM =====

interface WeeklyExpenseGenerator {
  baseChance: number;
  minAmount: number;
  maxAmount: number;
  category: string;
  stressMultiplier?: number;
  description: string;
}

const weeklyExpenseTable: WeeklyExpenseGenerator[] = [
  {
    baseChance: 30,
    minAmount: 3,
    maxAmount: 8,
    category: 'Food & Drink',
    description: 'Coffee/lunch out',
  },
  {
    baseChance: 15,
    minAmount: 15,
    maxAmount: 50,
    category: 'Entertainment',
    description: 'Movie, game, entertainment',
  },
  {
    baseChance: 8,
    minAmount: 20,
    maxAmount: 120,
    category: 'Household',
    description: 'Broken item, replacement needed',
    stressMultiplier: 0.5,
  },
  {
    baseChance: 5,
    minAmount: 50,
    maxAmount: 200,
    category: 'Health',
    description: 'Doctor visit, medicine',
    stressMultiplier: 0.3,
  },
  {
    baseChance: 3,
    minAmount: 100,
    maxAmount: 500,
    category: 'Urgent Repair',
    description: 'Car/phone emergency repair',
    stressMultiplier: 1.0,
  },
];

/**
 * Apply weekly random expenses based on stress and chance
 */
export const applyWeeklyRandomExpenses = (playerStats: IPlayerStats): void => {
  for (const expense of weeklyExpenseTable) {
    let actualChance = expense.baseChance;

    // Stress modifies chance
    if (expense.stressMultiplier) {
      const stressBonus = (playerStats.stress / 100) * expense.stressMultiplier * 100;
      actualChance += stressBonus;
    }

    if (Math.random() * 100 < actualChance) {
      // Expense triggered
      const amount = Number(
        (expense.minAmount + Math.random() * (expense.maxAmount - expense.minAmount)).toFixed(2)
      );

      playerStats.balanceDebit -= amount;

      // Happiness impact based on category
      if (expense.category === 'Food & Drink' || expense.category === 'Entertainment') {
        playerStats.happiness = Math.min(100, playerStats.happiness + 2);
      } else if (expense.category === 'Urgent Repair') {
        playerStats.stress = Math.min(100, playerStats.stress + 5);
        playerStats.happiness = Math.max(0, playerStats.happiness - 3);
      }
    }
  }
};

// ===== INVESTMENT SYSTEM =====

export interface InvestmentCatalogItem {
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'bond' | 'crypto';
  sharePrice: number;
  riskLevel: 'low' | 'medium' | 'high';
  volatility: number;
  expectedReturn: number;
  dividendYield?: number;
  description: string;
}

export const investmentCatalog: InvestmentCatalogItem[] = [
  // LOW RISK
  {
    symbol: 'VTSAX',
    name: 'Vanguard Total Stock Market ETF',
    type: 'etf',
    sharePrice: 95.5,
    riskLevel: 'low',
    volatility: 0.03,
    expectedReturn: 0.08,
    dividendYield: 0.015,
    description: 'Broad market index fund. Boring, reliable.',
  },
  {
    symbol: 'BND',
    name: 'Vanguard Total Bond Market',
    type: 'bond',
    sharePrice: 82.0,
    riskLevel: 'low',
    volatility: 0.02,
    expectedReturn: 0.04,
    dividendYield: 0.04,
    description: 'Bond index. Very safe, modest returns.',
  },

  // MEDIUM RISK
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    sharePrice: 189.95,
    riskLevel: 'medium',
    volatility: 0.15,
    expectedReturn: 0.1,
    dividendYield: 0.005,
    description: 'Stable mega-cap tech.',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    type: 'stock',
    sharePrice: 380.0,
    riskLevel: 'medium',
    volatility: 0.14,
    expectedReturn: 0.12,
    dividendYield: 0.008,
    description: 'Cloud services giant.',
  },

  // HIGH RISK
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    sharePrice: 42500,
    riskLevel: 'high',
    volatility: 0.4,
    expectedReturn: 0.5,
    description: 'Extreme volatility. Could 10x or crash 50%.',
  },
  {
    symbol: 'GME',
    name: 'GameStop Corp.',
    type: 'stock',
    sharePrice: 25.5,
    riskLevel: 'high',
    volatility: 0.5,
    expectedReturn: 0.3,
    description: 'Highly volatile retail stock.',
  },
];

export interface BuyInvestmentResult {
  success: boolean;
  message: string;
  investment?: Investment;
  balanceAfter?: number;
}

/**
 * Buy investment by purchasing shares from catalog
 */
export const buyInvestment = (
  catalogItem: InvestmentCatalogItem,
  shareCount: number,
  playerStats: IPlayerStats
): BuyInvestmentResult => {
  const totalCost = catalogItem.sharePrice * shareCount;
  const availableFunds = playerStats.balanceDebit + playerStats.balanceVirtual;

  if (totalCost > availableFunds) {
    return {
      success: false,
      message: `Insufficient funds. Need $${totalCost.toFixed(2)}, have $${availableFunds.toFixed(2)}`,
    };
  }

  // Prefer deducting from virtual account (savings)
  if (totalCost <= playerStats.balanceVirtual) {
    playerStats.balanceVirtual -= totalCost;
  } else if (totalCost <= playerStats.balanceDebit) {
    playerStats.balanceDebit -= totalCost;
  } else {
    const virtualUsed = playerStats.balanceVirtual;
    playerStats.balanceVirtual = 0;
    playerStats.balanceDebit -= totalCost - virtualUsed;
  }

  // Create investment object
  const investment: Investment = {
    id: generateId(),
    type: catalogItem.type,
    symbol: catalogItem.symbol,
    name: catalogItem.name,
    sharePrice: catalogItem.sharePrice,
    sharesOwned: shareCount,
    totalValue: totalCost,
    volatility: catalogItem.volatility,
    dividendYield: catalogItem.dividendYield,
    lastPriceUpdate: new Date(),
    purchasePrice: catalogItem.sharePrice,
  };

  // Safety check: ensure investments array exists
  if (!playerStats.investments) {
    playerStats.investments = [];
  }
  
  playerStats.investments.push(investment);

  // Recalculate total portfolio value
  playerStats.investmentPortfolioValue = playerStats.investments.reduce(
    (sum, inv) => sum + inv.totalValue,
    0
  );

  // Psychological impact
  if (catalogItem.riskLevel === 'high') {
    playerStats.stress = Math.min(100, playerStats.stress + 10);
    playerStats.prospects = Math.min(100, playerStats.prospects + 5);
  } else if (catalogItem.riskLevel === 'low') {
    playerStats.stress = Math.max(0, playerStats.stress - 3);
    playerStats.happiness = Math.min(100, playerStats.happiness + 2);
  }

  return {
    success: true,
    message: `Purchased ${shareCount} shares of ${catalogItem.name}`,
    investment,
    balanceAfter: playerStats.balanceVirtual,
  };
};

export interface SellInvestmentResult {
  success: boolean;
  proceeds: number;
  gainLoss: number;
  message: string;
}

/**
 * Sell investment shares
 */
export const sellInvestment = (
  investment: Investment,
  shareCount: number,
  playerStats: IPlayerStats
): SellInvestmentResult => {
  if (shareCount > investment.sharesOwned) {
    return {
      success: false,
      proceeds: 0,
      gainLoss: 0,
      message: 'Cannot sell more shares than owned',
    };
  }

  const saleProceeds = investment.sharePrice * shareCount;
  const originalCost = investment.purchasePrice * shareCount;
  const gainLoss = saleProceeds - originalCost;
  const gainLossPercent = (gainLoss / originalCost) * 100;

  // Update investment
  investment.sharesOwned -= shareCount;
  if (investment.sharesOwned === 0) {
    playerStats.investments = playerStats.investments.filter(i => i.id !== investment.id);
  } else {
    investment.totalValue = investment.sharePrice * investment.sharesOwned;
  }

  // Recalculate total portfolio value
  playerStats.investmentPortfolioValue = playerStats.investments.reduce(
    (sum, inv) => sum + inv.totalValue,
    0
  );

  // Add proceeds to debit (main card)
  playerStats.balanceDebit += saleProceeds;

  // Emotional impact
  if (gainLoss > 0) {
    playerStats.happiness = Math.min(100, playerStats.happiness + 5);
    playerStats.stress = Math.max(0, playerStats.stress - 3);
  } else {
    playerStats.happiness = Math.max(0, playerStats.happiness - 5);
    playerStats.stress = Math.min(100, playerStats.stress + 5);
  }

  return {
    success: true,
    proceeds: saleProceeds,
    gainLoss,
    message: `Sold ${shareCount} shares for $${saleProceeds.toFixed(2)}. ${gainLoss > 0 ? 'Gain' : 'Loss'}: $${Math.abs(gainLoss).toFixed(2)}`,
  };
};

// ===== TURN SYSTEM EXECUTION =====

/**
 * Calculate annual interest rate based on credit score and loan type
 * Credit score determines base rate, loan type applies modifier
 */
export const calculateLoanRate = (creditScore: number, loanType: string): number => {
  let baseRate = 0;

  // Credit score tiers
  if (creditScore >= 750) baseRate = 0.04; // Excellent: 4%
  else if (creditScore >= 700) baseRate = 0.06; // Good: 6%
  else if (creditScore >= 650) baseRate = 0.09; // Fair: 9%
  else if (creditScore >= 600) baseRate = 0.14; // Poor: 14%
  else baseRate = 0.22; // Very Poor: 22%

  // Loan type modifiers
  const typeModifier = {
    asset_mortgage: 0.5, // Secured = lower risk = 50% of base
    personal_loan: 1.0, // Unsecured = standard rate
    payday_loan: 2.5, // High risk = 250% of base
  }[loanType] || 1.0;

  return baseRate * typeModifier;
};

/**
 * Calculate monthly payment using standard amortization formula
 */
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  monthsRemaining: number
): number => {
  if (monthsRemaining <= 0 || principal <= 0) return 0;

  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) {
    return principal / monthsRemaining;
  }

  return (principal * monthlyRate * Math.pow(1 + monthlyRate, monthsRemaining)) /
    (Math.pow(1 + monthlyRate, monthsRemaining) - 1);
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (date1: Date | string, date2: Date | string): number => {
  const oneDay = 1000 * 60 * 60 * 24;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Safety check
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return 0;
  }
  
  return Math.floor((d2.getTime() - d1.getTime()) / oneDay);
};

/**
 * Calculate months between two dates
 */
export const monthsBetween = (date1: Date | string, date2: Date | string): number => {
  let months = 0;
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Safety check
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return 0;
  }

  while (d1 < d2) {
    months++;
    d1.setMonth(d1.getMonth() + 1);
  }
  return months;
};

/**
 * Add months to a date
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Process early payment on a loan
 * Returns result with savings information
 */
export interface PayEarlyResult {
  amountPaid: number;
  newBalance: number;
  interestSaved: number;
  monthsSaved: number;
  stressReduction: number;
}

export const payEarlyOnLoan = (
  loan: Loan,
  amountPaid: number
): PayEarlyResult => {
  const monthlyInterest = loan.remainingBalance * (loan.annualInterestRate / 12);
  const principalPortion = Math.max(0, loan.monthlyPayment - monthlyInterest);

  const extraTowardsPrincipal = Math.max(0, amountPaid - loan.monthlyPayment);
  const totalPrincipalPayment = principalPortion + extraTowardsPrincipal;

  const newBalance = Math.max(0, loan.remainingBalance - totalPrincipalPayment);
  const remainingMonths = monthsBetween(new Date(), loan.maturityDate);
  const monthsSaved = principalPortion > 0
    ? Math.ceil(totalPrincipalPayment / principalPortion)
    : remainingMonths;

  const interestSaved = monthlyInterest * monthsSaved;
  const stressReduction = Math.ceil(monthsSaved / 6);

  return {
    amountPaid,
    newBalance,
    interestSaved,
    monthsSaved,
    stressReduction,
  };
};

/**
 * Calculate new credit score based on various factors
 */
export const updateCreditScore = (playerStats: IPlayerStats): void => {
  let newScore = 650; // Starting base

  // Payment history (35% weight in real life, here simplified)
  if (!playerStats.loans || playerStats.loans.length === 0) {
    newScore += 50; // No debt = lower history but good standing
  } else {
    const delinquentLoans = playerStats.loans.filter(l => l.isDelinquent).length;
    if (delinquentLoans === 0) {
      newScore += 50; // Perfect payment history
    } else {
      newScore -= delinquentLoans * 50; // Each delinquency = -50
    }
  }

  // Debt-to-income ratio (30% weight)
  const dti = playerStats.totalMonthlyDebtPayment / (playerStats.income || 1);
  if (dti < 0.2) {
    newScore += 50;
  } else if (dti < 0.4) {
    newScore += 20;
  } else if (dti < 0.6) {
    newScore += 0;
  } else {
    newScore -= 30;
  }

  // Savings vs debt ratio (15% weight)
  const savingsRatio = playerStats.balanceVirtual / (playerStats.totalMonthlyDebtPayment * 3 || 1);
  if (savingsRatio > 1) {
    newScore += 30;
  } else if (savingsRatio > 0.5) {
    newScore += 15;
  }

  // Account age (15% weight) - simplified: accounts older = better
  // Ensure startDate is a Date object
  const startDate = typeof playerStats.startDate === 'string' 
    ? new Date(playerStats.startDate) 
    : playerStats.startDate;
  
  if (startDate && !isNaN(startDate.getTime())) {
    const accountAge = daysBetween(startDate, new Date()) / 365;
    if (accountAge > 5) {
      newScore += 20;
    } else if (accountAge > 2) {
      newScore += 10;
    }
  }

  // Cap score at 300-850
  playerStats.creditScore = Math.max(300, Math.min(850, newScore));
  playerStats.debtToIncomeRatio = dti;
};

/**
 * Calculate current turn information based on game start date
 * Determines week number, month, year, and if month-end close should happen
 */
export const calculateTurnInfo = (currentDate: Date | string, gameStartDate: Date | string): GameTurn => {
  // Ensure dates are Date objects
  const currDate = typeof currentDate === 'string' ? new Date(currentDate) : currentDate;
  const gameStart = typeof gameStartDate === 'string' ? new Date(gameStartDate) : gameStartDate;
  
  const yearStart = new Date(currDate.getFullYear(), 0, 1);
  const dayOfYear = Math.floor(
    (currDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  const weekNumber = Math.floor(dayOfYear / 7) + 1; // 1-52
  const monthNumber = currDate.getMonth() + 1; // 1-12
  const year = currDate.getFullYear();

  // Calculate turn number from game start
  const daysDiff = Math.floor(
    (currDate.getTime() - gameStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const turnNumber = Math.floor(daysDiff / 7) + 1;

  // Month ends on weeks: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52
  const monthEnds = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52];
  const isMonthEnd = monthEnds.includes(weekNumber);

  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
    currDate.getDay()
  ];

  return {
    turnNumber,
    weekNumber,
    monthNumber,
    year,
    dayOfWeek,
    turnType: isMonthEnd ? 'monthly_close' : 'weekly',
  };
};

/**
 * Accrue weekly interest on savings and overdraft penalties
 * Runs every turn
 */
export const accrueWeeklyInterest = (playerStats: IPlayerStats): void => {
  // Interest is 1/4.33 of monthly (52 weeks / 12 months = 4.33 weeks/month)
  if (playerStats.balanceVirtual > 0) {
    const annualRate = 0.02; // 2% annual savings interest
    const weeklyRate = annualRate / 12 / 4.33;
    const weeklyInterest = playerStats.balanceVirtual * weeklyRate;
    playerStats.balanceVirtual += weeklyInterest;
  }

  // Overdraft penalty (weekly portion)
  if (playerStats.balanceDebit < 0) {
    const annualRate = 0.05; // 5% annual overdraft penalty
    const weeklyRate = annualRate / 12 / 4.33;
    const weeklyPenalty = Math.abs(playerStats.balanceDebit) * weeklyRate;
    playerStats.balanceDebit -= weeklyPenalty;
  }
};

/**
 * Update investment prices weekly with volatility
 * Generates notifications for significant moves
 */
export const updateInvestmentPrices = (playerStats: IPlayerStats, globalMarketFactor: number = 0): void => {
  if (!playerStats.investments || playerStats.investments.length === 0) return;

  for (const investment of playerStats.investments) {
    // Weekly volatility is smaller than monthly (monthly / sqrt(4.33) ≈ monthly / 2.08)
    const weeklyVolatility = investment.volatility / 2.08;

    // Random walk: price change this week
    const weeklyRandomComponent = (Math.random() - 0.5) * weeklyVolatility;
    const weeklyReturn = weeklyRandomComponent + globalMarketFactor / 4.33;

    const oldPrice = investment.sharePrice;
    const newPrice = oldPrice * (1 + weeklyReturn);
    const priceChange = newPrice - oldPrice;

    investment.sharePrice = newPrice;
    investment.totalValue = investment.sharePrice * investment.sharesOwned;
    investment.lastPriceUpdate = new Date();

    // Significant weekly move logs to history (not implemented yet)
    const percentChange = (priceChange / oldPrice) * 100;
    // Future: emit event if Math.abs(percentChange) > 3
  }

  // Recalculate total portfolio value
  playerStats.investmentPortfolioValue = playerStats.investments.reduce(
    (sum, inv) => sum + inv.totalValue,
    0
  );
};

/**
 * Process loan delinquency each turn
 * Checks if monthly loan payments have been made
 */
export const processLoanDelinquency = (playerStats: IPlayerStats): void => {
  if (!playerStats.loans || playerStats.loans.length === 0) return;

  for (const loan of playerStats.loans) {
    if (loan.isDelinquent) {
      // Escalate delinquency
      loan.daysDelinquent += 7;

      // Apply late fee after 30 days
      if (loan.daysDelinquent === 30 || (loan.daysDelinquent > 30 && loan.daysDelinquent % 30 === 0)) {
        const lateFeeAmount = Math.max(35, loan.monthlyPayment * 0.1);
        loan.remainingBalance += lateFeeAmount;
      }

      // After 90 days, consider repossession
      if (loan.daysDelinquent >= 90 && loan.collateral) {
        // Future: trigger asset repossession
      }
    }
  }
};

/**
 * Execute weekly turn flow
 */
export const executeWeeklyTurn = (playerStats: IPlayerStats): void => {
  // STEP 1: Accrue weekly interest on savings/debt
  accrueWeeklyInterest(playerStats);

  // STEP 2: Update investment prices with weekly volatility
  updateInvestmentPrices(playerStats);

  // STEP 3: Process loan delinquency status
  processLoanDelinquency(playerStats);

  // STEP 4: Apply weekly random expenses (stress-driven)
  applyWeeklyRandomExpenses(playerStats);

  // STEP 5: Generate weekly minor events
  generateWeeklyMinorEvents(playerStats);

  // STEP 6-7: Other systems will be added later
  // - updateWeeklyMoodInfluences()
  // - triggerRandomNPCMessage()

  // Record weekly snapshot (future: add to history arrays)
  // recordWeeklySnapshot(playerStats);
};

/**
 * Execute monthly close (Week 4 of month)
 */
export const executeMonthlyClose = (playerStats: IPlayerStats): void => {
  // STEP 1: Large monthly income
  playerStats.balanceDebit += playerStats.income;
  // Future: recordTransaction('Monthly Salary', ...)

  // STEP 2: Mandatory monthly expenses
  const monthlyExpenses = {
    rent: playerStats.expenses.rent,
    groceries: playerStats.expenses.groceries,
    utilities: playerStats.expenses.utilities,
    loanPayment: playerStats.totalMonthlyDebtPayment || playerStats.expenses.loanPayment,
  };

  const totalExpenses = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
  playerStats.balanceDebit -= totalExpenses;
  // Future: recordTransaction('Monthly Expenses', ...)

  // STEP 2b: Apply housing costs (maintenance, property tax, or rental income)
  applyMonthlyHousingCosts(playerStats);

  // STEP 3: Accrue monthly dividends (if investments have them)
  if (playerStats.investments && playerStats.investments.length > 0) {
    for (const investment of playerStats.investments) {
      if (investment.dividendYield && investment.dividendYield > 0) {
        const monthlyDividend = investment.totalValue * (investment.dividendYield / 12);
        playerStats.balanceVirtual += monthlyDividend;
        // Future: recordTransaction('Dividend Received', ...)
      }
    }
  }

  // STEP 4: Update credit score based on financial performance
  updateCreditScore(playerStats);

  // STEP 5: Job performance review
  monthlyJobReview(playerStats);

  // STEP 6: Update NPC relationships
  updateNPCRelationships(playerStats);

  // STEP 7: Apply reputation effects
  applyReputationEffects(playerStats);

  // STEP 8: Generate monthly major events
  generateMonthlyMajorEvents(playerStats);

  // STEP 9: Check game status (Red Zone, Game Over, etc)
  const gameStatus = checkGameStatus(playerStats);
  if (gameStatus === 'red_zone') {
    processRedZone(playerStats);
    
    // Check if should trigger bankruptcy option
    if (playerStats.redZoneStartDate) {
      const redZoneDate = typeof playerStats.redZoneStartDate === 'string'
        ? new Date(playerStats.redZoneStartDate)
        : playerStats.redZoneStartDate;
      
      const currentDate = typeof playerStats.currentDate === 'string'
        ? new Date(playerStats.currentDate)
        : playerStats.currentDate;
      
      if (redZoneDate && currentDate && !isNaN(redZoneDate.getTime()) && !isNaN(currentDate.getTime())) {
        const daysSinceRedZone = Math.floor(
          (currentDate.getTime() - redZoneDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceRedZone >= 90) { // After 3 months
          offerBankruptcyRecovery(playerStats);
        }
      }
    }
  } else if (gameStatus === 'game_over') {
    playerStats.gameStatus = 'game_over';
    createGameEvent(
      playerStats,
      'system',
      '🎮 GAME OVER',
      'Your financial situation became unrecoverable. You are bankrupt.'
    );
  }

  // Update history tracking
  if (playerStats.balanceHistory) {
    playerStats.balanceHistory.push(playerStats.balanceDebit);
  }
  if (playerStats.happinessHistory) {
    playerStats.happinessHistory.push(playerStats.happiness);
  }
  if (playerStats.stressHistory) {
    playerStats.stressHistory.push(playerStats.stress);
  }
};

// ===== JOB PERFORMANCE SYSTEM =====

/**
 * Calculate job performance score based on happiness, stress, and education
 */
export const calculateJobPerformance = (
  previousPerformance: number,
  happiness: number,
  stress: number,
  educationLevel: number = 0,
  jobDifficultyLevel: number = 50
): number => {
  let newPerformance = previousPerformance;

  // Happiness directly impacts productivity
  if (happiness < 20) {
    newPerformance *= 0.6; // Severe: -40%
  } else if (happiness < 40) {
    newPerformance *= 0.8; // Poor: -20%
  } else if (happiness < 50) {
    newPerformance *= 0.9; // Fair: -10%
  } else if (happiness > 75) {
    newPerformance *= 1.15; // Excellent: +15%
  }

  // Stress above 80 = burnout crisis
  if (stress > 90) {
    newPerformance *= 0.7; // Critical: -30%
  } else if (stress > 75) {
    newPerformance *= 0.85; // High: -15%
  } else if (stress > 60) {
    newPerformance *= 0.95; // Moderate: -5%
  }

  // Education provides ceiling boost
  const educationBonus = Math.min(20, educationLevel * 2);
  newPerformance += educationBonus;

  // Natural growth vs decay
  if (happiness > 60 && stress < 50) {
    newPerformance += 3; // Skill growth
  } else if (happiness < 40 || stress > 75) {
    newPerformance -= 4; // Skill decay
  }

  // Job difficulty factor
  if (jobDifficultyLevel > 70) {
    newPerformance *= 0.9; // Harder jobs = lower scores
  }

  return Math.max(0, Math.min(100, newPerformance));
};

/**
 * Execute monthly job review with promotion/layoff checks
 */
export const monthlyJobReview = (playerStats: IPlayerStats): void => {
  // Safety check: ensure jobMetrics exists
  if (!playerStats.jobMetrics) {
    playerStats.jobMetrics = {
      currentPerformance: 75,
      monthlyPerformanceHistory: [75],
      monthsAtCurrentJob: 0,
      promotionEligibility: 0,
      riskOfLayoff: 10,
      lastReviewDate: new Date(),
      currentJobTitle: 'Unknown Job',
    };
  }

  const metrics = playerStats.jobMetrics;

  // Calculate this month's performance
  metrics.currentPerformance = calculateJobPerformance(
    metrics.currentPerformance,
    playerStats.happiness,
    playerStats.stress,
    0, // education level - simplified for now
    50  // job difficulty - default
  );

  // Track history (last 12 months)
  if (!metrics.monthlyPerformanceHistory) {
    metrics.monthlyPerformanceHistory = [];
  }
  metrics.monthlyPerformanceHistory.push(metrics.currentPerformance);
  if (metrics.monthlyPerformanceHistory.length > 12) {
    metrics.monthlyPerformanceHistory.shift();
  }

  metrics.monthsAtCurrentJob++;
  metrics.lastReviewDate = new Date();

  // Calculate averages
  const avgPerformanceLastThree = metrics.monthlyPerformanceHistory.slice(-3).reduce((a, b) => a + b, 0) /
    Math.min(3, metrics.monthlyPerformanceHistory.length);
  const avgPerformanceLastSix = metrics.monthlyPerformanceHistory.slice(-6).reduce((a, b) => a + b, 0) /
    Math.min(6, metrics.monthlyPerformanceHistory.length);

  // Update derived metrics
  metrics.promotionEligibility = Math.max(0, avgPerformanceLastSix - 50);
  metrics.riskOfLayoff = Math.max(0, 100 - avgPerformanceLastThree);

  // === PROMOTION TRIGGER ===
  if (
    metrics.monthlyPerformanceHistory.length >= 3 &&
    metrics.monthlyPerformanceHistory.slice(-3).every(p => p > 75) &&
    playerStats.prospects > 60
  ) {
    triggerPromotionEvent(playerStats);
  }

  // === SALARY CUT TRIGGER ===
  if (
    metrics.monthlyPerformanceHistory.length >= 2 &&
    metrics.monthlyPerformanceHistory.slice(-2).every(p => p < 40)
  ) {
    triggerSalaryCutEvent(playerStats);
  }

  // === LAYOFF TRIGGER ===
  if (
    metrics.currentPerformance < 20 ||
    (playerStats.stress > 95 && metrics.currentPerformance < 30) ||
    (playerStats.happiness < 20 && metrics.currentPerformance < 35)
  ) {
    if (Math.random() < metrics.riskOfLayoff / 100) {
      triggerLayoffEvent(playerStats);
    }
  }
};

/**
 * Trigger promotion event
 */
export const triggerPromotionEvent = (playerStats: IPlayerStats): void => {
  const salaryIncrease = playerStats.income * 0.15; // 15% raise
  playerStats.income += salaryIncrease;
  playerStats.prospects = Math.min(100, playerStats.prospects + 15);
  playerStats.happiness = Math.min(100, playerStats.happiness + 25);
  playerStats.stress = Math.min(100, playerStats.stress + 5); // New responsibilities
};

/**
 * Trigger salary cut event
 */
export const triggerSalaryCutEvent = (playerStats: IPlayerStats): void => {
  const salaryCut = playerStats.income * 0.1; // 10% cut
  // Minimum take-home floor (protect from runaway decay)
  const MINIMUM_WAGE = 600; // $600/mo minimum before unemployment
  const newIncome = Math.max(MINIMUM_WAGE, Math.round(playerStats.income - salaryCut));
  const actualCut = playerStats.income - newIncome;
  playerStats.income = newIncome;
  // Create a game event to track the salary cut reason
  createGameEvent(
    playerStats,
    'career',
    '📉 Salary Reduced',
    `Due to poor performance your salary was reduced by $${actualCut.toLocaleString()}. New salary: $${playerStats.income.toLocaleString()}/mo.`
  );
  playerStats.stress = Math.min(100, playerStats.stress + 25);
  playerStats.happiness = Math.max(0, playerStats.happiness - 15);
};

/**
 * Trigger layoff event
 */
export const triggerLayoffEvent = (playerStats: IPlayerStats): void => {
  const unemploymentBenefit = 300; // $300/month temporary
  playerStats.income = unemploymentBenefit;
  playerStats.stress = 100;
  playerStats.happiness = 0;
  playerStats.jobMetrics.currentPerformance = 0;
  playerStats.jobMetrics.monthsAtCurrentJob = 0;
  playerStats.prospects = Math.max(0, playerStats.prospects - 20);
  playerStats.creditScore = Math.max(300, playerStats.creditScore - 50);
  // Emit a user-facing game event so players understand why they were laid off
  createGameEvent(
    playerStats,
    'career',
    '💼 Laid Off',
    `You were laid off due to performance/risk exposure. Monthly income set to unemployment benefit of $${unemploymentBenefit}/mo.`
  );
};

// ===== NPC REPUTATION SYSTEM =====

/**
 * Update NPC relationships based on player actions and time
 */
export const updateNPCRelationships = (playerStats: IPlayerStats): void => {
  if (!playerStats.npcRelationships || playerStats.npcRelationships.length === 0) return;

  for (const npc of playerStats.npcRelationships) {
    // Passive reputation decay over time (relationships fade without interaction)
    if (daysBetween(npc.lastInteraction, new Date()) > 30) {
      const decayFactor = -0.5; // -0.5 reputation per month of no interaction
      npc.reputation = Math.max(-100, npc.reputation + decayFactor);
    }

    // NPC-specific logic
    if (npc.npcId === 'karen') {
      // Boss relationship affected by job performance
      if (playerStats.jobMetrics.currentPerformance > 75) {
        npc.reputation = Math.min(100, npc.reputation + 2);
      } else if (playerStats.jobMetrics.currentPerformance < 30) {
        npc.reputation = Math.max(-100, npc.reputation - 3);
      }
    } else if (npc.npcId === 'sam') {
      // Friend relationship affected by helping/refusing events
      // (specific interactions happen through decision system)
    } else if (npc.npcId === 'emma') {
      // Rival relationship affected by performance comparison
      if (playerStats.prospects > 70 && playerStats.income > 4000) {
        npc.reputation = Math.min(100, npc.reputation + 1); // Respect
      } else if (playerStats.prospects < 40) {
        npc.reputation = Math.max(-100, npc.reputation - 1); // Disdain
      }
    }
  }
};

/**
 * Apply NPC reputation effects to player stats
 */
export const applyReputationEffects = (playerStats: IPlayerStats): void => {
  if (!playerStats.npcRelationships || playerStats.npcRelationships.length === 0) return;

  let totalReputationBonus = 0;

  for (const npc of playerStats.npcRelationships) {
    if (npc.npcId === 'karen' && npc.reputation > 70) {
      // Boss with high reputation gives salary bonus
      totalReputationBonus += playerStats.income * 0.05; // 5% bonus
      playerStats.jobMetrics.promotionEligibility += 10;
    } else if (npc.npcId === 'karen' && npc.reputation < 0) {
      // Boss with bad reputation gives salary penalty
      totalReputationBonus -= playerStats.income * 0.05; // 5% penalty
      playerStats.jobMetrics.promotionEligibility -= 10;
    }
  }

  playerStats.income += totalReputationBonus;
};

// ===== NET WORTH & RED ZONE SYSTEM =====

/**
 * Calculate total net worth from all assets and debts
 */
export const calculateNetWorth = (playerStats: IPlayerStats): number => {
  const assets = playerStats.balanceDebit + playerStats.balanceVirtual + playerStats.investmentPortfolioValue;
  const liabilities = playerStats.loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  return assets - liabilities;
};

/**
 * Check current game status (active, yellow warning, red zone, game over)
 */
export const checkGameStatus = (playerStats: IPlayerStats): 'active' | 'yellow_warning' | 'red_zone' | 'game_over' => {
  const netWorth = calculateNetWorth(playerStats);
  const balanceDebit = playerStats.balanceDebit;

  // ACTIVE: Normal gameplay
  if (netWorth > 0 && balanceDebit > -500) {
    return 'active';
  }

  // YELLOW WARNING: Headed toward trouble
  if (balanceDebit < -500 && netWorth > 0) {
    return 'yellow_warning';
  }

  // RED ZONE: Crisis state
  if (balanceDebit < -1000 || (netWorth < 0 && netWorth > -10000)) {
    return 'red_zone';
  }

  // GAME OVER: Persistent insolvency
  if (netWorth < 0) {
    playerStats.negativeNetWorthMonths++;
    if (playerStats.negativeNetWorthMonths >= 3) {
      return 'game_over';
    }
  } else {
    playerStats.negativeNetWorthMonths = 0;
  }

  return 'active';
};

/**
 * Process Red Zone mechanics
 */
export const processRedZone = (playerStats: IPlayerStats): void => {
  // Initialize red zone if just entered
  if (!playerStats.redZoneStartDate) {
    playerStats.redZoneStartDate = new Date(playerStats.currentDate);
    playerStats.stress = 100;
    playerStats.happiness = 0;

    createGameEvent(
      playerStats,
      'crisis',
      '🚨 FINANCIAL CRISIS - RED ZONE ACTIVATED',
      'Your finances are in critical condition. You have 3 months to recover or face bankruptcy.',
      undefined,
      { stress: 30, happiness: -50 }
    );
  }

  // Daily overdraft penalty (simulated as ~$50/week = $1500/month)
  playerStats.balanceDebit -= 50;

  // Stress accumulation
  playerStats.stress = 100; // Capped at maximum
  playerStats.happiness = 0;

  // Check if recovered
  const netWorth = calculateNetWorth(playerStats);
  if (netWorth > 0 && playerStats.balanceDebit > 0) {
    playerStats.redZoneStartDate = undefined;
    playerStats.stress = Math.max(0, playerStats.stress - 30);
    playerStats.happiness = Math.min(100, playerStats.happiness + 20);

    createGameEvent(
      playerStats,
      'system',
      '✅ RED ZONE EXITED',
      'You\'ve stabilized your finances! Crisis averted. Keep up your new spending habits.',
      undefined,
      { happiness: 20, stress: -30 }
    );
  }
};

// ===== ASSET TIER SYSTEM =====

/**
 * Housing tier catalog with progression from rental to luxury
 */
export const housingCatalog: HousingTier[] = [
  {
    id: 'rental_studio',
    tier: 1,
    name: 'Shared Studio Apartment',
    monthlyRent: 800,
    maintenanceCost: 0,
    happinessBonus: 0,
    stressReduction: -5,
    commuteDamage: 45,
    canRent: false,
    unlocks: [],
  },
  {
    id: 'rental_1bed',
    tier: 2,
    name: '1-Bedroom Apartment',
    monthlyRent: 1200,
    maintenanceCost: 0,
    happinessBonus: 5,
    stressReduction: -2,
    commuteDamage: 30,
    canRent: false,
    unlocks: [],
  },
  {
    id: 'owned_starter',
    tier: 3,
    name: 'Starter Home (Owned)',
    purchasePrice: 120000,
    monthlyRent: 0,
    maintenanceCost: 300,
    propertyTax: 200,
    happinessBonus: 15,
    stressReduction: 0,
    commuteDamage: 20,
    resaleValue: 120000,
    canRent: true,
    rentalIncome: 1500,
    unlocks: ['better_job_tier_2'],
  },
  {
    id: 'owned_nice',
    tier: 4,
    name: 'Nice Suburban Home',
    purchasePrice: 300000,
    monthlyRent: 0,
    maintenanceCost: 600,
    propertyTax: 400,
    happinessBonus: 25,
    stressReduction: 5,
    commuteDamage: 15,
    resaleValue: 300000,
    canRent: true,
    rentalIncome: 3200,
    unlocks: ['premium_job_tier'],
  },
  {
    id: 'owned_luxury',
    tier: 5,
    name: 'Luxury Home',
    purchasePrice: 800000,
    monthlyRent: 0,
    maintenanceCost: 1500,
    propertyTax: 1200,
    happinessBonus: 30,
    stressReduction: 10,
    commuteDamage: 5,
    resaleValue: 800000,
    canRent: true,
    rentalIncome: 6500,
    unlocks: ['executive_opportunities'],
  },
];

/**
 * Vehicle tier catalog with progression
 */
export const vehicleCatalog: VehicleTier[] = [
  {
    id: 'vehicle_beater',
    tier: 1,
    name: '2008 Used Sedan',
    purchasePrice: 3000,
    maintenanceCost: 150,
    fuelCost: 40,
    breakdownChance: 8,
    resaleValue: 1500,
    happinessBonus: 0,
    stressReduction: -10,
  },
  {
    id: 'vehicle_reliable',
    tier: 2,
    name: '2015 Toyota Camry',
    purchasePrice: 12000,
    maintenanceCost: 80,
    fuelCost: 35,
    breakdownChance: 2,
    resaleValue: 8000,
    happinessBonus: 5,
    stressReduction: 0,
  },
  {
    id: 'vehicle_nice',
    tier: 3,
    name: '2020 Honda Accord',
    purchasePrice: 25000,
    maintenanceCost: 50,
    fuelCost: 30,
    breakdownChance: 0.5,
    resaleValue: 18000,
    happinessBonus: 10,
    stressReduction: 5,
  },
  {
    id: 'vehicle_premium',
    tier: 4,
    name: '2022 BMW 3 Series',
    purchasePrice: 50000,
    maintenanceCost: 120,
    fuelCost: 50,
    breakdownChance: 0.2,
    resaleValue: 38000,
    happinessBonus: 15,
    stressReduction: 8,
  },
  {
    id: 'vehicle_luxury',
    tier: 5,
    name: 'Tesla Model S',
    purchasePrice: 90000,
    maintenanceCost: 100,
    fuelCost: 20,
    breakdownChance: 0.1,
    resaleValue: 70000,
    happinessBonus: 25,
    stressReduction: 12,
  },
];

/**
 * Upgrade housing to a new tier
 */
export const upgradeHousing = (
  playerStats: IPlayerStats,
  newHousingId: string
): { success: boolean; message: string } => {
  const newHousing = housingCatalog.find(h => h.id === newHousingId);
  if (!newHousing) return { success: false, message: 'Housing not found' };

  const oldHousing = playerStats.currentHousing;

  // If upgrading from owned to owned, sell old first
  if (oldHousing?.isOwned && newHousing.purchasePrice) {
    const saleProceeds = oldHousing.currentResaleValue || (newHousing.purchasePrice * 0.9);
    playerStats.balanceDebit += saleProceeds;
  }

  // Purchase or rent new
  if (newHousing.purchasePrice) {
    // Would need mortgage approval - for now, deduct from balance
    if (playerStats.balanceDebit < newHousing.purchasePrice * 0.2) {
      return { success: false, message: 'Insufficient funds for down payment' };
    }

    playerStats.balanceDebit -= newHousing.purchasePrice * 0.2; // 20% down

    // Create mortgage loan
    const mortgageMonths = 360; // 30 years
    const loanRate = calculateLoanRate(playerStats.creditScore, 'asset_mortgage');
    const monthlyPayment = (newHousing.purchasePrice * (loanRate / 12)) / 
      (1 - Math.pow(1 + (loanRate / 12), -mortgageMonths));

    // Ensure currentDate is a Date object
    const currentDateObj = typeof playerStats.currentDate === 'string' 
      ? new Date(playerStats.currentDate) 
      : playerStats.currentDate;

    const mortgage: Loan = {
      id: generateId(),
      type: 'asset_mortgage',
      originalAmount: newHousing.purchasePrice * 0.8,
      remainingBalance: newHousing.purchasePrice * 0.8,
      annualInterestRate: loanRate,
      monthlyPayment: monthlyPayment,
      startDate: new Date(currentDateObj),
      maturityDate: new Date(currentDateObj.getTime() + mortgageMonths * 30 * 24 * 60 * 60 * 1000),
      collateral: newHousingId,
      isDelinquent: false,
      daysDelinquent: 0,
    };

    // Safety check: ensure loans array exists
    if (!playerStats.loans) {
      playerStats.loans = [];
    }
    
    playerStats.loans.push(mortgage);
    playerStats.totalMonthlyDebtPayment += mortgage.monthlyPayment;

    playerStats.currentHousing = {
      housingId: newHousingId,
      tierLevel: newHousing.tier,
      isOwned: true,
      purchaseDate: new Date(playerStats.currentDate),
      loanId: mortgage.id,
      currentResaleValue: newHousing.purchasePrice,
    };
  } else {
    // Rental
    playerStats.currentHousing = {
      housingId: newHousingId,
      tierLevel: newHousing.tier,
      isOwned: false,
    };
  }

  // Apply happiness and stress bonuses
  playerStats.happiness = Math.min(100, playerStats.happiness + newHousing.happinessBonus);
  playerStats.stress = Math.max(0, playerStats.stress + newHousing.stressReduction);
  playerStats.expenses.rent = newHousing.monthlyRent || 0;

  return { success: true, message: `Moved to ${newHousing.name}!` };
};

/**
 * Execute player decision with immediate and delayed effects
 */
export const executePlayerDecision = (
  decision: PlayerDecision,
  playerStats: IPlayerStats
): ToastNotification => {
  // IMMEDIATE EFFECTS
  const immediate = decision.immediateImpact;

  if (immediate.balance) {
    playerStats.balanceDebit += immediate.balance;
  }

  if (immediate.happiness) {
    playerStats.happiness = Math.max(0, Math.min(100, 
      playerStats.happiness + immediate.happiness
    ));
  }

  if (immediate.stress) {
    playerStats.stress = Math.max(0, Math.min(100,
      playerStats.stress + immediate.stress
    ));
  }

  // DELAYED EFFECTS
  if (decision.delayedImpact && decision.delayedTrigger) {
    const turnInfo = calculateTurnInfo(playerStats.currentDate, playerStats.startDate);
    let triggerTurn = turnInfo.turnNumber;

    if (decision.delayedTrigger === 'nextWeek') {
      triggerTurn += 1;
    } else if (decision.delayedTrigger === 'nextMonth') {
      triggerTurn += 4; // ~4 weeks per month
    }

    const scheduledEffect: ScheduledDecisionEffect = {
      id: generateId(),
      description: `Effect from ${decision.actionId}`,
      triggerDate: new Date(playerStats.currentDate),
      effectType: 'opportunity',
      impact: {},
      triggeredBy: decision.actionId,
      triggerTurn: triggerTurn,
      delayedImpact: decision.delayedImpact,
    };

    // Safety check: ensure scheduledEffects array exists
    if (!playerStats.scheduledEffects) {
      playerStats.scheduledEffects = [];
    }
    
    playerStats.scheduledEffects.push(scheduledEffect as ScheduledEffect);
  }

  // Create toast notification
  const messages: string[] = [];
  if (immediate.happiness && immediate.happiness > 0) {
    messages.push(`😊 +${immediate.happiness} Happiness`);
  } else if (immediate.happiness && immediate.happiness < 0) {
    messages.push(`😞 ${immediate.happiness} Happiness`);
  }

  if (immediate.stress && immediate.stress < 0) {
    messages.push(`😌 ${immediate.stress} Stress`);
  } else if (immediate.stress && immediate.stress > 0) {
    messages.push(`😰 +${immediate.stress} Stress`);
  }

  if (immediate.balance && immediate.balance > 0) {
    messages.push(`💰 +$${immediate.balance}`);
  } else if (immediate.balance && immediate.balance < 0) {
    messages.push(`💸 -$${Math.abs(immediate.balance)}`);
  }

  const notifType = (immediate.happiness || 0) > 0 || (immediate.stress || 0) < 0 
    ? 'success' 
    : 'neutral';

  return {
    id: generateId(),
    type: notifType,
    message: messages.join(' • '),
    duration: 3000,
  };
};

/**
 * Process scheduled decision effects at turn boundaries
 */
export const processScheduledDecisionEffects = (playerStats: IPlayerStats): void => {
  const turnInfo = calculateTurnInfo(playerStats.currentDate, playerStats.startDate);
  const currentTurn = turnInfo.turnNumber;

  const effectsToProcess = playerStats.scheduledEffects.filter(
    (e) => (e as any).triggerTurn && (e as any).triggerTurn <= currentTurn
  );

  for (const effect of effectsToProcess) {
    const delayedImpact = (effect as any).delayedImpact;
    if (!delayedImpact) continue;

    // Apply reputation changes
    if (delayedImpact.reputation) {
      const repArray = Array.isArray(delayedImpact.reputation) 
        ? delayedImpact.reputation 
        : [delayedImpact.reputation];

      for (const rep of repArray) {
        const npcRel = playerStats.npcRelationships.find(r => r.npcId === rep.npcId);
        if (npcRel) {
          npcRel.reputation = Math.max(-100, Math.min(100, 
            npcRel.reputation + rep.change
          ));
        }
      }
    }

    // Apply metric changes
    if (delayedImpact.metrics) {
      Object.entries(delayedImpact.metrics).forEach(([key, value]) => {
        if (key === 'income') {
          playerStats.income = value as number;
        } else if (key === 'prospects') {
          playerStats.prospects = Math.max(0, Math.min(100, 
            playerStats.prospects + (value as number)
          ));
        }
      });
    }
  }

  // Remove processed effects
  playerStats.scheduledEffects = playerStats.scheduledEffects.filter(
    (e) => !(e as any).triggerTurn || (e as any).triggerTurn > currentTurn
  );
};

/**
 * Helper to apply monthly housing costs
 */
export const applyMonthlyHousingCosts = (playerStats: IPlayerStats): void => {
  if (!playerStats.currentHousing) return;

  const housing = housingCatalog.find(h => h.id === playerStats.currentHousing.housingId);
  if (!housing) return;

  let totalCost = 0;

  if (playerStats.currentHousing.isOwned) {
    totalCost = (housing.maintenanceCost || 0) + (housing.propertyTax || 0);
    // Mortgage payment is already in loans system

    if (playerStats.currentHousing.isRentedOut && housing.rentalIncome) {
      playerStats.balanceDebit += housing.rentalIncome;
    }
  } else {
    totalCost = housing.monthlyRent || 0;
  }

  playerStats.balanceDebit -= totalCost;
  playerStats.expenses.rent = totalCost;
};

// ===== EVENT SYSTEM =====

/**
 * Create and add a game event
 */
export const createGameEvent = (
  playerStats: IPlayerStats,
  eventType: GameEvent['eventType'],
  title: string,
  message: string,
  actions?: EventAction[],
  impact?: GameEvent['impact']
): GameEvent => {
  const event: GameEvent = {
    id: generateId(),
    eventType,
    title,
    message,
    date: new Date(playerStats.currentDate),
    isRead: false,
    actions,
    impact,
  };

  // Safety check: ensure gameEvents array exists
  if (!playerStats.gameEvents) {
    playerStats.gameEvents = [];
  }
  
  playerStats.gameEvents.push(event);
  return event;
};

/**
 * Offer bankruptcy recovery options when in severe crisis
 */
export const offerBankruptcyRecovery = (playerStats: IPlayerStats): void => {
  const bankruptcyOptions: BankruptcyRecovery[] = [
    {
      option: 'chapter_7',
      title: '💥 Chapter 7: Liquidation',
      description: 'Wipe most debts. Lose most assets. Credit destroyed for 7 years.',
      effects: {
        debtWiped: playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0),
        balanceChange: -1000,
        creditScoreChange: -400,
        stressChange: -50,
        prospectChange: -20,
        assetsLost: ['investments', 'vehicle'],
      },
    },
    {
      option: 'chapter_13',
      title: '📋 Chapter 13: Reorganization',
      description: 'Restructure debts into 3-5 year repayment plan. Keep assets.',
      effects: {
        debtWiped: Math.floor(playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0) * 0.2),
        balanceChange: 0,
        creditScoreChange: -100,
        stressChange: -40,
        prospectChange: -10,
      },
    },
    {
      option: 'settlement',
      title: '🤝 Creditor Settlement',
      description: 'Negotiate with creditors. Pay 70% of debt, rest forgiven.',
      effects: {
        debtWiped: Math.floor(playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0) * 0.3),
        balanceChange: -Math.floor(playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0) * 0.7),
        creditScoreChange: -80,
        stressChange: -30,
        prospectChange: 0,
      },
    },
  ];

  const event = createGameEvent(
    playerStats,
    'crisis',
    '⚖️ Bankruptcy Protection Available',
    'Due to severe financial hardship, you\'re eligible for bankruptcy protection.'
  );

  // Store as pending to require player decision
  playerStats.pendingEventActions = event;
};

/**
 * Execute bankruptcy option
 */
export const executeBankruptcy = (
  playerStats: IPlayerStats,
  option: BankruptcyOption
): void => {
  if (option === 'none') return;

  const options: Record<BankruptcyOption, BankruptcyRecovery> = {
    chapter_7: {
      option: 'chapter_7',
      title: '💥 Chapter 7: Liquidation',
      description: '',
      effects: {
        debtWiped: playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0),
        balanceChange: -1000,
        creditScoreChange: -400,
        stressChange: -50,
        prospectChange: -20,
        assetsLost: ['investments', 'vehicle'],
      },
    },
    chapter_13: {
      option: 'chapter_13',
      title: '📋 Chapter 13: Reorganization',
      description: '',
      effects: {
        debtWiped: Math.floor(playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0) * 0.2),
        balanceChange: 0,
        creditScoreChange: -100,
        stressChange: -40,
        prospectChange: -10,
      },
    },
    settlement: {
      option: 'settlement',
      title: '🤝 Creditor Settlement',
      description: '',
      effects: {
        debtWiped: Math.floor(playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0) * 0.3),
        balanceChange: -Math.floor(playerStats.loans.reduce((sum, l) => sum + l.remainingBalance, 0) * 0.7),
        creditScoreChange: -80,
        stressChange: -30,
        prospectChange: 0,
      },
    },
    none: {
      option: 'none',
      title: '',
      description: '',
      effects: {
        debtWiped: 0,
        balanceChange: 0,
        creditScoreChange: 0,
        stressChange: 0,
        prospectChange: 0,
      },
    },
  };

  const recovery = options[option];
  const effects = recovery.effects;

  // Apply effects
  playerStats.creditScore = Math.max(300, playerStats.creditScore + effects.creditScoreChange);
  playerStats.stress = Math.max(0, Math.min(100, playerStats.stress + effects.stressChange));
  playerStats.prospects = Math.max(0, Math.min(100, playerStats.prospects + effects.prospectChange));
  playerStats.balanceDebit += effects.balanceChange;

  // Wipe debt
  const totalDebtWiped = effects.debtWiped;
  let remaining = totalDebtWiped;

  playerStats.loans = playerStats.loans
    .map(loan => {
      if (remaining <= 0) return loan;

      const wipeAmount = Math.min(loan.remainingBalance, remaining);
      remaining -= wipeAmount;

      return {
        ...loan,
        remainingBalance: Math.max(0, loan.remainingBalance - wipeAmount),
      };
    })
    .filter(loan => loan.remainingBalance > 0);

  // Recalculate monthly debt payment
  playerStats.totalMonthlyDebtPayment = playerStats.loans.reduce(
    (sum, loan) => sum + loan.monthlyPayment,
    0
  );

  // Clear assets if Chapter 7
  if (option === 'chapter_7') {
    playerStats.investments = [];
    playerStats.investmentPortfolioValue = 0;
  }

  playerStats.bankruptcyAttempts = (playerStats.bankruptcyAttempts || 0) + 1;
  playerStats.redZoneStartDate = undefined;

  createGameEvent(
    playerStats,
    'system',
    `✅ ${recovery.title}`,
    `Your financial situation has been addressed. ${effects.debtWiped > 0 ? `$${effects.debtWiped} in debt forgiven.` : ''} Credit score impacted.`
  );
};

/**
 * Generate weekly minor random events
 */
export const generateWeeklyMinorEvents = (playerStats: IPlayerStats): void => {
  const random = Math.random() * 100;

  // 30% chance of small random expense
  if (random < 30) {
    const expenses = [
      { title: '🚗 Car maintenance', amount: 150 },
      { title: '☕ Coffee habit', amount: 25 },
      { title: '📱 Phone repair', amount: 100 },
      { title: '🏥 Medical co-pay', amount: 50 },
      { title: '🍕 Food delivery urge', amount: 35 },
    ];

    const expense = expenses[Math.floor(Math.random() * expenses.length)];
    playerStats.balanceDebit -= expense.amount;

    createGameEvent(
      playerStats,
      'financial',
      `💸 ${expense.title}`,
      `Unexpected expense: -$${expense.amount}`,
      undefined,
      { balance: -expense.amount }
    );
  }

  // 15% chance of investment volatility event
  if (random < 45 && playerStats.investments.length > 0) {
    const investment = playerStats.investments[Math.floor(Math.random() * playerStats.investments.length)];
    const change = (Math.random() - 0.5) * 0.1; // ±10%
    const oldValue = investment.totalValue;
    investment.totalValue *= 1 + change;
    playerStats.investmentPortfolioValue += investment.totalValue - oldValue;

    const direction = change > 0 ? '📈' : '📉';
    createGameEvent(
      playerStats,
      'financial',
      `${direction} ${investment.symbol} volatility`,
      `${investment.symbol} moved ${Math.abs(change * 100).toFixed(1)}%. Value now: $${investment.totalValue.toFixed(2)}`,
      undefined,
      { balance: investment.totalValue - oldValue }
    );
  }

  // 10% chance of stress relief temptation if stress > 70
  if (random < 55 && playerStats.stress > 70) {
    const stressReliefs = [
      { title: '🎮 Gaming spree', cost: 80, relief: 15 },
      { title: '🍔 Dining out', cost: 60, relief: 10 },
      { title: '🎬 Movie + popcorn', cost: 40, relief: 8 },
      { title: '🛍️ Shopping therapy', cost: 120, relief: 20 },
    ];

    const relief = stressReliefs[Math.floor(Math.random() * stressReliefs.length)];

    createGameEvent(
      playerStats,
      'opportunity',
      `😰 ${relief.title}`,
      `Temptation! Spend $${relief.cost} to relieve stress by ${relief.relief}%?`,
      [
        {
          id: 'accept_stress_relief',
          label: `Yes, spend $${relief.cost}`,
          impact: { balance: -relief.cost, stress: -relief.relief },
        },
        {
          id: 'decline_stress_relief',
          label: 'No, save the money',
          impact: { stress: -5 },
        },
      ]
    );
  }
};

/**
 * Generate monthly major events (salary, job review, crisis)
 */
export const generateMonthlyMajorEvents = (playerStats: IPlayerStats): void => {
  const random = Math.random() * 100;

  // 20% chance of job performance event
  if (random < 20) {
    if (playerStats.jobMetrics.currentPerformance > 80) {
      createGameEvent(
        playerStats,
        'career',
        '⭐ Excellent Performance',
        'Your manager noticed your excellent work this month!',
        [
          {
            id: 'accept_bonus',
            label: 'Accept $500 bonus',
            impact: { balance: 500, happiness: 10 },
          },
        ]
      );
    } else if (playerStats.jobMetrics.currentPerformance < 40) {
      createGameEvent(
        playerStats,
        'career',
        '⚠️ Performance Warning',
        'Your manager is concerned about your performance. Improve or face consequences.',
        undefined,
        { stress: 15 }
      );
    }
  }

  // 5% chance of crisis event
  if (random < 25) {
    const crises = [
      {
        title: '🚗 Car breakdown!',
        message: 'Your car needs emergency repair: $400',
        cost: 400,
      },
      {
        title: '🏠 Roof leak!',
        message: 'Your apartment has water damage. Emergency repair: $300',
        cost: 300,
      },
      {
        title: '📱 Device broken!',
        message: 'You need a new phone for work. Cost: $600',
        cost: 600,
      },
    ];

    const crisis = crises[Math.floor(Math.random() * crises.length)];
    playerStats.balanceDebit -= crisis.cost;
    playerStats.stress = Math.min(100, playerStats.stress + 20);

    createGameEvent(
      playerStats,
      'crisis',
      crisis.title,
      crisis.message,
      undefined,
      { balance: -crisis.cost, stress: 20 }
    );
  }
};