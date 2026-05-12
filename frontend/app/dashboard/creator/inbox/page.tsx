"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAcceptProposal, useDeclineProposal, useProposals } from "@/lib/hooks/useProposals";
import { showToast } from "@/lib/toast";
import { Check, X } from "lucide-react";

export default function CreatorInboxPage() {
  const proposals = useProposals("pending");
  const accept = useAcceptProposal();
  const decline = useDeclineProposal();
  const list = proposals.data?.proposals || [];

  async function handleAccept(id: string) {
    try {
      await accept.mutateAsync(id);
      showToast("Proposal accepted! Check Active Deals.", "success");
    } catch {
      showToast("Could not accept — please try again.", "error");
    }
  }

  async function handleDecline(id: string) {
    try {
      await decline.mutateAsync(id);
      showToast("Proposal declined.", "info");
    } catch {
      showToast("Could not decline — please try again.", "error");
    }
  }

  if (proposals.isLoading) {
    return (
      <div className="max-w-[1000px] space-y-4">
        <h1 className="text-h2 font-display">Inbox</h1>
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-display">Inbox</h1>
        {list.length > 0 && (
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
            {list.length} PENDING
          </span>
        )}
      </div>

      <div className="grid gap-4">
        {list.map((proposal: any) => (
          <div
            key={proposal._id}
            className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5 transition-colors hover:border-(--border-strong)"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                {proposal.brandProfile?.companyName && (
                  <p className="font-mono-utility text-mono-sm text-(--accent) mb-1">
                    {proposal.brandProfile.companyName.toUpperCase()}
                  </p>
                )}
                <h2 className="font-semibold truncate">{proposal.title}</h2>
                <p className="mt-1.5 text-sm text-(--text-secondary) line-clamp-2">
                  {proposal.description}
                </p>
              </div>
              <span className="font-mono-utility text-sm shrink-0">
                ${proposal.budget.toLocaleString()}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-xs text-(--text-tertiary)">
                Deadline: {new Date(proposal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecline(proposal._id)}
                  disabled={decline.isPending || accept.isPending}
                  className="h-9 rounded-lg border border-(--border) px-3 text-sm text-(--text-secondary) hover:text-(--text-primary) hover:border-(--border-strong) transition-colors disabled:opacity-40 flex items-center gap-1.5"
                >
                  <X size={13} aria-hidden />
                  Decline
                </button>
                <button
                  onClick={() => handleAccept(proposal._id)}
                  disabled={accept.isPending || decline.isPending}
                  className="h-9 rounded-lg bg-(--accent) px-3 text-sm font-semibold text-(--bg-primary) hover:bg-(--accent-hover) transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check size={13} aria-hidden />
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && !proposals.isLoading && (
          <div className="rounded-2xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-12 text-center">
            <p className="text-h3 font-display mb-2">All clear 🎉</p>
            <p className="text-sm text-(--text-tertiary)">No pending proposals. Brands will reach out when there&apos;s a match.</p>
          </div>
        )}
      </div>
    </div>
  );
}
