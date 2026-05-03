"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";
import { showToast } from "@/lib/toast";

export function useVerificationStatus() {
  return useQuery({
    queryKey: ["verification", "status"],
    queryFn: async () => unwrap<any>(await api.get("/api/verification/status")),
  });
}

export function useRequestVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { evidence?: { type: string; url: string }[] }) =>
      unwrap<any>(await api.post("/api/verification/request", payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification"] });
      showToast("Verification request submitted", "success");
    },
  });
}
