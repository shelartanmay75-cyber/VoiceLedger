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
  displayName: 'Alex Morgan',
  email: 'alex.morgan@voiceledger.io',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  monthlyBudget: 40000,
  currency: '₹',
  theme: 'dark',
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const isAuthenticated = Boolean(user && user.uid !== 'guest_user_demo' && !isGuest);

  const [expenses, setExpenses] = useState<Expense[]>(() => (isAuthenticated ? [] : mockExpensesList));
  const [goals, setGoals] = useState<SavingsGoal[]>(() => (isAuthenticated ? [] : mockSavingsGoals));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => (isAuthenticated ? [] : mockSubscriptions));
  const [trips, setTrips] = useState<Trip[]>(() => (isAuthenticated ? [] : mockTrips));
  const [friends, setFriends] = useState<SharedFriend[]>(() => (isAuthenticated ? [] : mockSharedFriends));
  const [settlements, setSettlements] = useState<SharedSettlement[]>(() => (isAuthenticated ? [] : mockSettlements));
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userId = user?.uid;

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

        if (fetchedProfile) {
          setProfile((prev) => ({
            ...prev,
            ...fetchedProfile,
            monthlyBudget: fetchedProfile.monthlyBudget || (savedBudget ? parseFloat(savedBudget) : prev.monthlyBudget),
            hasConfiguredBudget: fetchedProfile.hasConfiguredBudget || isConfigured,
          }));
        } else if (user) {
          setProfile((prev) => ({
            ...prev,
            uid: user.uid,
            displayName: user.displayName || 'User',
            email: user.email || '',
            photoURL: user.photoURL || prev.photoURL,
            monthlyBudget: savedBudget ? parseFloat(savedBudget) : prev.monthlyBudget,
            hasConfiguredBudget: isConfigured,
          }));
        }
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
  }, [userId]);

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

  const depositToGoal = async (goalId: string, amount: number, currentAmount: number) => {
    const newAmount = await goalsService.depositToGoal(goalId, amount, currentAmount, userId);
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: newAmount } : g))
    );
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

  // Profile update
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (userId) {
      if (profileData.monthlyBudget) {
        localStorage.setItem(`voiceledger_budget_${userId}`, String(profileData.monthlyBudget));
      }
      if (profileData.hasConfiguredBudget !== undefined) {
        localStorage.setItem(`voiceledger_configured_${userId}`, String(profileData.hasConfiguredBudget));
      }
    }
    const updated = await profileService.updateProfile(profileData, userId);
    setProfile((prev) => ({ ...prev, ...updated }));
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
