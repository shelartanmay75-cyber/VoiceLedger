import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import type { SharedFriend, SharedSettlement } from '../types/featurePages';
import { apiFetch } from './apiClient';

export const sharedService = {
  async fetchSharedData(userId?: string): Promise<{ friends: SharedFriend[]; settlements: SharedSettlement[] }> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const friendsSnap = await getDocs(collection(db, `users/${userId}/friends`));
        const settlementsSnap = await getDocs(collection(db, `users/${userId}/settlements`));

        const friends = friendsSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<SharedFriend, 'id'>),
        }));

        const settlements = settlementsSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<SharedSettlement, 'id'>),
        }));

        if (friends.length > 0 || settlements.length > 0) {
          return { friends, settlements };
        }
      } catch (err) {
        console.warn('Firestore fetchSharedData error, falling back to REST API:', err);
      }
    }

    try {
      const [friendsRes, settlementsRes] = await Promise.all([
        apiFetch('/shared/friends', {}, userId),
        apiFetch('/shared/settlements', {}, userId),
      ]);

      const friends = friendsRes.ok ? await friendsRes.json() : [];
      const settlements = settlementsRes.ok ? await settlementsRes.json() : [];
      return { friends, settlements };
    } catch (err) {
      console.warn('REST API fetchSharedData error:', err);
    }

    return { friends: [], settlements: [] };
  },

  async addFriend(friendData: { name: string; email: string }, userId?: string): Promise<SharedFriend> {
    const newFriend: SharedFriend = {
      id: `f-${Date.now()}`,
      name: friendData.name,
      email: friendData.email,
      balance: 0,
      statusText: 'Settled Up',
    };

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const docRef = await addDoc(collection(db, `users/${userId}/friends`), newFriend);
        newFriend.id = docRef.id;
      } catch (err) {
        console.warn('Firestore addFriend error:', err);
      }
    }

    try {
      await apiFetch('/shared/friends', {
        method: 'POST',
        body: JSON.stringify(friendData),
      }, userId);
    } catch (err) {
      console.warn('REST API addFriend error:', err);
    }

    return newFriend;
  },

  async recordSettlement(
    friendName: string,
    amount: number,
    type: 'received' | 'paid',
    userId?: string
  ): Promise<{ settlement: SharedSettlement }> {
    const settlement: SharedSettlement = {
      id: `s-${Date.now()}`,
      friendName,
      amount,
      type,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    };

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await addDoc(collection(db, `users/${userId}/settlements`), settlement);
      } catch (err) {
        console.warn('Firestore recordSettlement error:', err);
      }
    }

    try {
      await apiFetch('/shared/settle', {
        method: 'POST',
        body: JSON.stringify({ friendName, amount, type }),
      }, userId);
    } catch (err) {
      console.warn('REST API recordSettlement error:', err);
    }

    return { settlement };
  },
};
