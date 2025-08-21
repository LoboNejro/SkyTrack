import React, { createContext, useContext, useState, useEffect } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";

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
    role: User["role"]
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { signIn, setSession } = useSignIn();
  const { signUp } = useSignUp();

  useEffect(() => {
    // Optional: restore user from localStorage if you want
    const savedUser = localStorage.getItem("skytrack_user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signIn.create({ identifier: email, password });
      await signIn.authenticate();

      const clerkUser = signIn.user!;
      const loggedUser: User = {
        uid: clerkUser.id,
        name: clerkUser.firstName || email.split("@")[0],
        email,
        role: "student", // Mantén tu lógica de roles
      };

      setUser(loggedUser);
      localStorage.setItem("skytrack_user", JSON.stringify(loggedUser));
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: User["role"]
  ) => {
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification();
      await signUp.authenticate();

      const clerkUser = signUp.user!;
      const newUser: User = { uid: clerkUser.id, name, email, role };
      setUser(newUser);
      localStorage.setItem("skytrack_user", JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Clerk OAuth Google
      const result = await signIn.create({
        strategy: "oauth_google"
      });
      await signIn.authenticate();
      const clerkUser = signIn.user!;
      const loggedUser: User = {
        uid: clerkUser.id,
        name: clerkUser.firstName || "Google User",
        email: clerkUser.emailAddresses[0].emailAddress,
        photoURL: clerkUser.profileImageUrl,
        role: "student",
      };
      setUser(loggedUser);
      localStorage.setItem("skytrack_user", JSON.stringify(loggedUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skytrack_user");
  };

  const value = { user, login, register, loginWithGoogle, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
