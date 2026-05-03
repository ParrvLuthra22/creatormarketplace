"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, unwrap } from "@/lib/api";
import { useAuthStore, User } from "@/lib/auth";
import { showToast } from "@/lib/toast";

export function useUser() {
  const refreshUser = useAuthStore((state) => state.refreshUser);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: refreshUser,
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  return useMutation({ mutationFn: logout });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) =>
      unwrap<{ user: User; profile: any }>(await api.post("/api/auth/login", payload)),
    onSuccess: (data) => {
      setUser(data.user, data.profile);
      queryClient.invalidateQueries();
      router.push(data.user.accountType === "Brand" ? "/dashboard/brand" : "/dashboard/creator");
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (payload: {
      fullName: string;
      email: string;
      password: string;
      accountType: "Brand" | "Creator";
      instagramHandle?: string;
      plan?: string;
      selectedPlan?: string;
    }) => unwrap<{ user: User; profile: any }>(await api.post("/api/auth/signup", payload)),
    onSuccess: (data) => {
      setUser(data.user, data.profile);
      showToast("Account created. Check your email to verify your address.", "success");
      router.push("/onboarding");
    },
  });
}
