"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { showToast } from "@/lib/toast";

export function useRefreshStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => unwrap<any>(await api.post("/api/profile/creator/refresh-stats")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showToast("Stats refresh started", "success");
    },
  });
}

export function useDisconnectProvider() {
  const refreshUser = useAuthStore((state) => state.refreshUser);
  return useMutation({
    mutationFn: async (provider: string) => unwrap<any>(await api.post("/api/auth/disconnect", { provider })),
    onSuccess: async () => {
      await refreshUser();
      showToast("Disconnected", "success");
    },
  });
}
