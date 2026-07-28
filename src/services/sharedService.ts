import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import type { SharedFriend, SharedSettlement } from '../types/featurePages';

const API_URL = '/api/shared';

export const sharedService = {
  async fetchSharedData(userId?: string): Promise<{ friends: SharedFriend[]; settlements: SharedSettlement[] }> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const friendsSnap = await getDocs(collection(db, `users/${userId}/friends`));
        const settlementsSnap = await getDocs(collection(db, `users/${userId}/settlements`));

        if (!friendsSnap.empty) {
          const friends = friendsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SharedFriend, 'id'>) }));
          const settlements = settlementsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SharedSettlement, 'id'>) }));
          return { friends, settlements };
        }
      } catch (err) {
        console.warn('Firestore fetchSharedData error:', err);
      }
    }

    try {
      const friendsRes = await fetch(`${API_URL}/friends`);
      const friends = friendsRes.ok ? await friendsRes.json() : [];
      return { friends, settlements: [] };
    } catch (err) {
      console.warn('REST API fetchSharedData error:', err);
    }

    return { friends: [], settlements: [] };
  },

  async addFriend(friendData: Omit<SharedFriend, 'id' | 'balance' | 'statusText'>, userId?: string): Promise<SharedFriend> {
    const newFriend: SharedFriend = {
      ...friendData,
      id: `f-${Date.now()}`,
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
      await fetch(`${API_URL}/friends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFriend),
      });
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
    const newSettlement: SharedSettlement = {
      id: `s-${Date.now()}`,
      friendName,
      amount,
      type,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    };

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        await addDoc(collection(db, `users/${userId}/settlements`), newSettlement);
      } catch (err) {
        console.warn('Firestore recordSettlement error:', err);
      }
    }

    try {
      await fetch(`${API_URL}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendName, amount, type }),
      });
    } catch (err) {
      console.warn('REST API recordSettlement error:', err);
    }

    return { settlement: newSettlement };
  },
};
