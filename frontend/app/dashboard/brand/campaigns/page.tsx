"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoreHorizontal, Plus } from "lucide-react";
import { useProposals } from "@/lib/hooks/useProposals";
import { useCampaignModal } from "@/lib/CampaignModalContext";
import { getProfilePhotoUrl } from "@/lib/api";
import SectionLabel from "@/components/dashboard/SectionLabel";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const TABS = ["All", "Active", "Pending", "Completed", "Archived"] as const;
type Tab = (typeof TABS)[number];

function deriveTab(p: any): Exclude<Tab, "All"> {
  if (p.status === "pending") return "Pending";
  if (p.status === "declined") return "Archived";
  const isPast = p.deadline && new Date(p.deadline).getTime() < Date.now();
  return isPast ? "Completed" : "Active";
}

const STATUS_STYLE: Record<string, { color: string; border: string; background: string }> = {
  Active: { color: "var(--accent)", border: "rgba(212,255,79,0.4)", background: "rgba(212,255,79,0.1)" },
  Pending: { color: "var(--warning)", border: "rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.1)" },
  Completed: { color: "var(--success)", border: "rgba(74,222,128,0.4)", background: "rgba(74,222,128,0.1)" },
  Archived: { color: "var(--text-tertiary)", border: "var(--border)", background: "transparent" },
};

// Deterministic gradient per campaign — no cover-image field on the data model yet.
function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `linear-gradient(135deg, hsl(${hue}, 45%, 16%) 0%, hsl(${(hue + 60) % 360}, 40%, 10%) 100%)`;
}

function progressFor(p: any) {
  if (p.status === "pending") return 0;
  if (p.status === "declined") return 100;
  const created = new Date(p.createdAt).getTime();
  const deadline = new Date(p.deadline).getTime();
  const now = Date.now();
  if (deadline <= created) return 100;
  return Math.min(100, Math.max(0, ((now - created) / (deadline - created)) * 100));
}

export default function BrandCampaignsPage() {
  const [tab, setTab] = useState<Tab>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const proposals = useProposals();
  const { openModal } = useCampaignModal();

  const all = proposals.data?.proposals || [];
  const withDerived = useMemo(() => all.map((p: any) => ({ ...p, _tab: deriveTab(p) })), [all]);
  const filtered = tab === "All" ? withDerived : withDerived.filter((p: any) => p._tab === tab);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: withDerived.length };
    for (const t of TABS) {
      if (t === "All") continue;
      c[t] = withDerived.filter((p: any) => p._tab === t).length;
    }
    return c;
  }, [withDerived]);

  return (
    <div className="max-w-[1240px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <SectionLabel index="01" label="CAMPAIGNS" />
          <h1 className="text-h2 font-display mt-2">Your campaigns.</h1>
        </div>
      </div>

      {/* Tabs with animated underline */}
      <div className="relative flex gap-6 border-b border-(--border)">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative pb-3 text-sm font-medium transition-colors duration-150"
            style={{ color: tab === t ? "var(--text-primary)" : "var(--text-tertiary)" }}
            data-interactive
          >
            {t} <span className="font-mono-utility text-mono-sm">({counts[t] ?? 0})</span>
            {tab === t && (
              <motion.div
                layoutId="campaigns-tab-underline"
                className="absolute left-0 right-0 -bottom-px h-[2px] bg-(--accent)"
                transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      {proposals.isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* New campaign CTA card — always first */}
          <button
            onClick={() => openModal()}
            className="card-accent rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) flex flex-col items-center justify-center gap-3 min-h-[280px] text-(--text-tertiary) hover:text-(--accent) transition-colors duration-200"
            data-interactive
          >
            <span className="h-10 w-10 rounded-full border border-current flex items-center justify-center">
              <Plus size={18} />
            </span>
            <span className="text-sm font-medium">New Campaign</span>
          </button>

          {filtered.map((p: any) => {
            const progress = progressFor(p);
            return (
              <div key={p._id} className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) overflow-hidden flex flex-col">
                <Link href={`/dashboard/brand/campaigns/${p._id}`} className="block" data-interactive>
                  <div className="h-24" style={{ background: gradientFor(p.title || p._id) }} aria-hidden />
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h2 className="font-display font-semibold text-lg leading-tight truncate">{p.title}</h2>
                      <span
                        className="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-mono-utility uppercase tracking-wide"
                        style={{
                          color: STATUS_STYLE[p._tab].color,
                          borderColor: STATUS_STYLE[p._tab].border,
                          background: STATUS_STYLE[p._tab].background,
                        }}
                      >
                        {p._tab}
                      </span>
                    </div>
                    <p className="text-sm text-(--text-secondary) line-clamp-2 mb-4">{p.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-7 w-7 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-xs shrink-0">
                        {p.creatorProfile?.profilePhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={getProfilePhotoUrl(p.creatorProfile.profilePhoto)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          (p.creatorId?.fullName || "C").charAt(0)
                        )}
                      </div>
                      <span className="text-sm text-(--text-tertiary) truncate">{p.creatorId?.fullName || "Creator"}</span>
                    </div>

                    <div className="flex items-center justify-between font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">
                      <span>₹{p.budget?.toLocaleString("en-IN")}</span>
                      <span>{new Date(p.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="h-1 rounded-full bg-(--bg-surface) overflow-hidden">
                      <div className="h-full bg-(--accent) transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </Link>

                <div className="relative px-5 pb-4 -mt-1">
                  <button
                    onClick={() => setOpenMenuId((id) => (id === p._id ? null : p._id))}
                    className="h-8 w-8 rounded-lg hover:bg-(--bg-surface) grid place-items-center text-(--text-tertiary) hover:text-(--text-primary) ml-auto"
                    aria-label="Campaign actions"
                    data-interactive
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenuId === p._id && (
                    <div className="absolute right-5 bottom-12 w-44 rounded-xl border border-(--border) bg-(--bg-surface) shadow-xl overflow-hidden z-10">
                      <Link
                        href={`/dashboard/brand/campaigns/${p._id}`}
                        className="block px-4 py-2.5 text-sm hover:bg-(--bg-secondary) transition-colors"
                        onClick={() => setOpenMenuId(null)}
                      >
                        View details
                      </Link>
                      <Link
                        href="/dashboard/brand/messages"
                        className="block px-4 py-2.5 text-sm hover:bg-(--bg-secondary) transition-colors"
                        onClick={() => setOpenMenuId(null)}
                      >
                        Message creator
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
