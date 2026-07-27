import type {
  AnalyticsSummary,
  SavingsGoal,
  MonthlyCategoryBudget,
  Trip,
  SharedFriend,
  SharedSettlement,
  Subscription,
} from '../types/featurePages';

export const mockAnalyticsData: AnalyticsSummary = {
  monthlyData: [
    { month: 'Feb', amount: 18500, budget: 35000 },
    { month: 'Mar', amount: 22400, budget: 35000 },
    { month: 'Apr', amount: 19800, budget: 35000 },
    { month: 'May', amount: 31200, budget: 40000 },
    { month: 'Jun', amount: 28900, budget: 40000 },
    { month: 'Jul', amount: 24500, budget: 40000 },
  ],
  weeklyData: [
    { day: 'Mon', amount: 1450 },
    { day: 'Tue', amount: 3200 },
    { day: 'Wed', amount: 890 },
    { day: 'Thu', amount: 2100 },
    { day: 'Fri', amount: 4500 },
    { day: 'Sat', amount: 6200 },
    { day: 'Sun', amount: 1850 },
  ],
  categoryDistribution: [
    { category: 'Groceries', amount: 8450, percentage: 34.5, color: '#22C55E' },
    { category: 'Food & Dining', amount: 5600, percentage: 22.8, color: '#F97316' },
    { category: 'Fuel & Transit', amount: 4170, percentage: 17.0, color: '#3B82F6' },
    { category: 'Subscriptions', amount: 3149, percentage: 12.8, color: '#8B5CF6' },
    { category: 'Shopping', amount: 3131, percentage: 12.9, color: '#EC4899' },
  ],
  topMerchants: [
    { name: 'Reliance Fresh', category: 'Groceries', amount: 8450, transactions: 6, iconName: 'ShoppingCart' },
    { name: 'Shell Petrol Station', category: 'Fuel', amount: 4170, transactions: 4, iconName: 'Fuel' },
    { name: 'Starbucks Coffee', category: 'Food & Dining', amount: 2800, transactions: 8, iconName: 'Coffee' },
    { name: 'Zara Outfit Store', category: 'Shopping', amount: 3999, transactions: 1, iconName: 'ShoppingBag' },
    { name: 'Swiggy Gourmet', category: 'Food & Dining', amount: 2800, transactions: 5, iconName: 'Utensils' },
  ],
  trends: [
    { title: 'Average Daily Spend', subtitle: 'Based on 30 days', value: '₹816 / day', change: '-12% vs last month', isPositive: true },
    { title: 'Highest Spend Category', subtitle: 'Groceries', value: '₹8,450', change: '+5% vs last month', isPositive: false },
    { title: 'Savings Rate', subtitle: 'Monthly income saved', value: '38.75%', change: '+4.2% increase', isPositive: true },
  ],
};

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Safety Fund',
    targetAmount: 100000,
    currentAmount: 75000,
    targetDate: 'Dec 2026',
    category: 'Safety',
    iconName: 'ShieldCheck',
    color: 'from-[#3B82F6] to-[#1D4ED8]',
  },
  {
    id: 'goal-2',
    title: 'Goa Beach Vacation',
    targetAmount: 35000,
    currentAmount: 24500,
    targetDate: 'Nov 2026',
    category: 'Travel',
    iconName: 'Plane',
    color: 'from-[#F59E0B] to-[#D97706]',
  },
  {
    id: 'goal-3',
    title: 'MacBook Pro M3 Fund',
    targetAmount: 160000,
    currentAmount: 96000,
    targetDate: 'Jan 2027',
    category: 'Electronics',
    iconName: 'Laptop',
    color: 'from-[#8B5CF6] to-[#6D28D9]',
  },
];

export const mockCategoryBudgets: MonthlyCategoryBudget[] = [
  { id: 'b-1', category: 'Groceries', allocatedAmount: 10000, spentAmount: 8450, iconName: 'ShoppingCart' },
  { id: 'b-2', category: 'Food & Dining', allocatedAmount: 7000, spentAmount: 5600, iconName: 'Coffee' },
  { id: 'b-3', category: 'Fuel & Transit', allocatedAmount: 5000, spentAmount: 4170, iconName: 'Fuel' },
  { id: 'b-4', category: 'Bills & Subscriptions', allocatedAmount: 4000, spentAmount: 3149, iconName: 'Tv' },
];

