"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageSquare } from "lucide-react";
import { useProposals, useAdvanceDealStage, useToggleDeliverable } from "@/lib/hooks/useProposals";
import { createConversation, getProfilePhotoUrl, type Proposal } from "@/lib/api";
import { showToast } from "@/lib/toast";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const STAGES = [
  { id: "brief", label: "Brief" },
  { id: "content_creation", label: "Content Creation" },
  { id: "review", label: "Review" },
  { id: "approved", label: "Approved" },
  { id: "posted", label: "Posted" },
  { id: "paid", label: "Paid" },
] as const;

const PAYMENT_LABEL: Record<string, string> = {
  brief: "Awaiting content",
  content_creation: "Awaiting content",
  review: "Awaiting approval",
  approved: "Awaiting posting",
  posted: "Awaiting payout",
  paid: "Paid",
};

function DealTimeline({ dealId, currentStage }: { dealId: string; currentStage: string }) {
  const advanceStage = useAdvanceDealStage();
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="flex items-center">
      {STAGES.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const canAdvance = i === currentIndex + 1;
        return (
          <div key={stage.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => canAdvance && advanceStage.mutate({ id: dealId, stage: stage.id })}
              disabled={!canAdvance || advanceStage.isPending}
              className="flex flex-col items-center gap-1.5 shrink-0"
              data-interactive
              data-cursor={canAdvance ? `Mark as ${stage.label}` : undefined}
              title={canAdvance ? `Mark as ${stage.label}` : stage.label}
            >
              <span
                className="h-6 w-6 rounded-full border-2 grid place-items-center transition-colors duration-200"
                style={{
                  borderColor: done || active ? "var(--accent)" : "var(--border)",
                  background: done ? "var(--accent)" : "transparent",
                  cursor: canAdvance ? "pointer" : "default",
                }}
              >
                {done && <Check size={12} className="text-(--bg-primary)" />}
              </span>
              <span
                className="font-mono-utility text-mono-sm whitespace-nowrap hidden sm:block"
                style={{ color: active ? "var(--accent)" : done ? "var(--text-secondary)" : "var(--text-tertiary)" }}
              >
                {stage.label}
              </span>
            </button>
            {i < STAGES.length - 1 && (
              <div className="flex-1 h-px mx-1" style={{ background: i < currentIndex ? "var(--accent)" : "var(--border)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ActiveDealsPage() {
  const router = useRouter();
  const proposals = useProposals("accepted");
  const toggleDeliverable = useToggleDeliverable();
  const [messagingId, setMessagingId] = useState<string | null>(null);

  const deals: Proposal[] = proposals.data?.proposals || [];

  async function messageBrand(deal: Proposal) {
    const brandId = (deal.brandId as { _id?: string })?._id;
    if (!brandId) return;
    setMessagingId(deal._id);
    try {
      await createConversation(brandId);
      router.push("/dashboard/creator/messages");
    } catch {
      showToast("Could not open conversation.", "error");
    } finally {
      setMessagingId(null);
    }
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div>
        <SectionLabel index="01" label="ACTIVE DEALS" />
        <h1 className="text-h2 font-display mt-2">Deals in progress.</h1>
      </div>

      {proposals.isLoading ? (
        <SkeletonCard />
      ) : deals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-16 text-center">
          <p className="text-(--text-tertiary)">No active deals — accepted proposals will show up here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {deals.map((deal) => {
            const brandName = deal.brandProfile?.companyName || (deal.brandId as { fullName?: string })?.fullName || "Brand";
            const lines = (deal.deliverables || "").split("\n").map((l) => l.trim()).filter(Boolean);
            const completed = new Set(deal.completedDeliverables || []);
            const stage = deal.dealStage || "brief";

            return (
              <div key={deal._id} className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 space-y-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold shrink-0">
                      {deal.brandProfile?.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getProfilePhotoUrl(deal.brandProfile.logoUrl)} alt={brandName} className="h-full w-full object-cover" />
                      ) : (
                        brandName.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{brandName}</p>
                      <h2 className="font-display text-lg">{deal.title}</h2>
                    </div>
                  </div>
                  <MagneticButton variant="secondary" onClick={() => messageBrand(deal)} disabled={messagingId === deal._id}>
                    <MessageSquare size={14} /> Message Brand
                  </MagneticButton>
                </div>

                <DealTimeline dealId={deal._id} currentStage={stage} />

                {lines.length > 0 && (
                  <div>
                    <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">
                      DELIVERABLES ({completed.size}/{lines.length})
                    </p>
                    <div className="space-y-1.5">
                      {lines.map((line) => {
                        const done = completed.has(line);
                        return (
                          <label key={line} className="flex items-center gap-2.5 text-sm cursor-pointer" data-interactive>
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={(e) => toggleDeliverable.mutate({ id: deal._id, item: line, completed: e.target.checked })}
                              className="h-4 w-4 rounded accent-(--accent)"
                            />
                            <span style={{ color: done ? "var(--text-tertiary)" : "var(--text-primary)", textDecoration: done ? "line-through" : "none" }}>
                              {line}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-(--border)">
                  <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
                    PAYMENT: <span style={{ color: stage === "paid" ? "var(--success)" : "var(--warning)" }}>{PAYMENT_LABEL[stage]}</span>
                  </span>
                  <span className="text-h3 font-display">₹{deal.budget?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
