"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/lib/auth";
import { usePublicCreators } from "@/lib/hooks/useCreators";
import { useProposals } from "@/lib/hooks/useProposals";
import { useUnreadCount } from "@/lib/socket";
import { useCampaignModal } from "@/lib/CampaignModalContext";

export default function BrandOverview() {
  const user = useAuthStore((state) => state.user);
  const creators = usePublicCreators();
  const proposals = useProposals();
  const unread = useUnreadCount();
  const { openModal } = useCampaignModal();
  const allProposals = proposals.data?.proposals || [];
  const active = allProposals.filter((p: any) => p.status === "accepted");
  const pending = allProposals.filter((p: any) => p.status === "pending");

  return (
    <div className="max-w-[1200px] space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
          </p>
          <h1 className="text-h2 font-display mt-1">
            Welcome back, <span className="font-serif text-(--text-secondary)">{user?.fullName || "Brand"}.</span>
          </h1>
        </div>
        <button
          onClick={openModal}
          className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors shrink-0"
          data-interactive
        >
          <Plus size={14} aria-hidden />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/brand/campaigns">
          <StatCard label="Active Deals" value={active.length} trend={0} trendUp />
        </Link>
        <Link href="/dashboard/brand/campaigns">
          <StatCard label="Pending Proposals" value={pending.length} trend={0} trendUp />
        </Link>
        <Link href="/dashboard/brand/messages">
          <StatCard label="Unread Messages" value={unread.data?.totalUnread || 0} trend={0} trendUp />
        </Link>
        <Link href="/dashboard/brand/discover">
          <StatCard label="Creator Matches" value={creators.data?.creators?.length || 0} trend={0} trendUp />
        </Link>
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
            <Link key={creator.id} href={`/c/${creator.handle.replace(/^@/, "")}`} className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-4 hover:border-(--accent) transition-colors group">
              <div className="h-10 w-10 rounded-full bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-sm mb-3">{creator.name.charAt(0)}</div>
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
                <p className="text-sm text-(--text-tertiary) capitalize">{proposal.status}</p>
              </div>
              <p className="font-mono-utility text-sm shrink-0">${proposal.budget}</p>
            </div>
          ))}
          {allProposals.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-sm text-(--text-tertiary) mb-3">No proposals yet. Start a new campaign to invite creators.</p>
              <button onClick={openModal} className="h-9 px-4 rounded-lg bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors">
                Create campaign
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
