# 🎮 Advanced Game Systems - Deep Design Document

> Extension of the main architecture with 6 sophisticated systems that add depth, player agency, and interconnected consequences. These systems turn mechanics into emergent gameplay.

---

## Table of Contents

1. [Debt Management & Credit System](#1-debt-management--credit-system)
2. [Passive Income & Investments](#2-passive-income--investments)
3. [Job Performance Metrics](#3-job-performance-metrics)
4. [Red Zone Crisis & Bankruptcy](#4-red-zone-crisis--bankruptcy)
5. [NPC Reputation System](#5-npc-reputation-system)
6. [Integration Summary](#6-integration-summary)

---

## 1. Debt Management & Credit System

### Problem with Current Design

Current model only includes fixed monthly debt payment ($600) with no active debt management, refinancing options, or personal loans. Player has no incentive to manage debt beyond paying minimums.

### Extended Loan Model

#### Core Loan Structure

```typescript
interface Loan {
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

interface PlayerStats {
  // ... existing fields
  loans: Loan[];                 // All active loans
  totalMonthlyDebtPayment: number; // Sum of all minimums
  creditScore: number;           // 300-850 range
  debtToIncomeRatio: number;     // totalDebtPayment / income
  interestPaidTotal: number;     // Lifetime interest paid
}
```

#### Dynamic Interest Rate Calculation

Credit score directly determines available rates on new loans:

```typescript
const calculateLoanRate = (creditScore: number, loanType: string): number => {
  let baseRate = 0;
  
  // Credit score tiers
  if (creditScore >= 750) baseRate = 0.04;        // Excellent: 4%
  else if (creditScore >= 700) baseRate = 0.06;   // Good: 6%
  else if (creditScore >= 650) baseRate = 0.09;   // Fair: 9%
  else if (creditScore >= 600) baseRate = 0.14;   // Poor: 14%
  else baseRate = 0.22;                           // Very Poor: 22%
  
  // Loan type modifiers
  const typeModifier = {
    'asset_mortgage': 0.5,      // Secured = lower risk = 50% of base
    'personal_loan': 1.0,       // Unsecured = standard rate
    'payday_loan': 2.5,         // High risk = 250% of base
  }[loanType] || 1.0;
  
  return baseRate * typeModifier;
};

// Examples:
// creditScore = 700, personal_loan → 6% * 1.0 = 6% APR
// creditScore = 600, payday_loan → 14% * 2.5 = 35% APR ⚠️
// creditScore = 750, asset_mortgage → 4% * 0.5 = 2% APR
```

### Feature 1: Early Payment & Interest Optimization

**UI Location:** Assets Screen → Liabilities section → [Pay Early] button on each loan

```typescript
interface PayEarlyResult {
  amountPaid: number;
  newBalance: number;
  interestSaved: number;        // Total saved over loan lifetime
  monthsSaved: number;          // Shorter maturity date
  stressReduction: number;      // Happiness boost from debt reduction
}

const payEarlyOnLoan = (loan: Loan, amountPaid: number): PayEarlyResult => {
  // Calculate current month's interest and principal breakdown
  const monthlyInterest = loan.remainingBalance * (loan.annualInterestRate / 12);
  const principalPortion = loan.monthlyPayment - monthlyInterest;
  
  // Extra payment goes entirely toward principal
  const extraTowardsPrincipal = Math.max(0, amountPaid - loan.monthlyPayment);
  
  // Calculate new balance and recalculate schedule
  const newBalance = Math.max(0, loan.remainingBalance - (principalPortion + extraTowardsPrincipal));
  
  const remainingMonths = monthsBetween(new Date(), loan.maturityDate);
  const monthsSaved = Math.ceil((principalPortion + extraTowardsPrincipal) / principalPortion);
  
  // Interest savings by eliminating months
  const interestSaved = monthlyInterest * monthsSaved;
  
  return {
    amountPaid,
    newBalance,
    interestSaved,
    monthsSaved,
    stressReduction: Math.ceil(monthsSaved / 6), // -1 stress per 6 months saved
  };
};
```

**UI Flow:**
1. Player taps [Pay Early] on a loan card
2. Modal appears showing:
   - Current balance: $X
   - Minimum monthly payment: $Y
   - Total interest remaining: $Z
3. Slider or input field to enter payment amount (0% to 100% of available balance)
4. Real-time preview shows:
   - New balance after payment
   - Months saved toward payoff
   - Total interest avoided
5. **Confirm** → Deduct from `balanceDebit`, update loan object, reduce stress by calculated amount
6. Transaction recorded with category "Debt Paydown"

**Psychological Effect:** Players feel agency over their debt, not trapped by fixed payments.

### Feature 2: Refinancing

When creditScore improves (via consistent payments, building assets), player can refinance existing loans at better rates:

```typescript
const refinanceLoan = (loan: Loan, newCreditScore: number): Loan | null => {
  const oldRate = loan.annualInterestRate;
  const newRate = calculateLoanRate(newCreditScore, loan.type);
  
  // Only allow if new rate is meaningfully better (at least 1% difference)
  if (newRate >= oldRate - 0.01) {
    return null; // Not eligible
  }
  
  // Recalculate monthly payment with new rate and remaining term
  const remainingMonths = monthsBetween(new Date(), loan.maturityDate);
  const newMonthlyPayment = calculateMonthlyPayment(
    loan.remainingBalance,
    newRate,
    remainingMonths
  );
  
  // Create refinanced loan (2% refinancing fee applied)
  return {
    ...loan,
    annualInterestRate: newRate,
    monthlyPayment: newMonthlyPayment,
    remainingBalance: loan.remainingBalance * 1.02, // Fee
  };
};

// Trigger: In nextTurn(), check if player's credit improved
if (playerStats.creditScore > previousCreditScore) {
  const refinancingOpportunities = playerStats.loans
    .map(loan => ({ loan, newRate: calculateLoanRate(playerStats.creditScore, loan.type) }))
    .filter(({ loan, newRate }) => newRate < loan.annualInterestRate - 0.01);
  
  if (refinancingOpportunities.length > 0) {
    createEvent('refinance_available', {
      title: '💰 Better Loan Rates Available',
      message: `Your credit score improved! You now qualify for better rates.`,
      opportunities: refinancingOpportunities,
    });
  }
}
```

### Feature 3: Personal Loans (Unsecured)

**Location:** Marketplace → New Tab "Loans"

Players can take personal loans when they need cash, but rates depend heavily on creditScore:

```typescript
interface PersonalLoanOffer {
  id: string;
  lender: string;               // "QuickCash Inc", "People's Bank", etc.
  minAmount: number;            // $500
  maxAmount: number;            // Calculated per player
  termMonths: number;           // 12, 24, 36, 60 months
  baseRate: number;             // Before credit adjustment
  fees: {
    originationFee: number;     // 1-5% upfront
    lateFee: number;            // $35-50 if payment missed
  };
}

// Max loan amount based on debt-to-income ratio
const calculateMaxPersonalLoan = (playerStats: PlayerStats): number => {
  // Standard lending rule: max monthly debt payment = 40% of income
  const maxMonthlyPayment = playerStats.income * 0.4;
  const availableForNewLoan = maxMonthlyPayment - playerStats.totalMonthlyDebtPayment;
  
  if (availableForNewLoan <= 0) return 0; // Already at DTI limit
  
  // Convert monthly payment capacity to loan amount (assuming standard 24-month term)
  const rate = calculateLoanRate(playerStats.creditScore, 'personal_loan');
  return availableForNewLoan * 24 / (1 + (rate / 12 * 24));
};

// Loan application flow
const requestPersonalLoan = (
  offer: PersonalLoanOffer,
  amount: number,
  playerStats: PlayerStats
): { approved: boolean; loan: Loan | null; message: string } => {
  // Validation checks
  if (amount > calculateMaxPersonalLoan(playerStats)) {
    return {
      approved: false,
      loan: null,
      message: `Loan exceeds your maximum. Your debt-to-income ratio is too high.`,
    };
  }
  
  if (playerStats.creditScore < 600) {
    return {
      approved: false,
      loan: null,
      message: 'Credit score too low. Improve it by 30+ points before reapplying.',
    };
  }
  
  // Calculate actual terms
  const actualRate = calculateLoanRate(playerStats.creditScore, 'personal_loan');
  const originationFee = amount * offer.fees.originationFee;
  const principalAfterFee = amount - originationFee;
  
  const monthlyPayment = calculateMonthlyPayment(
    principalAfterFee,
    actualRate,
    offer.termMonths
  );
  
  // Create loan object
  const newLoan: Loan = {
    id: generateId(),
    type: 'personal_loan',
    originalAmount: amount,
    remainingBalance: principalAfterFee,
    annualInterestRate: actualRate,
    monthlyPayment,
    startDate: new Date(),
    maturityDate: addMonths(new Date(), offer.termMonths),
    isDelinquent: false,
    daysDelinquent: 0,
  };
  
  // Disburse funds minus origination fee
  playerStats.balanceDebit += principalAfterFee;
  playerStats.loans.push(newLoan);
  playerStats.totalMonthlyDebtPayment += monthlyPayment;
  
  // Psychological impact: new debt = stress increase
  playerStats.stress += 15;
  
  return {
    approved: true,
    loan: newLoan,
    message: `Approved! You received $${principalAfterFee} (after $${originationFee} origination fee). Repay over ${offer.termMonths} months.`,
  };
};
```

### Feature 4: Delinquency & Collection

**Trigger:** In `nextTurn()`, if loan payment not made:

```typescript
const processLoanDelinquency = (loan: Loan, playerStats: PlayerStats): void => {
  const paymentWasMade = checkLoanPaymentRecord(loan.id, currentMonth);
  
  if (!paymentWasMade) {
    // Escalate delinquency
    loan.daysDelinquent += 30;
    loan.isDelinquent = true;
    
    // Apply late fees
    const lateFeeAmount = Math.max(35, loan.monthlyPayment * 0.1);
    loan.remainingBalance += lateFeeAmount;
    
    // Massive credit score penalty
    playerStats.creditScore -= 50; // Huge hit for missed payment
    playerStats.stress += 25;
    
    // Event: Debt collector calls
    createEvent('loan_delinquency', {
      title: '📞 Debt Collector Calling',
      message: `${loan.type} is ${loan.daysDelinquent} days overdue.`,
      message2: `Late fee added: $${lateFeeAmount}. Next call in 30 days if unpaid.`,
      severity: loan.daysDelinquent > 90 ? 'CRITICAL' : 'WARNING',
    });
    
    // After 90 days: potential repossession (if asset collateral exists)
    if (loan.daysDelinquent > 90 && loan.collateral) {
      initiateAssetRepossession(loan, playerStats);
    }
  } else {
    // Payment made: clear delinquency status
    loan.isDelinquent = false;
    loan.daysDelinquent = 0;
    
    // Slight credit score recovery (payments help over time)
    playerStats.creditScore += 5;
  }
};

const initiateAssetRepossession = (loan: Loan, playerStats: PlayerStats): void => {
  const asset = playerStats.assets.find(a => a.id === loan.collateral);
  if (!asset) return;
  
  // Remove asset
  playerStats.assets = playerStats.assets.filter(a => a.id !== loan.collateral);
  
  // Apply credit toward remaining loan balance
  const assetSaleValue = asset.currentValue * 0.85; // Auction discount
  loan.remainingBalance -= assetSaleValue;
  if (loan.remainingBalance < 0) {
    playerStats.balanceDebit += Math.abs(loan.remainingBalance);
  }
  
  // Massive emotional impact
  playerStats.stress = 100; // Maxed out
  playerStats.happiness = 0;
  playerStats.creditScore -= 100;
  
  createEvent('asset_repossession', {
    title: '⚠️ ASSET REPOSSESSED',
    message: `Your ${asset.name} was seized and sold at auction for $${assetSaleValue}.`,
    message2: `Remaining balance on loan: $${Math.max(0, loan.remainingBalance)}`,
  });
};
```

---

## 2. Passive Income & Investments

### Problem with Current Design

`balanceVirtual` (Savings) exists but has no purpose. There's no incentive to save vs. spend since both accounts earn 0% interest.

### Feature 1: Interest Accrual

**Trigger:** In `nextTurn()`, before calculating monthly expenses:

```typescript
const accrueInterest = (playerStats: PlayerStats): void => {
  // Savings account earns modest interest
  const savingsInterest = playerStats.balanceVirtual * (0.02 / 12); // 2% annual = 0.167% monthly
  playerStats.balanceVirtual += savingsInterest;
  
  recordTransaction('Savings Interest', savingsInterest, 'Income', 'Automatic');
  
  // Debit account has no interest, but penalty if overdrafted
  if (playerStats.balanceDebit < 0) {
    const overdraftPenalty = Math.abs(playerStats.balanceDebit) * (0.05 / 12); // 5% annual on deficit
    playerStats.balanceDebit -= overdraftPenalty;
    playerStats.stress += 5; // Anxiety about overdraft
  }
};
```

**Impact:** 
- Over a year, savings grow by ~2%
- Over 5 years, small emergency fund can become substantial buffer
- Plays into risk management: Build savings → avoid crisis loans

### Feature 2: Investment Portfolio System

**UI Location:** Marketplace → New Tab "Investments"

Players can build a diversified investment portfolio with varying risk/reward:

```typescript
interface Investment {
  id: string;
  type: 'stocks' | 'etf' | 'bond' | 'crypto';
  symbol: string;               // AAPL, BTC, VTSAX, etc.
  name: string;
  sharePrice: number;           // Current market price
  sharesOwned: number;          // Number of shares held
  totalValue: number;           // sharePrice * sharesOwned
  purchasePrice: number;        // Average purchase price per share
  purchaseDate: Date;
  volatility: number;           // 0.05 (5% monthly) to 0.50 (50% monthly)
  riskLevel: 'low' | 'medium' | 'high';
  dividendYield?: number;       // Annual % if applicable
}
```

#### Investment Catalog (Marketplace)

```typescript
const investmentCatalog = [
  // LOW RISK (2-4% annual, 2-5% volatility, steady income)
  {
    symbol: 'VTSAX',
    name: 'Vanguard Total Stock Market ETF',
    type: 'etf',
    sharePrice: 95.50,
    riskLevel: 'low',
    volatility: 0.03,           // 3% monthly volatility
    expectedReturn: 0.08,       // 8% annual
    description: 'Broad market index fund. Boring, reliable, recommended for beginners.',
  },
  {
    symbol: 'BND',
    name: 'Vanguard Total Bond Market',
    type: 'bond',
    sharePrice: 82.00,
    riskLevel: 'low',
    volatility: 0.02,           // 2% monthly volatility
    expectedReturn: 0.04,       // 4% annual
    dividendYield: 0.04,        // 4% annual dividend
    description: 'Bond index. Very safe, modest returns, good for risk-averse players.',
  },
  
  // MEDIUM RISK (6-10% annual, 10-20% volatility, growth potential)
  {
    symbol: 'TECH',
    name: 'Technology Sector ETF',
    type: 'etf',
    sharePrice: 156.00,
    riskLevel: 'medium',
    volatility: 0.12,           // 12% monthly volatility
    expectedReturn: 0.12,       // 12% annual average
    description: 'Heavy in software, cloud, semiconductors. Growth with volatility.',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stocks',
    sharePrice: 189.95,
    riskLevel: 'medium',
    volatility: 0.15,           // 15% monthly volatility
    expectedReturn: 0.10,       // 10% annual average
    dividendYield: 0.005,       // 0.5% annual dividend
    description: 'Stable mega-cap tech. Good for long-term investors.',
  },
  
  // HIGH RISK (15-50% annual, 30-50% volatility, 10x or crash)
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    sharePrice: 42500,
    riskLevel: 'high',
    volatility: 0.40,           // 40% monthly volatility (!!)
    expectedReturn: 0.50,       // 50% annual average (but highly variable)
    description: 'Extreme volatility. Could 10x or crash 50% overnight. Gamble wisely.',
  },
  {
    symbol: 'MSTR',
    name: 'MicroStrategy (Crypto Exposure)',
    type: 'stocks',
    sharePrice: 315.00,
    riskLevel: 'high',
    volatility: 0.35,
    expectedReturn: 0.30,
    description: 'Leveraged crypto bet via publicly traded company. Very volatile.',
  },
];
```

#### Purchase Flow

```typescript
interface BuyInvestmentResult {
  success: boolean;
  message: string;
  investment?: Investment;
  balanceAfter?: number;
}

const buyInvestment = (
  catalogItem: CatalogInvestment,
  shareCount: number,
  playerStats: PlayerStats
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
  // But allow using debit if savings insufficient
  let deductedFrom = 'debit';
  if (totalCost <= playerStats.balanceVirtual) {
    playerStats.balanceVirtual -= totalCost;
    deductedFrom = 'virtual';
  } else if (totalCost <= playerStats.balanceDebit) {
    playerStats.balanceDebit -= totalCost;
  } else {
    // Draw from virtual first, rest from debit
    const virtualUsed = playerStats.balanceVirtual;
    playerStats.balanceVirtual = 0;
    playerStats.balanceDebit -= (totalCost - virtualUsed);
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
    purchasePrice: catalogItem.sharePrice,
    purchaseDate: new Date(),
    volatility: catalogItem.volatility,
    riskLevel: catalogItem.riskLevel,
    dividendYield: catalogItem.dividendYield,
  };
  
  playerStats.investments.push(investment);
  
  // Psychological impact based on risk
  if (investment.riskLevel === 'high') {
    playerStats.stress += 10; // Worry about volatility
    playerStats.prospects += 5; // But wealth-building ambition shows
  } else if (investment.riskLevel === 'low') {
    playerStats.stress -= 3;   // Reassuring, safe
    playerStats.happiness += 2;
  }
  
  recordTransaction('Investment Purchase', totalCost, 'Expense', `${catalogItem.symbol}`);
  
  return {
    success: true,
    message: `Purchased ${shareCount} shares of ${catalogItem.name}`,
    investment,
    balanceAfter: deductedFrom === 'virtual' ? playerStats.balanceVirtual : playerStats.balanceDebit,
  };
};
```

#### Market Volatility & Price Updates (nextTurn)

```typescript
const updateInvestmentPrices = (
  playerStats: PlayerStats,
  globalMarketFactor: number = 0  // -0.15 to +0.15 (recession vs boom)
): void => {
  for (const investment of playerStats.investments) {
    // Each month: random volatility + global market factor
    const monthlyRandomComponent = (Math.random() - 0.5) * investment.volatility;
    const monthlyReturn = monthlyRandomComponent + globalMarketFactor;
    
    const newPrice = investment.sharePrice * (1 + monthlyReturn);
    const priceChange = newPrice - investment.sharePrice;
    
    investment.sharePrice = newPrice;
    investment.totalValue = investment.sharePrice * investment.sharesOwned;
    
    // Accrue dividends if applicable
    if (investment.dividendYield) {
      const monthlyDividend = investment.totalValue * (investment.dividendYield / 12);
      playerStats.balanceVirtual += monthlyDividend;
      recordTransaction('Dividend Payment', monthlyDividend, 'Income', `${investment.symbol}`);
    }
    
    // Generate notification for significant changes
    const percentChange = (priceChange / investment.sharePrice) * 100;
    if (Math.abs(percentChange) > 5) {
      createEvent(percentChange > 0 ? 'investment_gain' : 'investment_loss', {
        investment,
        percentChange,
        message: `${investment.symbol} ${percentChange > 0 ? '📈' : '📉'} ${Math.abs(percentChange).toFixed(1)}% this month`,
        impact: percentChange > 0
          ? { happiness: +3, stress: -2 }
          : { happiness: -3, stress: +5 },
      });
    }
  }
  
  // Update portfolio value for metrics
  playerStats.investmentPortfolioValue = playerStats.investments.reduce(
    (sum, inv) => sum + inv.totalValue,
    0
  );
};

// Global market factor from current game events
const generateGlobalMarketFactor = (currentGameEvents: GameEvent[]): number => {
  let factor = 0;
  
  if (currentGameEvents.some(e => e.type === 'recession')) factor -= 0.15;
  if (currentGameEvents.some(e => e.type === 'market_boom')) factor += 0.10;
  if (currentGameEvents.some(e => e.type === 'tech_crash')) factor -= 0.25;
  if (currentGameEvents.some(e => e.type === 'regulatory_win')) factor += 0.05;
  if (currentGameEvents.some(e => e.type === 'interest_rate_cut')) factor += 0.08;
  
  return factor;
};
```

#### Selling Investments

```typescript
const sellInvestment = (
  investment: Investment,
  shareCount: number,
  playerStats: PlayerStats
): { success: boolean; proceeds: number; gainLoss: number; message: string } => {
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
    // Fully sold, remove from portfolio
    playerStats.investments = playerStats.investments.filter(i => i.id !== investment.id);
  } else {
    investment.totalValue = investment.sharePrice * investment.sharesOwned;
  }
  
  // Add proceeds to virtual (savings)
  playerStats.balanceVirtual += saleProceeds;
  
  // Emotional impact
  if (gainLoss > 0) {
    playerStats.happiness += 5;
    playerStats.stress -= 3;
  } else {
    playerStats.happiness -= 5;
    playerStats.stress += 5;
  }
  
  recordTransaction(
    'Investment Sale',
    -saleProceeds,
    'Income',
    `${investment.symbol} (${gainLossPercent > 0 ? '+' : ''}${gainLossPercent.toFixed(1)}%)`
  );
  
  return {
    success: true,
    proceeds: saleProceeds,
    gainLoss,
    message: `Sold ${shareCount} shares for $${saleProceeds.toFixed(2)}. ${gainLoss > 0 ? 'Gain' : 'Loss'}: $${Math.abs(gainLoss).toFixed(2)}`,
  };
};
```

---

## 3. Job Performance Metrics

### Problem with Current Design

Jobs are passive: take job, get salary, experience stress. No connection between player behavior (happiness, stress) and actual job performance, which should have career consequences.

### Job Performance Scoring

```typescript
interface JobMetrics {
  currentPerformance: number;   // 0-100 (current month's score)
  performanceHistory: number[]; // Last 12 months
  monthsAtCurrentJob: number;
  promotionEligibility: number; // 0-100 (chance of promotion)
  riskOfLayoff: number;         // 0-100 (termination risk)
}

interface PlayerStats {
  // ... existing
  jobMetrics: JobMetrics;
}
```

#### Performance Calculation (Monthly)

```typescript
const calculateJobPerformance = (
  previousPerformance: number,
  happiness: number,
  stress: number,
  educationLevel: number,
  currentJobDemandLevel: number = 50 // 0-100, some jobs harder than others
): number => {
  let newPerformance = previousPerformance;
  
  // Happiness directly impacts productivity
  if (happiness < 20) {
    newPerformance *= 0.60;       // Severe: -40% (depression, no motivation)
  } else if (happiness < 40) {
    newPerformance *= 0.80;       // Poor: -20% (disengaged)
  } else if (happiness < 50) {
    newPerformance *= 0.90;       // Fair: -10% (slightly distracted)
  } else if (happiness > 75) {
    newPerformance *= 1.15;       // Excellent: +15% (motivated, energized)
  }
  
  // Stress above 80 = burnout crisis
  if (stress > 90) {
    newPerformance *= 0.70;       // Critical: -30% (errors, absent, breakdown imminent)
  } else if (stress > 75) {
    newPerformance *= 0.85;       // High: -15% (mistakes increase, slower work)
  } else if (stress > 60) {
    newPerformance *= 0.95;       // Moderate: -5% (slightly affected)
  }
  
  // Education provides ceiling boost
  const educationBonus = Math.min(20, educationLevel * 2);
  newPerformance += educationBonus;
  
  // Natural growth vs decay
  if (happiness > 60 && stress < 50) {
    // Good conditions: skill growth
    newPerformance += 3;
  } else if (happiness < 40 || stress > 75) {
    // Bad conditions: skill decay
    newPerformance -= 4;
  }
  
  // Job difficulty factor
  if (currentJobDemandLevel > 70) {
    newPerformance *= 0.90; // Harder jobs = natural lower scores
  }
  
  return Math.max(0, Math.min(100, newPerformance));
};
```

#### Monthly Job Review (nextTurn)

```typescript
const monthlyJobReview = (playerStats: PlayerStats, currentJob: Job): void => {
  const metrics = playerStats.jobMetrics;
  
  // Calculate this month's performance
  metrics.currentPerformance = calculateJobPerformance(
    metrics.currentPerformance,
    playerStats.happiness,
    playerStats.stress,
    playerStats.education.length,
    currentJob.difficulty || 50
  );
  
  // Track history (last 12 months)
  metrics.performanceHistory.push(metrics.currentPerformance);
  if (metrics.performanceHistory.length > 12) {
    metrics.performanceHistory.shift();
  }
  
  metrics.monthsAtCurrentJob++;
  
  // Calculate derived metrics
  const avgPerformanceLastThree = metrics.performanceHistory.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, metrics.performanceHistory.length);
  const avgPerformanceLastSix = metrics.performanceHistory.slice(-6).reduce((a, b) => a + b, 0) / Math.min(6, metrics.performanceHistory.length);
  
  // Promotion eligibility: Performance trend
  metrics.promotionEligibility = Math.max(0, avgPerformanceLastSix - 50);
  
  // Layoff risk: Low performance or extreme stress
  metrics.riskOfLayoff = Math.max(0, 100 - avgPerformanceLastThree);
  
  // === PROMOTION TRIGGER ===
  // Sustained high performance (> 75 for 3 months) + good prospects
  if (
    metrics.performanceHistory.length >= 3 &&
    metrics.performanceHistory.slice(-3).every(p => p > 75) &&
    playerStats.prospects > 60
  ) {
    triggerPromotionEvent(currentJob, playerStats);
  }
  
  // === SALARY CUT TRIGGER ===
  // Declining performance (< 40 for 2 months)
  if (
    metrics.performanceHistory.length >= 2 &&
    metrics.performanceHistory.slice(-2).every(p => p < 40)
  ) {
    triggerSalaryCutEvent(currentJob, playerStats);
  }
  
  // === LAYOFF TRIGGER ===
  // Severe performance drop or extreme stress/unhappiness
  if (
    metrics.currentPerformance < 20 ||
    (playerStats.stress > 95 && metrics.currentPerformance < 30) ||
    (playerStats.happiness < 20 && metrics.currentPerformance < 35)
  ) {
    if (Math.random() < metrics.riskOfLayoff / 100) {
      triggerLayoffEvent(currentJob, playerStats);
    }
  }
};

const triggerPromotionEvent = (job: Job, playerStats: PlayerStats): void => {
  const salaryIncrease = job.salary * 0.15; // 15% raise
  
  createEvent('job_promotion', {
    title: '🎉 PROMOTION!',
    message: `Congratulations! Your manager recognizes your excellent work.`,
    message2: `You're promoted with a ${(0.15 * 100).toFixed(0)}% salary increase!`,
    actions: [
      {
        label: 'Accept Promotion',
        actionId: 'accept_promotion',
        impact: {
          income: salaryIncrease,
          prospects: +15,
          happiness: +25,
          stress: +5, // New responsibilities
        },
      },
    ],
  });
};

const triggerSalaryCutEvent = (job: Job, playerStats: PlayerStats): void => {
  const salaryDecrease = job.salary * 0.10; // 10% cut
  
  createEvent('job_salary_cut', {
    title: '📉 Performance Review - Salary Reduction',
    message: `Your manager cites declining performance metrics. Your salary is cut by 10%.`,
    impact: {
      income: -salaryDecrease,
      stress: +25,
      happiness: -15,
    },
  });
};

const triggerLayoffEvent = (job: Job, playerStats: PlayerStats): void => {
  // Remove job, set income to 0
  playerStats.jobs = playerStats.jobs.filter(j => j.id !== job.id);
  playerStats.income = 0;
  playerStats.stress = 100; // Maxed out
  playerStats.happiness = 0;
  playerStats.jobMetrics.currentPerformance = 0;
  
  // Unemployment benefits (reduced, temporary)
  const unemploymentBenefit = 300; // $300/month
  
  createEvent('job_layoff', {
    title: '⚠️ YOU\'VE BEEN LAID OFF',
    message: `Due to poor performance and unsustainable stress, you were terminated.`,
    message2: `Temporary unemployment benefits: $${unemploymentBenefit}/month for 6 months.`,
    message3: `Find a new job quickly! Your prospects and credit score will suffer.`,
    impact: {
      income: unemploymentBenefit,
      stress: 100,
      happiness: 0,
      prospects: -20, // Employment gap
      creditScore: -50,
    },
    duration_months: 6,
  });
};
```

---

## 4. Red Zone Crisis & Bankruptcy

### Problem with Current Design

No clear game-over conditions. Player could enter extreme debt but keep playing indefinitely.

### Game Status States

```typescript
type GameStatus = 'active' | 'yellow_warning' | 'red_zone' | 'game_over';

interface GameState {
  gameStatus: GameStatus;
  redZoneStartDate?: Date;
  collectionAgency?: string;
  negativeNetWorthMonths: number; // Track consecutive months of insolvency
}
```

#### Status Determination Logic

```typescript
const checkGameStatus = (playerStats: PlayerStats, assets: Asset[]): GameStatus => {
  const netWorth = calculateNetWorth(playerStats, assets);
  const balanceDebit = playerStats.balanceDebit;
  
  // ACTIVE: Normal gameplay
  if (netWorth > 0 && balanceDebit > -500) {
    return 'active';
  }
  
  // YELLOW WARNING: Headed toward trouble
  if (balanceDebit < -500 && netWorth > 0) {
    createEvent('yellow_warning', {
      title: '⚠️ Financial Warning',
      message: `Your debit balance is negative. Overdraft penalties are accumulating.`,
    });
    return 'yellow_warning';
  }
  
  // RED ZONE: Crisis state
  if (balanceDebit < -1000 || (netWorth < 0 && netWorth > -10000)) {
    return 'red_zone';
  }
  
  // GAME OVER: Persistent insolvency
  if (netWorth < 0) {
    if (!playerStats.negativeNetWorthMonths) playerStats.negativeNetWorthMonths = 0;
    playerStats.negativeNetWorthMonths++;
    
    if (playerStats.negativeNetWorthMonths >= 3) {
      return 'game_over';
    }
  } else {
    playerStats.negativeNetWorthMonths = 0;
  }
  
  return 'active';
};
```

### Red Zone Mechanics

```typescript
const processRedZone = (playerStats: PlayerStats, assets: Asset[]): void => {
  // Initialize red zone if just entered
  if (!playerStats.redZoneStartDate) {
    playerStats.redZoneStartDate = new Date();
    playerStats.stress = 100;
    playerStats.happiness = 0;
    
    createEvent('red_zone_activated', {
      title: '🚨 FINANCIAL CRISIS - RED ZONE ACTIVATED',
      message: `Your finances are in critical condition. You have 3 months to recover.`,
      message2: `What happens now:
        • Daily overdraft penalties ($50/day)
        • Forced asset sales if debt isn't reduced
        • Aggressive debt collection calls
        • Stress at maximum`,
      message3: `To escape: Get net worth positive again for 1 month OR negotiate with creditors.`,
    });
  }
  
  // Daily overdraft penalty (simulated monthly)
  const dailyPenalty = 50;
  playerStats.balanceDebit -= dailyPenalty; // $1500/month
  
  // Stress accumulation
  playerStats.stress = 100; // Capped at maximum
  playerStats.happiness = 0;
  
  // Every 60 days: forced asset liquidation
  const daysSinceRedZone = daysBetween(playerStats.redZoneStartDate, new Date());
  if (daysSinceRedZone % 60 === 0 && daysSinceRedZone > 0) {
    const assetToForeclosure = selectHighestValueNonEssentialAsset(assets);
    
    if (assetToForeclosure) {
      const saleProceeds = assetToForeclosure.currentValue * 0.75; // Fire sale discount
      playerStats.balanceDebit += saleProceeds;
      
      assets.splice(assets.indexOf(assetToForeclosure), 1);
      
      createEvent('forced_asset_sale', {
        title: `⛔ ${assetToForeclosure.name} SEIZED`,
        message: `Creditor forced sale of your ${assetToForeclosure.name} for $${saleProceeds}.`,
        message2: `Fire sale netted only 75% of market value.`,
      });
    }
  }
  
  // Recovery path: Return to positive balance for 1 month
  if (playerStats.balanceDebit > 0) {
    playerStats.redZoneStartDate = null;
    
    createEvent('red_zone_exit', {
      title: '✅ RED ZONE EXITED',
      message: `You've managed to stabilize your finances. Crisis averted!`,
      message2: `Keep up your new spending habits to rebuild your credit score.`,
      impact: { happiness: +20 },
    });
  }
};
```

### Bankruptcy Recovery Options

```typescript
const offerBankruptcyRecovery = (playerStats: PlayerStats, assets: Asset[]): void => {
  // After 3 months in red zone OR net worth < -20000
  
  createEvent('bankruptcy_court', {
    title: '⚖️ Bankruptcy Protection Available',
    message: `Due to severe financial hardship, you're eligible for bankruptcy protection.`,
    actions: [
      {
        label: 'Chapter 7: Liquidation',
        actionId: 'chapter_7',
        description: 'Wipe most debts. Lose most assets. Credit destroyed for 7 years.',
        impact: {
          debt: 0,
          loans: [], // Wipe all loans
          balanceDebit: -1000, // Fresh start with small penalty
          creditScore: 300, // Bottom tier
          assets: assets.filter(a => a.type === 'education'), // Keep education only
          stress: -50, // Relief from debt
          prospects: -20, // Major setback
        },
      },
      {
        label: 'Chapter 13: Reorganization',
        actionId: 'chapter_13',
        description: 'Restructure debts into 3-5 year repayment plan. Keep assets.',
        impact: {
          debt: playerStats.debt * 0.8, // 80% of debt forgiven, 20% restructured
          creditScore: 400, // Severe but not destroyed
          monthlyDebtPayment: playerStats.monthlyDebtPayment * 0.4, // Reduced
          stress: -40,
          prospects: -10,
        },
      },
      {
        label: 'Creditor Settlement',
        actionId: 'negotiate_settlement',
        description: 'Negotiate with creditors. Pay 70% of debt, rest forgiven.',
        impact: {
          debt: playerStats.debt * 0.7,
          balanceDebit: playerStats.balanceDebit * 0.8,
          creditScore: 380, // Still bad
          stress: -30,
        },
      },
    ],
  });
};
```

---

## 5. NPC Reputation System

### Problem with Current Design

Contacts (Karen, Sam, Emma) exist only as event generators. No persistent relationship system that creates long-term consequences.

### NPC Relationship Model

```typescript
interface NPCRelationship {
  npcId: string;
  npcName: string;
  npcRole: 'boss' | 'friend' | 'rival' | 'family';
  reputation: number;           // -100 to +100 range
  trustLevel: number;           // 0-100 (how much they trust player)
  lastInteraction: Date;
  nextInteractionChance: number; // % per month they initiate
  interactionHistory: {
    date: Date;
    type: 'helped' | 'refused' | 'betrayed' | 'collaborated' | 'competed';
    impact: number;             // Reputation change
    description: string;
  }[];
}

interface PlayerStats {
  // ... existing
  npcRelationships: NPCRelationship[];
  socialCapital: number; // Derived from all relationships
}
```

### NPC Registry

```typescript
const NPCRegistry = [
  {
    id: 'karen_boss',
    name: 'Karen',
    role: 'boss',
    title: 'Your Manager',
    personality: 'demanding, results-focused, values loyalty',
    baseInteractionFrequency: 20, // 20% chance per month
    
    likes: [
      { behavior: 'high_job_performance', weight: 0.4 },
      { behavior: 'long_hours_worked', weight: 0.3 },
      { behavior: 'competitive_spirit', weight: 0.2 },
    ],
    dislikes: [
      { behavior: 'poor_job_performance', weight: -0.4 },
      { behavior: 'missed_deadlines', weight: -0.3 },
      { behavior: 'undermining_team', weight: -0.2 },
    ],
    
    reputationEffects: {
      excellent: { // reputation > 70
        salary_bonus: 0.10,        // +10% salary
        promotion_chance: +25,
        bonus_opportunities: true, // Extra $ events
        description: 'Karen values you. She mentors you.',
      },
      good: { // reputation 40-70
        salary_bonus: 0.05,
        promotion_chance: +10,
      },
      poor: { // reputation 0-40
        salary_cut: -0.05,
        job_security: -10,
      },
      terrible: { // reputation < 0
        salary_cut: -0.15,
        layoff_risk: +30,
        gossip: true,  // Negative rumors spread
        description: 'Karen actively works against you.',
      },
    },
  },
  
  {
    id: 'sam_friend',
    name: 'Sam',
    role: 'friend',
    title: 'College Friend',
    personality: 'loyal, sometimes broke, good listener',
    baseInteractionFrequency: 15,
    
    likes: [
      { behavior: 'generosity', weight: 0.5 },
      { behavior: 'social_spending', weight: 0.3 },
      { behavior: 'showing_up', weight: 0.4 },
    ],
    dislikes: [
      { behavior: 'stinginess', weight: -0.3 },
      { behavior: 'avoidance', weight: -0.4 },
      { behavior: 'boasting', weight: -0.2 },
    ],
    
    reputationEffects: {
      excellent: {
        description: 'Sam is your best friend',
        happiness_bonus: +15, // When hanging out
        gift_chance: 0.4,     // 40% chance he gifts you $500
        emotional_support: true, // Stress reduction in crisis
      },
      poor: {
        description: 'Sam is distant',
        happiness_penalty: -10,
        isolation: true,      // Miss social hangout opportunities
      },
    },
  },
  
  {
    id: 'emma_rival',
    name: 'Emma',
    role: 'rival',
    title: 'Colleague / Competitor',
    personality: 'ambitious, competitive, intelligent',
    baseInteractionFrequency: 10,
    
    likes: [
      { behavior: 'competitive_drive', weight: 0.4 },
      { behavior: 'ambition', weight: 0.3 },
      { behavior: 'mutual_respect', weight: 0.3 },
    ],
    dislikes: [
      { behavior: 'helping_others_at_her_expense', weight: -0.4 },
      { behavior: 'humility', weight: -0.1 },
    ],
    
    reputationEffects: {
      excellent: {
        description: 'Emma respects you as a peer',
        career_opportunities: +2, // Unlock premium jobs
        prospects_bonus: +10,
        collaboration_events: true,
      },
      poor: {
        description: 'Emma sees you as weak',
        rumors_spread: true,
        prospects_penalty: -15,
        sabotage_events: true,
      },
    },
  },
];
```

### Reputation Update Logic (nextTurn)

```typescript
const updateNPCRelationships = (playerStats: PlayerStats): void => {
  for (const relationship of playerStats.npcRelationships) {
    const npc = NPCRegistry.find(n => n.id === relationship.npcId);
    if (!npc) continue;
    
    // Passive decay if no interaction (after 3 months)
    const monthsSinceInteraction = monthsBetween(relationship.lastInteraction, new Date());
    if (monthsSinceInteraction > 3) {
      relationship.reputation *= 0.95; // 5% decay per month of silence
      
      if (monthsSinceInteraction > 6) {
        relationship.trustLevel *= 0.90; // Additional trust decay
      }
    }
    
    // Random interaction trigger
    if (Math.random() * 100 < npc.baseInteractionFrequency) {
      triggerNPCInteraction(relationship, npc, playerStats);
    }
    
    // Apply reputation effects to player stats
    applyReputationEffects(relationship, npc, playerStats);
  }
};

const triggerNPCInteraction = (
  relationship: NPCRelationship,
  npc: NPC,
  playerStats: PlayerStats
): void => {
  if (npc.role === 'boss') {
    // Karen interactions based on job performance
    if (playerStats.jobMetrics?.currentPerformance > 80) {
      createEvent('boss_praise', {
        title: `${npc.name} Calls You In`,
        message: `"${npc.name}: Great work on the project. I'm impressed."`,
        actions: [{
          label: 'Thank Her',
          actionId: 'accept_praise',
          impact: {
            happiness: +10,
            reputation_karen: +15,
          },
        }],
      });
    } else if (playerStats.jobMetrics?.currentPerformance < 40) {
      createEvent('boss_complaint', {
        title: `${npc.name} Calls Meeting`,
        message: `"Your performance is slipping. I need to see immediate improvement."`,
        impact: { stress: +20, reputation_karen: -15 },
      });
    }
  } else if (npc.role === 'friend') {
    // Sam may ask for help
    const helpAmount = 75 + Math.random() * 150; // $75-225
    createEvent('friend_help_request', {
      title: `${npc.name} Texts You`,
      message: `"Hey, things are tight. Could I borrow $${Math.round(helpAmount)}?"`,
      actions: [
        {
          label: 'Help Him Out',
          actionId: 'help_friend',
          impact: {
            balance: -helpAmount,
            reputation_sam: +25,
            happiness: +15,
            stress: -5,
          },
        },
        {
          label: 'Can't Help Right Now',
          actionId: 'refuse_friend',
          impact: {
            reputation_sam: -15,
            happiness: -8,
            stress: +3,
          },
        },
      ],
    });
  } else if (npc.role === 'rival') {
    // Emma events based on player vs Emma comparison
    if (playerStats.prospects > 70 && playerStats.income > 4000) {
      createEvent('rival_respect', {
        title: `${npc.name} Acknowledges You`,
        message: `"You've done well. Maybe we should collaborate instead of compete?"`,
        actions: [{
          label: 'Accept Alliance',
          actionId: 'ally_with_rival',
          impact: {
            reputation_emma: +20,
            prospects: +10,
          },
        }],
      });
    } else if (playerStats.prospects < 40) {
      createEvent('rival_sabotage', {
        title: `${npc.name} Takes Action`,
        message: `You overhear Emma gossiping about your career struggles. Your reputation at work suffers.`,
        impact: {
          prospects: -10,
          happiness: -10,
          stress: +15,
          reputation_emma: -20,
        },
      });
    }
  }
};

const applyReputationEffects = (
  relationship: NPCRelationship,
  npc: NPC,
  playerStats: PlayerStats
): void => {
  const effects = npc.reputationEffects;
  
  if (relationship.reputation > 70) {
    // Excellent reputation
    if (effects.excellent?.salary_bonus) {
      playerStats.income *= (1 + effects.excellent.salary_bonus);
    }
    if (effects.excellent?.promotion_chance) {
      playerStats.jobMetrics.promotionEligibility += effects.excellent.promotion_chance;
    }
  } else if (relationship.reputation < 0) {
    // Terrible reputation
    if (effects.terrible?.salary_cut) {
      playerStats.income *= (1 + effects.terrible.salary_cut);
    }
    if (effects.terrible?.layoff_risk) {
      playerStats.jobMetrics.riskOfLayoff += effects.terrible.layoff_risk;
    }
  }
};
```

#### Special Reputation-Based Events

```typescript
// Sam's gift (high reputation, random)
const generateSamGiftEvent = (relationship: NPCRelationship): void => {
  if (relationship.reputation > 60 && Math.random() < 0.3) {
    createEvent('friend_gift', {
      title: `🎁 Sam Sends Money`,
      message: `Sam transfers $500 to your account as a thank you for being a good friend.`,
      impact: { balance: +500, happiness: +15 },
    });
  }
};

// Karen's promotion opportunity (high reputation + good performance)
const generateKarenOpportunity = (
  relationship: NPCRelationship,
  jobMetrics: JobMetrics
): void => {
  if (
    relationship.reputation > 65 &&
    jobMetrics.currentPerformance > 75 &&
    Math.random() < 0.2
  ) {
    createEvent('karen_offer_promotion', {
      title: `🚀 Karen's Special Offer`,
      message: `Karen: "I have a unique opportunity for you. VP of your department just retired."`,
      message2: `"Are you interested? It comes with a $2000/month raise and more respect."`,
      actions: [{
        label: 'Take the Opportunity',
        actionId: 'take_vp_role',
        impact: {
          income: +2000,
          stress: +25, // More responsibility
          reputation_karen: +30,
          prospects: +25,
        },
      }],
    });
  }
};

// Emma's competitive challenge
const generateEmmaChallenge = (relationship: NPCRelationship): void => {
  if (relationship.reputation > 40 && relationship.reputation < 70) {
    createEvent('emma_challenge', {
      title: `⚔️ Emma's Challenge`,
      message: `Emma: "There's a big project coming up. Highest performer gets a bonus."`,
      message2: `"Interested in proving who's better?"`,
      actions: [
        {
          label: 'Accept Challenge',
          actionId: 'accept_emma_challenge',
          impact: {
            stress: +15, // Competitive pressure
            happiness: +5, // Motivated
            prospects: '+X', // Depends on outcome next month
          },
        },
      ],
    });
  }
};
```

---

## 6. Integration Summary

### Data Flow with New Systems

```
nextTurn() execution order:
1. accrueInterest()              → balance growth/penalties
2. processLoanDelinquency()      → late fees, credit damage
3. updateInvestmentPrices()      → portfolio volatility, dividends
4. calculateJobPerformance()     → career consequences
5. monthlyJobReview()            → promotion/layoff checks
6. updateNPCRelationships()      → reputation decay/growth
7. applyReputationEffects()      → salary adjustments from NPCs
8. checkGameStatus()             → red zone/game over conditions
9. generateMonthlyEvents()       → random life events
10. recordTransactions()          → financial history
11. persist to AsyncStorage()    → save progress
```

### Cross-System Cascades

**Example 1: The Downward Spiral**
```
Low income from salary cut
  ↓
Can't pay loan on time
  ↓
Delinquency → Credit score drops
  ↓
New loan rates spike
  ↓
Take payday loan (35% APR)
  ↓
Stress maxes out
  ↓
Job performance crashes
  ↓
Laid off
  ↓
RED ZONE entered
```

**Example 2: The Upward Climb**
```
Take investment course
  ↓
Start building investment portfolio
  ↓
Dividend income + interest on savings
  ↓
Passive income reduces financial stress
  ↓
Happiness increases, job performance improves
  ↓
Promotion + raise
  ↓
Can pay off high-interest debt early
  ↓
Credit score improves → better rates
  ↓
Wealth compounds
```

### Extended Roadmap (12 weeks)

**Week 1-2: Data Structure**
- [ ] Add Loan[], Investment[], JobMetrics to store
- [ ] Add creditScore, debtToIncomeRatio
- [ ] Add NPCRelationship[]

**Week 3-4: Core Calculators**
- [ ] Interest accrual, loan rates
- [ ] Investment volatility
- [ ] Job performance scoring
- [ ] Net worth, Red Zone triggers

**Week 5-6: Events & Mechanics**
- [ ] Promotion/layoff events
- [ ] NPC interactions
- [ ] Forced asset sales
- [ ] Investment purchase/sale flows

**Week 7-8: UI Enhancements**
- [ ] Assets: Pay Early, Refinance buttons
- [ ] Marketplace: Loans tab, Investments tab
- [ ] Profile: Job Performance display
- [ ] Chats: NPC Reputation status
- [ ] New Red Zone warning UI

**Week 9-10: Integration**
- [ ] Hook mechanics to nextTurn()
- [ ] Test cascading effects
- [ ] Bankruptcy recovery flows

**Week 11-12: Polish**
- [ ] Balance gameplay difficulty
- [ ] Edge case handling
- [ ] Performance optimization
- [ ] User testing & iteration

---

## Conclusion

These 6 systems transform the game from **simple mechanics** into **emergent, interconnected gameplay** where:

- **Debt management** gives strategic depth (early payment, refinancing)
- **Investments** create long-term wealth-building gameplay
- **Job performance** ties lifestyle choices to career consequences
- **Red Zone** adds tension and meaningful failure states
- **NPC relationships** reward thoughtful interaction
- **Everything compounds**: Positive habits create virtuous cycles; poor decisions snowball into crises

The result is a game where player agency matters, consequences are real, and emergent stories emerge from system interactions.
