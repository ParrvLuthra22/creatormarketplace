"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useProposals, useDashboardSummary } from "@/lib/hooks/useProposals";
import { usePublicCreators } from "@/lib/hooks/useCreators";
import SectionLabel from "@/components/dashboard/SectionLabel";
import StatCard from "@/components/dashboard/StatCard";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const RANGES = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "90d", label: "90D", days: 90 },
  { id: "1y", label: "1Y", days: 365 },
] as const;

const DONUT_COLORS = ["#d4ff4f", "#8fce3f", "#5a9e2f", "#3d7a1f", "#2a5c14", "#1a3d0c"];

function bucketLabel(date: Date, granularity: "day" | "week" | "month") {
  if (granularity === "month") return date.toLocaleDateString("en-US", { month: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildSpendSeries(proposals: any[], rangeDays: number) {
  const granularity: "day" | "week" | "month" = rangeDays <= 30 ? "day" : rangeDays <= 90 ? "week" : "month";
  const bucketMs = granularity === "day" ? 86_400_000 : granularity === "week" ? 7 * 86_400_000 : 30 * 86_400_000;
  const bucketCount = granularity === "month" ? 12 : Math.ceil(rangeDays / (bucketMs / 86_400_000));

  const now = Date.now();
  const buckets = Array.from({ length: bucketCount }, (_, i) => {
    const t = now - (bucketCount - 1 - i) * bucketMs;
    return { date: new Date(t), spend: 0 };
  });

  proposals
    .filter((p) => p.status === "accepted")
    .forEach((p) => {
      const t = new Date(p.updatedAt || p.createdAt).getTime();
      if (t < now - rangeDays * 86_400_000) return;
      const idx = buckets.findIndex((b, i) => {
        const next = i < buckets.length - 1 ? buckets[i + 1].date.getTime() : now + 1;
        return t >= b.date.getTime() && t < next;
      });
      if (idx >= 0) buckets[idx].spend += p.budget || 0;
    });

  return buckets.map((b) => ({ label: bucketLabel(b.date, granularity), spend: b.spend }));
}

export default function BrandAnalytics() {
  const proposals = useProposals();
  const summary = useDashboardSummary();
  const creators = usePublicCreators();
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("30d");

  const all = proposals.data?.proposals || [];
  const accepted = all.filter((p: any) => p.status === "accepted");
  const rangeDays = RANGES.find((r) => r.id === range)!.days;

  const spendSeries = useMemo(() => buildSpendSeries(all, rangeDays), [all, rangeDays]);

  const topCreators = useMemo(() => {
    const byCreator = new Map<string, { name: string; spend: number }>();
    accepted.forEach((p: any) => {
      const id = p.creatorId?._id || p.creatorId;
      const name = p.creatorId?.fullName || "Creator";
      const existing = byCreator.get(id) || { name, spend: 0 };
      existing.spend += p.budget || 0;
      byCreator.set(id, existing);
    });
    return Array.from(byCreator.values()).sort((a, b) => b.spend - a.spend).slice(0, 6);
  }, [accepted]);

  const nicheDistribution = useMemo(() => {
    const creatorNicheMap = new Map<string, string>();
    (creators.data?.creators || []).forEach((c: any) => {
      creatorNicheMap.set(c.id, (c.niches && c.niches[0]) || "Other");
    });
    const byNiche = new Map<string, number>();
    accepted.forEach((p: any) => {
      const id = String(p.creatorId?._id || p.creatorId);
      const niche = creatorNicheMap.get(id) || "Other";
      byNiche.set(niche, (byNiche.get(niche) || 0) + (p.budget || 0));
    });
    return Array.from(byNiche.entries()).map(([name, value]) => ({ name, value }));
  }, [accepted, creators.data]);

  const isLoading = proposals.isLoading || summary.isLoading;

  return (
    <div className="max-w-[1240px] mx-auto space-y-10">
      <div>
        <SectionLabel index="05" label="ANALYTICS" />
        <h1 className="text-h2 font-display mt-2">Your campaign performance.</h1>
      </div>

      {/* Sample KPIs — no reach/engagement/ROI tracking exists on the backend yet */}
      <section>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">
          SAMPLE DATA FOR PREVIEW — REACH, ENGAGEMENT &amp; ROI TRACKING ARE NOT YET WIRED TO A BACKEND METRIC
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Reach" value={482_000} suffix="" formatter={(n) => `${(n / 1000).toFixed(0)}K`} trend={12} trendUp />
          <StatCard label="Total Engagement" value={38_400} trend={8} trendUp />
          <StatCard label="Conversion Rate" value={3.2} formatter={(n) => `${n.toFixed(1)}%`} trend={2} trendUp />
          <StatCard label="ROI" value={2.4} formatter={(n) => `${n.toFixed(1)}x`} trend={5} trendUp />
        </div>
      </section>

      {isLoading ? (
        <SkeletonCard />
      ) : (
        <>
          {/* Spend over time — real, from accepted proposal budgets */}
          <section>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">REAL DATA</p>
                <h2 className="text-h3 font-display mt-1">Spend over time.</h2>
              </div>
              <div className="flex gap-1 rounded-lg border border-(--border) p-1">
                {RANGES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRange(r.id)}
                    className="px-3 py-1.5 rounded-md text-xs font-mono-utility transition-colors"
                    style={{
                      color: range === r.id ? "var(--bg-primary)" : "var(--text-tertiary)",
                      background: range === r.id ? "var(--accent)" : "transparent",
                    }}
                    data-interactive
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
                  <Tooltip
                    contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Spend"]}
                  />
                  <Line type="monotone" dataKey="spend" stroke="var(--accent)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top creators by spend — real proxy for "top-performing", since per-campaign
                engagement isn't tracked by the backend yet */}
            <section>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">REAL DATA</p>
              <h2 className="text-h3 font-display mb-4">Top creators by spend.</h2>
              <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[280px]">
                {topCreators.length === 0 ? (
                  <div className="h-full grid place-items-center text-sm text-(--text-tertiary)">No accepted campaigns yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCreators} layout="vertical" margin={{ left: 8 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Spend"]}
                      />
                      <Bar dataKey="spend" fill="var(--accent)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            {/* Budget distribution by niche — real, joined from creator profiles */}
            <section>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">REAL DATA</p>
              <h2 className="text-h3 font-display mb-4">Budget by niche.</h2>
              <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[280px]">
                {nicheDistribution.length === 0 ? (
                  <div className="h-full grid place-items-center text-sm text-(--text-tertiary)">No accepted campaigns yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={nicheDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                        {nicheDistribution.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          </div>

          {/* Campaign performance breakdown — real */}
          <section>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">REAL DATA</p>
            <h2 className="text-h3 font-display mb-4">Campaign breakdown.</h2>
            <div className="rounded-xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-(--border) font-mono-utility text-mono-sm text-(--text-tertiary)">
                <span>CAMPAIGN</span>
                <span>CREATOR</span>
                <span>STATUS</span>
                <span>BUDGET</span>
              </div>
              {all.length === 0 ? (
                <p className="p-8 text-center text-sm text-(--text-tertiary)">No campaigns yet.</p>
              ) : (
                all.slice(0, 10).map((p: any) => (
                  <div key={p._id} className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-2 md:gap-4 px-5 py-4 border-b border-(--border) last:border-b-0 text-sm">
                    <span className="font-medium truncate col-span-2 md:col-span-1">{p.title}</span>
                    <span className="text-(--text-secondary) truncate">{p.creatorId?.fullName || "Creator"}</span>
                    <span className="text-(--text-secondary) capitalize">{p.status}</span>
                    <span className="font-mono-utility">₹{p.budget?.toLocaleString("en-IN")}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
