import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import type { Expense } from '../types/expense';
import { apiFetch } from './apiClient';

const COLLECTION_NAME = 'expenses';

export const expenseService = {
  async fetchExpenses(userId?: string): Promise<Expense[]> {
    // 1. Try Firebase Firestore with timeout
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000));
        const q = query(collection(db, `users/${userId}/${COLLECTION_NAME}`), orderBy('isoDate', 'desc'));
        const snapshot = await Promise.race([getDocs(q), timeoutPromise]);
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Expense, 'id'>),
          }));
        }
      } catch (err) {
        console.warn('Firestore fetchExpenses timeout or error, trying REST API:', err);
      }
    }

    // 2. Fallback to Express REST API / Backend
    try {
      const res = await apiFetch('/expenses', {}, userId);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('REST API fetchExpenses error:', err);
    }

    return [];
  },

  async addExpense(expenseData: Omit<Expense, 'id'>, userId?: string): Promise<Expense> {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };

    // Non-blocking background persistence so UI updates instantly (0ms delay)
    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
          await Promise.race([
            addDoc(collection(db, `users/${userId}/${COLLECTION_NAME}`), expenseData),
            timeoutPromise,
          ]);
        } catch (err) {
          console.warn('Background Firestore addExpense notice:', err);
        }
      }

      try {
        await apiFetch('/expenses', {
          method: 'POST',
          body: JSON.stringify(newExpense),
        }, userId);
      } catch (err) {
        console.warn('Background REST API addExpense notice:', err);
      }
    })();

    return newExpense;
  },

  async deleteExpense(expenseId: string, userId?: string): Promise<boolean> {
    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await deleteDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, expenseId));
        } catch (err) {
          console.warn('Background Firestore deleteExpense error:', err);
        }
      }

      try {
        await apiFetch(`/expenses/${expenseId}`, { method: 'DELETE' }, userId);
      } catch (err) {
        console.warn('Background REST API deleteExpense error:', err);
      }
    })();

    return true;
  },
};
