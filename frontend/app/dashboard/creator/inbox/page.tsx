"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAcceptProposal, useDeclineProposal, useProposals } from "@/lib/hooks/useProposals";

export default function CreatorInboxPage() {
  const proposals = useProposals("pending");
  const accept = useAcceptProposal();
  const decline = useDeclineProposal();
  const list = proposals.data?.proposals || [];

  return (
    <div className="max-w-[1000px] space-y-6">
      <h1 className="text-h2 font-display">Inbox</h1>
      <div className="grid gap-4">
        {list.map((proposal: any) => (
          <div key={proposal._id} className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-5">
            <h2 className="font-semibold">{proposal.title}</h2>
            <p className="mt-2 text-sm text-(--text-secondary)">{proposal.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono-utility text-sm">${proposal.budget}</span>
              <div className="flex gap-2">
                <button onClick={() => decline.mutate(proposal._id)} className="h-9 rounded-lg border border-(--border) px-3 text-sm">Decline</button>
                <button onClick={() => accept.mutate(proposal._id)} className="h-9 rounded-lg bg-(--accent) px-3 text-sm font-semibold text-(--bg-primary)">Accept</button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-(--text-tertiary)">No pending proposals.</p>}
      </div>
    </div>
  );
}
