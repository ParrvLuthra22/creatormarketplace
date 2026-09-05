"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import { api, unwrap, API_URL } from "@/lib/api";

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
  notificationPreferences?: {
    newProposal: boolean;
    newMessage: boolean;
    weeklyDigest: boolean;
  };
  connectedPlatforms?: {
    google: boolean;
    instagram: boolean;
    youtube: boolean;
    twitter: boolean;
    linkedin: boolean;
    snapchat: boolean;
  };
  isAdmin?: boolean;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Derived from user.accountType — kept in sync by setUser/refreshUser/logout. */
  isBrand: boolean;
  /** Derived from user.accountType — kept in sync by setUser/refreshUser/logout. */
  isCreator: boolean;
  /** Raw JWT, fetched alongside the user in refreshUser() — needed by hooks/useSocket.ts's socket.io `auth` handshake. */
  authToken: string | null;
  setUser: (user: User | null, profile?: any) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isBrand: false,
  isCreator: false,
  authToken: null,
  setUser: (user, profile = null) =>
    set({
      user,
      profile,
      isAuthenticated: Boolean(user),
      isLoading: false,
      isBrand: user?.accountType === "Brand",
      isCreator: user?.accountType === "Creator",
    }),
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
        isBrand: data.user?.accountType === "Brand",
        isCreator: data.user?.accountType === "Creator",
      });

      // Fetch the raw token for socket auth — best-effort, non-fatal.
      try {
        const tokenRes = await fetch(`${API_URL}/api/auth/token`, { credentials: "include" });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData.token) set({ authToken: tokenData.token });
        }
      } catch {
        // Not critical — socket falls back to cookie-based auth.
      }

      return data.user;
    } catch {
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false, isBrand: false, isCreator: false, authToken: null });
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
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false, isBrand: false, isCreator: false, authToken: null });
      if (typeof window !== "undefined") window.location.href = "/login";
    }
  },
}));
