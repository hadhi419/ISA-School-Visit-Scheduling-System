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
  email: string | null;
};

type JWTPayload = {
  id: number;
  name: string;
  role: Role;
  exp: number;
  email: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  const bootstrapAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode<JWTPayload>(token);

        const now = Math.floor(Date.now() / 1000); // current time in seconds
        if (decoded.exp < now) {
          // token expired
          await AsyncStorage.removeItem('token');
          setRole(null);
          setId(null);
          setName(null);
        } else {
          setRole(decoded.role);
          setId(decoded.id);
          setName(decoded.name);
          setEmail(decoded.email);
        }
      }
    } catch {
      await AsyncStorage.removeItem('token');
      setRole(null);
      setId(null);
      setName(null);
      setEmail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timeout: number | undefined;

    const setupAutoLogout = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode<JWTPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = decoded.exp - now;

      if (secondsLeft <= 0) {
        logout();
      } else {
        timeout = setTimeout(() => {
          logout();
        }, secondsLeft * 1000);
      }
    };

    setupAutoLogout();

    return () => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
    };
  }, [role]);

  // 🔹 App startup
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode<JWTPayload>(token);
          console.log(decoded);
          setRole(decoded.role);
          setId(decoded.id); // Assuming 'exp' is being used as user ID here
          setName(decoded.name);
          setEmail(decoded.email);
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
    console.log(decoded);
    setRole(decoded.role);
    setId(decoded.id);
    setName(decoded.name);
    setLoading(false);
    setEmail(decoded.email);
  };

  // 🔹 Logout
  const logout = async () => {
    setLoading(true);

    await AsyncStorage.removeItem('token');
    setRole(null);
    setId(null);
    setName(null);
    setEmail(null);

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
        email: email,
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
