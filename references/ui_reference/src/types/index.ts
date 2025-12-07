/**
 * Type definitions for the Finance App
 */

// User types
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

// Card types
export interface BankCard {
  id: string;
  type: 'debit' | 'virtual' | 'credit';
  balance: number;
  lastFourDigits: string;
  cardColor: 'orange' | 'gray' | 'dark';
  isActive?: boolean;
}

// Transaction types
export type TransactionType = 
  | 'money-transfer'
  | 'food'
  | 'entertainment'
  | 'travel'
  | 'shopping'
  | 'utilities'
  | 'other';

export interface Transaction {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  isIncome: boolean;
  date: Date;
  icon?: string;
  iconUrl?: string;
  category: string;
}

// Notification types
export type NotificationCategory = 'all' | 'payments' | 'system' | 'delivery' | 'travel';

export interface Notification {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  isIncome?: boolean;
  date: Date;
  category: NotificationCategory;
  cardInfo?: string;
  balance?: number;
  icon?: string;
  iconUrl?: string;
  isUnread?: boolean;
}

// Expense summary
export interface ExpenseCategory {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface MonthlyExpenses {
  month: string;
  total: number;
  categories: ExpenseCategory[];
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Payments: undefined;
  History: undefined;
  Analytics: undefined;
  Chats: undefined;
};
