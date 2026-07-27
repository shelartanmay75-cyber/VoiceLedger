export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  date: string;
  isoDate: string;
  notes?: string;
  iconName: string;
  categoryColor: string;
}

export type DateFilterOption = 'all' | 'today' | 'week' | 'month';
export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';
export type ViewMode = 'table' | 'timeline';
