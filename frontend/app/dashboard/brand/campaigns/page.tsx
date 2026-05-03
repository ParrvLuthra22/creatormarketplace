"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useProposals } from "@/lib/hooks/useProposals";

const tabs = ["all", "pending", "accepted", "declined"];

export default function BrandCampaignsPage() {
  const [tab, setTab] = useState("all");
  const proposals = useProposals(tab === "all" ? undefined : tab);
  const grouped = proposals.data?.proposals || [];

  return (
    <div className="max-w-[1200px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-display">Campaigns</h1>
          <p className="text-sm text-(--text-secondary)">Proposal-backed campaigns grouped by status.</p>
        </div>
      </div>
      <div className="flex gap-2">
        {tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`rounded-full border px-3 py-1.5 text-sm ${tab === item ? "border-(--accent) text-(--accent)" : "border-(--border) text-(--text-secondary)"}`}>
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
              <span className="rounded-full border border-(--border) px-2.5 py-1 text-xs uppercase">{proposal.status}</span>
            </div>
            <div className="mt-4 flex gap-4 text-sm text-(--text-tertiary)">
              <span>${proposal.budget}</span>
              <span>{new Date(proposal.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {grouped.length === 0 && <p className="text-sm text-(--text-tertiary)">No proposals in this view.</p>}
      </div>
    </div>
  );
}
