import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import type { SavingsGoal } from '../types/featurePages';
import { apiFetch } from './apiClient';

const COLLECTION_NAME = 'goals';

export const goalsService = {
  async fetchGoals(userId?: string): Promise<SavingsGoal[]> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const snapshot = await getDocs(collection(db, `users/${userId}/${COLLECTION_NAME}`));
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<SavingsGoal, 'id'>),
          }));
        }
      } catch (err) {
        console.warn('Firestore fetchGoals error, falling back to REST API:', err);
      }
    }

    try {
      const res = await apiFetch('/goals', {}, userId);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('REST API fetchGoals error:', err);
    }

    return [];
  },

  async addGoal(goalData: Omit<SavingsGoal, 'id'>, userId?: string): Promise<SavingsGoal> {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
    };

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const docRef = await addDoc(collection(db, `users/${userId}/${COLLECTION_NAME}`), goalData);
        newGoal.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addGoal error:', err);
      }
    }

    try {
      await apiFetch('/goals', {
        method: 'POST',
        body: JSON.stringify(newGoal),
      }, userId);
    } catch (err) {
      console.warn('REST API addGoal error:', err);
    }

    return newGoal;
  },

  async depositToGoal(goalId: string, amount: number, currentAmount: number, userId?: string): Promise<number> {
    const newTotal = currentAmount + amount;

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, goalId), {
          currentAmount: newTotal,
        });
      } catch (err) {
        console.warn('Firestore depositToGoal error:', err);
      }
    }

    try {
      await apiFetch(`/goals/${goalId}/deposit`, {
        method: 'PATCH',
        body: JSON.stringify({ amount }),
      }, userId);
    } catch (err) {
      console.warn('REST API depositToGoal error:', err);
    }

    return newTotal;
  },

  async deleteGoal(goalId: string, userId?: string): Promise<boolean> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await deleteDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, goalId));
      } catch (err) {
        console.warn('Firestore deleteGoal error:', err);
      }
    }

    try {
      await apiFetch(`/goals/${goalId}`, { method: 'DELETE' }, userId);
    } catch (err) {
      console.warn('REST API deleteGoal error:', err);
    }

    return true;
  },
};
