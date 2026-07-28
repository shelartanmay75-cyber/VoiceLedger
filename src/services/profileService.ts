import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '../types/backend';

const API_URL = '/api/profile';

export const profileService = {
  async fetchProfile(userId?: string): Promise<UserProfile | null> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const docRef = doc(db, `users/${userId}/profile`, 'settings');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data() as UserProfile;
        }
      } catch (err) {
        console.warn('Firestore fetchProfile error:', err);
      }
    }

    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('REST API fetchProfile error:', err);
    }

    return null;
  },

  async updateProfile(profileData: Partial<UserProfile>, userId?: string): Promise<UserProfile> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const docRef = doc(db, `users/${userId}/profile`, 'settings');
        await setDoc(docRef, profileData, { merge: true });
      } catch (err) {
        console.warn('Firestore updateProfile error:', err);
      }
    }

    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('REST API updateProfile error:', err);
    }

    return profileData as UserProfile;
  },
};
