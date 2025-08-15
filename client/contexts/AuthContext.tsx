import React, { createContext, useContext, useState, useEffect } from 'react';

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
  register: (email: string, password: string, name: string, role: User['role']) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('skytrack_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        role: 'student'
      };
      
      setUser(mockUser);
      localStorage.setItem('skytrack_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: User['role']) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role
      };
      
      setUser(newUser);
      localStorage.setItem('skytrack_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name: 'Google User',
        email: 'user@gmail.com',
        photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=6366f1&color=fff',
        role: 'student'
      };
      
      setUser(mockUser);
      localStorage.setItem('skytrack_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skytrack_user');
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
