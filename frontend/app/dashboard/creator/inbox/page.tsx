"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useProposals } from "@/lib/hooks/useProposals";
import { useConversations } from "@/lib/hooks/useChat";
import { useAuthStore } from "@/lib/auth";
import { getProfilePhotoUrl, type Proposal } from "@/lib/api";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import ProposalDrawer from "@/components/dashboard/ProposalDrawer";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const TABS = ["New", "Negotiating", "Declined", "Archived"] as const;
type Tab = (typeof TABS)[number];

function deadlineColor(deadline: string) {
  const days = (new Date(deadline).getTime() - Date.now()) / 86_400_000;
  if (days < 3) return "var(--warning)";
  if (days < 7) return "var(--warning)";
  return "var(--success)";
}

function parseDeliverables(text: string) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

export default function CreatorInboxPage() {
  const user = useAuthStore((state) => state.user);
  const myId = String(user?.id || (user as { _id?: string })?._id || "");
  const proposals = useProposals();
  const conversations = useConversations();
  const [tab, setTab] = useState<Tab>("New");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [openProposal, setOpenProposal] = useState<Proposal | null>(null);

  const all: Proposal[] = proposals.data?.proposals || [];

  const brandIdsWithConversation = useMemo(() => {
    const list = conversations.data?.conversations || [];
    const ids = new Set<string>();
    list.forEach((c: { participants: { _id: string }[] }) => {
      const other = c.participants?.find((p) => String(p._id) !== myId);
      if (other) ids.add(String(other._id));
    });
    return ids;
  }, [conversations.data, myId]);

  function tabFor(p: Proposal): Tab {
    if (p.status === "declined") return "Declined";
    if (p.status === "accepted") return "Archived";
    const brandId = (p.brandId as { _id?: string })?._id || (p.brandId as string);
    return brandIdsWithConversation.has(String(brandId)) ? "Negotiating" : "New";
  }

  const withTab = useMemo(() => all.map((p) => ({ ...p, _tab: tabFor(p) })), [all, brandIdsWithConversation]);
  const filtered = withTab.filter((p) => p._tab === tab);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { New: 0, Negotiating: 0, Declined: 0, Archived: 0 };
    withTab.forEach((p) => c[p._tab]++);
    return c;
  }, [withTab]);

  const isLoading = proposals.isLoading;

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div>
        <SectionLabel index="01" label="INBOX" />
        <h1 className="text-h2 font-display mt-2">Your inbox.</h1>
      </div>

      <div className="relative flex gap-6 border-b border-(--border)">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative pb-3 text-sm font-medium transition-colors duration-150"
            style={{ color: tab === t ? "var(--text-primary)" : "var(--text-tertiary)" }}
            data-interactive
          >
            {t} <span className="font-mono-utility text-mono-sm">({counts[t]})</span>
            {tab === t && (
              <motion.div
                layoutId="inbox-tab-underline"
                className="absolute left-0 right-0 -bottom-px h-[2px] bg-(--accent)"
                transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonCard />
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-16 text-center">
          <p className="text-(--text-tertiary)">
            {tab === "New" && "No new proposals right now."}
            {tab === "Negotiating" && "No proposals currently in conversation."}
            {tab === "Declined" && "You haven't declined any proposals."}
            {tab === "Archived" && "No accepted deals yet — they'll show up here once you accept a proposal."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => {
            const brandName = p.brandProfile?.companyName || (p.brandId as { fullName?: string })?.fullName || "Brand";
            const deliverables = parseDeliverables(p.deliverables);
            const expanded = expandedId === p._id;
            return (
              <div key={p._id} className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold shrink-0">
                      {p.brandProfile?.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getProfilePhotoUrl(p.brandProfile.logoUrl)} alt={brandName} className="h-full w-full object-cover" />
                      ) : (
                        brandName.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{brandName}</p>
                      <h3 className="font-display text-lg">{p.title}</h3>
                    </div>
                  </div>
                  <p className="text-h3 font-display text-(--accent) shrink-0">₹{p.budget?.toLocaleString("en-IN")}</p>
                </div>

                <p className={`text-sm text-(--text-secondary) leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>{p.description}</p>
                {p.description && p.description.length > 160 && (
                  <button
                    onClick={() => setExpandedId(expanded ? null : p._id)}
                    className="text-xs font-medium text-(--accent) hover:opacity-80 transition-opacity mt-1"
                    data-interactive
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}

                <div className="flex items-center gap-4 flex-wrap mt-4 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-(--text-tertiary)">
                    <Package size={13} /> {deliverables.length} deliverable{deliverables.length === 1 ? "" : "s"}
                  </span>
                  <span className="text-xs font-mono-utility" style={{ color: deadlineColor(p.deadline) }}>
                    DUE {new Date(p.deadline).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenProposal(p)}
                    className="h-9 px-4 rounded-lg border border-(--border) text-sm font-medium hover:border-(--accent) transition-colors"
                    data-interactive
                  >
                    View Full Brief
                  </button>
                  {p.status === "pending" && (
                    <>
                      <MagneticButton variant="primary" className="h-9" onClick={() => setOpenProposal(p)}>
                        Accept
                      </MagneticButton>
                      <MagneticButton variant="secondary" className="h-9" onClick={() => setOpenProposal(p)}>
                        Decline
                      </MagneticButton>
                      <MagneticButton variant="ghost" className="h-9" onClick={() => setOpenProposal(p)}>
                        Negotiate
                      </MagneticButton>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProposalDrawer proposal={openProposal} onClose={() => setOpenProposal(null)} />
    </div>
  );
}
