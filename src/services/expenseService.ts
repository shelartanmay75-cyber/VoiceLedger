import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import type { Expense } from '../types/expense';
import { apiFetch } from './apiClient';

const COLLECTION_NAME = 'expenses';

export const expenseService = {
  async fetchExpenses(userId?: string): Promise<Expense[]> {
    const key = `voiceledger_expenses_${userId || 'guest'}`;

    // 1. Try Firebase Firestore with timeout
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
        const q = query(collection(db, `users/${userId}/${COLLECTION_NAME}`), orderBy('isoDate', 'desc'));
        const snapshot = await Promise.race([getDocs(q), timeoutPromise]);
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Expense, 'id'>),
          }));
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      } catch (err) {
        console.warn('Firestore fetchExpenses timeout or error:', err);
      }
    }

    // 2. Fallback to Express REST API
    try {
      const res = await apiFetch('/expenses', {}, userId);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      }
    } catch (err) {
      console.warn('REST API fetchExpenses notice:', err);
    }

    // 3. Fallback to local persistent cache
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (_) {}

    return [];
  },

  async addExpense(expenseData: Omit<Expense, 'id'>, userId?: string): Promise<Expense> {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };

    const key = `voiceledger_expenses_${userId || 'guest'}`;

    // Update local persistent storage immediately
    try {
      const existing = localStorage.getItem(key);
      const list: Expense[] = existing ? JSON.parse(existing) : [];
      const updated = [newExpense, ...list];
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving expense to local cache:', err);
    }

    // Persist in cloud / backend asynchronously in background
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
    const key = `voiceledger_expenses_${userId || 'guest'}`;

    // Remove from local persistent storage immediately
    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const list: Expense[] = JSON.parse(existing);
        const updated = list.filter((e) => e.id !== expenseId);
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (err) {
      console.warn('Error deleting expense from local cache:', err);
    }

    // Persist in backend asynchronously
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