export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    title: 'Goa Beach Getaway',
    location: 'Goa, India',
    startDate: '15 Nov 2026',
    endDate: '20 Nov 2026',
    totalBudget: 35000,
    totalSpent: 21400,
    status: 'active',
    travelersCount: 4,
    coverGradient: 'from-[#06B6D4] to-[#3B82F6]',
    expensesList: [
      { id: 'te-1', description: 'Resort Beach Stay Deposit', amount: 12000, category: 'Accommodation', paidBy: 'You', date: '15 Nov' },
      { id: 'te-2', description: 'Scooter Rental & Petrol', amount: 3400, category: 'Transport', paidBy: 'Rahul', date: '16 Nov' },
      { id: 'te-3', description: 'Shack Dinner & Seafood', amount: 6000, category: 'Food', paidBy: 'You', date: '17 Nov' },
    ],
  },
  {
    id: 'trip-2',
    title: 'Manali Snow Mountain Trek',
    location: 'Himachal Pradesh',
    startDate: '10 Dec 2026',
    endDate: '18 Dec 2026',
    totalBudget: 45000,
    totalSpent: 8500,
    status: 'upcoming',
    travelersCount: 3,
    coverGradient: 'from-[#3B82F6] to-[#1E3A8A]',
    expensesList: [
      { id: 'te-4', description: 'Trekking Gear Booking', amount: 8500, category: 'Equipment', paidBy: 'You', date: '01 Jul' },
    ],
  },
];

export const mockSharedFriends: SharedFriend[] = [
  { id: 'f-1', name: 'Rahul Sharma', email: 'rahul.s@gmail.com', balance: 1450, statusText: 'Owes you ₹1,450' },
  { id: 'f-2', name: 'Priya Patel', email: 'priya.p@gmail.com', balance: -650, statusText: 'You owe ₹650' },
  { id: 'f-3', name: 'Amit Kumar', email: 'amit.k@gmail.com', balance: 890, statusText: 'Owes you ₹890' },
  { id: 'f-4', name: 'Sneha Verma', email: 'sneha.v@gmail.com', balance: 0, statusText: 'Settled Up' },
];

export const mockSettlements: SharedSettlement[] = [
  { id: 's-1', friendName: 'Sneha Verma', amount: 1200, type: 'received', date: 'Yesterday' },
  { id: 's-2', friendName: 'Priya Patel', amount: 500, type: 'paid', date: '22 Jul 2026' },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Netflix Premium 4K',
    category: 'Entertainment',
    billingFrequency: 'Monthly',
    cost: 649,
    nextRenewalDate: '05 Aug 2026',
    status: 'active',
    logoColor: 'bg-[#E50914]',
    iconName: 'Tv',
  },
  {
    id: 'sub-2',
    name: 'Spotify Premium Family',
    category: 'Music & Audio',
    billingFrequency: 'Monthly',
    cost: 179,
    nextRenewalDate: '12 Aug 2026',
    status: 'active',
    logoColor: 'bg-[#1DB954]',
    iconName: 'Music',
  },
  {
    id: 'sub-3',
    name: 'ChatGPT Plus AI',
    category: 'Productivity',
    billingFrequency: 'Monthly',
    cost: 1650,
    nextRenewalDate: '18 Aug 2026',
    status: 'active',
    logoColor: 'bg-[#10A37F]',
    iconName: 'Sparkles',
  },
  {
    id: 'sub-4',
    name: 'Amazon Prime India',
    category: 'Shopping & Video',
    billingFrequency: 'Yearly',
    cost: 1499,
    nextRenewalDate: '15 Dec 2026',
    status: 'active',
    logoColor: 'bg-[#FF9900]',
    iconName: 'ShoppingBag',
  },
  {
    id: 'sub-5',
    name: 'Apple iCloud+ 200GB',
    category: 'Cloud Storage',
    billingFrequency: 'Monthly',
    cost: 219,
    nextRenewalDate: '24 Aug 2026',
    status: 'active',
    logoColor: 'bg-[#3B82F6]',
    iconName: 'Cloud',
  },
];
