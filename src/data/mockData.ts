/**
 * Mock data for the Finance App
 */

import { BankCard, Transaction, Notification, MonthlyExpenses, User } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Charlotte',
  avatar: undefined,
};

export const bankCards: BankCard[] = [
  {
    id: '1',
    type: 'debit',
    balance: 4098.12,
    lastFourDigits: '4385',
    cardColor: 'orange',
    isActive: true,
  },
  {
    id: '2',
    type: 'virtual',
    balance: 14.71,
    lastFourDigits: '9081',
    cardColor: 'gray',
    isActive: false,
  },
];

// Create dynamic dates for "Today" and "Yesterday"
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const recentTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Matthew Billson',
    type: 'money-transfer',
    amount: 56.19,
    isIncome: false,
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 8),
    category: 'Money Transfer',
  },
  {
    id: '2',
    title: 'Starbucks',
    type: 'food',
    amount: 122.47,
    isIncome: false,
    date: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 19, 21),
    category: 'Food',
    iconUrl: 'starbucks',
  },
  {
    id: '3',
    title: 'Netflix',
    type: 'entertainment',
    amount: 13.17,
    isIncome: false,
    date: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 8, 53),
    category: 'Entertainment',
    iconUrl: 'netflix',
  },
];

export const monthlyExpenses: MonthlyExpenses = {
  month: 'June',
  total: 5091,
  categories: [
    { category: 'Food', amount: 1800, color: '#FF6B00', percentage: 35 },
    { category: 'Transport', amount: 1200, color: '#FF8534', percentage: 24 },
    { category: 'Entertainment', amount: 900, color: '#34C759', percentage: 18 },
    { category: 'Shopping', amount: 700, color: '#0A84FF', percentage: 14 },
    { category: 'Other', amount: 491, color: '#8E8E93', percentage: 9 },
  ],
};

// Dynamic notification dates
const notifToday = new Date(today);
const notifYesterday = new Date(yesterday);
const olderDate = new Date(today);
olderDate.setMonth(olderDate.getMonth() - 9);

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Received from Anna',
    amount: 110,
    isIncome: true,
    date: new Date(notifToday.getFullYear(), notifToday.getMonth(), notifToday.getDate(), 17, 49),
    category: 'payments',
    cardInfo: 'Debit •• 4385',
    balance: 4098.12,
    isUnread: true,
  },
  {
    id: '2',
    title: 'See our limited offer!',
    description: 'Would you like to visit new countries? Maybe it\'s your time!',
    date: new Date(notifYesterday.getFullYear(), notifYesterday.getMonth(), notifYesterday.getDate(), 23, 8),
    category: 'travel',
    icon: 'globe',
    isUnread: false,
  },
  {
    id: '3',
    title: 'Sent to •• 2041',
    amount: 14.62,
    isIncome: false,
    date: new Date(notifYesterday.getFullYear(), notifYesterday.getMonth(), notifYesterday.getDate(), 6, 18),
    category: 'payments',
    cardInfo: 'Debit •• 4385',
    balance: 3987.5,
    isUnread: false,
  },
  {
    id: '4',
    title: 'New login into account',
    description: 'You have logged in from a new location:\niOS 26.0.1 · 109.255.84.7 · Spain',
    date: new Date(olderDate.getFullYear(), olderDate.getMonth(), 24, 15, 44),
    category: 'system',
    icon: 'shield',
    isUnread: false,
  },
];

export const navigationCategories = ['Travel', 'Delivery', 'Bonuses', 'Support'] as const;

export const notificationFilters: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'payments', label: 'Payments' },
  { key: 'system', label: 'System' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'travel', label: 'Travel' },
];
