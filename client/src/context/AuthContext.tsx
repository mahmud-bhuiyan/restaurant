import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
import type { AuthResponse, User } from "../types/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    address?: string;
  }) => Promise<User>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { user } = await api<{ user: User }>("/auth/me");
      setUser(user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(user);
    return user;
  }, []);

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      address?: string;
    }) => {
      const { user } = await api<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setUser(user);
      return user;
    },
    [],
  );

  const logout = useCallback(async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data: { name?: string; phone?: string; address?: string }) => {
      const { user } = await api<{ user: User }>("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      setUser(user);
      return user;
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAdmin: user?.role === "ADMIN",
    }),
    [user, loading, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
