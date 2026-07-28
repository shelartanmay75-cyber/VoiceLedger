import type { Expense } from './expense';
import type { SavingsGoal, Subscription, Trip, SharedFriend, SharedSettlement } from './featurePages';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  monthlyBudget: number;
  currency: string;
  theme: 'dark' | 'light';
}

export interface AppStateData {
  expenses: Expense[];
  goals: SavingsGoal[];
  subscriptions: Subscription[];
  trips: Trip[];
  friends: SharedFriend[];
  settlements: SharedSettlement[];
  profile: UserProfile;
}
