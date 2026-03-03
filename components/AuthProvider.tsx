"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, firebaseEnabled } from "@/lib/firebase";

type Plan = "free" | "pro";

type Entitlements = {
  authenticated: boolean;
  plan: Plan;
  isPro: boolean;
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
};

type AuthContextValue = {
  user: FirebaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  plan: Plan;
  isPro: boolean;
  entitlements: Entitlements;
  firebaseEnabled: boolean;
  signInWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  refreshEntitlements: () => Promise<void>;
};

const DEFAULT_ENTITLEMENTS: Entitlements = {
  authenticated: false,
  plan: "free",
  isPro: false,
  dailyLimit: 5,
  usedToday: 0,
  remainingToday: 5,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState<Entitlements>(DEFAULT_ENTITLEMENTS);

  const getIdToken = useCallback(async () => {
    if (!auth?.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch {
      return null;
    }
  }, []);

  const refreshEntitlements = useCallback(async () => {
    const token = await getIdToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch("/api/entitlements", { headers, cache: "no-store" });
      const data = await res.json();

      if (!res.ok || data?.error) {
        setEntitlements((prev) => ({
          ...prev,
          authenticated: Boolean(token),
        }));
        return;
      }

      setEntitlements({
        authenticated: Boolean(data.authenticated),
        plan: data.plan === "pro" ? "pro" : "free",
        isPro: Boolean(data.isPro),
        dailyLimit: Number(data.dailyLimit ?? 5),
        usedToday: Number(data.usedToday ?? 0),
        remainingToday: Number(data.remainingToday ?? 0),
      });
    } catch {
      setEntitlements((prev) => ({
        ...prev,
        authenticated: Boolean(token),
      }));
    }
  }, [getIdToken]);

  const signInWithGoogle = useCallback(async () => {
    if (!firebaseEnabled || !auth) {
      return {
        ok: false,
        error: "Firebase Auth не настроен. Заполни NEXT_PUBLIC_FIREBASE_* переменные.",
      };
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await refreshEntitlements();
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось выполнить вход через Google.";
      return { ok: false, error: message };
    }
  }, [refreshEntitlements]);

  const signOutUser = useCallback(async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } finally {
      setEntitlements(DEFAULT_ENTITLEMENTS);
    }
  }, []);

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setLoading(false);
      setUser(null);
      setEntitlements(DEFAULT_ENTITLEMENTS);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        await refreshEntitlements();
      } else {
        setEntitlements(DEFAULT_ENTITLEMENTS);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [refreshEntitlements]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      plan: entitlements.plan,
      isPro: entitlements.isPro,
      entitlements,
      firebaseEnabled,
      signInWithGoogle,
      signOutUser,
      getIdToken,
      refreshEntitlements,
    }),
    [entitlements, getIdToken, loading, refreshEntitlements, signInWithGoogle, signOutUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

