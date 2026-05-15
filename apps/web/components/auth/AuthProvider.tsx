'use client';

import { createContext, use, useEffect, useState } from 'react';

import { api } from '@/lib/api';

interface AuthContextValue {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: null | User;
}

interface User {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

const AuthContext = createContext<AuthContextValue>({
  isLoaded: false,
  isSignedIn: false,
  user: null,
});

export function AuthProvider({
  children,
  hasSession = false,
}: {
  children: React.ReactNode;
  hasSession?: boolean;
}) {
  const [state, setState] = useState<AuthContextValue>({
    isLoaded: !hasSession,
    isSignedIn: false,
    user: null,
  });

  useEffect(() => {
    if (!hasSession) return;

    api
      .get<User>('/auth/me')
      .then(({ data }) => {
        setState({ isLoaded: true, isSignedIn: true, user: data });
      })
      .catch(() => {
        setState({ isLoaded: true, isSignedIn: false, user: null });
      });
  }, [hasSession]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return use(AuthContext);
}
