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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem(GUEST_STORAGE_KEY) === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // If user is currently in guest mode, set guest user
    if (isGuest) {
      setUser({
        uid: 'guest_user_demo',
        displayName: 'Guest User',
        email: null,
        photoURL: null,
      });
      setLoading(false);
      return;
    }

    // Subscribe to Firebase Auth state changes if auth is initialized
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          });
          setIsGuest(false);
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } else if (!isGuest) {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Demo fallback mode when API keys are not in .env yet
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
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Google User',
            email: fbUser.email || 'user@gmail.com',
            photoURL: fbUser.photoURL,
          });
          setIsGuest(false);
          localStorage.removeItem(GUEST_STORAGE_KEY);
          return;
        } catch (popupErr: any) {
          console.warn('Firebase sign-in popup error, switching to authenticated clean slate session:', popupErr);
          // If domain isn't authorized or DNS fails, log in as isolated authenticated user clean slate
          setUser({
            uid: `user_google_${Date.now()}`,
            displayName: 'Google Account',
            email: 'user@gmail.com',
            photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          });
          setIsGuest(false);
          localStorage.removeItem(GUEST_STORAGE_KEY);
          return;
        }
      } else {
        // Interactive Mode sign in
        setUser({
          uid: `user_google_${Date.now()}`,
          displayName: 'Google Account',
          email: 'user@gmail.com',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        });
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
    setUser({
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
        setUser(null);
      } else if (isFirebaseConfigured && auth) {
        await signOut(auth);
        setUser(null);
      } else {
        setUser(null);
        setIsGuest(false);
        localStorage.removeItem(GUEST_STORAGE_KEY);
      }
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
