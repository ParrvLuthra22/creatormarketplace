"use client";

import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/lib/auth";
import { useCreatorProfile } from "@/lib/hooks/useProfile";
import { useProposals } from "@/lib/hooks/useProposals";

export default function CreatorOverview() {
  const user = useAuthStore((state) => state.user);
  const profile = useCreatorProfile();
  const inbound = useProposals("pending");
  const accepted = useProposals("accepted");
  const profileData = profile.data?.profile || profile.data;
  const completion = [
    profileData?.bio,
    profileData?.profilePhoto,
    profileData?.niches?.length,
    profileData?.pricing,
    profileData?.brandWork?.length,
  ].filter(Boolean).length * 20;

  return (
    <div className="max-w-[1200px] space-y-8">
      <div>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
        </p>
        <h1 className="text-h2 font-display mt-1">
          Welcome, <span className="font-serif text-(--text-secondary)">{user?.fullName || "Creator"}.</span>
        </h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Inbound Requests" value={inbound.data?.proposals?.length || 0} trend={0} trendUp />
        <StatCard label="Active Deals" value={accepted.data?.proposals?.length || 0} trend={0} trendUp />
        <StatCard label="Profile Completion" value={completion} suffix="%" trend={0} trendUp />
        <StatCard label="Followers" value={profileData?.combinedFollowerCount || profileData?.instagramFollowerCount || 0} trend={0} trendUp />
      </div>
      <section className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h3 font-display">Profile health</h2>
            <p className="text-sm text-(--text-secondary)">Complete your profile to improve brand matching.</p>
          </div>
          <Link href="/dashboard/creator/profile" className="text-sm font-medium text-(--accent)">Edit profile →</Link>
        </div>
      </section>
    </div>
  );
}
