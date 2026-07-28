import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import type { Subscription } from '../types/featurePages';
import { apiFetch } from './apiClient';

const COLLECTION_NAME = 'subscriptions';

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
        console.warn('Firestore fetchSubscriptions error, falling back to REST API:', err);
      }
    }

    try {
      const res = await apiFetch('/subscriptions', {}, userId);
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
      await apiFetch('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(newSub),
      }, userId);
    } catch (err) {
      console.warn('REST API addSubscription error:', err);
    }

    return newSub;
  },

  async toggleSubscriptionStatus(subId: string, currentStatus: string, userId?: string): Promise<string> {
    const newStatus = currentStatus === 'active' ? 'cancelling' : 'active';

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await updateDoc(doc(db, `users/${userId}/${COLLECTION_NAME}`, subId), {
          status: newStatus,
        });
      } catch (err) {
        console.warn('Firestore toggleSubscriptionStatus error:', err);
      }
    }

    try {
      await apiFetch(`/subscriptions/${subId}/toggle`, {
        method: 'PATCH',
      }, userId);
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
      await apiFetch(`/subscriptions/${subId}`, { method: 'DELETE' }, userId);
    } catch (err) {
      console.warn('REST API deleteSubscription error:', err);
    }

    return true;
  },
};
