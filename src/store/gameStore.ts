import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ITransaction, 
  IPlayerStats, 
  Notification, 
  Chat, 
  GameTurn,
  Loan,
  Investment,
  JobMetrics,
  NPCRelationship,
} from '../types';
import { 
  generateMonthlyTransactions,
  calculateTurnInfo,
  executeWeeklyTurn,
  executeMonthlyClose,
  upgradeHousing,
  vehicleCatalog,
} from '../engine/gameLogic';
import { jobCatalog } from '../engine/jobCatalog';

interface GameState {
  playerStats: IPlayerStats;
  currentDate: string;
  gameStartDate: string;
  currentTurn: GameTurn | null;
  transactions: ITransaction[];
  notifications: Notification[];
  chats: Chat[];
  isGameOver: boolean;
  gameOverReason: string | null;
  
  // Actions
  addTransaction: (transaction: ITransaction) => void;
  nextTurn: () => void;
  markNotificationRead: (id: string) => void;
  handleNotificationAction: (notificationId: string, actionId: string) => void;
  updateExpenses: (expenses: Partial<IPlayerStats['expenses']>) => void;
  applyForJob: (job: any) => { success: boolean; message: string };
  purchaseHousing: (housingId: string, method?: 'cash' | 'mortgage' | 'rent') => { success: boolean; message: string };
  purchaseVehicle: (vehicleId: string, method?: 'cash' | 'loan') => { success: boolean; message: string };
  buyInvestmentAction: (catalogItem: any, shareCount: number) => { success: boolean; message: string };
  sellInvestmentAction: (investment: any, shareCount: number) => { success: boolean; message: string; proceeds: number; gainLoss: number };
  resetGame: () => void;
}

// Helper function to create initial player stats
const createInitialPlayerStats = (): IPlayerStats => {
  const now = new Date();
  return {
    playerId: 'player_' + Date.now(),
    playerName: 'Player',
    startDate: now,
    currentDate: now,
    balanceDebit: 500,
    balanceVirtual: 10,
    income: 3200,
    expenses: {
      rent: 2100,
      groceries: 1100,
      loanPayment: 600,
      utilities: 200,
    },
    happiness: 60,
    stress: 30,
    prospects: 50,
    health: 700, // Credit Score
    debt: 40000,
    loans: [],
    totalMonthlyDebtPayment: 600,
    creditScore: 700,
    debtToIncomeRatio: 0.19,
    interestPaidTotal: 0,
    investments: [],
    investmentPortfolioValue: 0,
    jobMetrics: {
      currentPerformance: 75,
      monthlyPerformanceHistory: [75],
      monthsAtCurrentJob: 3,
      promotionEligibility: 0,
      riskOfLayoff: 10,
      lastReviewDate: now,
      currentJobTitle: 'Software Developer',
    },
    npcRelationships: [
      {
        npcId: 'karen',
        npcName: 'Karen (Boss)',
        reputation: 50,
        lastInteraction: now,
        totalInteractions: 0,
      },
      {
        npcId: 'sam',
        npcName: 'Sam (Friend)',
        reputation: 75,
        lastInteraction: now,
        totalInteractions: 0,
      },
      {
        npcId: 'emma',
        npcName: 'Emma (Rival)',
        reputation: 25,
        lastInteraction: now,
        totalInteractions: 0,
      },
    ],
    currentHousing: {
      housingId: 'rental_1bed',
      tierLevel: 2,
      isOwned: false,
    },
    gameStatus: 'active',
    negativeNetWorthMonths: 0,
    bankruptcyAttempts: 0,
    gameEvents: [],
    scheduledEffects: [],
    happinessHistory: [60],
    stressHistory: [30],
    balanceHistory: [500],
  };
};

