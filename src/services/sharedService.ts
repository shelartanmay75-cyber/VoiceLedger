import { db } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import type { SharedFriend, SharedSettlement } from '../types/featurePages';
import { apiFetch } from './apiClient';
import { mockSharedFriends, mockSettlements } from '../data/mockFeatureData';

export const sharedService = {
  async fetchSharedData(userId?: string): Promise<{ friends: SharedFriend[]; settlements: SharedSettlement[] }> {
    const friendsKey = `voiceledger_friends_${userId || 'guest'}`;
    const settlementsKey = `voiceledger_settlements_${userId || 'guest'}`;

    try {
      const cachedFriends = localStorage.getItem(friendsKey);
      const cachedSettlements = localStorage.getItem(settlementsKey);
      if (cachedFriends && cachedSettlements) {
        return {
          friends: JSON.parse(cachedFriends),
          settlements: JSON.parse(cachedSettlements),
        };
      }
    } catch (_) {}

    let friends: SharedFriend[] = mockSharedFriends;
    let settlements: SharedSettlement[] = mockSettlements;

    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const friendsSnap = await getDocs(collection(db, `users/${userId}/friends`));
        const settlementsSnap = await getDocs(collection(db, `users/${userId}/settlements`));

        if (!friendsSnap.empty || !settlementsSnap.empty) {
          friends = friendsSnap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<SharedFriend, 'id'>),
          }));
          settlements = settlementsSnap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<SharedSettlement, 'id'>),
          }));
        }
      } catch (err) {
        console.warn('Firestore fetchSharedData notice:', err);
      }
    }

    try {
      localStorage.setItem(friendsKey, JSON.stringify(friends));
      localStorage.setItem(settlementsKey, JSON.stringify(settlements));
    } catch (_) {}

    return { friends, settlements };
  },

  async addFriend(
    friendData: { name: string; email?: string; balance?: number; statusText?: string },
    userId?: string
  ): Promise<SharedFriend> {
    const balance = friendData.balance ?? 0;
    let statusText = friendData.statusText;
    if (!statusText) {
      if (balance > 0) statusText = `Owes you ₹${balance.toLocaleString('en-IN')}`;
      else if (balance < 0) statusText = `You owe ₹${Math.abs(balance).toLocaleString('en-IN')}`;
      else statusText = 'Settled Up';
    }

    const newFriend: SharedFriend = {
      id: `f-${Date.now()}`,
      name: friendData.name,
      email: friendData.email || `${friendData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      balance,
      statusText,
    };

    const friendsKey = `voiceledger_friends_${userId || 'guest'}`;
    try {
      const cached = localStorage.getItem(friendsKey);
      const list: SharedFriend[] = cached ? JSON.parse(cached) : [...mockSharedFriends];
      const updated = [newFriend, ...list];
      localStorage.setItem(friendsKey, JSON.stringify(updated));
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          const docRef = await addDoc(collection(db, `users/${userId}/friends`), newFriend);
          newFriend.id = docRef.id;
        } catch (err) {
          console.warn('Firestore addFriend notice:', err);
        }
      }

      try {
        await apiFetch('/shared/friends', {
          method: 'POST',
          body: JSON.stringify(newFriend),
        }, userId);
      } catch (err) {
        console.warn('REST API addFriend notice:', err);
      }
    })();

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

    const friendsKey = `voiceledger_friends_${userId || 'guest'}`;
    const settlementsKey = `voiceledger_settlements_${userId || 'guest'}`;

    try {
      const cachedSettlements = localStorage.getItem(settlementsKey);
      const list: SharedSettlement[] = cachedSettlements ? JSON.parse(cachedSettlements) : [...mockSettlements];
      localStorage.setItem(settlementsKey, JSON.stringify([settlement, ...list]));

      const cachedFriends = localStorage.getItem(friendsKey);
      if (cachedFriends) {
        const friendsList: SharedFriend[] = JSON.parse(cachedFriends);
        const updatedFriends = friendsList.map((f) => {
          if (f.name.toLowerCase() === friendName.toLowerCase()) {
            let newBalance = f.balance;
            if (type === 'received') newBalance -= amount;
            else newBalance += amount;

            let statusText = 'Settled Up';
            if (newBalance > 0) statusText = `Owes you ₹${newBalance.toLocaleString('en-IN')}`;
            if (newBalance < 0) statusText = `You owe ₹${Math.abs(newBalance).toLocaleString('en-IN')}`;
            return { ...f, balance: newBalance, statusText };
          }
          return f;
        });
        localStorage.setItem(friendsKey, JSON.stringify(updatedFriends));
      }
    } catch (_) {}

    (async () => {
      if (db && userId && userId !== 'guest_user_demo') {
        try {
          await addDoc(collection(db, `users/${userId}/settlements`), settlement);
        } catch (err) {
          console.warn('Firestore recordSettlement notice:', err);
        }
      }

      try {
        await apiFetch('/shared/settle', {
          method: 'POST',
          body: JSON.stringify({ friendName, amount, type }),
        }, userId);
      } catch (err) {
        console.warn('REST API recordSettlement notice:', err);
      }
    })();

    return { settlement };
  },
};
