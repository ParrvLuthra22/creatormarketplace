"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { useCreatorProfile } from "@/lib/hooks/useProfile";
import { useProposals } from "@/lib/hooks/useProposals";
import { type Proposal } from "@/lib/api";
import SectionLabel from "@/components/dashboard/SectionLabel";
import StatCard from "@/components/dashboard/StatCard";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CreatorAnalytics() {
  const profileQuery = useCreatorProfile();
  const proposals = useProposals();

  const profile = profileQuery.data?.profile || profileQuery.data;
  const all: Proposal[] = proposals.data?.proposals || [];
  const accepted = all.filter((p) => p.status === "accepted");
  const acceptanceRate = all.length ? (accepted.length / all.length) * 100 : 0;

  const profileViews30d = useMemo(() => {
    const log: string[] = profile?.profileViewLog || [];
    const cutoff = Date.now() - 30 * 86_400_000;
    return log.filter((t) => new Date(t).getTime() > cutoff).length;
  }, [profile?.profileViewLog]);

  // Real: when brands actually send proposals, bucketed by day of week.
  const byDayOfWeek = useMemo(() => {
    const buckets = DAYS.map((label) => ({ label, count: 0 }));
    all.forEach((p) => {
      const day = new Date(p.createdAt).getDay();
      buckets[day].count += 1;
    });
    return buckets;
  }, [all]);

  // Sample: Proposal data doesn't carry niche tags, and a creator has only their
  // own ≤3 registered niches — there's no real per-niche performance signal to
  // chart yet, so this is illustrative relative interest, clearly labeled.
  const niches: string[] = profile?.niches?.length ? profile.niches : ["Your niches"];
  const sampleNichePerformance = niches.map((n, i) => ({ label: n, value: 100 - i * 22 }));

  const isLoading = profileQuery.isLoading || proposals.isLoading;

  return (
    <div className="max-w-[1100px] mx-auto space-y-10">
      <div>
        <SectionLabel index="01" label="ANALYTICS" />
        <h1 className="text-h2 font-display mt-2">Your analytics.</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Profile Views (30d)" value={profileViews30d} />
        <StatCard label="Inbound Proposals" value={all.length} />
        <StatCard label="Acceptance Rate" value={acceptanceRate} formatter={(n) => `${n.toFixed(0)}%`} />
        <StatCard label="Active Deals" value={accepted.filter((p) => p.dealStage !== "paid").length} />
      </div>

      {isLoading ? (
        <SkeletonCard />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <section>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">REAL DATA</p>
            <h2 className="text-h3 font-display mb-4">Best time to receive proposals.</h2>
            <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[280px]">
              {all.length === 0 ? (
                <div className="h-full grid place-items-center text-sm text-(--text-tertiary)">No proposals yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byDayOfWeek}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">
              SAMPLE DATA — PROPOSALS DON&apos;T CARRY NICHE TAGS YET
            </p>
            <h2 className="text-h3 font-display mb-4">Top-performing niches.</h2>
            <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleNichePerformance} layout="vertical" margin={{ left: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="label" type="category" width={100} stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {sampleNichePerformance.map((_, i) => (
                      <Cell key={i} fill="var(--accent)" fillOpacity={1 - i * 0.2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
