"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { api, unwrap } from "@/lib/api";

export function normalizeCreator(item: any) {
  const profile = item.profile || item.creatorProfile || item;
  const user = item.user || item;
  return {
    id: item.id || user._id || user.id,
    name: item.name || user.fullName || profile.name || "Creator",
    handle: profile.instagramHandle
      ? `@${String(profile.instagramHandle).replace(/^@+/, "")}`
      : item.instagramHandle
        ? `@${String(item.instagramHandle).replace(/^@+/, "")}`
        : "@creator",
    profilePicture: item.profilePicture || item.profilePhoto || profile.profilePhoto || null,
    niches: profile.niches || (item.category ? [item.category] : []),
    followers: profile.instagramFollowerCount || profile.followers || item.followers || 0,
    engagement: profile.engagement || item.engagement || null,
    pricing: profile.pricing || null,
    verificationBadge: user.verificationBadge || "none",
    raw: item,
  };
}

export function usePublicCreators(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["creators", "public", filters],
    queryFn: async () => {
      const data = unwrap<any>(await api.get("/api/profile/creators/public", { params: filters }));
      return {
        ...data,
        creators: (data.creators || []).map(normalizeCreator),
      };
    },
  });
}

export function useCreatorById(userId?: string) {
  return useQuery({
    queryKey: ["creators", userId],
    enabled: Boolean(userId),
    queryFn: async () => unwrap<any>(await api.get(`/api/profile/creators/${userId}/public`)),
  });
}

export function useCreatorByHandle(handle?: string) {
  return useQuery({
    queryKey: ["creators", "handle", handle],
    enabled: Boolean(handle),
    queryFn: async () =>
      unwrap<any>(await api.get(`/api/profile/creator/by-handle/${String(handle).replace(/^@+/, "")}`)),
  });
}
