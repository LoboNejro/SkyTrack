import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser, useClerk, useSignIn, useSignUp } from "@clerk/clerk-react";

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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mapear user de Clerk a tu interfaz User
  useEffect(() => {
    if (clerkUser) {
      setUser({
        uid: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        photoURL: clerkUser.imageUrl,
        role: "student", // 🔹 puedes extender Clerk con metadatos para roles reales
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [clerkUser]);

  // Login con email/password
  const login = async (email: string, password: string) => {
    if (!signInLoaded) return;
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status !== "complete") {
        throw new Error("Login incompleto");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Registro con email/password
  const register = async (
    email: string,
    password: string,
    name: string,
    role: User["role"]
  ) => {
    if (!signUpLoaded) return;
    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === "complete") {
        // opcional: guardar metadatos como role
        await result.signUp?.update({ unsafeMetadata: { role, name } });
      } else {
        throw new Error("Registration incompleta");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Login con Google (Clerk lo maneja con OAuth)
  const loginWithGoogle = async () => {
    if (!signInLoaded) return;
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard", // 🔹 cambia esto según tu ruta
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    signOut();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
