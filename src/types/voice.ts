export type RecordingState =
  | 'Idle'
  | 'Listening'
  | 'Processing'
  | 'Completed'
  | 'Error'
  | 'Permission Denied'
  | 'Network Error'
  | 'Browser Unsupported';

export interface ExtractedExpense {
  title: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  paymentMethod: string;
  notes: string;
}

export const EXPENSE_CATEGORIES: string[] = [
  'Food & Beverages',
  'Transportation',
  'Shopping',
  'Housing & Rent',
  'Utilities',
  'Healthcare',
  'Education',
  'Entertainment',
  'Travel',
  'Work & Business',
  'Fitness & Sports',
  'Bills & Subscriptions',
  'Gifts & Donations',
  'Pets',
  'Family & Kids',
  'Personal Care',
  'Investments & Savings',
  'Taxes & Fees',
  'Miscellaneous',
  'Income / Refund',
];
