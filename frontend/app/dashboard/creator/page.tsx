"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useCreatorProfile } from "@/lib/hooks/useProfile";
import { useProposals } from "@/lib/hooks/useProposals";
import { type Proposal, getProfilePhotoUrl } from "@/lib/api";
import SectionLabel from "@/components/dashboard/SectionLabel";
import StatCard from "@/components/dashboard/StatCard";
import CircularProgress from "@/components/dashboard/CircularProgress";
import ProposalCarousel from "@/components/dashboard/ProposalCarousel";
import ProposalDrawer from "@/components/dashboard/ProposalDrawer";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const DEAL_STAGES = ["brief", "content_creation", "review", "approved", "posted", "paid"] as const;
const STAGE_LABEL: Record<string, string> = {
  brief: "Brief",
  content_creation: "In progress",
  review: "In review",
  approved: "Approved",
  posted: "Posted",
  paid: "Paid",
};

function greetingWord() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function deliverableProgress(p: Proposal) {
  const lines = (p.deliverables || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const done = (p.completedDeliverables || []).filter((d) => lines.includes(d)).length;
  return { total: lines.length, done };
}

export default function CreatorOverview() {
  const user = useAuthStore((state) => state.user);
  const profileQuery = useCreatorProfile();
  const inbound = useProposals("pending");
  const accepted = useProposals("accepted");
  const [openProposal, setOpenProposal] = useState<Proposal | null>(null);

  const profile = profileQuery.data?.profile || profileQuery.data;
  const firstName = (user?.fullName || "there").split(" ")[0];

  const completion = useMemo(() => {
    const factors = [
      Boolean(profile?.bio),
      Boolean(profile?.profilePhoto),
      Boolean(profile?.coverImage),
      (profile?.niches?.length || 0) > 0,
      Boolean(profile?.pricing?.starting),
      (profile?.brandWork?.length || 0) > 0,
      Object.values(user?.connectedPlatforms || {}).some(Boolean),
      Boolean(profile?.availability),
    ];
    const done = factors.filter(Boolean).length;
    return { pct: Math.round((done / factors.length) * 100), done, total: factors.length };
  }, [profile, user?.connectedPlatforms]);

  const missingHint = !profile?.bio
    ? "Add a bio"
    : !profile?.profilePhoto
    ? "Add a profile photo"
    : !(profile?.niches?.length > 0)
    ? "Pick your niches"
    : !profile?.pricing?.starting
    ? "Set your starting rate"
    : !(profile?.brandWork?.length > 0)
    ? "Upload portfolio work"
    : !Object.values(user?.connectedPlatforms || {}).some(Boolean)
    ? "Connect a platform"
    : "Add a cover image";

  const pendingList: Proposal[] = inbound.data?.proposals || [];
  const acceptedList: Proposal[] = accepted.data?.proposals || [];
  const activeDeals = acceptedList.filter((p) => p.dealStage !== "paid");

  const now = new Date();
  const thisMonthEarnings = acceptedList
    .filter((p) => p.dealStage === "paid" && p.updatedAt && new Date(p.updatedAt).getMonth() === now.getMonth() && new Date(p.updatedAt).getFullYear() === now.getFullYear())
    .reduce((sum, p) => sum + (p.budget || 0), 0);

  const profileViews30d = useMemo(() => {
    const log: string[] = profile?.profileViewLog || [];
    const cutoff = Date.now() - 30 * 86_400_000;
    return log.filter((t) => new Date(t).getTime() > cutoff).length;
  }, [profile?.profileViewLog]);

  // This quarter's monthly earnings — real, from deals marked "paid".
  const quarterSeries = useMemo(() => {
    const months = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("en-US", { month: "short" }), earnings: 0 };
    });
    acceptedList
      .filter((p) => p.dealStage === "paid" && p.updatedAt)
      .forEach((p) => {
        const d = new Date(p.updatedAt as string);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const bucket = months.find((m) => m.key === key);
        if (bucket) bucket.earnings += p.budget || 0;
      });
    return months;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedList]);
  const quarterTotal = quarterSeries.reduce((sum, m) => sum + m.earnings, 0);

  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });
  const isLoading = profileQuery.isLoading || inbound.isLoading || accepted.isLoading;

  return (
    <div className="max-w-[1200px] mx-auto space-y-12">
      <div>
        <SectionLabel index="01" label={`OVERVIEW · ${dateLabel.toUpperCase()}`} />
        <h1 className="text-h2 font-display mt-2">
          <span className="font-serif text-(--accent)">Hey</span> {firstName} 👋
        </h1>
        <p className="text-body text-(--text-secondary) mt-2">Here&apos;s your creator update for today.</p>
      </div>

      {/* Profile completion meter */}
      {!isLoading && (
        <section className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-6 flex items-center gap-6 flex-wrap">
          <CircularProgress value={completion.pct} />
          <div className="flex-1 min-w-[200px]">
            <p className="text-sm text-(--text-primary)">
              Your profile is <span className="text-(--accent) font-semibold">{completion.pct}%</span> complete.{" "}
              {completion.pct < 100 && <span className="text-(--text-secondary)">{missingHint} to attract better brands.</span>}
            </p>
            <Link href="/dashboard/creator/profile" className="inline-flex items-center gap-1 text-sm font-medium text-(--accent) hover:opacity-80 transition-opacity mt-2" data-interactive>
              Complete profile <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/creator/inbox" data-interactive>
          <StatCard label="Inbound Proposals" value={pendingList.length} pulseIfPositive />
        </Link>
        <Link href="/dashboard/creator/deals" data-interactive>
          <StatCard label="Active Deals" value={activeDeals.length} />
        </Link>
        <Link href="/dashboard/creator/earnings" data-interactive>
          <StatCard label="This Month Earnings" value={thisMonthEarnings} formatter={(n) => `₹${n.toLocaleString("en-IN")}`} />
        </Link>
        <Link href="/dashboard/creator/analytics" data-interactive>
          <StatCard label="Profile Views (30d)" value={profileViews30d} />
        </Link>
      </div>

      {/* New proposals */}
      <section>
        <SectionLabel index="02" label="NEW OPPORTUNITIES" />
        <h2 className="text-h3 font-display mt-2 mb-5">New opportunities.</h2>
        {isLoading ? <SkeletonCard /> : (
          <ProposalCarousel proposals={pendingList.slice(0, 5)} onOpen={setOpenProposal} />
        )}
      </section>

      {/* Active deals */}
      <section>
        <SectionLabel index="03" label="DEALS IN PROGRESS" />
        <h2 className="text-h3 font-display mt-2 mb-5">Deals in progress.</h2>
        {isLoading ? (
          <SkeletonCard />
        ) : activeDeals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-8 text-center">
            <p className="text-sm text-(--text-tertiary)">No active deals yet — accept a proposal to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDeals.map((deal) => {
              const brandName = deal.brandProfile?.companyName || (deal.brandId as { fullName?: string })?.fullName || "Brand";
              const { total, done } = deliverableProgress(deal);
              const stageIndex = DEAL_STAGES.indexOf((deal.dealStage || "brief") as (typeof DEAL_STAGES)[number]);
              const stageProgress = ((stageIndex + 1) / DEAL_STAGES.length) * 100;
              return (
                <div key={deal._id} className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-xs shrink-0">
                        {deal.brandProfile?.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={getProfilePhotoUrl(deal.brandProfile.logoUrl)} alt={brandName} className="h-full w-full object-cover" />
                        ) : (
                          brandName.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{deal.title}</p>
                        <p className="text-xs text-(--text-tertiary)">{brandName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
                        {total > 0 ? `${done}/${total} DELIVERABLES` : STAGE_LABEL[deal.dealStage || "brief"].toUpperCase()}
                      </span>
                      <Link
                        href="/dashboard/creator/deals"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-(--accent) text-(--bg-primary) text-xs font-semibold hover:bg-(--accent-hover) transition-colors"
                        data-interactive
                      >
                        <MessageSquare size={12} /> Message Brand
                      </Link>
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-(--bg-surface) overflow-hidden">
                    <div className="h-full bg-(--accent) transition-all duration-500" style={{ width: `${stageProgress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Earnings this quarter */}
      <section>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <SectionLabel index="04" label="EARNINGS THIS QUARTER" />
            <h2 className="text-h3 font-display mt-2">Earnings this quarter.</h2>
          </div>
          <div className="rounded-lg border border-(--accent) px-3 py-1.5">
            <span className="font-mono-utility text-mono-sm text-(--accent)">₹{quarterTotal.toLocaleString("en-IN")} TOTAL</span>
          </div>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={quarterSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
              <Tooltip
                contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`₹${Number(v).toLocaleString("en-IN")}`, "Earnings"]}
              />
              <Line type="monotone" dataKey="earnings" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <ProposalDrawer proposal={openProposal} onClose={() => setOpenProposal(null)} />
    </div>
  );
}
