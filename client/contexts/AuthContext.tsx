import React, { createContext, useContext, useState, useEffect } from "react";
import { ClerkProvider, useClerk, useUser } from "@clerk/clerk-react";

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

function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const mappedUser: User | null =
    isSignedIn && user
      ? {
          uid: user.id,
          name:
            user.fullName ||
            user.username ||
            user.primaryEmailAddress?.emailAddress ||
            "User",
          email: user.primaryEmailAddress?.emailAddress || "",
          photoURL: user.imageUrl,
          role: "student",
        }
      : null;

  const value: AuthContextType = {
    user: mappedUser,
    loading: !isLoaded,
    login: async () => {
      window.location.assign("/sign-in");
    },
    register: async () => {
      window.location.assign("/sign-up");
    },
    loginWithGoogle: async () => {
      window.location.assign("/sign-in");
    },
    logout: () => {
      signOut();
    },
  } as AuthContextType;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("skytrack_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email,
        role: "student",
      };

      setUser(mockUser);
      localStorage.setItem("skytrack_user", JSON.stringify(mockUser));

      const existingClasses = localStorage.getItem(
        `skytrack_classes_${mockUser.uid}`,
      );
      if (!existingClasses) {
        const sampleClasses = [
          {
            id: "class1",
            ownerUID: mockUser.uid,
            name: "Matemáticas",
            color: "#3b82f6",
            createdAt: new Date().toISOString(),
          },
          {
            id: "class2",
            ownerUID: mockUser.uid,
            name: "Historia",
            color: "#10b981",
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(
          `skytrack_classes_${mockUser.uid}`,
          JSON.stringify(sampleClasses),
        );

        const sampleNotes = [
          {
            id: "note1",
            ownerUID: mockUser.uid,
            classID: "class1",
            title: "Nota de Matemáticas",
            content:
              "Esta es una nota de ejemplo sobre álgebra.\n\nPuedes hacer click en esta nota para ver el detalle completo.\n\nLas notas se pueden editar y eliminar usando los botones que aparecen al pasar el mouse.",
            attachments: [],
            createdAt: new Date().toISOString(),
          },
          {
            id: "note2",
            ownerUID: mockUser.uid,
            classID: "class2",
            title: "Apuntes de Historia",
            content:
              "Notas sobre la Revolución Industrial.\n\n- Comenzó en Inglaterra en el siglo XVIII\n- Cambió la forma de producir bienes\n- Tuvo gran impacto social y económico",
            attachments: [],
            createdAt: new Date().toISOString(),
          },
          {
            id: "note3",
            ownerUID: mockUser.uid,
            classID: "",
            title: "Nota Personal",
            content:
              "Esta es una nota personal sin clase asociada.\n\nPuedes crear notas sin asociarlas a ninguna clase específica.",
            attachments: [],
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(
          `skytrack_notes_${mockUser.uid}`,
          JSON.stringify(sampleNotes),
        );
      }
    } catch (error) {
      throw new Error("Login failed");
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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      };

      setUser(newUser);
      localStorage.setItem("skytrack_user", JSON.stringify(newUser));
    } catch (error) {
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name: "Google User",
        email: "user@gmail.com",
        photoURL:
          "https://ui-avatars.com/api/?name=Google+User&background=6366f1&color=fff",
        role: "student",
      };

      setUser(mockUser);
      localStorage.setItem("skytrack_user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skytrack_user");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
    | string
    | undefined;

  if (clerkPublishableKey) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <ClerkAuthProvider>{children}</ClerkAuthProvider>
      </ClerkProvider>
    );
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
}
