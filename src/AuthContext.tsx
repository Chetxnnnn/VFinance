"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type User = { id: string; email: string } | null;
type AuthState = { loading: boolean; authenticated: boolean; user: User };

const AuthContext = createContext<AuthState>({ loading: true, authenticated: false, user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ loading: true, authenticated: false, user: null });

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data.authenticated) {
          setState({ loading: false, authenticated: true, user: data.user });
        } else {
          setState({ loading: false, authenticated: false, user: null });
        }
      })
      .catch(() => {
        if (mounted) setState({ loading: false, authenticated: false, user: null });
      });
    return () => { mounted = false; };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
