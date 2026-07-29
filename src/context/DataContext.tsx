import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { expenseService } from '../services/expenseService';
import { goalsService } from '../services/goalsService';
import { subscriptionService } from '../services/subscriptionService';
import { tripService } from '../services/tripService';
import { sharedService } from '../services/sharedService';
import { profileService } from '../services/profileService';
import type { Expense } from '../types/expense';
import type { SavingsGoal, Subscription, Trip, SharedFriend, SharedSettlement } from '../types/featurePages';
import type { UserProfile } from '../types/backend';
import { mockExpensesList } from '../data/mockExpensesData';
import { mockSavingsGoals, mockSubscriptions, mockTrips, mockSharedFriends, mockSettlements } from '../data/mockFeatureData';

export interface DataContextType {
  expenses: Expense[];
  goals: SavingsGoal[];
  subscriptions: Subscription[];
  trips: Trip[];
  friends: SharedFriend[];
  settlements: SharedSettlement[];
  profile: UserProfile;
  isLoading: boolean;
  
  // Expenses actions
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Goals actions
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
  updateGoal: (id: string, goalData: Partial<SavingsGoal>) => Promise<void>;
  depositToGoal: (goalId: string, amount: number, currentAmount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Subscriptions actions
  addSubscription: (sub: Omit<Subscription, 'id'>) => Promise<void>;
  toggleSubscriptionStatus: (subId: string, currentStatus: string) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;

  // Trips actions
  addTrip: (trip: Omit<Trip, 'id' | 'totalSpent' | 'expensesList'>) => Promise<void>;
  addTripExpense: (tripId: string, expense: { description: string; amount: number; category: string; paidBy: string; date: string }) => Promise<void>;

  // Shared Expenses actions
  addFriend: (friend: { name: string; email: string }) => Promise<void>;
  recordSettlement: (friendName: string, amount: number, type: 'received' | 'paid') => Promise<void>;

  // Profile actions
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;

  // Manual refresh
  refreshData: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  uid: 'demo_user',
  displayName: 'User',
  email: '',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  monthlyBudget: 0,
  currency: '₹',
  theme: 'dark',
  hasConfiguredBudget: false,
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const userId = user?.uid;

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (userId && userId !== 'guest_user_demo') {
      const cached = localStorage.getItem(`voiceledger_expenses_${userId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        } catch (_) {}
      }
      return [];
    }
    return isGuest ? mockExpensesList : [];
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => (isGuest ? mockSavingsGoals : []));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => (isGuest ? mockSubscriptions : []));
  const [trips, setTrips] = useState<Trip[]>(() => (isGuest ? mockTrips : []));
  const [friends, setFriends] = useState<SharedFriend[]>(() => (isGuest ? mockSharedFriends : []));
  const [settlements, setSettlements] = useState<SharedSettlement[]>(() => (isGuest ? mockSettlements : []));

  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedUid = user?.uid;
    const savedBudget = savedUid ? localStorage.getItem(`voiceledger_budget_${savedUid}`) : null;
    const isConfigured = savedUid ? localStorage.getItem(`voiceledger_configured_${savedUid}`) === 'true' : false;
    return {
      ...defaultProfile,
      monthlyBudget: savedBudget ? parseFloat(savedBudget) : 0,
      hasConfiguredBudget: isConfigured,
    };
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedExpenses, fetchedGoals, fetchedSubs, fetchedTrips, fetchedShared, fetchedProfile] = await Promise.all([
        expenseService.fetchExpenses(userId),
        goalsService.fetchGoals(userId),
        subscriptionService.fetchSubscriptions(userId),
        tripService.fetchTrips(userId),
        sharedService.fetchSharedData(userId),
        profileService.fetchProfile(userId),
      ]);

      if (userId && userId !== 'guest_user_demo') {
        // Authenticated Google user: Clean slate initialization so user records expenses from beginning
        setExpenses(fetchedExpenses || []);
        setGoals(fetchedGoals || []);
        setSubscriptions(fetchedSubs || []);
        setTrips(fetchedTrips || []);
        setFriends(fetchedShared.friends || []);
        setSettlements(fetchedShared.settlements || []);

        const savedBudget = userId ? localStorage.getItem(`voiceledger_budget_${userId}`) : null;
        const isConfigured = userId ? localStorage.getItem(`voiceledger_configured_${userId}`) === 'true' : false;

        setProfile((prev) => ({
          ...prev,
          uid: userId,
          displayName: user?.displayName || fetchedProfile?.displayName || prev.displayName,
          email: user?.email || fetchedProfile?.email || prev.email,
          photoURL: user?.photoURL || fetchedProfile?.photoURL || prev.photoURL,
          monthlyBudget: savedBudget ? parseFloat(savedBudget) : (fetchedProfile?.monthlyBudget || 0),
          hasConfiguredBudget: isConfigured || Boolean(fetchedProfile?.hasConfiguredBudget),
        }));
      } else {
        // Guest Demo mode: Fallback to mock data preview
        if (fetchedExpenses.length > 0) setExpenses(fetchedExpenses);
        if (fetchedGoals.length > 0) setGoals(fetchedGoals);
        if (fetchedSubs.length > 0) setSubscriptions(fetchedSubs);
        if (fetchedTrips.length > 0) setTrips(fetchedTrips);
        if (fetchedShared.friends.length > 0) setFriends(fetchedShared.friends);
        if (fetchedShared.settlements.length > 0) setSettlements(fetchedShared.settlements);
        if (fetchedProfile) setProfile((prev) => ({ ...prev, ...fetchedProfile }));
      }
    } catch (err) {
      console.warn('Error loading backend data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Expenses CRUD
  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    const created = await expenseService.addExpense(expenseData, userId);
    setExpenses((prev) => [created, ...prev]);
  };

  const deleteExpense = async (id: string) => {
    await expenseService.deleteExpense(id, userId);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Savings Goals CRUD
  const addGoal = async (goalData: Omit<SavingsGoal, 'id'>) => {
    const created = await goalsService.addGoal(goalData, userId);
    setGoals((prev) => [created, ...prev]);
  };

  const updateGoal = async (id: string, goalData: Partial<SavingsGoal>) => {
    await goalsService.updateGoal(id, goalData, userId);
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...goalData } : g))
    );
  };

  const depositToGoal = async (goalId: string, amount: number, currentAmount: number) => {
    const targetGoal = goals.find((g) => g.id === goalId);
    const goalTitleStr = targetGoal ? targetGoal.title : 'Savings Target';

    // 1. Update Goal saved amount
    const newAmount = await goalsService.depositToGoal(goalId, amount, currentAmount, userId);
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: newAmount } : g))
    );

    // 2. Automatically record Goal Deposit as an expense so it deducts from remaining monthly budget!
    await addExpense({
      title: `Goal Deposit: ${goalTitleStr}`,
      amount: amount,
      category: 'Investments & Savings',
      date: 'Today',
      isoDate: new Date().toISOString(),
      paymentMethod: 'UPI',
      notes: `Goal deposit added to ${goalTitleStr}`,
      iconName: 'Target',
      categoryColor: '#8B5CF6',
    });
  };

  const deleteGoal = async (id: string) => {
    await goalsService.deleteGoal(id, userId);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Subscriptions CRUD
  const addSubscription = async (subData: Omit<Subscription, 'id'>) => {
    const created = await subscriptionService.addSubscription(subData, userId);
    setSubscriptions((prev) => [created, ...prev]);
  };

  const toggleSubscriptionStatus = async (subId: string, currentStatus: string) => {
    const updatedStatus = await subscriptionService.toggleSubscriptionStatus(subId, currentStatus, userId);
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: updatedStatus as Subscription['status'] } : s))
    );
  };

  const deleteSubscription = async (id: string) => {
    await subscriptionService.deleteSubscription(id, userId);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  // Trips CRUD
  const addTrip = async (tripData: Omit<Trip, 'id' | 'totalSpent' | 'expensesList'>) => {
    const created = await tripService.addTrip(tripData, userId);
    setTrips((prev) => [created, ...prev]);
  };

  const addTripExpense = async (
    tripId: string,
    expenseData: { description: string; amount: number; category: string; paidBy: string; date: string }
  ) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;
    const updatedTrip = await tripService.addTripExpense(tripId, expenseData, targetTrip, userId);
    setTrips((prev) => prev.map((t) => (t.id === tripId ? updatedTrip : t)));
  };

  // Shared Expenses
  const addFriend = async (friendData: { name: string; email: string }) => {
    const created = await sharedService.addFriend(friendData, userId);
    setFriends((prev) => [created, ...prev]);
  };

  const recordSettlement = async (friendName: string, amount: number, type: 'received' | 'paid') => {
    const { settlement } = await sharedService.recordSettlement(friendName, amount, type, userId);
    setSettlements((prev) => [settlement, ...prev]);
    
    // Update local friend balance
    setFriends((prev) =>
      prev.map((f) => {
        if (f.name.toLowerCase() === friendName.toLowerCase()) {
          let newBalance = f.balance;
          if (type === 'received') newBalance -= amount;
          else newBalance += amount;
          let statusText = 'Settled Up';
          if (newBalance > 0) statusText = `Owes you ₹${newBalance.toLocaleString('en-IN')}`;
          if (newBalance < 0) statusText = `You owe ₹${Math.abs(newBalance).toLocaleString('en-IN')}`;
          return { ...f, balance: newBalance, statusText };
        }
        return f;
      })
    );
  };

  // Profile update with zero-latency optimistic state response
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    // 1. Instantly update React state (0ms UI latency!)
    setProfile((prev) => ({ ...prev, ...profileData }));

    // 2. Instantly update local storage
    if (userId) {
      if (profileData.monthlyBudget !== undefined) {
        localStorage.setItem(`voiceledger_budget_${userId}`, String(profileData.monthlyBudget));
      }
      if (profileData.hasConfiguredBudget !== undefined) {
        localStorage.setItem(`voiceledger_configured_${userId}`, String(profileData.hasConfiguredBudget));
      }
    }

    // 3. Sync backend in background asynchronously without blocking UI
    profileService.updateProfile(profileData, userId).catch((err) => {
      console.warn('Background profile sync error:', err);
    });
  };

  return (
    <DataContext.Provider
      value={{
        expenses,
        goals,
        subscriptions,
        trips,
        friends,
        settlements,
        profile,
        isLoading,
        addExpense,
        deleteExpense,
        addGoal,
        updateGoal,
        depositToGoal,
        deleteGoal,
        addSubscription,
        toggleSubscriptionStatus,
        deleteSubscription,
        addTrip,
        addTripExpense,
        addFriend,
        recordSettlement,
        updateProfile,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
