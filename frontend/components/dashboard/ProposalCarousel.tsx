"use client";

import { useRef, useState, type MouseEvent } from "react";
import { useAcceptProposal, useDeclineProposal } from "@/lib/hooks/useProposals";
import { getProfilePhotoUrl, type Proposal } from "@/lib/api";
import MagneticButton from "./MagneticButton";

export default function ProposalCarousel({
  proposals,
  onOpen,
}: {
  proposals: Proposal[];
  onOpen: (proposal: Proposal) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0 });
  const [dragging, setDragging] = useState(false);
  const acceptProposal = useAcceptProposal();
  const declineProposal = useDeclineProposal();

  function onMouseDown(e: MouseEvent) {
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { dragging: true, startX: e.clientX, startScroll: el.scrollLeft };
    setDragging(true);
  }
  function onMouseMove(e: MouseEvent) {
    const el = trackRef.current;
    if (!el || !dragState.current.dragging) return;
    el.scrollLeft = dragState.current.startScroll - (e.clientX - dragState.current.startX);
  }
  function endDrag() {
    dragState.current.dragging = false;
    setDragging(false);
  }

  if (proposals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-8 text-center">
        <p className="text-sm text-(--text-tertiary)">No new proposals right now — check back soon.</p>
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-1"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      {proposals.map((p) => {
        const brandName = p.brandProfile?.companyName || (p.brandId as { fullName?: string })?.fullName || "Brand";
        return (
          <div
            key={p._id}
            className="card-accent w-[300px] shrink-0 rounded-xl border border-(--border) bg-(--bg-secondary) p-5 cursor-pointer"
            onClick={() => onOpen(p)}
            data-interactive
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-xs shrink-0">
                {p.brandProfile?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getProfilePhotoUrl(p.brandProfile.logoUrl)} alt={brandName} className="h-full w-full object-cover" />
                ) : (
                  brandName.charAt(0)
                )}
              </div>
              <p className="font-semibold text-sm truncate">{brandName}</p>
            </div>
            <p className="font-display font-semibold truncate mb-1">{p.title}</p>
            <p className="text-sm text-(--text-secondary) line-clamp-2 mb-3 min-h-[2.5rem]">{p.description}</p>
            <div className="flex items-center justify-between font-mono-utility text-mono-sm text-(--text-tertiary) mb-4">
              <span className="text-(--accent)">₹{p.budget?.toLocaleString("en-IN")}</span>
              <span>{new Date(p.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <MagneticButton
                variant="primary"
                className="flex-1 justify-center h-9"
                onClick={() => acceptProposal.mutate(p._id)}
                disabled={acceptProposal.isPending}
              >
                Accept
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                className="flex-1 justify-center h-9"
                onClick={() => declineProposal.mutate(p._id)}
                disabled={declineProposal.isPending}
              >
                Decline
              </MagneticButton>
              <MagneticButton variant="ghost" className="h-9 px-3" onClick={() => onOpen(p)}>
                Negotiate
              </MagneticButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}
