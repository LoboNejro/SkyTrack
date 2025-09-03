import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider, firebaseReady } from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile as fbUpdateProfile,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'teacher' | 'tutor';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: User['role'],
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'photoURL'>>) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

async function ensureUserDoc(u: { uid: string; displayName: string | null; email: string; photoURL: string | null }) {
  if (!firebaseReady || !db) throw new Error('Firestore not ready');
  const ref = doc(db, 'users', u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const userDoc: User = {
      uid: u.uid,
      name: u.displayName || u.email.split('@')[0],
      email: u.email,
      photoURL: u.photoURL || undefined,
      role: 'student',
    };
    await setDoc(ref, userDoc);
    return userDoc;
  }
  return snap.data() as User;
}

function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady || !auth) {
      const saved = localStorage.getItem('skytrack_user');
      if (saved) setUser(JSON.parse(saved));
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          const docUser = await ensureUserDoc({
            uid: fbUser.uid,
            displayName: fbUser.displayName,
            email: fbUser.email!,
            photoURL: fbUser.photoURL,
          });
          setUser(docUser);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!firebaseReady || !auth) {
        const mock: User = { uid: crypto.randomUUID(), name: email.split('@')[0], email, role: 'student' };
        setUser(mock);
        localStorage.setItem('skytrack_user', JSON.stringify(mock));
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: User['role'],
  ) => {
    setLoading(true);
    try {
      if (!firebaseReady || !auth || !db) {
        const newUser: User = { uid: crypto.randomUUID(), name, email, role };
        setUser(newUser);
        localStorage.setItem('skytrack_user', JSON.stringify(newUser));
        return;
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await fbUpdateProfile(auth.currentUser, { displayName: name });
      }
      const newUser: User = {
        uid: cred.user.uid,
        name,
        email,
        role,
        photoURL: auth.currentUser?.photoURL || undefined,
      };
      await setDoc(doc(db, 'users', cred.user.uid), newUser);
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (!firebaseReady || !auth) {
        const mock: User = { uid: crypto.randomUUID(), name: 'Google User', email: 'user@example.com', role: 'student' };
        setUser(mock);
        localStorage.setItem('skytrack_user', JSON.stringify(mock));
        return;
      }
      const res = await signInWithPopup(auth, googleProvider);
      await ensureUserDoc({
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email!,
        photoURL: res.user.photoURL,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'photoURL'>>) => {
    if (!user) return;
    if (!firebaseReady || !auth || !db) {
      const merged = { ...user, ...updates } as User;
      setUser(merged);
      localStorage.setItem('skytrack_user', JSON.stringify(merged));
      return;
    }
    if (auth.currentUser && updates.name) {
      await fbUpdateProfile(auth.currentUser, { displayName: updates.name });
    }
    await updateDoc(doc(db, 'users', user.uid), updates as any);
    const merged = { ...user, ...updates } as User;
    setUser(merged);
  };

  const logout = () => {
    if (firebaseReady && auth) signOut(auth);
    setUser(null);
    localStorage.removeItem('skytrack_user');
  };

  const value: AuthContextType = { user, login, register, loginWithGoogle, updateProfile, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}
