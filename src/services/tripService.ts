import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import type { Trip } from '../types/featurePages';
import { apiFetch } from './apiClient';

const COLLECTION_NAME = 'trips';

export const tripService = {
  async fetchTrips(userId?: string): Promise<Trip[]> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const snapshot = await getDocs(collection(db, `users/${userId}/${COLLECTION_NAME}`));
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Trip, 'id'>),
          }));
        }
      } catch (err) {
        console.warn('Firestore fetchTrips error, falling back to REST API:', err);
      }
    }

    try {
      const res = await apiFetch('/trips', {}, userId);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('REST API fetchTrips error:', err);
    }

    return [];
  },

  async addTrip(tripData: Omit<Trip, 'id' | 'totalSpent' | 'expensesList'>, userId?: string): Promise<Trip> {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      totalSpent: 0,
      expensesList: [],
    };

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const docRef = await addDoc(collection(db, `users/${userId}/${COLLECTION_NAME}`), newTrip);
        newTrip.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addTrip error:', err);
      }
    }

    try {
      await apiFetch('/trips', {
        method: 'POST',
        body: JSON.stringify(newTrip),
      }, userId);
    } catch (err) {
      console.warn('REST API addTrip error:', err);
    }

    return newTrip;
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

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, tripId), {
          expensesList: updatedExpensesList,
          totalSpent: newTotalSpent,
        });
      } catch (err) {
        console.warn('Firestore addTripExpense error:', err);
      }
    }

    try {
      await apiFetch(`/trips/${tripId}/expenses`, {
        method: 'POST',
        body: JSON.stringify(expenseData),
      }, userId);
    } catch (err) {
      console.warn('REST API addTripExpense error:', err);
    }

    return updatedTrip;
  },
};
