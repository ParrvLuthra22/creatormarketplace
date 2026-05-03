"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useProposals } from "@/lib/hooks/useProposals";

export default function CreatorDealsPage() {
  const proposals = useProposals("accepted");
  const list = proposals.data?.proposals || [];

  return (
    <div className="max-w-[1000px] space-y-6">
      <h1 className="text-h2 font-display">Active deals</h1>
      <div className="grid gap-4">
        {list.map((proposal: any) => (
          <div key={proposal._id} className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5">
            <h2 className="font-semibold">{proposal.title}</h2>
            <p className="mt-2 text-sm text-(--text-secondary)">{proposal.deliverables}</p>
            <p className="mt-4 font-mono-utility text-sm">${proposal.budget}</p>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-(--text-tertiary)">No active deals yet.</p>}
      </div>
    </div>
  );
}
