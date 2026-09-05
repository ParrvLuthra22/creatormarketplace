"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";
import { showToast } from "@/lib/toast";

export function useProposals(status?: string) {
  return useQuery({
    queryKey: ["proposals", status || "all"],
    queryFn: async () =>
      unwrap<any>(await api.get("/api/proposals", { params: status ? { status } : undefined })),
  });
}

/** Real backend aggregation: totalSpend, creatorsHired, pendingProposals (brand-only). */
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["proposals", "dashboard-summary"],
    queryFn: async () => unwrap<any>(await api.get("/api/proposals/dashboard-summary")),
  });
}

export function useProposal(id?: string) {
  return useQuery({
    queryKey: ["proposals", "detail", id],
    enabled: Boolean(id),
    queryFn: async () => unwrap<any>(await api.get(`/api/proposals/${id}`)),
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      creatorId: string;
      title: string;
      description: string;
      budget: number;
      deliverables: string;
      deadline: string;
    }) => unwrap<any>(await api.post("/api/proposals", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      showToast("Proposal sent", "success");
    },
  });
}

export function useAcceptProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrap<any>(await api.put(`/api/proposals/${id}/accept`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proposals"] }),
  });
}

export function useDeclineProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => unwrap<any>(await api.put(`/api/proposals/${id}/decline`)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proposals"] }),
  });
}

export function useAdvanceDealStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) =>
      unwrap<any>(await api.put(`/api/proposals/${id}/stage`, { stage })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proposals"] }),
  });
}

export function useToggleDeliverable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, item, completed }: { id: string; item: string; completed: boolean }) =>
      unwrap<any>(await api.put(`/api/proposals/${id}/deliverables`, { item, completed })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proposals"] }),
  });
}
