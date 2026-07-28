import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import type { Expense } from '../types/expense';
import { apiFetch } from './apiClient';

const COLLECTION_NAME = 'expenses';

export const expenseService = {
  async fetchExpenses(userId?: string): Promise<Expense[]> {
    // 1. Try Firebase Firestore if configured & online
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const q = query(collection(db, `users/${userId}/${COLLECTION_NAME}`), orderBy('isoDate', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Expense, 'id'>),
          }));
        }
      } catch (err) {
        console.warn('Firestore fetchExpenses error, falling back to REST API:', err);
      }
    }

    // 2. Fallback to Express REST API / Render backend
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

    // 1. Try Firestore
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const docRef = await addDoc(collection(db, `users/${userId}/${COLLECTION_NAME}`), expenseData);
        newExpense.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addExpense error:', err);
      }
    }

    // 2. Also save to REST API backend
    try {
      await apiFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify(newExpense),
      }, userId);
    } catch (err) {
      console.warn('REST API addExpense error:', err);
    }

    return newExpense;
  },

  async deleteExpense(expenseId: string, userId?: string): Promise<boolean> {
    // 1. Try Firestore
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await deleteDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, expenseId));
      } catch (err) {
        console.warn('Firestore deleteExpense error:', err);
      }
    }

    // 2. Delete from REST API backend
    try {
      await apiFetch(`/expenses/${expenseId}`, { method: 'DELETE' }, userId);
    } catch (err) {
      console.warn('REST API deleteExpense error:', err);
    }

    return true;
  },
};
