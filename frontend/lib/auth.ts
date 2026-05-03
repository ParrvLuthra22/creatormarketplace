"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import { api, unwrap } from "@/lib/api";

export type AccountType = "Brand" | "Creator";

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  accountType: AccountType;
  plan?: string;
  subscriptionStatus?: string;
  emailVerified?: boolean;
  verificationStatus?: string;
  verificationBadge?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null, profile?: any) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user, profile = null) =>
    set({ user, profile, isAuthenticated: Boolean(user), isLoading: false }),
  refreshUser: async () => {
    try {
      const data = unwrap<{ user: User; profile: any }>(
        await api.get("/api/auth/me", {
          skipAuthRedirect: true,
          skipErrorToast: true,
        } as any)
      );
      set({
        user: data.user,
        profile: data.profile,
        isAuthenticated: true,
        isLoading: false,
      });
      return data.user;
    } catch {
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },
  logout: async () => {
    try {
      await api.post("/api/auth/logout", undefined, {
        skipAuthRedirect: true,
        skipErrorToast: true,
      } as any);
    } finally {
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  },
}));
