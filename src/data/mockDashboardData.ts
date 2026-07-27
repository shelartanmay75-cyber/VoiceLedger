import type {
  MonthlyBudgetSummary,
  QuickStat,
  AIInsight,
  Transaction,
} from '../types/dashboard';

export const mockMonthlyBudget: MonthlyBudgetSummary = {
  totalSpent: 24500.00,
  monthlyBudget: 40000.00,
  remainingBudget: 15500.00,
  percentageUsed: 61.25,
};

export const mockQuickStats: QuickStat[] = [
  {
    id: 'stat-1',
    title: "Today's Spending",
    value: '₹425.00',
    change: '+12% vs daily avg',
    isPositive: false,
    iconName: 'CreditCard',
  },
  {
    id: 'stat-2',
    title: 'Weekly Spending',
    value: '₹5,800.00',
    change: '-8% vs last week',
    isPositive: true,
    iconName: 'TrendingDown',
  },
  {
    id: 'stat-3',
    title: 'Total Transactions',
    value: '34 items',
    change: '+5 this week',
    isPositive: true,
    iconName: 'Receipt',
  },
  {
    id: 'stat-4',
    title: 'Savings Goal',
    value: '₹12,000 / ₹20,000',
    change: '60% completed',
    isPositive: true,
    iconName: 'Target',
  },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-1',
    title: 'Food & Dining Alert',
    description: 'You spent 18% more on coffee & dining out this week compared to your average.',
    type: 'warning',
    category: 'Food & Dining',
  },
  {
    id: 'insight-2',
    title: 'Subscription Savings',
    description: 'Great job! Your recurring subscriptions are 15% lower than last month.',
    type: 'success',
    category: 'Bills & Subscriptions',
  },
  {
    id: 'insight-3',
    title: 'Smart Pattern Detected',
    description: 'Recurring fuel expense of approx ₹1,850 detected every Tuesday morning.',
    type: 'info',
    category: 'Transportation',
  },
];

export const mockRecentTransactions: Transaction[] = [
  {
    id: 'tx-1',
    merchant: 'Starbucks Coffee',
    category: 'Food & Beverage',
    categoryBadgeColor: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30',
    amount: 350.00,
    date: 'Today, 08:30 AM',
    iconName: 'Coffee',
  },
  {
    id: 'tx-2',
    merchant: 'Shell Gas Station',
    category: 'Transportation',
    categoryBadgeColor: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
    amount: 1850.00,
    date: 'Yesterday, 05:15 PM',
    iconName: 'Fuel',
  },
  {
    id: 'tx-3',
    merchant: 'Apple Music & Cloud',
    category: 'Bills & Subscriptions',
    categoryBadgeColor: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30',
    amount: 149.00,
    date: 'Jul 24, 2026',
    iconName: 'Tv',
  },
  {
    id: 'tx-4',
    merchant: 'Reliance Fresh',
    category: 'Groceries',
    categoryBadgeColor: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
    amount: 2450.00,
    date: 'Jul 22, 2026',
    iconName: 'ShoppingCart',
  },
  {
    id: 'tx-5',
    merchant: 'Uber Ride',
    category: 'Transportation',
    categoryBadgeColor: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
    amount: 320.00,
    date: 'Jul 20, 2026',
    iconName: 'Car',
  },
];
