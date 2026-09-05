"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SectionLabel from "@/components/dashboard/SectionLabel";
import CreatorCarousel from "@/components/dashboard/CreatorCarousel";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import Drawer from "@/components/dashboard/Drawer";
import { SkeletonCard } from "@/components/dashboard/Skeleton";
import { useAuthStore } from "@/lib/auth";
import { usePublicCreators } from "@/lib/hooks/useCreators";
import { useProposals, useDashboardSummary } from "@/lib/hooks/useProposals";
import { useActivity } from "@/lib/hooks/useActivity";
import { useCampaignModal } from "@/lib/CampaignModalContext";

function greetingWord() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function statusColor(status: string) {
  if (status === "accepted") return "text-(--success)";
  if (status === "declined") return "text-(--warning)";
  return "text-(--text-secondary)";
}

export default function BrandOverview() {
  const user = useAuthStore((state) => state.user);
  const creators = usePublicCreators();
  const proposals = useProposals();
  const summary = useDashboardSummary();
  const activity = useActivity();
  const { openModal } = useCampaignModal();
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  const allProposals = proposals.data?.proposals || [];
  const active = allProposals.filter((p: any) => p.status === "accepted");
  const pending = allProposals.filter((p: any) => p.status === "pending");
  const firstName = (user?.fullName || "there").split(" ")[0];

  const activeSparkline = useMemo(() => {
    const days = 7;
    const buckets = Array.from({ length: days }, () => 0);
    const now = Date.now();
    active.forEach((p: any) => {
      const t = new Date(p.updatedAt || p.createdAt).getTime();
      const daysAgo = Math.floor((now - t) / (1000 * 60 * 60 * 24));
      if (daysAgo >= 0 && daysAgo < days) buckets[days - 1 - daysAgo] += 1;
    });
    return buckets;
  }, [active]);

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-[1240px] mx-auto space-y-12">
      {/* Greeting block */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <SectionLabel index="01" label={`OVERVIEW · ${dateLabel.toUpperCase()}`} />
          <h1 className="text-h2 font-display mt-2">
            Good <span className="font-serif text-(--text-secondary)">{greetingWord()}</span>, {firstName}.
          </h1>
          <p className="text-body text-(--text-secondary) mt-2">
            Here&apos;s what&apos;s happening in your creator network today.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/brand/campaigns" data-interactive>
          <StatCard label="Active Campaigns" value={active.length} sparkline={activeSparkline} />
        </Link>
        <Link href="/dashboard/brand/discover" data-interactive>
          <StatCard
            label="Creators Engaged"
            value={summary.data?.creatorsHired ?? active.length}
            trend={0}
            trendUp
          />
        </Link>
        <Link href="/dashboard/brand/campaigns" data-interactive>
          <StatCard label="Pending Responses" value={pending.length} pulseIfPositive />
        </Link>
        <Link href="/dashboard/brand/analytics" data-interactive>
          <StatCard
            label="Total Spend"
            value={summary.data?.totalSpend ?? 0}
            formatter={(n) => `₹${n.toLocaleString("en-IN")}`}
            trend={0}
            trendUp
          />
        </Link>
      </div>

      {/* Curated creators */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <div>
            <SectionLabel index="02" label="CURATED FOR YOUR BRAND" />
            <h2 className="text-h3 font-display mt-2">
              Creators picked for <span className="font-serif text-(--accent)">you.</span>
            </h2>
          </div>
          <Link
            href="/dashboard/brand/discover"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-(--accent) hover:opacity-80 transition-opacity shrink-0"
            data-interactive
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {creators.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <CreatorCarousel
            creators={(creators.data?.creators || []).slice(0, 8)}
            onInvite={(creatorId) => openModal(creatorId)}
          />
        )}
      </section>

      {/* Active campaigns table */}
      <section>
        <SectionLabel index="03" label="CAMPAIGNS IN FLIGHT" />
        <h2 className="text-h3 font-display mt-2 mb-5">Campaigns in flight.</h2>

        {proposals.isLoading ? (
          <SkeletonCard />
        ) : allProposals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-10 text-center">
            <p className="text-(--text-tertiary) mb-4">No campaigns yet.</p>
            <button
              onClick={() => openModal()}
              className="h-10 px-5 rounded-xl bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors"
              data-interactive
            >
              Create your first campaign
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1.2fr_0.8fr_0.8fr_0.8fr] gap-4 px-5 py-3 border-b border-(--border) font-mono-utility text-mono-sm text-(--text-tertiary)">
              <span>CAMPAIGN</span>
              <span>CREATOR</span>
              <span>STATUS</span>
              <span>BUDGET</span>
              <span>DEADLINE</span>
            </div>
            <div>
              {allProposals.slice(0, 8).map((p: any) => (
                <button
                  key={p._id}
                  onClick={() => setSelectedProposal(p)}
                  className="card-accent w-full grid grid-cols-2 md:grid-cols-[2fr_1.2fr_0.8fr_0.8fr_0.8fr] gap-2 md:gap-4 px-5 py-4 border-b border-(--border) last:border-b-0 text-left transition-colors duration-150 hover:bg-(--bg-surface)"
                  data-interactive
                >
                  <span className="font-semibold text-sm truncate col-span-2 md:col-span-1">{p.title}</span>
                  <span className="text-sm text-(--text-secondary) truncate">{p.creatorId?.fullName || "Creator"}</span>
                  <span className={`text-sm capitalize ${statusColor(p.status)}`}>{p.status}</span>
                  <span className="font-mono-utility text-sm">₹{p.budget?.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-(--text-tertiary)">{new Date(p.deadline).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Live activity feed */}
      <section>
        <SectionLabel index="04" label="LIVE ACTIVITY" />
        <h2 className="text-h3 font-display mt-2 mb-5">Live activity.</h2>
        {activity.isLoading ? <SkeletonCard /> : <ActivityFeed items={activity.data?.activity || []} />}
      </section>

      {/* Campaign detail drawer */}
      <Drawer open={Boolean(selectedProposal)} onClose={() => setSelectedProposal(null)} title={selectedProposal?.title}>
        {selectedProposal && (
          <div className="space-y-6">
            <span className={`font-mono-utility text-mono-sm capitalize ${statusColor(selectedProposal.status)}`}>
              {selectedProposal.status}
            </span>
            <div>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">BRIEF</p>
              <p className="text-sm text-(--text-secondary) leading-relaxed">{selectedProposal.description}</p>
            </div>
            <div>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">DELIVERABLES</p>
              <p className="text-sm text-(--text-secondary) leading-relaxed whitespace-pre-line">{selectedProposal.deliverables}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">BUDGET</p>
                <p className="text-h3 font-display">₹{selectedProposal.budget?.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">DEADLINE</p>
                <p className="text-h3 font-display">{new Date(selectedProposal.deadline).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">CREATOR</p>
              <p className="text-sm">{selectedProposal.creatorId?.fullName || "Creator"}</p>
            </div>
            <Link
              href={`/dashboard/brand/campaigns/${selectedProposal._id}`}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors"
              data-interactive
            >
              View full campaign <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </Drawer>
    </div>
  );
}
