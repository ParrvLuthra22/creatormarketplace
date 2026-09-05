"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowRight, ShieldCheck, Search } from "lucide-react";
import { useAdminStats, useAdminActivity } from "@/lib/hooks/useAdmin";
import SectionLabel from "@/components/dashboard/SectionLabel";
import StatCard from "@/components/dashboard/StatCard";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const STATUS_COLORS: Record<string, string> = {
  accepted: "var(--accent)",
  pending: "var(--warning)",
  declined: "var(--text-tertiary)",
};

function timeAgo(iso: string) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminOverview() {
  const stats = useAdminStats();
  const activity = useAdminActivity();
  const [signupRange, setSignupRange] = useState<"7d" | "30d">("7d");

  const data = stats.data;
  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });
  const pendingVerifications = data?.verification?.pendingRequests || 0;

  const proposalDonut = data
    ? [
        { name: "Accepted", value: data.proposals.accepted, color: STATUS_COLORS.accepted },
        { name: "Pending", value: data.proposals.pending, color: STATUS_COLORS.pending },
        { name: "Declined", value: data.proposals.declined, color: STATUS_COLORS.declined },
      ]
    : [];

  const growthSeries = (data?.users?.dailySignups || []).map((d: { date: string; count: number }) => ({
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: d.count,
  }));

  return (
    <div className="max-w-[1240px] mx-auto space-y-12">
      <div>
        <SectionLabel index="01" label="PLATFORM OVERVIEW" />
        <h1 className="text-h2 font-display mt-2">Platform health at a glance.</h1>
        <p className="text-sm text-(--text-tertiary) mt-1">{dateLabel}</p>
      </div>

      {stats.isLoading ? (
        <SkeletonCard />
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">TOTAL USERS</span>
              <p className="text-h2 font-display tabular-nums mt-3">{data?.users.total.toLocaleString()}</p>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mt-2">
                {data?.users.brands} BRANDS · {data?.users.creators} CREATORS
              </p>
            </div>

            <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">NEW SIGNUPS</span>
                <div className="flex gap-1">
                  {(["7d", "30d"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setSignupRange(r)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono-utility transition-colors"
                      style={{ color: signupRange === r ? "var(--accent)" : "var(--text-tertiary)" }}
                      data-interactive
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-h2 font-display tabular-nums mt-3">
                {(signupRange === "7d" ? data?.users.newSignups7d : data?.users.newSignups30d)?.toLocaleString()}
              </p>
            </div>

            <StatCard label="Active Users (7d)" value={data?.users.activeUsers7d || 0} />

            <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary) flex items-center gap-2">
                PENDING VERIFICATIONS
                {pendingVerifications > 5 && <span className="h-1.5 w-1.5 rounded-full bg-(--warning) animate-pulse" />}
              </span>
              <p className="text-h2 font-display tabular-nums mt-3" style={{ color: pendingVerifications > 5 ? "var(--warning)" : "var(--text-primary)" }}>
                {pendingVerifications}
              </p>
            </div>

            <div className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-6 flex items-center justify-between gap-4">
              <div>
                <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">TOTAL PROPOSALS</span>
                <p className="text-h2 font-display tabular-nums mt-3">{data?.proposals.total.toLocaleString()}</p>
              </div>
              {data && (
                <div className="h-14 w-14 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={proposalDonut} dataKey="value" innerRadius={16} outerRadius={26} paddingAngle={2}>
                        {proposalDonut.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <StatCard label="Total Messages Sent" value={data?.messages.totalSent || 0} />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-h3 font-display mb-4">User growth (30d).</h2>
              <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="label" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} dot={false} name="Signups" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section>
              <h2 className="text-h3 font-display mb-4">Proposal status breakdown.</h2>
              <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 h-[260px] flex items-center justify-center gap-8">
                <ResponsiveContainer width="55%" height="100%">
                  <PieChart>
                    <Pie data={proposalDonut} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                      {proposalDonut.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {proposalDonut.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
                      <span className="text-(--text-secondary)">{entry.name}</span>
                      <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Recent activity + quick actions */}
          <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
            <section>
              <h2 className="text-h3 font-display mb-4">Recent activity.</h2>
              {activity.isLoading ? (
                <SkeletonCard />
              ) : (activity.data?.activity || []).length === 0 ? (
                <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-8 text-center">
                  <p className="text-sm text-(--text-tertiary)">No recent activity.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-(--border) bg-(--bg-secondary) divide-y divide-(--border) overflow-hidden">
                  {activity.data.activity.map((item: { id: string; text: string; timestamp: string; href?: string }) => {
                    const content = (
                      <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                        <p className="text-sm text-(--text-primary)">{item.text}</p>
                        <span className="font-mono-utility text-mono-sm text-(--text-tertiary) shrink-0">{timeAgo(item.timestamp)}</span>
                      </div>
                    );
                    return item.href ? (
                      <Link key={item.id} href={item.href} className="block hover:bg-(--bg-surface) transition-colors duration-150">
                        {content}
                      </Link>
                    ) : (
                      <div key={item.id}>{content}</div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-h3 font-display mb-1">Quick actions.</h2>
              <Link
                href="/dashboard/admin/verification-queue"
                className="card-accent flex items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--bg-secondary) p-4 hover:border-(--warning) transition-colors"
                data-interactive
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck size={15} style={{ color: "var(--warning)" }} /> Review Verifications ({pendingVerifications} pending)
                </span>
                <ArrowRight size={14} className="text-(--text-tertiary)" />
              </Link>
              <Link
                href="/dashboard/admin/users"
                className="card-accent flex items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--bg-secondary) p-4 hover:border-(--accent) transition-colors"
                data-interactive
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Search size={15} className="text-(--accent)" /> Search Users
                </span>
                <ArrowRight size={14} className="text-(--text-tertiary)" />
              </Link>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
