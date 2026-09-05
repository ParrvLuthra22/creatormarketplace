"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";
import { showToast } from "@/lib/toast";

export interface AdminUserFilters {
  page?: number;
  role?: "Brand" | "Creator" | "";
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected" | "";
  suspended?: "true" | "false" | "";
  plan?: "free" | "basic" | "pro" | "";
  search?: string;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => unwrap<any>(await api.get("/api/admin/stats")),
    refetchInterval: 60_000,
  });
}

export function useAdminActivity() {
  return useQuery({
    queryKey: ["admin", "activity"],
    queryFn: async () => unwrap<any>(await api.get("/api/admin/activity")),
    refetchInterval: 60_000,
  });
}

export function useAdminUsers(filters: AdminUserFilters = {}) {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: async () => unwrap<any>(await api.get("/api/admin/users", { params: filters })),
  });
}

export function useAdminUser(id?: string) {
  return useQuery({
    queryKey: ["admin", "users", id],
    enabled: Boolean(id),
    queryFn: async () => unwrap<any>(await api.get(`/api/admin/users/${id}`)),
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; verificationBadge?: string; isAdmin?: boolean; plan?: string }) =>
      unwrap<any>(await api.patch(`/api/admin/users/${id}`, payload)),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", variables.id] });
      showToast("User updated", "success");
    },
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrap<any>(await api.post(`/api/admin/users/${id}/suspend`)),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
      showToast("User suspended", "success");
    },
  });
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrap<any>(await api.post(`/api/admin/users/${id}/unsuspend`)),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
      showToast("User unsuspended", "success");
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrap<any>(await api.delete(`/api/admin/users/${id}`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      showToast("User deleted", "success");
    },
  });
}

export function useVerificationRequests(filters: { status?: "pending" | "approved" | "rejected"; page?: number } = {}) {
  return useQuery({
    queryKey: ["admin", "verification-requests", filters],
    queryFn: async () => unwrap<any>(await api.get("/api/admin/verification-requests", { params: filters })),
  });
}

export function useApproveVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, badge, notes }: { id: string; badge: "verified" | "premium"; notes?: string }) =>
      unwrap<any>(await api.post(`/api/admin/verification-requests/${id}/approve`, { badge, notes })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "verification-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      showToast("Verification approved", "success");
    },
  });
}

export function useRejectVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason, notes }: { id: string; reason: string; notes?: string }) =>
      unwrap<any>(await api.post(`/api/admin/verification-requests/${id}/reject`, { reason, notes })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "verification-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      showToast("Verification rejected", "success");
    },
  });
}
