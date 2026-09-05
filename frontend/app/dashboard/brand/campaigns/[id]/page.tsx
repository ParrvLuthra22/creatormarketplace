"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useProposal } from "@/lib/hooks/useProposals";
import { createConversation, getProfilePhotoUrl } from "@/lib/api";
import { showToast } from "@/lib/toast";
import MagneticButton from "@/components/dashboard/MagneticButton";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const STATUS_STYLE: Record<string, { color: string; border: string; background: string }> = {
  accepted: { color: "var(--accent)", border: "rgba(212,255,79,0.4)", background: "rgba(212,255,79,0.1)" },
  pending: { color: "var(--warning)", border: "rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.1)" },
  declined: { color: "var(--text-tertiary)", border: "var(--border)", background: "transparent" },
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const proposal = useProposal(id);
  const [messaging, setMessaging] = useState(false);

  async function messageCreator() {
    const creatorId = proposal.data?.proposal?.creatorId?._id;
    if (!creatorId) return;
    setMessaging(true);
    try {
      await createConversation(creatorId);
      router.push("/dashboard/brand/messages");
    } catch {
      showToast("Could not open conversation.", "error");
    } finally {
      setMessaging(false);
    }
  }

  if (proposal.isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <SkeletonCard />
      </div>
    );
  }

  const p = proposal.data?.proposal;
  if (!p) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-(--text-tertiary) mb-4">Campaign not found.</p>
        <Link href="/dashboard/brand/campaigns" className="text-(--accent) text-sm font-medium">
          ← Back to campaigns
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLE[p.status] || STATUS_STYLE.pending;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/dashboard/brand/campaigns"
        className="inline-flex items-center gap-2 font-mono-utility text-mono-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
        data-interactive
      >
        <ArrowLeft size={13} /> BACK TO CAMPAIGNS
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-h2 font-display">{p.title}</h1>
        </div>
        <span
          className="rounded-full border px-3 py-1.5 text-xs font-mono-utility uppercase tracking-wide shrink-0"
          style={{ color: statusStyle.color, borderColor: statusStyle.border, background: statusStyle.background }}
        >
          {p.status}
        </span>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">BRIEF</p>
        <p className="text-sm text-(--text-secondary) leading-relaxed">{p.description}</p>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">DELIVERABLES</p>
        <p className="text-sm text-(--text-secondary) leading-relaxed whitespace-pre-line">{p.deliverables}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">BUDGET</p>
          <p className="text-h2 font-display">₹{p.budget?.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">DEADLINE</p>
          <p className="text-h2 font-display">{new Date(p.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold shrink-0">
            {p.creatorProfile?.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getProfilePhotoUrl(p.creatorProfile.profilePhoto)} alt="" className="h-full w-full object-cover" />
            ) : (
              (p.creatorId?.fullName || "C").charAt(0)
            )}
          </div>
          <div>
            <p className="font-semibold">{p.creatorId?.fullName || "Creator"}</p>
            <p className="text-sm text-(--text-tertiary)">Creator</p>
          </div>
        </div>
        {p.status === "accepted" && (
          <MagneticButton variant="primary" onClick={messageCreator} disabled={messaging}>
            <MessageCircle size={14} /> {messaging ? "Opening…" : "Message Creator"}
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
