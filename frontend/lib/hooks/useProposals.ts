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
