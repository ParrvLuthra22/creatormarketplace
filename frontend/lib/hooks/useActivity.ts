"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";

export interface ActivityItem {
  id: string;
  type: "proposal_created" | "proposal_accepted" | "proposal_declined" | "message" | "verification";
  text: string;
  highlight?: string;
  timestamp: string;
  href?: string;
}

export function useActivity() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: async () => unwrap<{ activity: ActivityItem[] }>(await api.get("/api/activity")),
    refetchInterval: 30_000,
  });
}
