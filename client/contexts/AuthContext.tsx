import React, { createContext, useContext, useState, useEffect } from "react";
import { ID } from "appwrite";
import { account, appwriteReady } from "../lib/appwrite";

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: "student" | "teacher" | "tutor";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: User["role"],
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, "name" | "photoURL">>) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AppwriteAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (appwriteReady) {
          const me = await account.get();
          const photoURL = (me.prefs as any)?.photoURL as string | undefined;
          setUser({ uid: me.$id, name: me.name || me.email, email: me.email, role: "student", photoURL });
        } else {
          const savedUser = localStorage.getItem("skytrack_user");
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (appwriteReady) {
        await account.createEmailSession(email, password);
        const me = await account.get();
        const photoURL = (me.prefs as any)?.photoURL as string | undefined;
        setUser({ uid: me.$id, name: me.name || me.email, email: me.email, role: "student", photoURL });
      } else {
        const mockUser: User = { uid: crypto.randomUUID(), name: email.split("@")[0], email, role: "student" };
        setUser(mockUser);
        localStorage.setItem("skytrack_user", JSON.stringify(mockUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: User["role"],
  ) => {
    setLoading(true);
    try {
      if (appwriteReady) {
        await account.create(ID.unique(), email, password, name);
        await account.createEmailSession(email, password);
        const me = await account.get();
        const photoURL = (me.prefs as any)?.photoURL as string | undefined;
        setUser({ uid: me.$id, name: me.name || me.email, email: me.email, role, photoURL });
      } else {
        const newUser: User = { uid: crypto.randomUUID(), name, email, role };
        setUser(newUser);
        localStorage.setItem("skytrack_user", JSON.stringify(newUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!appwriteReady) return;
    const origin = window.location.origin;
    const success = `${origin}/dashboard`;
    const failure = `${origin}/login`;
    window.location.href = account.createOAuth2Session("google", success, failure).href ?? `/login`;
  };

  const updateProfile = async (updates: Partial<Pick<User, "name" | "photoURL">>) => {
    if (!user) return;
    if (appwriteReady) {
      if (updates.name) await account.updateName(updates.name);
      if (updates.photoURL !== undefined) await account.updatePrefs({ photoURL: updates.photoURL });
      const me = await account.get();
      const photoURL = (me.prefs as any)?.photoURL as string | undefined;
      setUser({ uid: me.$id, name: me.name || me.email, email: me.email, role: user.role, photoURL });
    } else {
      const newUser = { ...user, ...updates } as User;
      setUser(newUser);
      localStorage.setItem("skytrack_user", JSON.stringify(newUser));
    }
  };

  const logout = () => {
    if (appwriteReady) account.deleteSession("current");
    setUser(null);
    localStorage.removeItem("skytrack_user");
  };

  const value: AuthContextType = { user, login, register, loginWithGoogle, updateProfile, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AppwriteAuthProvider>{children}</AppwriteAuthProvider>;
}
