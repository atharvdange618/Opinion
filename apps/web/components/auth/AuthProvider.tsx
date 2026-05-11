"use client";

import { createContext, use, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface User {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextValue {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue>({
  isLoaded: false,
  isSignedIn: false,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextValue>({
    isLoaded: false,
    isSignedIn: false,
    user: null,
  });

  useEffect(() => {
    api
      .get<User>("/auth/me")
      .then(({ data }) => {
        setState({ isLoaded: true, isSignedIn: true, user: data });
      })
      .catch(() => {
        setState({ isLoaded: true, isSignedIn: false, user: null });
      });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return use(AuthContext);
}
