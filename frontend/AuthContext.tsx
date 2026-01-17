import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'ADMIN' | 'ISA' | 'DDE' | 'ZDE' | 'ADE' | null;

type AuthContextType = {
  id: number | null;
  name: string | null;
  isLoggedIn: boolean;
  role: Role;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

type JWTPayload = {
  id: number;
  name: string;
  role: Role;
  exp: number;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 App startup
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode<JWTPayload>(token);
          setRole(decoded.role);
          setId(decoded.id); // Assuming 'exp' is being used as user ID here
          setName(decoded.name);
        }
      } catch {
        await AsyncStorage.removeItem('token');
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  // 🔹 Login
  const login = async (token: string) => {
    setLoading(true);

    const decoded = jwtDecode<JWTPayload>(token);

    setRole(decoded.role);
    setLoading(false);
  };

  // 🔹 Logout
  const logout = async () => {
    setLoading(true);

    await AsyncStorage.removeItem('token');
    setRole(null);

    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        id: id,
        name: name,
        isLoggedIn: !!role,
        role,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
