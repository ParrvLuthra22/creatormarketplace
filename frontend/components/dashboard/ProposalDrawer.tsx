"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import Drawer from "./Drawer";
import MagneticButton from "./MagneticButton";
import { useAcceptProposal, useDeclineProposal } from "@/lib/hooks/useProposals";
import { createConversation, getProfilePhotoUrl, type Proposal } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function ProposalDrawer({
  proposal,
  onClose,
}: {
  proposal: Proposal | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const acceptProposal = useAcceptProposal();
  const declineProposal = useDeclineProposal();
  const [negotiating, setNegotiating] = useState(false);

  async function negotiate() {
    if (!proposal) return;
    const brandId = (proposal.brandId as { _id?: string })?._id;
    if (!brandId) return;
    setNegotiating(true);
    try {
      await createConversation(brandId);
      router.push("/dashboard/creator/messages");
    } catch {
      showToast("Could not open conversation.", "error");
    } finally {
      setNegotiating(false);
    }
  }

  const brandName = proposal?.brandProfile?.companyName || (proposal?.brandId as { fullName?: string })?.fullName || "Brand";
  const isPending = proposal?.status === "pending";

  return (
    <Drawer open={Boolean(proposal)} onClose={onClose} title={proposal?.title}>
      {proposal && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold shrink-0">
              {proposal.brandProfile?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getProfilePhotoUrl(proposal.brandProfile.logoUrl)} alt={brandName} className="h-full w-full object-cover" />
              ) : (
                brandName.charAt(0)
              )}
            </div>
            <div>
              <p className="font-semibold">{brandName}</p>
              <p className="text-sm text-(--text-tertiary) capitalize">{proposal.status}</p>
            </div>
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">BRIEF</p>
            <p className="text-sm text-(--text-secondary) leading-relaxed">{proposal.description}</p>
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">DELIVERABLES</p>
            <p className="text-sm text-(--text-secondary) leading-relaxed whitespace-pre-line">{proposal.deliverables}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">BUDGET</p>
              <p className="text-h3 font-display">₹{proposal.budget?.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1">DEADLINE</p>
              <p className="text-h3 font-display">{new Date(proposal.deadline).toLocaleDateString()}</p>
            </div>
          </div>

          {isPending && (
            <div className="flex gap-2 pt-2">
              <MagneticButton
                variant="primary"
                className="flex-1 justify-center"
                onClick={() => acceptProposal.mutate(proposal._id, { onSuccess: onClose })}
                disabled={acceptProposal.isPending}
              >
                Accept
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                className="flex-1 justify-center"
                onClick={() => declineProposal.mutate(proposal._id, { onSuccess: onClose })}
                disabled={declineProposal.isPending}
              >
                Decline
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={negotiate} disabled={negotiating} aria-label="Negotiate">
                <MessageSquare size={15} />
              </MagneticButton>
            </div>
          )}

          {proposal.status === "accepted" && (
            <MagneticButton variant="primary" className="w-full justify-center" onClick={negotiate} disabled={negotiating}>
              <MessageSquare size={14} /> Message Brand
            </MagneticButton>
          )}
        </div>
      )}
    </Drawer>
  );
}
