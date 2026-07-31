import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
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
import { toISODateString, formatDateToStandard } from '../utils/dateUtils';

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
  updateTrip: (id: string, tripData: Partial<Trip>) => Promise<void>;
  depositToTrip: (tripId: string, amount: number) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addTripExpense: (tripId: string, expense: { description: string; amount: number; category: string; paidBy: string; date: string }) => Promise<void>;

  // Shared Expenses actions
  addFriend: (friend: { name: string; email?: string; balance?: number; statusText?: string }) => Promise<void>;
  recordSettlement: (friendName: string, amount: number, type: 'received' | 'paid') => Promise<void>;

  // Profile actions
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  resetAllLedgerData: () => Promise<void>;

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
    const targetUid = userId || 'guest';
    const key = `voiceledger_expenses_${targetUid}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return isGuest ? mockExpensesList : [];
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const targetUid = userId || 'guest';
    const key = `voiceledger_goals_${targetUid}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return isGuest ? mockSavingsGoals : [];
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const targetUid = userId || 'guest';
    const key = `voiceledger_subs_${targetUid}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return isGuest ? mockSubscriptions : [];
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const targetUid = userId || 'guest';
    const key = `voiceledger_trips_${targetUid}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return isGuest ? mockTrips : [];
  });

  const [friends, setFriends] = useState<SharedFriend[]>(() => {
    const targetUid = userId || 'guest';
    const key = `voiceledger_friends_${targetUid}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return isGuest ? mockSharedFriends : [];
  });

  const [settlements, setSettlements] = useState<SharedSettlement[]>(() => {
    const targetUid = userId || 'guest';
    const key = `voiceledger_settlements_${targetUid}`;
    try {
      const cached = localStorage.getItem(key);
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return isGuest ? mockSettlements : [];
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedUid = userId;
    const savedBudget = savedUid ? localStorage.getItem(`voiceledger_budget_${savedUid}`) : (isGuest ? localStorage.getItem('voiceledger_guest_monthly_budget') : null);
    const isConfigured = savedUid ? localStorage.getItem(`voiceledger_configured_${savedUid}`) === 'true' : (isGuest ? localStorage.getItem('voiceledger_configured_guest_user_demo') === 'true' : false);
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

      const targetUid = userId || 'guest';
      const readCacheOrFallback = (key: string, fetchedData: any, mockFallback: any) => {
        const cached = localStorage.getItem(key);
        if (cached !== null) {
          try { return JSON.parse(cached); } catch (_) {}
        }
        if (fetchedData && Array.isArray(fetchedData)) return fetchedData;
        return isGuest ? mockFallback : [];
      };

      setExpenses(readCacheOrFallback(`voiceledger_expenses_${targetUid}`, fetchedExpenses, mockExpensesList));
      setGoals(readCacheOrFallback(`voiceledger_goals_${targetUid}`, fetchedGoals, mockSavingsGoals));
      setSubscriptions(readCacheOrFallback(`voiceledger_subs_${targetUid}`, fetchedSubs, mockSubscriptions));
      setTrips(readCacheOrFallback(`voiceledger_trips_${targetUid}`, fetchedTrips, mockTrips));
      setFriends(readCacheOrFallback(`voiceledger_friends_${targetUid}`, fetchedShared?.friends, mockSharedFriends));
      setSettlements(readCacheOrFallback(`voiceledger_settlements_${targetUid}`, fetchedShared?.settlements, mockSettlements));

      const savedBudget = localStorage.getItem(`voiceledger_budget_${targetUid}`) || (isGuest ? localStorage.getItem('voiceledger_guest_monthly_budget') : null);
      const isConfigured = localStorage.getItem(`voiceledger_configured_${targetUid}`) === 'true' || (isGuest ? localStorage.getItem('voiceledger_configured_guest_user_demo') === 'true' : false);

      setProfile((prev) => ({
        ...prev,
        uid: userId || prev.uid,
        displayName: user?.displayName || fetchedProfile?.displayName || prev.displayName,
        email: user?.email || fetchedProfile?.email || prev.email,
        photoURL: user?.photoURL || fetchedProfile?.photoURL || prev.photoURL,
        monthlyBudget: savedBudget ? parseFloat(savedBudget) : (fetchedProfile?.monthlyBudget || 0),
        hasConfiguredBudget: isConfigured || Boolean(fetchedProfile?.hasConfiguredBudget),
      }));
    } catch (err) {
      console.warn('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, user, isGuest]);

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
      date: formatDateToStandard(new Date().toISOString()),
      isoDate: toISODateString('today'),
      paymentMethod: 'UPI',
      notes: `Goal deposit added to ${goalTitleStr}`,
      iconName: 'Target',
      categoryColor: '#8B5CF6',
    });
  };

  const deleteGoal = async (id: string) => {
    const targetGoal = goals.find((g) => g.id === id);
    const goalTitleStr = targetGoal ? targetGoal.title.toLowerCase() : '';

    // 1. Delete Goal from goals service & state
    await goalsService.deleteGoal(id, userId);
    setGoals((prev) => prev.filter((g) => g.id !== id));

    // 2. Cascade delete all associated Goal Deposit expenses for this goal to restore monthly budget!
    if (goalTitleStr) {
      const expensesToDelete = expenses.filter((e) => {
        const titleLower = (e.title || '').toLowerCase();
        const notesLower = (e.notes || '').toLowerCase();
        return (
          titleLower === `goal deposit: ${goalTitleStr}` ||
          titleLower.includes(`goal deposit: ${goalTitleStr}`) ||
          notesLower.includes(`goal deposit added to ${goalTitleStr}`) ||
          notesLower.includes(`to savings goal ${goalTitleStr}`)
        );
      });

      for (const exp of expensesToDelete) {
        await deleteExpense(exp.id);
      }
    }
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

  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    await tripService.updateTrip(id, tripData, userId);
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...tripData } : t))
    );
  };

  const depositToTrip = async (tripId: string, amount: number) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    const currentSaved = targetTrip.savedAmount || 0;
    const newSavedAmount = await tripService.depositToTrip(tripId, amount, currentSaved, userId);

    // 1. Update trip saved amount in local React state
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, savedAmount: newSavedAmount } : t))
    );

    // 2. Automatically record Trip Savings Deposit as an expense so it deducts from remaining monthly budget!
    await addExpense({
      title: `Trip Savings Deposit: ${targetTrip.title}`,
      amount: amount,
      category: 'Travel & Vacation',
      date: formatDateToStandard(new Date().toISOString()),
      isoDate: toISODateString('today'),
      paymentMethod: 'UPI',
      notes: `Allocated trip savings deposit for ${targetTrip.title}`,
      iconName: 'Plane',
      categoryColor: '#3B82F6',
    });
  };

  const deleteTrip = async (id: string) => {
    const targetTrip = trips.find((t) => t.id === id);
    const tripTitleStr = targetTrip ? targetTrip.title.toLowerCase() : '';

    // 1. Delete trip from trip service & state
    await tripService.deleteTrip(id, userId);
    setTrips((prev) => prev.filter((t) => t.id !== id));

    // 2. Delete deposit expenses associated with this trip to restore monthly budget balance
    if (tripTitleStr) {
      const expensesToDelete = expenses.filter((e) => {
        const titleLower = (e.title || '').toLowerCase();
        const notesLower = (e.notes || '').toLowerCase();
        return (
          titleLower.includes(`trip savings deposit: ${tripTitleStr}`) ||
          notesLower.includes(`for ${tripTitleStr}`)
        );
      });

      for (const exp of expensesToDelete) {
        await deleteExpense(exp.id);
      }
    }
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
  const addFriend = async (friendData: { name: string; email?: string; balance?: number; statusText?: string }) => {
    const created = await sharedService.addFriend(friendData, userId);
    setFriends((prev) => [created, ...prev]);

    // If 'You are owed' (balance > 0), money was lent out so record it as an expense to deduct from remaining budget!
    if (friendData.balance && friendData.balance > 0) {
      const lentAmount = friendData.balance;
      await addExpense({
        title: `Shared Expense Lent to ${friendData.name}`,
        amount: lentAmount,
        category: 'Shared Expenses',
        paymentMethod: 'UPI',
        date: formatDateToStandard(new Date().toISOString()),
        isoDate: toISODateString('today'),
        notes: `Lent money to ${friendData.name}`,
        iconName: 'UserCheck',
        categoryColor: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
      });
    }
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

    // 1. If type === 'paid' (You paid your debt to friend): deduct from remaining budget by logging expense
    if (type === 'paid') {
      await addExpense({
        title: `Settlement Paid to ${friendName}`,
        amount: amount,
        category: 'Shared Expenses',
        paymentMethod: 'UPI',
        date: formatDateToStandard(new Date().toISOString()),
        isoDate: toISODateString('today'),
        notes: `Paid shared expense settlement to ${friendName}`,
        iconName: 'UserCheck',
        categoryColor: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
      });
    }

    // 2. If type === 'received' (Friend repaid money owed to you):
    // Remove lent expense to reduce total spent and reflect money back in remaining budget (without affecting monthly budget target)!
    if (type === 'received') {
      const targetNameLower = friendName.toLowerCase();
      const lentExpenses = expenses.filter((e) => {
        const titleLower = (e.title || '').toLowerCase();
        const notesLower = (e.notes || '').toLowerCase();
        return (
          titleLower.includes(`lent to ${targetNameLower}`) ||
          notesLower.includes(`lent money to ${targetNameLower}`) ||
          titleLower.includes(`shared expense lent to ${targetNameLower}`)
        );
      });

      let remainingToRemove = amount;
      for (const exp of lentExpenses) {
        if (remainingToRemove <= 0) break;
        await deleteExpense(exp.id);
        remainingToRemove -= exp.amount;
      }

      // If no matching lent expense was found, log a negative expense adjustment so total spent decreases & remaining budget increases!
      if (remainingToRemove > 0 && lentExpenses.length === 0) {
        await addExpense({
          title: `Settlement Repaid by ${friendName}`,
          amount: -remainingToRemove,
          category: 'Shared Expenses',
          paymentMethod: 'UPI',
          date: formatDateToStandard(new Date().toISOString()),
          isoDate: toISODateString('today'),
          notes: `Repayment received from ${friendName}`,
          iconName: 'UserCheck',
          categoryColor: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
        });
      }
    }
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

  // Reset all user data completely and prepare for new setup
  const resetAllLedgerData = async () => {
    // 1. Instantly clear React state
    setExpenses([]);
    setGoals([]);
    setSubscriptions([]);
    setTrips([]);
    setFriends([]);
    setSettlements([]);
    setProfile((prev) => ({
      ...prev,
      monthlyBudget: 0,
      hasConfiguredBudget: false,
    }));

    // 2. Clear local storage keys by explicitly setting empty arrays so mock data is not restored
    const targetUid = userId || 'guest';
    const featureDataKeys = [
      `voiceledger_expenses_${targetUid}`,
      `voiceledger_goals_${targetUid}`,
      `voiceledger_trips_${targetUid}`,
      `voiceledger_subs_${targetUid}`,
      `voiceledger_friends_${targetUid}`,
      `voiceledger_settlements_${targetUid}`,
      'voiceledger_expenses_guest',
      'voiceledger_goals_guest',
      'voiceledger_trips_guest',
      'voiceledger_subs_guest',
      'voiceledger_friends_guest',
      'voiceledger_settlements_guest',
    ];

    featureDataKeys.forEach((k) => {
      try {
        localStorage.setItem(k, JSON.stringify([]));
      } catch (_) {}
    });

    const budgetKeysToRemove = [
      `voiceledger_budget_${targetUid}`,
      `voiceledger_configured_${targetUid}`,
      'voiceledger_guest_monthly_budget',
      'voiceledger_configured_guest_user_demo',
      'voiceledger_guest_budget_configured',
    ];

    budgetKeysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      } catch (_) {}
    });

    // 3. Async backend reset
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await profileService.updateProfile({ monthlyBudget: 0, hasConfiguredBudget: false }, userId);
      } catch (err) {
        console.warn('Backend reset notice:', err);
      }
    }
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
        updateTrip,
        depositToTrip,
        deleteTrip,
        addTripExpense,
        addFriend,
        recordSettlement,
        updateProfile,
        resetAllLedgerData,
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
