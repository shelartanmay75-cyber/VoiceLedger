import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { Subscription } from '../types/featurePages';

const COLLECTION_NAME = 'subscriptions';
const API_URL = '/api/subscriptions';

export const subscriptionService = {
  async fetchSubscriptions(userId?: string): Promise<Subscription[]> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const snapshot = await getDocs(collection(db, `users/${userId}/${COLLECTION_NAME}`));
        if (!snapshot.empty) {
          return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Subscription, 'id'>),
          }));
        }
      } catch (err) {
        console.warn('Firestore fetchSubscriptions error:', err);
      }
    }

    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('REST API fetchSubscriptions error:', err);
    }

    return [];
  },

  async addSubscription(subData: Omit<Subscription, 'id'>, userId?: string): Promise<Subscription> {
    const newSub: Subscription = {
      ...subData,
      id: `sub-${Date.now()}`,
    };

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const docRef = await addDoc(collection(db, `users/${userId}/${COLLECTION_NAME}`), subData);
        newSub.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addSubscription error:', err);
      }
    }

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSub),
      });
    } catch (err) {
      console.warn('REST API addSubscription error:', err);
    }

    return newSub;
  },

  async toggleSubscriptionStatus(subId: string, currentStatus: string, userId?: string): Promise<string> {
    const newStatus = currentStatus === 'active' ? 'cancelling' : 'active';

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, subId), { status: newStatus });
      } catch (err) {
        console.warn('Firestore toggleSubscriptionStatus error:', err);
      }
    }

    try {
      await fetch(`${API_URL}/${subId}/toggle`, { method: 'PATCH' });
    } catch (err) {
      console.warn('REST API toggleSubscriptionStatus error:', err);
    }

    return newStatus;
  },

  async deleteSubscription(subId: string, userId?: string): Promise<boolean> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await deleteDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, subId));
      } catch (err) {
        console.warn('Firestore deleteSubscription error:', err);
      }
    }

    try {
      await fetch(`${API_URL}/${subId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('REST API deleteSubscription error:', err);
    }

    return true;
  },
};
