"use client";

import { getStorageProvider } from "@/lib/storage/StorageProvider";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  timezone?: string | null;
  is_verified?: boolean;
};

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthorized: boolean;
  isBootstrapping: boolean;
};

export type AuthContextValue = AuthState & {
  storage: ReturnType<typeof getStorageProvider>;
  login: (params: { name: string; password: string }) => Promise<void>;
  signup: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "retro.access_token";
const REFRESH_TOKEN_KEY = "retro.refresh_token";
const USER_KEY = "retro.user";

function readStoredJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeStoredJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function removeStored(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const storedAccess =
      typeof window !== "undefined"
        ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    const storedRefresh =
      typeof window !== "undefined"
        ? window.localStorage.getItem(REFRESH_TOKEN_KEY)
        : null;
    const storedUser = readStoredJSON<AuthUser>(USER_KEY);
    setAccessToken(storedAccess);
    setRefreshToken(storedRefresh);
    setUser(storedUser);
    setIsBootstrapping(false);
  }, []);

  const isAuthorized = !!accessToken;

  const setTokens = useCallback(
    (newAccess: string | null, newRefresh: string | null) => {
      setAccessToken(newAccess);
      setRefreshToken(newRefresh);
      if (newAccess) {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
      } else {
        removeStored(ACCESS_TOKEN_KEY);
      }
      if (newRefresh) {
        window.localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);
      } else {
        removeStored(REFRESH_TOKEN_KEY);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    getStorageProvider().logout();
    setTokens(null, null);
    setUser(null);
    removeStored(USER_KEY);
  }, [setTokens]);

  const login = useCallback(
    async ({ name, password }: { name: string; password: string }) => {
      const data = await getStorageProvider().login(name, password);
      setTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      writeStoredJSON(USER_KEY, data.user);
    },
    [setTokens],
  );

  const signup = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const data = await getStorageProvider().signup(password, email, name);
      setTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      writeStoredJSON(USER_KEY, data.user);
    },
    [setTokens],
  );

  const refreshTokenIfNeeded = useCallback(async () => {
    if (!refreshToken) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) return;

    try {
      const res = await fetch(`${baseUrl}/users/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }, [refreshToken, setTokens, logout]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (isAuthorized) {
          refreshTokenIfNeeded();
        }
      },
      1000 * 60 * 14,
    ); // Refresh every 14 minutes

    return () => clearInterval(interval);
  }, [isAuthorized, refreshTokenIfNeeded]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthorized,
      isBootstrapping,
      login,
      signup,
      logout,
      setTokens,
      storage: getStorageProvider(),
    }),
    [
      user,
      accessToken,
      refreshToken,
      isAuthorized,
      isBootstrapping,
      login,
      signup,
      logout,
      setTokens,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
