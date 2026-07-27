export interface AnalyticsSummary {
  monthlyData: { month: string; amount: number; budget: number }[];
  weeklyData: { day: string; amount: number }[];
  categoryDistribution: { category: string; amount: number; percentage: number; color: string }[];
  topMerchants: { name: string; category: string; amount: number; transactions: number; iconName: string }[];
  trends: { title: string; subtitle: string; value: string; change: string; isPositive: boolean }[];
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  iconName: string;
  color: string;
}

export interface MonthlyCategoryBudget {
  id: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  iconName: string;
}

export interface TripExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  paidBy: string;
  date: string;
}

export interface Trip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalSpent: number;
  status: 'active' | 'upcoming' | 'completed';
  travelersCount: number;
  coverGradient: string;
  expensesList: TripExpense[];
}

export interface SharedFriend {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  balance: number; // positive = owes you, negative = you owe
  statusText: string;
}

export interface SharedSettlement {
  id: string;
  friendName: string;
  amount: number;
  type: 'received' | 'paid';
  date: string;
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  billingFrequency: 'Monthly' | 'Yearly';
  cost: number;
  nextRenewalDate: string;
  status: 'active' | 'trial' | 'cancelling';
  logoColor: string;
  iconName: string;
}
