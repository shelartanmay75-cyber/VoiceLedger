import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '../types/backend';
import { apiFetch } from './apiClient';

export const profileService = {
  async fetchProfile(userId?: string): Promise<UserProfile | null> {
    if (db && userId && userId !== 'guest_user_demo') {
      try {
        const docSnap = await getDoc(doc(db, `users/${userId}/profile`, 'meta'));
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (err) {
        console.warn('Firestore fetchProfile error, falling back to REST API:', err);
      }
    }

    try {
      const res = await apiFetch('/profile', {}, userId);
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
        await setDoc(doc(db, `users/${userId}/profile`, 'meta'), profileData, { merge: true });
      } catch (err) {
        console.warn('Firestore updateProfile error:', err);
      }
    }

    try {
      const res = await apiFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }, userId);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('REST API updateProfile error:', err);
    }

    return profileData as UserProfile;
  },
};
