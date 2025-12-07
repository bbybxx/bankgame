# 🎮 Systems Refinement - Time, Randomness & UX Feedback

> Final layer of design covering turn granularity, dynamic expenses, asset progression, and immediate player feedback. These details elevate the game from "mechanical" to "alive and responsive".

---

## Table of Contents

1. [Turn Granularity System](#1-turn-granularity-system)
2. [Dynamic Random Expenses](#2-dynamic-random-expenses)
3. [Asset Tier System & Progression](#3-asset-tier-system--progression)
4. [Immediate Feedback Architecture](#4-immediate-feedback-architecture)
5. [Integration & Testing](#5-integration--testing)

---

## 1. Turn Granularity System

### Problem with Monthly Turns

A 1-month turn is too coarse-grained:
- **Investments** feel static (prices update once/month = boring)
- **Stress/Happiness** changes feel delayed (player makes choice, waits 4 weeks to see effect)
- **Small purchases** have no immediate feedback (buy coffee, see result only next month)
- **Weekly salary** makes sense financially but monthly turn breaks the rhythm

### Solution: Hybrid Turn System (Weekly + Monthly Triggers)

```typescript
interface GameTurn {
  turnNumber: number;           // 1, 2, 3, ... (infinite)
  weekNumber: number;           // 1-52 (within year)
  monthNumber: number;          // 1-12
  year: number;                 // 2024, 2025, etc.
  dayOfWeek: string;            // "Monday", "Friday", etc.
  turnType: 'weekly' | 'monthly_close';
}

interface GameState {
  currentTurn: GameTurn;
  isMonthEnd: boolean;          // True on weeks 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52
  
  // Track pending transactions until month-end
  pendingMonthlyTransactions: Transaction[];
  pendingMonthlyEvents: Event[];
}
```

#### Weekly Turn Flow (Every Pull-to-Refresh)

```typescript
const executeWeeklyTurn = (playerStats: PlayerStats): void => {
  const turn = calculateTurnInfo();
  
  // === STEP 1: Small Random Weekly Expenses ===
  applyWeeklyRandomExpenses(playerStats);
  
  // === STEP 2: Investment Price Updates ===
  updateInvestmentPrices(playerStats);
  
  // === STEP 3: Passive Interest ===
  accrueWeeklyInterest(playerStats);
  
  // === STEP 4: Stress/Happiness Micro-Changes ===
  // Based on recent small purchases, activities
  updateWeeklyMoodInfluences(playerStats);
  
  // === STEP 5: NPC Mini-Interactions ===
  // Rare 5% chance of random contact message
  triggerRandomNPCMessage(playerStats);
  
  // === STEP 6: Minor Event Generation ===
  // Small flavor events, not career-changing
  generateWeeklyMinorEvents(playerStats);
  
  // === STEP 7: Record Weekly Metrics ===
  recordWeeklySnapshot(playerStats);
  
  // === MONTH-END: If 4th week of month ===
  if (turn.isMonthEnd) {
    executeMonthlyClose(playerStats);
  }
  
  // Persist to storage
  persistGameState(playerStats);
};
```

#### Monthly Close (Week 4 of Month)

```typescript
const executeMonthlyClose = (playerStats: PlayerStats, assets: Asset[]): void => {
  // === STEP 1: Large Monthly Income ===
  playerStats.balanceDebit += playerStats.income;
  recordTransaction('Monthly Salary', playerStats.income, 'Income', 'Employer');
  
  // === STEP 2: Mandatory Monthly Expenses ===
  const monthlyExpenses = {
    rent: playerStats.expenses.rent,
    groceries: playerStats.expenses.groceries,
    utilities: playerStats.expenses.utilities,
    loanPayment: playerStats.totalMonthlyDebtPayment,
  };
  
  const totalExpenses = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
  playerStats.balanceDebit -= totalExpenses;
  
  recordTransaction('Monthly Expenses', totalExpenses, 'Expense', 'Auto-debit');
  
  // === STEP 3: Investment Dividend Payments (Monthly) ===
  accrueMonthlyDividends(playerStats);
  
  // === STEP 4: Job Performance Review ===
  monthlyJobReview(playerStats);
  
  // === STEP 5: NPC Reputation Updates ===
  updateNPCRelationships(playerStats);
  
  // === STEP 6: Loan Delinquency Check ===
  processLoanDelinquency(playerStats);
  
  // === STEP 7: Credit Score Changes ===
  updateCreditScore(playerStats);
  
  // === STEP 8: Major Event Generation ===
  generateMonthlyMajorEvents(playerStats, assets);
  
  // === STEP 9: Game Status Check ===
  const gameStatus = checkGameStatus(playerStats, assets);
  if (gameStatus === 'game_over') {
    triggerGameOverSequence(playerStats);
  } else if (gameStatus === 'red_zone') {
    processRedZone(playerStats, assets);
  }
  
  // === STEP 10: Monthly Snapshot & Archive ===
  recordMonthlySnapshot(playerStats);
};
```

#### Interest Accrual: Weekly vs Monthly

```typescript
const accrueWeeklyInterest = (playerStats: PlayerStats): void => {
  // Interest is 1/4 of monthly (52 weeks / 12 months = 4.33 weeks/month)
  // So weekly interest = monthly interest / 4.33
  
  if (playerStats.balanceVirtual > 0) {
    const weeklyRate = (0.02 / 12 / 4.33); // 2% annual, weekly portion
    const weeklyInterest = playerStats.balanceVirtual * weeklyRate;
    playerStats.balanceVirtual += weeklyInterest;
  }
  
  // Overdraft penalty (weekly portion)
  if (playerStats.balanceDebit < 0) {
    const weeklyPenalty = Math.abs(playerStats.balanceDebit) * (0.05 / 12 / 4.33);
    playerStats.balanceDebit -= weeklyPenalty;
  }
};

const accrueMonthlyDividends = (playerStats: PlayerStats): void => {
  // Dividends only paid at month-end
  for (const investment of playerStats.investments) {
    if (investment.dividendYield) {
      const monthlyDividend = investment.totalValue * (investment.dividendYield / 12);
      playerStats.balanceVirtual += monthlyDividend;
      recordTransaction('Dividend Received', monthlyDividend, 'Income', investment.symbol);
    }
  }
};
```

#### Investment Updates: Weekly Granularity

```typescript
const updateInvestmentPrices = (playerStats: PlayerStats, globalMarketFactor: number = 0): void => {
  // Each week: price changes based on weekly volatility (not monthly)
  // Monthly volatility = sqrt(weeks_per_month) * weekly_volatility
  // So: weekly_volatility = monthly_volatility / sqrt(4.33) ≈ monthly / 2.08
  
  for (const investment of playerStats.investments) {
    // Weekly volatility is smaller than monthly
    const weeklyVolatility = investment.volatility / 2.08;
    
    // Random walk: price change this week
    const weeklyRandomComponent = (Math.random() - 0.5) * weeklyVolatility;
    const weeklyReturn = weeklyRandomComponent + (globalMarketFactor / 4.33);
    
    const newPrice = investment.sharePrice * (1 + weeklyReturn);
    const priceChange = newPrice - investment.sharePrice;
    
    investment.sharePrice = newPrice;
    investment.totalValue = investment.sharePrice * investment.sharesOwned;
    
    // Significant weekly move generates notification
    const percentChange = (priceChange / investment.sharePrice) * 100;
    if (Math.abs(percentChange) > 3) { // Lower threshold for weekly
      createEvent(percentChange > 0 ? 'investment_weekly_gain' : 'investment_weekly_loss', {
        investment,
        percentChange,
        message: `${investment.symbol} ${percentChange > 0 ? '📈' : '📉'} ${Math.abs(percentChange).toFixed(2)}% this week`,
        impact: percentChange > 0
          ? { happiness: +2 }
          : { happiness: -2, stress: +2 },
      });
    }
  }
};
```

#### Turn Calculator

```typescript
const calculateTurnInfo = (): GameTurn => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
  
  const weekNumber = Math.floor(dayOfYear / 7) + 1; // 1-52
  const monthNumber = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();
  
  // Month ends on weeks: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52
  // (approximately every 4 weeks, adjusted for actual month lengths)
  const monthEnds = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52];
  const isMonthEnd = monthEnds.includes(weekNumber);
  
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  
  return {
    turnNumber: weekNumber + (year - startYear) * 52,
    weekNumber,
    monthNumber,
    year,
    dayOfWeek,
    turnType: isMonthEnd ? 'monthly_close' : 'weekly',
  };
};

// UI Display of Turn Info
const renderTurnInfo = (turn: GameTurn): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `Week ${turn.weekNumber} • ${monthNames[turn.monthNumber - 1]} ${turn.year} • ${turn.dayOfWeek}`;
};
```

---

## 2. Dynamic Random Expenses

### Problem with Current Model

Expenses are static (rent, groceries, utilities always the same). Real life has surprises: car breaks down, phone screen cracks, coffee addiction.

### Weekly Random Expenses Algorithm

```typescript
interface WeeklyExpenseGenerator {
  baseChance: number;           // % chance per week
  minAmount: number;
  maxAmount: number;
  category: string;
  stressMultiplier?: number;    // Chance increases with stress
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
    stressMultiplier: 0.5, // Stress increases chance
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

const applyWeeklyRandomExpenses = (playerStats: PlayerStats): void => {
  for (const expense of weeklyExpenseTable) {
    let actualChance = expense.baseChance;
    
    // Stress modifies chance
    if (expense.stressMultiplier) {
      const stressBonus = (playerStats.stress / 100) * expense.stressMultiplier * 100;
      actualChance += stressBonus;
    }
    
    if (Math.random() * 100 < actualChance) {
      // Expense triggered
      const amount = expense.minAmount + Math.random() * (expense.maxAmount - expense.minAmount);
      
      playerStats.balanceDebit -= amount;
      
      recordTransaction(
        expense.description,
        amount,
        'Expense',
        expense.category
      );
      
      // Happiness impact based on category
      if (expense.category === 'Food & Drink' || expense.category === 'Entertainment') {
        playerStats.happiness += 2; // Small boost from treat
      } else if (expense.category === 'Urgent Repair') {
        playerStats.stress += 5; // Stress from unexpected cost
        playerStats.happiness -= 3;
      }
      
      // Potential notification event
      if (amount > 100) {
        createEvent('unexpected_expense', {
          title: '💸 Unexpected Expense',
          message: `${expense.description}: -$${amount.toFixed(2)}`,
          impact: {
            happiness: expense.category === 'Urgent Repair' ? -5 : 0,
            stress: expense.category === 'Urgent Repair' ? +5 : 0,
          },
        });
      }
    }
  }
};
```

### Stress-Driven Expense Spiral

```typescript
// High stress → more accidents → more expenses → more stress (feedback loop)
const stressExpenseMultiplier = (playerStats: PlayerStats): number => {
  if (playerStats.stress > 90) return 2.5;    // 2.5x more likely
  if (playerStats.stress > 75) return 2.0;
  if (playerStats.stress > 60) return 1.5;
  if (playerStats.stress > 40) return 1.0;
  return 0.7;                                 // Less likely when calm
};
```

### "Coping Purchases" (Stress Relief Spending)

```typescript
// Stress above 70 creates urge to spend on happiness
const generateStressReliefPurchase = (playerStats: PlayerStats): void => {
  if (playerStats.stress > 70 && Math.random() < 0.2) {
    const copingCategories = [
      { name: 'Treat yourself to nice meal', cost: 50, happiness: +15, stress: -10 },
      { name: 'Buy new clothes', cost: 100, happiness: +12, stress: -8 },
      { name: 'Get massage', cost: 80, happiness: +20, stress: -15 },
      { name: 'Gaming splurge', cost: 60, happiness: +10, stress: -5 },
    ];
    
    const choice = copingCategories[Math.floor(Math.random() * copingCategories.length)];
    
    createEvent('stress_relief_spending', {
      title: '😌 Need a Break',
      message: `You're stressed. Consider: ${choice.name} ($${choice.cost})?`,
      actions: [
        {
          label: 'Treat Myself',
          actionId: 'stress_relief_yes',
          impact: {
            balance: -choice.cost,
            happiness: choice.happiness,
            stress: choice.stress,
          },
        },
        {
          label: 'Skip It',
          actionId: 'stress_relief_no',
          impact: {
            stress: +5, // Denying treats increases stress
          },
        },
      ],
    });
  }
};
```

---

## 3. Asset Tier System & Progression

### Problem with Current Model

Once player buys housing, there's no progression. Housing is binary: rented vs owned. Should be a ladder.

### Housing Tier System

```typescript
interface HousingTier {
  id: string;
  tier: number;                 // 1 = rental, 5 = luxury
  name: string;
  monthlyRent: number;
  purchasePrice?: number;       // Null if rental only
  maintenanceCost: number;      // Monthly cost to maintain
  happinessBonus: number;       // +0 to +30
  stressReduction: number;      // -0 to -15 (from commute, neighborhood)
  commuteDamage?: number;       // Minutes/stress per week
  resaleValue?: number;         // If purchased, can be sold
  unlocks?: string[];           // Career opportunities
  propertyTax?: number;         // If owned
  canRent?: boolean;            // Can generate passive income if rented out
  rentalIncome?: number;        // Monthly if rented to tenant
}

const housingCatalog: HousingTier[] = [
  // TIER 1: Basic Rental
  {
    id: 'rental_studio',
    tier: 1,
    name: 'Shared Studio Apartment',
    monthlyRent: 800,
    maintenanceCost: 0,
    happinessBonus: 0,
    stressReduction: -5, // Cramped = stressful
    commuteDamage: 45,
    canRent: false,
    unlocks: [],
  },
  
  // TIER 2: Decent Rental
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
  
  // TIER 3: Starter Home (Purchased)
  {
    id: 'owned_starter',
    tier: 3,
    name: 'Starter Home (Owned)',
    purchasePrice: 120000,
    monthlyRent: 0,              // No rent, but:
    maintenanceCost: 300,        // Mortgage included in property tax
    propertyTax: 200,            // Monthly property tax
    happinessBonus: 15,
    stressReduction: 0,
    commuteDamage: 20,
    resaleValue: 120000,         // Initial resale value
    canRent: true,               // Can rent to tenant
    rentalIncome: 1500,          // If rented out
    unlocks: ['better_job_tier_2'],
  },
  
  // TIER 4: Nice Home (Purchased)
  {
    id: 'owned_nice',
    tier: 4,
    name: 'Nice Suburban Home',
    purchasePrice: 300000,
    monthlyRent: 0,
    maintenanceCost: 600,
    propertyTax: 400,
    happinessBonus: 25,
    stressReduction: +5,         // Peaceful neighborhood
    commuteDamage: 15,
    resaleValue: 300000,
    canRent: true,
    rentalIncome: 3200,
    unlocks: ['premium_job_tier'],
  },
  
  // TIER 5: Luxury Home (Status Symbol)
  {
    id: 'owned_luxury',
    tier: 5,
    name: 'Luxury Home',
    purchasePrice: 800000,
    monthlyRent: 0,
    maintenanceCost: 1500,
    propertyTax: 1200,           // High taxes!
    happinessBonus: 30,
    stressReduction: +10,        // Low stress from surroundings
    commuteDamage: 5,
    resaleValue: 800000,
    canRent: true,
    rentalIncome: 6500,
    unlocks: ['executive_opportunities'],
  },
];
```

#### Housing State & Transitions

```typescript
interface CurrentHousing {
  housingId: string;
  tierLevel: number;
  isOwned: boolean;
  purchaseDate?: Date;
  loanId?: string;              // Mortgage ID
  isRentedOut?: boolean;        // Property generating income
  tenantReputation?: number;    // Risk of tenant damaging property
  purchasePrice?: number;
  currentResaleValue?: number;  // Depreciation/appreciation
}

// Player upgrades housing
const upgradeHousing = (
  playerStats: PlayerStats,
  oldHousing: CurrentHousing,
  newHousingId: string
): { success: boolean; message: string } => {
  const newHousing = housingCatalog.find(h => h.id === newHousingId);
  if (!newHousing) return { success: false, message: 'Housing not found' };
  
  // If upgrading from owned to owned, sell old first
  if (oldHousing.isOwned && newHousing.purchasePrice) {
    const saleProceeds = oldHousing.currentResaleValue || newHousing.purchasePrice * 0.9;
    playerStats.balanceDebit += saleProceeds;
    
    recordTransaction('Home Sale', saleProceeds, 'Income', oldHousing.housingId);
  }
  
  // Purchase or rent new
  if (newHousing.purchasePrice) {
    // Need to get mortgage
    const mortgageAmount = newHousing.purchasePrice;
    const mortgage = requestPersonalLoan(
      {
        id: generateId(),
        lender: 'HomeLoan Bank',
        termMonths: 360, // 30-year mortgage
        baseRate: calculateLoanRate(playerStats.creditScore, 'asset_mortgage'),
        fees: { originationFee: 0.01, lateFee: 50 },
      },
      mortgageAmount,
      playerStats
    );
    
    if (!mortgage.approved) {
      return { success: false, message: 'Mortgage denied. Credit score too low.' };
    }
    
    playerStats.currentHousing = {
      housingId: newHousingId,
      tierLevel: newHousing.tier,
      isOwned: true,
      purchaseDate: new Date(),
      loanId: mortgage.loan?.id,
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
  
  createEvent('housing_upgraded', {
    title: '🏠 New Home!',
    message: `You moved to ${newHousing.name}`,
    message2: `Happiness: +${newHousing.happinessBonus}, Stress: ${newHousing.stressReduction}`,
  });
  
  return { success: true, message: 'Housing upgraded successfully' };
};

// Monthly housing expense handling
const applyMonthlyHousingCosts = (playerStats: PlayerStats): void => {
  const housing = housingCatalog.find(h => h.id === playerStats.currentHousing.housingId);
  if (!housing) return;
  
  let totalCost = 0;
  
  if (playerStats.currentHousing.isOwned) {
    totalCost = (housing.maintenanceCost || 0) + (housing.propertyTax || 0);
    recordTransaction('Property Maintenance & Tax', totalCost, 'Expense', 'Housing');
    
    // If rented out, add income
    if (playerStats.currentHousing.isRentedOut && housing.rentalIncome) {
      playerStats.balanceDebit += housing.rentalIncome;
      recordTransaction('Rental Income', housing.rentalIncome, 'Income', 'Tenant');
    }
  } else {
    totalCost = housing.monthlyRent || 0;
    recordTransaction('Monthly Rent', totalCost, 'Expense', 'Landlord');
  }
  
  playerStats.balanceDebit -= totalCost;
  playerStats.expenses.rent = totalCost;
};
```

#### Housing Impact on Career

```typescript
// Better housing → unlocks better job opportunities
const updateAvailableJobsBasedOnHousing = (playerStats: PlayerStats): Job[] => {
  const housing = housingCatalog.find(h => h.id === playerStats.currentHousing.housingId);
  
  let availableJobs = allJobs.filter(job => {
    // Basic eligibility
    if (job.requiredEducation && !playerStats.education.some(e => e.type === job.requiredEducation)) {
      return false;
    }
    
    // Housing-based unlock
    if (housing?.unlocks?.includes(job.id)) {
      return true;
    }
    
    return !job.requiresHousingTier || (housing?.tier || 0) >= job.requiresHousingTier;
  });
  
  return availableJobs;
};
```

### Vehicle Tier System

```typescript
interface VehicleTier {
  id: string;
  tier: number;                 // 1 = used beater, 5 = luxury
  name: string;
  purchasePrice: number;
  maintenanceCost: number;      // Monthly
  fuelCost: number;             // Weekly equivalent
  breakdownChance: number;      // % per month, inverse of condition
  resaleValue: number;
  happinessBonus: number;
  stressReduction: number;      // From reliable transport
}

const vehicleCatalog: VehicleTier[] = [
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
    stressReduction: -10, // Unreliable car = stress
  },
  // ... tiers 2-5
];
```

---

## 4. Immediate Feedback Architecture

### Problem with Delayed Feedback

Decision → Wait 1 month → See consequence = Poor UX

### Solution: Two-Layer Feedback System

```typescript
interface PlayerDecision {
  actionId: string;
  immediateImpact: {
    happiness?: number;
    stress?: number;
    balance?: number;
  };
  delayedImpact?: {
    reputation?: { npcId: string; change: number };
    events?: string[];
    metrics?: { [key: string]: number };
  };
  delayedTrigger?: 'nextWeek' | 'nextMonth' | 'never';
}

// Example: Helping Sam
const helpSamDecision: PlayerDecision = {
  actionId: 'help_sam',
  immediateImpact: {
    balance: -100,                // Immediate transaction
    happiness: +8,                // Immediate mood boost
  },
  delayedImpact: {
    reputation: { npcId: 'sam_friend', change: +20 },
    events: ['sam_gift_chance'],  // Chance of gift next month
  },
  delayedTrigger: 'nextMonth',
};
```

#### Decision Resolution System

```typescript
const executePlayerDecision = (
  decision: PlayerDecision,
  playerStats: PlayerStats
): void => {
  // === IMMEDIATE EFFECTS (Instant Gratification) ===
  
  // Visual feedback happens instantly
  if (decision.immediateImpact.balance) {
    playerStats.balanceDebit += decision.immediateImpact.balance;
    recordTransaction(
      `[Decision] ${decision.actionId}`,
      decision.immediateImpact.balance,
      decision.immediateImpact.balance < 0 ? 'Expense' : 'Income',
      'Player Choice'
    );
  }
  
  if (decision.immediateImpact.happiness) {
    playerStats.happiness = Math.max(0, Math.min(100, 
      playerStats.happiness + decision.immediateImpact.happiness
    ));
  }
  
  if (decision.immediateImpact.stress) {
    playerStats.stress = Math.max(0, Math.min(100,
      playerStats.stress + decision.immediateImpact.stress
    ));
  }
  
  // UI Toast notification (optional)
  showToastNotification({
    type: decision.immediateImpact.happiness > 0 ? 'success' : 'neutral',
    message: `Happiness: ${decision.immediateImpact.happiness > 0 ? '+' : ''}${decision.immediateImpact.happiness}`,
    duration: 2000,
  });
  
  // === DELAYED EFFECTS (Scheduled for future turn) ===
  
  if (decision.delayedImpact) {
    const delayedEffect: ScheduledEffect = {
      effectId: generateId(),
      triggeredBy: decision.actionId,
      delayedImpact: decision.delayedImpact,
      triggerTurn: decision.delayedTrigger === 'nextMonth' 
        ? calculateTurnInfo().turnNumber + 4 
        : calculateTurnInfo().turnNumber + 1,
    };
    
    playerStats.scheduledEffects.push(delayedEffect);
  }
};

// Process scheduled effects at turn boundaries
const processScheduledEffects = (playerStats: PlayerStats): void => {
  const currentTurn = calculateTurnInfo().turnNumber;
  
  const effectsToProcess = playerStats.scheduledEffects.filter(
    e => e.triggerTurn <= currentTurn
  );
  
  for (const effect of effectsToProcess) {
    if (effect.delayedImpact.reputation) {
      const npcRel = playerStats.npcRelationships.find(
        r => r.npcId === effect.delayedImpact.reputation.npcId
      );
      if (npcRel) {
        npcRel.reputation += effect.delayedImpact.reputation.change;
      }
    }
    
    // Fire delayed events
    if (effect.delayedImpact.events) {
      for (const eventId of effect.delayedImpact.events) {
        if (eventId === 'sam_gift_chance' && Math.random() < 0.3) {
          generateSamGiftEvent(playerStats);
        }
      }
    }
  }
  
  // Remove processed effects
  playerStats.scheduledEffects = playerStats.scheduledEffects.filter(
    e => e.triggerTurn > currentTurn
  );
};
```

#### Decisions That Give Immediate Feedback

```typescript
// When player accepts promotion
const acceptPromotionDecision: PlayerDecision = {
  actionId: 'accept_promotion',
  immediateImpact: {
    happiness: +25,              // Instant happiness
    balance: +500,               // Signing bonus (optional)
  },
  delayedImpact: {
    metrics: {
      income: 15000,             // New monthly salary (takes effect next month)
      prospects: +15,
    },
  },
  delayedTrigger: 'nextMonth',
};

// When player declines Sam's help
const refuseSamDecision: PlayerDecision = {
  actionId: 'refuse_sam',
  immediateImpact: {
    happiness: -5,               // Guilt (instant)
    stress: +3,
  },
  delayedImpact: {
    reputation: { npcId: 'sam_friend', change: -15 },
  },
  delayedTrigger: 'nextWeek',
};

// When player purchases investment
const buyInvestmentDecision: PlayerDecision = {
  actionId: 'buy_btc',
  immediateImpact: {
    balance: -5000,              // Money leaves account (instant)
    stress: +5,                  // Anxiety about volatility (instant)
    prospects: +3,               // Ambition to build wealth (instant)
  },
  delayedImpact: {
    events: ['investment_volatility_tracking'],
  },
  delayedTrigger: 'never',       // Continuous effect until sold
};

// When player buys stress relief
const stressReliefDecision: PlayerDecision = {
  actionId: 'stress_relief_massage',
  immediateImpact: {
    balance: -80,
    happiness: +20,              // Major boost (instant)
    stress: -15,                 // Immediate relaxation
  },
  delayedImpact: {},
  delayedTrigger: 'never',
};
```

### UI Toast Feedback

```typescript
// Show immediate effects visually
interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'neutral';
  title?: string;
  message: string;
  duration: number;              // ms
  actions?: 'undo' | 'dismiss';
}

const showImmediateEffectToast = (impact: DecisionImpact): void => {
  const messages = [];
  
  if (impact.happiness > 0) messages.push(`😊 Happiness +${impact.happiness}`);
  if (impact.happiness < 0) messages.push(`😞 Happiness ${impact.happiness}`);
  
  if (impact.stress < 0) messages.push(`😌 Stress ${impact.stress}`);
  if (impact.stress > 0) messages.push(`😰 Stress +${impact.stress}`);
  
  if (impact.balance > 0) messages.push(`💰 Balance +$${impact.balance}`);
  if (impact.balance < 0) messages.push(`💸 Balance -$${Math.abs(impact.balance)}`);
  
  showToast({
    type: impact.happiness > 0 || impact.stress < 0 ? 'success' : 'warning',
    message: messages.join('\n'),
    duration: 3000,
  });
};
```

---

## 5. Integration & Testing

### Turn System Integration Checklist

```
[ ] WeeklyTurn Execution
  [ ] Apply random expenses weekly
  [ ] Update investment prices weekly
  [ ] Accrue weekly interest
  [ ] Update mood influences
  [ ] Generate minor events
  
[ ] MonthlyClose Execution (Week 4 of month)
  [ ] Apply salary
  [ ] Apply fixed expenses (rent, utilities, groceries)
  [ ] Apply loan payments
  [ ] Pay dividends
  [ ] Monthly job review
  [ ] Update NPC relationships
  [ ] Check delinquencies
  [ ] Generate major events
  [ ] Check game status
  
[ ] Scheduled Effects Processing
  [ ] Check for effects due this turn
  [ ] Execute reputation changes
  [ ] Fire delayed events
  [ ] Remove processed effects

[ ] Turn Info Display
  [ ] Show current week/month/year
  [ ] Show days until month-end
  [ ] Show next major event trigger
```

### Testing Cascade Scenarios

**Scenario 1: Weekly Volatility**
```
Week 1: Player buys $5000 of BTC
  → Immediate: Stress +5, Prospects +3
  → Weekly: BTC price changes ±15%
  → Week 2-4: Portfolio fluctuates, generating events

Week 4 (Month End): 
  → Salary paid, expenses deducted
  → Dividends if applicable
  → Major events generated
```

**Scenario 2: Stress Spiral**
```
Week 1: Job stress event → Stress +30
  → Increased random expenses (car breakdown)
  → Player tempted to stress-spend for relief
  → Happiness +10, Stress -15 (net: stress reduced but money spent)

Week 2: Still high stress
  → More likely to have accidents
  → Missing entertainment opportunities
  
Week 4 (Month End):
  → Low job performance (stress affected)
  → Salary cut or risk of layoff
```

**Scenario 3: Housing Upgrade**
```
Week 2: Player upgrades from $800 rental to $1500 rental
  → Immediate: Happiness +5
  → Monthly Close: New rent is $1500 (up from $800)
  → Week 4: Monthly Close applied
  → Impact on cash flow becomes apparent next turn

Alternative: Purchase $120k starter home
  → Immediate: Happiness +15
  → Need: Mortgage approval (credit score check)
  → Week 4: New mortgage payments start ($800/month?)
  → Property tax, maintenance costs
  → But: Can potentially rent out for $1500/month income
```

### Feedback Loop Testing

```typescript
// Unit test: Verify immediate + delayed feedback
describe('Decision Feedback System', () => {
  test('Help Sam: Immediate happiness boost, delayed reputation change', () => {
    const before = { happiness: 50, balance: 1000, samRep: 40 };
    
    executePlayerDecision(helpSamDecision, playerStats);
    
    // Immediate
    expect(playerStats.happiness).toBe(58);        // +8
    expect(playerStats.balanceDebit).toBe(900);    // -100
    
    // Delayed effect scheduled
    expect(playerStats.scheduledEffects.length).toBeGreaterThan(0);
    
    // After 4 weeks (next month)
    for (let i = 0; i < 4; i++) executeWeeklyTurn();
    processScheduledEffects(playerStats);
    
    expect(playerStats.npcRelationships[0].reputation).toBe(60); // +20 delayed
  });
});

// Integration test: Verify cascading effects
describe('Economic Cascade', () => {
  test('Job loss → Red zone → Forced asset sale', () => {
    triggerLayoffEvent(playerStats);
    
    expect(playerStats.income).toBe(0);
    expect(playerStats.stress).toBe(100);
    
    // Simulate 4 weeks of unemployment
    for (let week = 0; week < 12; week++) {
      executeWeeklyTurn();
    }
    
    // Should have accumulated negative balance
    expect(playerStats.balanceDebit).toBeLessThan(-1000);
    
    // Next month close should detect red zone
    executeMonthlyClose();
    
    expect(gameStatus).toBe('red_zone');
  });
});
```

### UI State Updates

```typescript
interface GameUIState {
  turnInfo: GameTurn;
  recentTransactions: Transaction[];  // Last 3
  happinessTrend: number[];          // Last 4 weeks
  stressTrend: number[];
  balanceTrend: number[];
  investmentValues: { symbol: string; value: number; change: number }[];
  immediateNotifications: ToastNotification[];
  upcomingMonthlyEvents: string[];
}

// Update UI after each turn
const updateGameUI = (playerStats: PlayerStats): GameUIState => {
  const turn = calculateTurnInfo();
  
  return {
    turnInfo: turn,
    recentTransactions: playerStats.transactions.slice(-3),
    happinessTrend: playerStats.happinessHistory.slice(-4),
    stressTrend: playerStats.stressHistory.slice(-4),
    balanceTrend: playerStats.balanceHistory.slice(-4),
    investmentValues: playerStats.investments.map(inv => ({
      symbol: inv.symbol,
      value: inv.totalValue,
      change: ((inv.sharePrice - inv.purchasePrice) / inv.purchasePrice * 100),
    })),
    immediateNotifications: [],
    upcomingMonthlyEvents: [],
  };
};
```

---

## Conclusion: Dynamic Living Simulation

These refinements transform the game from "update once per month" to "feel alive every week":

✅ **Weekly turns** create rhythm and engagement
✅ **Random expenses** make economy feel organic, not scripted
✅ **Asset tiers** provide clear progression ladder
✅ **Immediate feedback** makes decisions feel consequential
✅ **Delayed effects** create anticipation and planning depth

**Result:** Player makes choice → Sees result in milliseconds → Continues feeling ripples for weeks/months.
