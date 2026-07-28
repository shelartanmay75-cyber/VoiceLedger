import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import type { Expense } from '../types/expense';
import { apiFetch } from './apiClient';

const COLLECTION_NAME = 'expenses';

export const expenseService = {
  async fetchExpenses(userId?: string): Promise<Expense[]> {
    const key = `voiceledger_expenses_${userId || 'guest'}`;

    // 1. Read local cache first
    let cachedList: Expense[] = [];
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        cachedList = JSON.parse(cached);
      }
    } catch (_) {}

    // 2. Try REST API
    try {
      const res = await apiFetch('/expenses', {}, userId);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          const idMap = new Map<string, Expense>();
          cachedList.forEach((item) => idMap.set(item.id, item));
          list.forEach((item) => idMap.set(item.id, item));
          const merged = Array.from(idMap.values());
          localStorage.setItem(key, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (err) {
      console.warn('REST API fetchExpenses notice:', err);
    }

    // 3. Try Firebase Firestore
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
          const idMap = new Map<string, Expense>();
          cachedList.forEach((item) => idMap.set(item.id, item));
          list.forEach((item) => idMap.set(item.id, item));
          const merged = Array.from(idMap.values());
          localStorage.setItem(key, JSON.stringify(merged));
          return merged;
        }
      } catch (err) {
        console.warn('Firestore fetchExpenses notice:', err);
      }
    }

    return cachedList;
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
      try {
        await apiFetch('/expenses', {
          method: 'POST',
          body: JSON.stringify(newExpense),
        }, userId);
      } catch (err) {
        console.warn('Background REST API addExpense notice:', err);
      }

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
      try {
        await apiFetch(`/expenses/${expenseId}`, { method: 'DELETE' }, userId);
      } catch (err) {
        console.warn('Background REST API deleteExpense error:', err);
      }

      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await deleteDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, expenseId));
        } catch (err) {
          console.warn('Background Firestore deleteExpense error:', err);
        }
      }
    })();

    return true;
  },
};
