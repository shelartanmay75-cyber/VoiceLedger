export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  categoryBadgeColor: string;
  amount: number;
  date: string;
  iconName: string;
}

export interface QuickStat {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info';
  category: string;
}

export interface MonthlyBudgetSummary {
  totalSpent: number;
  monthlyBudget: number;
  remainingBudget: number;
  percentageUsed: number;
}
