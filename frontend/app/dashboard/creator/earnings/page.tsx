"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileText } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useInView } from "framer-motion";
import { useProposals } from "@/lib/hooks/useProposals";
import { type Proposal } from "@/lib/api";
import SectionLabel from "@/components/dashboard/SectionLabel";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const RANGES = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "90d", label: "90D", days: 90 },
  { id: "1y", label: "1Y", days: 365 },
] as const;

function useCountUp(target: number) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target]);

  return { ref, count };
}

function buildSeries(paidDeals: Proposal[], rangeDays: number) {
  const granularity: "day" | "week" | "month" = rangeDays <= 30 ? "day" : rangeDays <= 90 ? "week" : "month";
  const bucketMs = granularity === "day" ? 86_400_000 : granularity === "week" ? 7 * 86_400_000 : 30 * 86_400_000;
  const bucketCount = granularity === "month" ? 12 : Math.ceil(rangeDays / (bucketMs / 86_400_000));
  const now = Date.now();
  const buckets = Array.from({ length: bucketCount }, (_, i) => ({
    date: new Date(now - (bucketCount - 1 - i) * bucketMs),
    earnings: 0,
  }));

  paidDeals.forEach((p) => {
    const t = new Date(p.updatedAt || p.createdAt).getTime();
    if (t < now - rangeDays * 86_400_000) return;
    const idx = buckets.findIndex((b, i) => {
      const next = i < buckets.length - 1 ? buckets[i + 1].date.getTime() : now + 1;
      return t >= b.date.getTime() && t < next;
    });
    if (idx >= 0) buckets[idx].earnings += p.budget || 0;
  });

  return buckets.map((b) => ({
    label: granularity === "month" ? b.date.toLocaleDateString("en-US", { month: "short" }) : b.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    earnings: b.earnings,
  }));
}

export default function EarningsPage() {
  const proposals = useProposals("accepted");
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("30d");

  const deals: Proposal[] = proposals.data?.proposals || [];
  const paidDeals = deals.filter((p) => p.dealStage === "paid");
  const pendingPayoutDeals = deals.filter((p) => p.dealStage === "posted");

  const totalEarned = paidDeals.reduce((sum, p) => sum + (p.budget || 0), 0);
  const pendingPayouts = pendingPayoutDeals.reduce((sum, p) => sum + (p.budget || 0), 0);
  const rangeDays = RANGES.find((r) => r.id === range)!.days;
  const series = useMemo(() => buildSeries(paidDeals, rangeDays), [paidDeals, rangeDays]);
  const { ref: totalRef, count: totalCount } = useCountUp(totalEarned);

  const transactions = [...deals]
    .filter((p) => p.dealStage === "paid" || p.dealStage === "posted")
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

  return (
    <div className="max-w-[1100px] mx-auto space-y-10">
      <div>
        <SectionLabel index="01" label="EARNINGS" />
        <h1 className="text-h2 font-display mt-2">Your earnings.</h1>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-8">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">TOTAL EARNED</p>
          <p ref={totalRef} className="text-h1 font-display tabular-nums">₹{totalCount.toLocaleString("en-IN")}</p>
        </div>
        <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-8">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">PENDING PAYOUTS</p>
          <p className="text-h1 font-display tabular-nums text-(--warning)">₹{pendingPayouts.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {proposals.isLoading ? (
        <SkeletonCard />
      ) : (
        <>
          <section>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="text-h3 font-display">Earnings over time.</h2>
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
            <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
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

          <section>
            <h2 className="text-h3 font-display mb-5">Transactions.</h2>
            <div className="rounded-xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
              <div className="hidden md:grid grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-(--border) font-mono-utility text-mono-sm text-(--text-tertiary)">
                <span>DATE</span>
                <span>BRAND</span>
                <span>CAMPAIGN</span>
                <span>AMOUNT</span>
                <span>STATUS</span>
                <span className="text-right">INVOICE</span>
              </div>
              {transactions.length === 0 ? (
                <p className="p-8 text-center text-sm text-(--text-tertiary)">No transactions yet.</p>
              ) : (
                transactions.map((p) => {
                  const brandName = p.brandProfile?.companyName || (p.brandId as { fullName?: string })?.fullName || "Brand";
                  const paid = p.dealStage === "paid";
                  return (
                    <div key={p._id} className="grid grid-cols-2 md:grid-cols-[1fr_1.5fr_1.5fr_1fr_1fr_80px] gap-2 md:gap-4 px-5 py-4 border-b border-(--border) last:border-b-0 text-sm items-center">
                      <span className="text-(--text-tertiary)">{new Date(p.updatedAt || p.createdAt).toLocaleDateString()}</span>
                      <span className="truncate">{brandName}</span>
                      <span className="truncate col-span-2 md:col-span-1">{p.title}</span>
                      <span className="font-mono-utility">₹{p.budget?.toLocaleString("en-IN")}</span>
                      <span style={{ color: paid ? "var(--success)" : "var(--warning)" }}>{paid ? "Paid" : "Pending"}</span>
                      <button
                        disabled
                        title="Invoice PDF download — coming soon"
                        className="flex items-center gap-1 text-(--text-tertiary) opacity-50 cursor-not-allowed justify-self-end"
                      >
                        <FileText size={14} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
