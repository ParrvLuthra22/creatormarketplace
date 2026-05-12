"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Plus } from "lucide-react";
import { useProposals } from "@/lib/hooks/useProposals";
import { useCampaignModal } from "@/lib/CampaignModalContext";

const tabs = ["all", "pending", "accepted", "declined"];

export default function BrandCampaignsPage() {
  const [tab, setTab] = useState("all");
  const proposals = useProposals(tab === "all" ? undefined : tab);
  const grouped = proposals.data?.proposals || [];
  const { openModal } = useCampaignModal();

  return (
    <div className="max-w-[1200px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-display">Campaigns</h1>
          <p className="text-sm text-(--text-secondary)">Proposal-backed campaigns grouped by status.</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors"
          data-interactive
        >
          <Plus size={14} aria-hidden />
          New Campaign
        </button>
      </div>
      <div className="flex gap-2">
        {tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`rounded-full border px-3 py-1.5 text-sm capitalize ${tab === item ? "border-(--accent) text-(--accent)" : "border-(--border) text-(--text-secondary)"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {grouped.map((proposal: any) => (
          <div key={proposal._id} className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">{proposal.title}</h2>
                <p className="text-sm text-(--text-secondary) mt-1 line-clamp-2">{proposal.description}</p>
              </div>
              <span className="rounded-full border border-(--border) px-2.5 py-1 text-xs uppercase shrink-0">{proposal.status}</span>
            </div>
            <div className="mt-4 flex gap-4 text-sm text-(--text-tertiary)">
              <span>${proposal.budget}</span>
              <span>{new Date(proposal.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <div className="rounded-2xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-10 text-center">
            <p className="text-(--text-tertiary) mb-4">No campaigns yet.</p>
            <button onClick={openModal} className="h-10 px-5 rounded-xl bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors">
              Create your first campaign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
