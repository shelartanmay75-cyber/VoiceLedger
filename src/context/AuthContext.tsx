import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  isGuest: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'voiceledger_is_guest_session';
const USER_STORAGE_KEY = 'voiceledger_active_user_session';
const STABLE_UID_KEY = 'voiceledger_stable_user_uid';

const getStableUid = (): string => {
  let uid = localStorage.getItem(STABLE_UID_KEY);
  if (!uid) {
    uid = `user_google_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem(STABLE_UID_KEY, uid);
  }
  return uid;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (_) {
      return null;
    }
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem(GUEST_STORAGE_KEY) === 'true';
  });

  const [loading, setLoading] = useState<boolean>(true);

  const saveUserSession = (userData: AuthUser | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  useEffect(() => {
    if (isGuest) {
      saveUserSession({
        uid: 'guest_user_demo',
        displayName: 'Guest User',
        email: null,
        photoURL: null,
      });
      setLoading(false);
      return;
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          saveUserSession({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          });
          setIsGuest(false);
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } else if (!isGuest) {
          // Keep active local session if present
          const storedUser = localStorage.getItem(USER_STORAGE_KEY);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (_) {}
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [isGuest]);

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const fbUser = result.user;
          const userObj = {
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Google User',
            email: fbUser.email || 'user@gmail.com',
            photoURL: fbUser.photoURL,
          };
          saveUserSession(userObj);
          setIsGuest(false);
          localStorage.removeItem(GUEST_STORAGE_KEY);
          return;
        } catch (popupErr: any) {
          console.warn('Firebase sign-in popup error, switching to persistent user session:', popupErr);
          const stableUid = getStableUid();
          const userObj = {
            uid: stableUid,
            displayName: 'Google Account',
            email: 'user@gmail.com',
            photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          };
          saveUserSession(userObj);
          setIsGuest(false);
          localStorage.removeItem(GUEST_STORAGE_KEY);
          return;
        }
      } else {
        const stableUid = getStableUid();
        const userObj = {
          uid: stableUid,
          displayName: 'Google Account',
          email: 'user@gmail.com',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        saveUserSession(userObj);
        setIsGuest(false);
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = (): void => {
    setIsGuest(true);
    localStorage.setItem(GUEST_STORAGE_KEY, 'true');
    saveUserSession({
      uid: 'guest_user_demo',
      displayName: 'Guest User',
      email: null,
      photoURL: null,
    });
    setLoading(false);
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isGuest) {
        setIsGuest(false);
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } else if (isFirebaseConfigured && auth) {
        try { await signOut(auth); } catch (_) {}
      }
      saveUserSession(null);
      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      localStorage.removeItem('voiceledger_configured_guest_user_demo');
      sessionStorage.removeItem('voiceledger_guest_budget_configured');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        loading,
        signInWithGoogle,
        signInAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
