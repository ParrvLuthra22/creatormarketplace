"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/lib/auth";
import { usePublicCreators } from "@/lib/hooks/useCreators";
import { useProposals } from "@/lib/hooks/useProposals";
import { useUnreadCount } from "@/lib/socket";

export default function BrandOverview() {
  const user = useAuthStore((state) => state.user);
  const creators = usePublicCreators();
  const proposals = useProposals();
  const unread = useUnreadCount();
  const allProposals = proposals.data?.proposals || [];
  const active = allProposals.filter((p: any) => p.status === "accepted");
  const pending = allProposals.filter((p: any) => p.status === "pending");

  return (
    <div className="max-w-[1200px] space-y-8">
      <div>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
        </p>
        <h1 className="text-h2 font-display mt-1">
          Welcome back, <span className="font-serif text-(--text-secondary)">{user?.fullName || "Brand"}.</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Deals" value={active.length} trend={0} trendUp />
        <StatCard label="Pending Proposals" value={pending.length} trend={0} trendUp />
        <StatCard label="Unread Messages" value={unread.data?.totalUnread || 0} trend={0} trendUp />
        <StatCard label="Creator Matches" value={creators.data?.creators?.length || 0} trend={0} trendUp />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-display">Recommended creators</h2>
          <Link href="/dashboard/brand/discover" className="text-sm font-medium text-(--accent) flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(creators.data?.creators || []).slice(0, 6).map((creator: any) => (
            <Link key={creator.id} href={`/c/${creator.handle.replace(/^@/, "")}`} className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-4 hover:border-(--accent) transition-colors">
              <p className="font-semibold">{creator.name}</p>
              <p className="text-sm text-(--text-tertiary)">{creator.handle}</p>
              <p className="mt-3 text-xs text-(--text-secondary)">{(creator.niches || []).join(", ") || "Creator"}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h3 font-display mb-4">Recent proposals</h2>
        <div className="rounded-2xl border border-(--border) bg-(--bg-secondary) divide-y divide-(--border)">
          {allProposals.slice(0, 6).map((proposal: any) => (
            <div key={proposal._id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{proposal.title}</p>
                <p className="text-sm text-(--text-tertiary)">{proposal.status}</p>
              </div>
              <p className="font-mono-utility text-sm">${proposal.budget}</p>
            </div>
          ))}
          {allProposals.length === 0 && <p className="p-4 text-sm text-(--text-tertiary)">No proposals yet. Start a new campaign to invite creators.</p>}
        </div>
      </section>
    </div>
  );
}
