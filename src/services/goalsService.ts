import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import type { SavingsGoal } from '../types/featurePages';
import { apiFetch } from './apiClient';

const COLLECTION_NAME = 'goals';

export const goalsService = {
  async fetchGoals(userId?: string): Promise<SavingsGoal[]> {
    const key = `voiceledger_goals_${userId || 'guest'}`;

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
        const snapshot = await Promise.race([
          getDocs(collection(db, `users/${userId}/${COLLECTION_NAME}`)),
          timeoutPromise,
        ]);
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<SavingsGoal, 'id'>),
          }));
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      } catch (err) {
        console.warn('Firestore fetchGoals notice:', err);
      }
    }

    try {
      const res = await apiFetch('/goals', {}, userId);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      }
    } catch (err) {
      console.warn('REST API fetchGoals notice:', err);
    }

    try {
      const cached = localStorage.getItem(key);
      if (cached) return JSON.parse(cached);
    } catch (_) {}

    return [];
  },

  async addGoal(goalData: Omit<SavingsGoal, 'id'>, userId?: string): Promise<SavingsGoal> {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
    };

    const key = `voiceledger_goals_${userId || 'guest'}`;
    try {
      const existing = localStorage.getItem(key);
      const list: SavingsGoal[] = existing ? JSON.parse(existing) : [];
      localStorage.setItem(key, JSON.stringify([newGoal, ...list]));
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await addDoc(collection(db, `users/${userId}/${COLLECTION_NAME}`), goalData);
        } catch (_) {}
      }

      try {
        await apiFetch('/goals', {
          method: 'POST',
          body: JSON.stringify(newGoal),
        }, userId);
      } catch (_) {}
    })();

    return newGoal;
  },

  async depositToGoal(goalId: string, amount: number, currentAmount: number, userId?: string): Promise<number> {
    const newTotal = currentAmount + amount;
    const key = `voiceledger_goals_${userId || 'guest'}`;

    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const list: SavingsGoal[] = JSON.parse(existing);
        const updated = list.map((g) => (g.id === goalId ? { ...g, currentAmount: newTotal } : g));
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, goalId), {
            currentAmount: newTotal,
          });
        } catch (_) {}
      }

      try {
        await apiFetch(`/goals/${goalId}/deposit`, {
          method: 'PATCH',
          body: JSON.stringify({ amount }),
        }, userId);
      } catch (_) {}
    })();

    return newTotal;
  },

  async updateGoal(goalId: string, updatedData: Partial<SavingsGoal>, userId?: string): Promise<SavingsGoal | null> {
    const key = `voiceledger_goals_${userId || 'guest'}`;
    let updatedGoal: SavingsGoal | null = null;

    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const list: SavingsGoal[] = JSON.parse(existing);
        const updatedList = list.map((g) => {
          if (g.id === goalId) {
            updatedGoal = { ...g, ...updatedData };
            return updatedGoal;
          }
          return g;
        });
        localStorage.setItem(key, JSON.stringify(updatedList));
      }
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, goalId), updatedData);
        } catch (_) {}
      }

      try {
        await apiFetch(`/goals/${goalId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedData),
        }, userId);
      } catch (_) {}
    })();

    return updatedGoal;
  },

  async deleteGoal(goalId: string, userId?: string): Promise<boolean> {
    const key = `voiceledger_goals_${userId || 'guest'}`;

    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const list: SavingsGoal[] = JSON.parse(existing);
        localStorage.setItem(key, JSON.stringify(list.filter((g) => g.id !== goalId)));
      }
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await deleteDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, goalId));
        } catch (_) {}
      }

      try {
        await apiFetch(`/goals/${goalId}`, { method: 'DELETE' }, userId);
      } catch (_) {}
    })();

    return true;
  },
};
