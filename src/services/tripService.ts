import { db } from '../config/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import type { Trip, TripExpense } from '../types/featurePages';

const COLLECTION_NAME = 'trips';
const API_URL = '/api/trips';

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
        console.warn('Firestore fetchTrips error:', err);
      }
    }

    try {
      const res = await fetch(API_URL);
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
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrip),
      });
    } catch (err) {
      console.warn('REST API addTrip error:', err);
    }

    return newTrip;
  },

  async addTripExpense(tripId: string, expenseData: Omit<TripExpense, 'id'>, existingTrip: Trip, userId?: string): Promise<Trip> {
    const newExpense: TripExpense = {
      ...expenseData,
      id: `te-${Date.now()}`,
    };

    const updatedExpensesList = [...(existingTrip.expensesList || []), newExpense];
    const updatedTotalSpent = updatedExpensesList.reduce((acc, curr) => acc + curr.amount, 0);

    const updatedTrip: Trip = {
      ...existingTrip,
      expensesList: updatedExpensesList,
      totalSpent: updatedTotalSpent,
    };

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const tripRef = doc(db, `users/${userId}/${COLLECTION_NAME}`, tripId);
        await updateDoc(tripRef, {
          expensesList: updatedExpensesList,
          totalSpent: updatedTotalSpent,
        });
      } catch (err) {
        console.warn('Firestore addTripExpense error:', err);
      }
    }

    try {
      await fetch(`${API_URL}/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
    } catch (err) {
      console.warn('REST API addTripExpense error:', err);
    }

    return updatedTrip;
  },
};
