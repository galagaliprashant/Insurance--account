import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as secureStorage from "./secure-storage";
import * as api from "./api";

const USER_KEY = "pp_session_user";

interface SessionState {
  isLoading: boolean;
  user: api.AuthResponse["user"] | null;
  signIn: (phone: string, password: string) => Promise<void>;
  signUp: (name: string, phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<api.AuthResponse["user"] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [token, storedUser] = await Promise.all([api.getToken(), secureStorage.getItem(USER_KEY)]);
        if (token && storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (res: api.AuthResponse) => {
    await api.setToken(res.token);
    await secureStorage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
  }, []);

  const signIn = useCallback(async (phone: string, password: string) => {
    await persist(await api.login({ phone, password }));
  }, [persist]);

  const signUp = useCallback(async (name: string, phone: string, password: string) => {
    await persist(await api.signup({ name, phone, password }));
  }, [persist]);

  const signOut = useCallback(async () => {
    await api.clearToken();
    await secureStorage.deleteItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <SessionContext.Provider value={{ isLoading, user, signIn, signUp, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
