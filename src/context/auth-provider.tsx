"use client";

import { ApiProvider, LoginResponse } from "@/lib/api/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "@/lib/utils";
import { BackendApiProvider } from "@/lib/api/BackendApiProvider";
import { OfflineApiProvider } from "@/lib/api/OfflineApiProvider";

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
  storage: ApiProvider;
  login: (params: { name: string; password: string }) => Promise<void>;
  signup: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  forgotPassword(email: string): Promise<{ success: boolean }>;
  resetPassword(password: string, token: string): Promise<{ success: boolean }>;
  verifyEmail(token: string): Promise<{ success: boolean }>;
  resendVerificationEmail(email: string): Promise<{ success: boolean }>;
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

  const isAuthorized = !!accessToken;

  const storage = useMemo<ApiProvider>(() => {
    if (isAuthorized) {
      console.log("AuthProvider is providing: BackendApiProvider");
      return BackendApiProvider;
    }
    console.log("AuthProvider is providing: OfflineApiProvider");
    return OfflineApiProvider;
  }, [isAuthorized]);

  // get previous stored values
  useEffect(() => {
    const storedAccess = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefresh = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = readStoredJSON<AuthUser>(USER_KEY);

    setAccessToken(storedAccess);
    setRefreshToken(storedRefresh);
    setUser(storedUser);
    setIsBootstrapping(false);
  }, []);

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
    setTokens(null, null);
    setUser(null);
    removeStored(USER_KEY);
  }, [setTokens]);

  const login = useCallback(
    async ({ name, password }: { name: string; password: string }) => {
      const data = await apiFetch<LoginResponse>("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

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
      await apiFetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await apiFetch<LoginResponse>("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      setTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      writeStoredJSON(USER_KEY, data.user);
    },
    [setTokens],
  );

  const forgotPassword = useCallback(
    async (email: string): Promise<{ success: boolean }> => {
      await apiFetch("/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return { success: true };
    },
    [],
  );

  const resetPassword = useCallback(
    async (password: string, token: string): Promise<{ success: boolean }> => {
      await apiFetch("/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: password, token }),
      });
      return { success: true };
    },
    [],
  );

  const verifyEmail = useCallback(
    async (token: string): Promise<{ success: boolean }> => {
      await apiFetch("/users/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      return { success: true };
    },
    [],
  );

  const resendVerificationEmail = useCallback(
    async (email: string): Promise<{ success: boolean }> => {
      await apiFetch("/users/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return { success: true };
    },
    [],
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
      storage: storage,
      forgotPassword,
      resetPassword,
      verifyEmail,
      resendVerificationEmail,
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
      storage,
      forgotPassword,
      resetPassword,
      verifyEmail,
      resendVerificationEmail,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