// Helper function to convert ISO strings back to Date objects when hydrating
const fixDatesInPlayerStats = (stats: IPlayerStats): IPlayerStats => {
  return {
    ...stats,
    startDate: stats.startDate ? new Date(stats.startDate) : new Date(),
    currentDate: stats.currentDate ? new Date(stats.currentDate) : new Date(),
    loans: (stats.loans || []).map(loan => ({
      ...loan,
      startDate: loan.startDate ? new Date(loan.startDate) : new Date(),
      maturityDate: loan.maturityDate ? new Date(loan.maturityDate) : new Date(),
    })),
    investments: (stats.investments || []).map(inv => ({
      ...inv,
      lastPriceUpdate: inv.lastPriceUpdate ? new Date(inv.lastPriceUpdate) : new Date(),
    })),
    gameEvents: (stats.gameEvents || []).map(evt => ({
      ...evt,
      date: evt.date ? new Date(evt.date) : new Date(),
    })),
    npcRelationships: (stats.npcRelationships || []).map(npc => ({
      ...npc,
      lastInteraction: npc.lastInteraction ? new Date(npc.lastInteraction) : new Date(),
    })),
    scheduledEffects: (stats.scheduledEffects || []).map(eff => ({
      ...eff,
      triggerDate: eff.triggerDate ? new Date(eff.triggerDate) : new Date(),
    })),
    jobMetrics: stats.jobMetrics ? {
      ...stats.jobMetrics,
      lastReviewDate: stats.jobMetrics.lastReviewDate ? new Date(stats.jobMetrics.lastReviewDate) : new Date(),
    } : {
      currentPerformance: 75,
      monthlyPerformanceHistory: [75],
      monthsAtCurrentJob: 0,
      promotionEligibility: 0,
      riskOfLayoff: 10,
      lastReviewDate: new Date(),
      currentJobTitle: 'Unknown Job',
    },
  };
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerStats: createInitialPlayerStats(),
      currentDate: new Date().toISOString(),
      gameStartDate: new Date().toISOString(),
      currentTurn: null,
      transactions: [],
      notifications: [],
      chats: [
        {
          id: '1',
          sender: 'Karen (Boss)',
          lastMessage: "Here's your pittance. Don't spend it all on avocado toast.",
          date: new Date().toISOString(),
          amount: 3200,
          type: 'incoming',
          unread: true,
        },
        {
          id: '2',
          sender: 'Sam',
          lastMessage: "Great night yesterday! Here's my share.",
          date: new Date().toISOString(),
          amount: 45.50,
          type: 'incoming',
          unread: true,
        },
        {
          id: '3',
          sender: 'Emma',
          lastMessage: "For nails 💅",
          date: new Date().toISOString(),
          amount: 45.50,
          type: 'outgoing',
          unread: false,
        }
      ],
      isGameOver: false,
      gameOverReason: null,

      updateExpenses: (expenses) => set((state) => ({
        playerStats: {
          ...state.playerStats,
          expenses: {
            ...state.playerStats.expenses,
            ...expenses
          }
        }
      })),

      addTransaction: (transaction) => set((state) => {
        const amount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
        return {
          transactions: [transaction, ...state.transactions],
          playerStats: {
            ...state.playerStats,
            balanceDebit: state.playerStats.balanceDebit + amount
          }
        };
      }),

      applyForJob: (jobId) => {
        let result = { success: false, message: 'Unknown job' };
        set((state) => {
          const updatedStats = { ...state.playerStats } as IPlayerStats;
          const job = jobCatalog.find(j => j.id === jobId);
          if (!job) {
            result = { success: false, message: 'Job not found' };
            return {} as any;
          }
          // Validation & checks centralised here
          if (updatedStats.stress > 80) {
            result = { success: false, message: `Too stressed (${updatedStats.stress}/100).` };
            return {} as any;
          }
          if (updatedStats.creditScore < (job.requiredCreditScore || 0)) {
            result = { success: false, message: `Credit score too low (${updatedStats.creditScore}). Need ${job.requiredCreditScore}+` };
            return {} as any;
          }
          const currentHousingTier = updatedStats.currentHousing?.tierLevel || 1;
          if (currentHousingTier < (job.requiredHousingTier || 1)) {
            result = { success: false, message: `Upgrade housing to Tier ${job.requiredHousingTier} first` };
            return {} as any;
          }

          // Success chance
          const roll = Math.random() * 100;
          if (roll > (job.successChance || 50)) {
            result = { success: false, message: 'Application rejected. Better luck next time!' };
            return {} as any;
          }

          // Apply for job (update stats)
          updatedStats.income = job.salary;
          updatedStats.jobMetrics = {
            currentPerformance: updatedStats.jobMetrics?.currentPerformance || 75,
            monthlyPerformanceHistory: [...(updatedStats.jobMetrics?.monthlyPerformanceHistory || [75])],
            currentJobTitle: job.title,
            monthsAtCurrentJob: job.title === (updatedStats.jobMetrics?.currentJobTitle || '') ? (updatedStats.jobMetrics?.monthsAtCurrentJob || 0) : 0,
            promotionEligibility: 0,
            riskOfLayoff: 5,
            lastReviewDate: new Date(),
          } as JobMetrics;

          result = { success: true, message: `Congratulations! You're now a ${job.title}` };
          return { playerStats: updatedStats } as any;
        });
        return result;
      },

      purchaseHousing: (housingId, method = 'cash') => {
        let result = { success: false, message: 'Unknown error' };
        set((state) => {
          const updatedStats = { ...state.playerStats } as IPlayerStats;
          const res = upgradeHousing(updatedStats, housingId);
          if (!res.success) {
            result = res;
            return {} as any;
          }
          result = res;
          return { playerStats: updatedStats } as any;
        });
        return result;
      },

      purchaseVehicle: (vehicleId, method = 'cash') => {
        let result = { success: false, message: 'Unknown error' };
        set((state) => {
          const updatedStats = { ...state.playerStats } as IPlayerStats;
          const vehicle = vehicleCatalog.find(v => v.id === vehicleId);
          if (!vehicle) {
            result = { success: false, message: 'Vehicle not found' };
            return {} as any;
          }

          if (method === 'cash') {
            const downPayment = vehicle.purchasePrice * 0.2;
            if (updatedStats.balanceDebit >= downPayment) {
              updatedStats.balanceDebit -= downPayment;
              updatedStats.currentVehicle = { vehicleId, tierLevel: vehicle.tier, isOwned: true, mileage: 0, purchaseDate: new Date() };
              result = { success: true, message: `Purchased ${vehicle.name}!` };
              return { playerStats: updatedStats } as any;
            }
            result = { success: false, message: 'Insufficient funds' };
            return {} as any;
          } else if (method === 'loan') {
            const downPayment = vehicle.purchasePrice * 0.2;
            if (updatedStats.creditScore < 550) {
              result = { success: false, message: 'Credit score too low for auto loan' };
              return {} as any;
            }
            if (updatedStats.balanceDebit >= downPayment) {
              updatedStats.balanceDebit -= downPayment;
              updatedStats.debt = (updatedStats.debt || 0) + (vehicle.purchasePrice * 0.8);
              updatedStats.currentVehicle = { vehicleId, tierLevel: vehicle.tier, isOwned: true, mileage: 0, purchaseDate: new Date() };
              result = { success: true, message: `Financed ${vehicle.name} with auto loan!` };
              return { playerStats: updatedStats } as any;
            }
            result = { success: false, message: 'Insufficient funds for down payment' };
            return {} as any;
          }
          return {} as any;
        });
        return result;
      },

      nextTurn: () => {
        const { currentDate, gameStartDate, playerStats } = get();
        const date = new Date(currentDate);
        
        // 1. Advance time by 1 week (7 days)
        date.setDate(date.getDate() + 7);
        const newDateStr = date.toISOString();

        // 2. Calculate turn information
        const turn = calculateTurnInfo(date, new Date(gameStartDate));
        
        // 3. Create copy of player stats for mutation with safety checks
        const updatedStats = { 
          ...playerStats,
          // Ensure all required fields exist
          startDate: playerStats.startDate || new Date(),
          currentDate: playerStats.currentDate || new Date(),
          // Ensure nested arrays are always initialized
          gameEvents: playerStats.gameEvents || [],
          loans: playerStats.loans || [],
          investments: playerStats.investments || [],
          npcRelationships: playerStats.npcRelationships || [],
          happinessHistory: playerStats.happinessHistory || [],
          stressHistory: playerStats.stressHistory || [],
          balanceHistory: playerStats.balanceHistory || [],
          scheduledEffects: playerStats.scheduledEffects || [],
          // Ensure jobMetrics exists
          jobMetrics: playerStats.jobMetrics || {
            currentPerformance: 75,
            monthlyPerformanceHistory: [75],
            monthsAtCurrentJob: 0,
            promotionEligibility: 0,
            riskOfLayoff: 10,
            lastReviewDate: new Date(),
            currentJobTitle: 'Software Developer',
          },
        };

        // 4. Execute weekly turn logic
        executeWeeklyTurn(updatedStats);

        // 5. If month-end, execute monthly close
        if (turn.turnType === 'monthly_close') {
          executeMonthlyClose(updatedStats);
        }

        // 6. Generate transactions (legacy system, will be replaced)
        const newTransactions = generateMonthlyTransactions(date, updatedStats);
        
        console.log(`[GameEngine] Advanced to Turn ${turn.turnNumber} (Week ${turn.weekNumber}/${turn.year}). ${turn.turnType}`);

        set((state) => ({
          currentDate: newDateStr,
          currentTurn: turn,
          transactions: [...newTransactions, ...state.transactions],
          playerStats: updatedStats,
        }));
      },

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),

      handleNotificationAction: (notificationId, actionId) => {
        console.log(`Action ${actionId} on notification ${notificationId}`);
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== notificationId)
        }));
      },

      buyInvestmentAction: (catalogItem, shareCount) => {
        let result = { success: false, message: 'Unknown error' };
        set((state) => {
          const updatedStats = { ...state.playerStats } as IPlayerStats;
          const buyResult = require('../engine/gameLogic').buyInvestment(catalogItem, shareCount, updatedStats);
          
          result = {
            success: buyResult.success,
            message: buyResult.message,
          };
          
          if (buyResult.success) {
            return { playerStats: updatedStats };
          }
          return {};
        });
        return result;
      },

      sellInvestmentAction: (investment, shareCount) => {
        let result = { success: false, message: 'Unknown error', proceeds: 0, gainLoss: 0 };
        set((state) => {
          const updatedStats = { ...state.playerStats } as IPlayerStats;
          const sellResult = require('../engine/gameLogic').sellInvestment(investment, shareCount, updatedStats);
          
          result = {
            success: sellResult.success,
            message: sellResult.message,
            proceeds: sellResult.proceeds,
            gainLoss: sellResult.gainLoss,
          };
          
          if (sellResult.success) {
            return { playerStats: updatedStats };
          }
          return {};
        });
        return result;
      },

      resetGame: () => set({
        playerStats: createInitialPlayerStats(),
        currentDate: new Date().toISOString(),
        gameStartDate: new Date().toISOString(),
        currentTurn: null,
        transactions: [],
        notifications: [],
        chats: [
          {
            id: '1',
            sender: 'Karen (Boss)',
            lastMessage: "Here's your pittance. Don't spend it all on avocado toast.",
            date: new Date().toISOString(),
            amount: 3200,
            type: 'incoming',
            unread: true,
          },
          {
            id: '2',
            sender: 'Sam',
            lastMessage: "Great night yesterday! Here's my share.",
            date: new Date().toISOString(),
            amount: 45.50,
            type: 'incoming',
            unread: true,
          },
          {
            id: '3',
            sender: 'Emma',
            lastMessage: "For nails 💅",
            date: new Date().toISOString(),
            amount: 45.50,
            type: 'outgoing',
            unread: false,
          }
        ],
        isGameOver: false,
        gameOverReason: null,
      }),
    }),
    {
      name: 'bankgame-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.playerStats) {
          state.playerStats = fixDatesInPlayerStats(state.playerStats);
        }
      },
    }
  )
);
