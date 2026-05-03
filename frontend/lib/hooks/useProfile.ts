"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { showToast } from "@/lib/toast";

export function useCreatorProfile(userId?: string) {
  const user = useAuthStore((state) => state.user);
  const id = userId || user?.id || user?._id;
  return useQuery({
    queryKey: ["profile", "creator", id],
    enabled: Boolean(id),
    queryFn: async () => unwrap<any>(await api.get(`/api/profile/creator/${id}`)),
  });
}

export function useBrandProfile(userId?: string) {
  const user = useAuthStore((state) => state.user);
  const id = userId || user?.id || user?._id;
  return useQuery({
    queryKey: ["profile", "brand", id],
    enabled: Boolean(id),
    queryFn: async () => unwrap<any>(await api.get(`/api/profile/brand/${id}`)),
  });
}

export function useUpdateCreatorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, any>) =>
      unwrap<any>(await api.put("/api/profile/creator", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showToast("Creator profile updated", "success");
    },
  });
}

export function useUpdateBrandProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, any>) =>
      unwrap<any>(await api.put("/api/profile/brand", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showToast("Brand profile updated", "success");
    },
  });
}
