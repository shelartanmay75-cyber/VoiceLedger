import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { SavingsGoal } from '../types/featurePages';

const COLLECTION_NAME = 'savings_goals';
const API_URL = '/api/goals';

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
        console.warn('Firestore fetchGoals error:', err);
      }
    }

    try {
      const res = await fetch(API_URL);
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
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      });
    } catch (err) {
      console.warn('REST API addGoal error:', err);
    }

    return newGoal;
  },

  async depositToGoal(goalId: string, amount: number, currentAmount: number, userId?: string): Promise<number> {
    const updatedAmount = currentAmount + amount;

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const goalRef = doc(db, `users/${userId}/${COLLECTION_NAME}`, goalId);
        await updateDoc(goalRef, { currentAmount: updatedAmount });
      } catch (err) {
        console.warn('Firestore depositToGoal error:', err);
      }
    }

    try {
      await fetch(`${API_URL}/${goalId}/deposit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
    } catch (err) {
      console.warn('REST API depositToGoal error:', err);
    }

    return updatedAmount;
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
      await fetch(`${API_URL}/${goalId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('REST API deleteGoal error:', err);
    }

    return true;
  },
};
