import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Trip } from '../types/featurePages';
import { apiFetch } from './apiClient';
import { mockTrips } from '../data/mockFeatureData';

const COLLECTION_NAME = 'trips';

export const tripService = {
  async fetchTrips(userId?: string): Promise<Trip[]> {
    const key = `voiceledger_trips_${userId || 'guest'}`;

    // 1. Read cached trips from local storage first
    let cachedTrips: Trip[] = [];
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) cachedTrips = parsed;
      }
    } catch (_) {}

    // 2. Try Firestore
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
        const snapshot = await Promise.race([
          getDocs(collection(db, `users/${userId}/${COLLECTION_NAME}`)),
          timeoutPromise,
        ]);
        if (snapshot && !snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Trip, 'id'>),
          }));
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      } catch (err) {
        console.warn('Firestore fetchTrips notice:', err);
      }
    }

    // 3. Try REST API
    try {
      const res = await apiFetch('/trips', {}, userId);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          localStorage.setItem(key, JSON.stringify(list));
          return list;
        }
      }
    } catch (err) {
      console.warn('REST API fetchTrips notice:', err);
    }

    // 4. Return cached trips or fallback to mockTrips for guest
    if (cachedTrips.length > 0) return cachedTrips;
    return (!userId || userId === 'guest_user_demo') ? mockTrips : [];
  },

  async addTrip(tripData: Omit<Trip, 'id' | 'totalSpent' | 'expensesList'>, userId?: string): Promise<Trip> {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      totalSpent: 0,
      savedAmount: tripData.savedAmount ?? 0,
      expensesList: [],
    };

    const key = `voiceledger_trips_${userId || 'guest'}`;
    try {
      const existing = localStorage.getItem(key);
      const list: Trip[] = existing ? JSON.parse(existing) : mockTrips;
      localStorage.setItem(key, JSON.stringify([newTrip, ...list]));
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          const docRef = await addDoc(collection(db, `users/${userId}/${COLLECTION_NAME}`), newTrip);
          newTrip.id = docRef.id;
        } catch (err) {
          console.warn('Firestore addTrip notice:', err);
        }
      }

      try {
        await apiFetch('/trips', {
          method: 'POST',
          body: JSON.stringify(newTrip),
        }, userId);
      } catch (err) {
        console.warn('REST API addTrip notice:', err);
      }
    })();

    return newTrip;
  },

  async depositToTrip(tripId: string, amount: number, currentSaved: number = 0, userId?: string): Promise<number> {
    const newSavedAmount = currentSaved + amount;
    const key = `voiceledger_trips_${userId || 'guest'}`;

    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const list: Trip[] = JSON.parse(existing);
        const updated = list.map((t) => (t.id === tripId ? { ...t, savedAmount: newSavedAmount } : t));
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, tripId), {
            savedAmount: newSavedAmount,
          });
        } catch (err) {
          console.warn('Firestore depositToTrip notice:', err);
        }
      }

      try {
        await apiFetch(`/trips/${tripId}/deposit`, {
          method: 'POST',
          body: JSON.stringify({ amount, savedAmount: newSavedAmount }),
        }, userId);
      } catch (err) {
        console.warn('REST API depositToTrip notice:', err);
      }
    })();

    return newSavedAmount;
  },

  async updateTrip(tripId: string, updatedData: Partial<Trip>, userId?: string): Promise<Partial<Trip>> {
    const key = `voiceledger_trips_${userId || 'guest'}`;

    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const list: Trip[] = JSON.parse(existing);
        const updated = list.map((t) => (t.id === tripId ? { ...t, ...updatedData } : t));
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, tripId), updatedData);
        } catch (err) {
          console.warn('Firestore updateTrip notice:', err);
        }
      }

      try {
        await apiFetch(`/trips/${tripId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedData),
        }, userId);
      } catch (err) {
        console.warn('REST API updateTrip notice:', err);
      }
    })();

    return updatedData;
  },

  async deleteTrip(tripId: string, userId?: string): Promise<void> {
    const key = `voiceledger_trips_${userId || 'guest'}`;

    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const list: Trip[] = JSON.parse(existing);
        localStorage.setItem(key, JSON.stringify(list.filter((t) => t.id !== tripId)));
      }
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await deleteDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, tripId));
        } catch (err) {
          console.warn('Firestore deleteTrip notice:', err);
        }
      }

      try {
        await apiFetch(`/trips/${tripId}`, {
          method: 'DELETE',
        }, userId);
      } catch (err) {
        console.warn('REST API deleteTrip notice:', err);
      }
    })();
  },

  async addTripExpense(
    tripId: string,
    expenseData: { description: string; amount: number; category: string; paidBy: string; date: string },
    currentTrip: Trip,
    userId?: string
  ): Promise<Trip> {
    const newExpense = {
      id: `te-${Date.now()}`,
      ...expenseData,
    };

    const updatedExpensesList = [...(currentTrip.expensesList || []), newExpense];
    const newTotalSpent = updatedExpensesList.reduce((acc, curr) => acc + curr.amount, 0);

    const updatedTrip: Trip = {
      ...currentTrip,
      expensesList: updatedExpensesList,
      totalSpent: newTotalSpent,
    };

    const key = `voiceledger_trips_${userId || 'guest'}`;
    try {
      const existing = localStorage.getItem(key);
      if (existing) {
        const list: Trip[] = JSON.parse(existing);
        const updated = list.map((t) => (t.id === tripId ? updatedTrip : t));
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, tripId), {
            expensesList: updatedExpensesList,
            totalSpent: newTotalSpent,
          });
        } catch (err) {
          console.warn('Firestore addTripExpense notice:', err);
        }
      }

      try {
        await apiFetch(`/trips/${tripId}/expenses`, {
          method: 'POST',
          body: JSON.stringify(expenseData),
        }, userId);
      } catch (err) {
        console.warn('REST API addTripExpense notice:', err);
      }
    })();

    return updatedTrip;
  },
};
