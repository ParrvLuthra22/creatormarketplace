"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import {
  useVerificationRequests,
  useApproveVerification,
  useRejectVerification,
} from "@/lib/hooks/useAdmin";
import { getProfilePhotoUrl } from "@/lib/api";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import { SkeletonCard } from "@/components/dashboard/Skeleton";
import { InstagramIcon, YouTubeIcon, XIcon } from "@/components/auth/SocialIcons";

const TABS = ["Pending", "Approved", "Rejected"] as const;
type Tab = (typeof TABS)[number];

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  instagram: <InstagramIcon />,
  youtube: <YouTubeIcon />,
  twitter: <XIcon />,
};

function ApproveModal({ requestId, onClose }: { requestId: string; onClose: () => void }) {
  const approve = useApproveVerification();
  const [badge, setBadge] = useState<"verified" | "premium">("verified");
  const [notes, setNotes] = useState("");

  async function submit() {
    await approve.mutateAsync({ id: requestId, badge, notes });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-(--border) bg-(--bg-secondary) p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h3 font-display">Approve verification</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-(--bg-surface) grid place-items-center" aria-label="Close" data-interactive>
            <X size={16} />
          </button>
        </div>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">BADGE TIER</p>
        <div className="flex gap-2 mb-4">
          {(["verified", "premium"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBadge(b)}
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm capitalize transition-colors"
              style={{ borderColor: badge === b ? "var(--accent)" : "var(--border)", color: badge === b ? "var(--accent)" : "var(--text-secondary)" }}
              data-interactive
            >
              {b}
            </button>
          ))}
        </div>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">NOTES (OPTIONAL, PRIVATE)</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          data-interactive
          className="w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 py-3 text-sm outline-none resize-none focus-visible:ring-2 focus-visible:ring-(--accent) mb-4"
        />
        <MagneticButton variant="primary" className="w-full justify-center" onClick={submit} disabled={approve.isPending}>
          {approve.isPending ? "Approving…" : "Approve"}
        </MagneticButton>
      </div>
    </div>
  );
}

function RejectModal({ requestId, onClose }: { requestId: string; onClose: () => void }) {
  const reject = useRejectVerification();
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  async function submit() {
    await reject.mutateAsync({ id: requestId, reason, notes });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-(--warning) bg-(--bg-secondary) p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h3 font-display">Reject verification</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-(--bg-surface) grid place-items-center" aria-label="Close" data-interactive>
            <X size={16} />
          </button>
        </div>
        <label className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">REASON (SENT TO USER)</label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Evidence didn't confirm follower count"
          data-interactive
          className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--warning) mb-4"
        />
        <label className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">NOTES (OPTIONAL, PRIVATE)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          data-interactive
          className="w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 py-3 text-sm outline-none resize-none focus-visible:ring-2 focus-visible:ring-(--warning) mb-4"
        />
        <button
          onClick={submit}
          disabled={!reason.trim() || reject.isPending}
          className="w-full h-10 rounded-xl bg-(--warning) text-(--bg-primary) font-semibold text-sm disabled:opacity-40"
          data-interactive
        >
          {reject.isPending ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </div>
  );
}

export default function VerificationQueuePage() {
  const [tab, setTab] = useState<Tab>("Pending");
  const query = useVerificationRequests({ status: tab.toLowerCase() as "pending" | "approved" | "rejected" });
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const requests = query.data?.requests || [];

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div>
        <SectionLabel index="01" label="VERIFICATION QUEUE" />
        <h1 className="text-h2 font-display mt-2">Verification queue.</h1>
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
            {t}
            {tab === t && (
              <motion.div
                layoutId="verification-tab-underline"
                className="absolute left-0 right-0 -bottom-px h-[2px] bg-(--accent)"
                transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      {query.isLoading ? (
        <SkeletonCard />
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-16 text-center">
          <p className="text-(--text-tertiary)">No {tab.toLowerCase()} verification requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r: any) => {
            const user = r.userId;
            const handle = (r.profile?.instagramHandle || "").replace(/^@+/, "");
            const followers = r.profile?.combinedFollowerCount || r.followerCount || 0;

            return (
              <div key={r._id} className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold shrink-0">
                      {r.profile?.profilePhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getProfilePhotoUrl(r.profile.profilePhoto)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (user?.fullName || "U").charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.fullName || "Unknown"}</p>
                      <p className="text-xs text-(--text-tertiary)">{handle ? `@${handle}` : user?.email} · {followers.toLocaleString?.() || followers} followers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full border px-2.5 py-1 text-[10px] font-mono-utility uppercase"
                      style={{
                        color: r.requestType === "auto_flag" ? "var(--warning)" : "#60a5fa",
                        borderColor: r.requestType === "auto_flag" ? "var(--warning)" : "#60a5fa",
                      }}
                    >
                      {r.requestType.replace("_", " ")}
                    </span>
                    <span className="shrink-0">{PLATFORM_ICON[r.platform] || null}</span>
                  </div>
                </div>

                <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">
                  SUBMITTED {new Date(r.createdAt).toLocaleDateString()}
                </p>

                {r.evidence?.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
                    {r.evidence.map((item: { type: string; url: string }, i: number) => (
                      <a
                        key={i}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="aspect-square rounded-lg border border-(--border) overflow-hidden bg-(--bg-surface) block"
                        data-interactive
                      >
                        {item.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt="Evidence" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-[10px] text-(--text-tertiary)">FILE</div>
                        )}
                      </a>
                    ))}
                  </div>
                )}

                {r.notes && (
                  <p className="text-xs text-(--text-tertiary) mb-4 rounded-lg bg-(--bg-surface) p-3">Notes: {r.notes}</p>
                )}

                {r.status === "rejected" && r.rejectionReason && (
                  <p className="text-xs text-(--warning) mb-4">Rejected: {r.rejectionReason}</p>
                )}

                {tab === "Pending" && (
                  <div className="flex gap-2">
                    <MagneticButton variant="primary" className="flex-1 justify-center" onClick={() => setApproveId(r._id)}>
                      Approve
                    </MagneticButton>
                    <button
                      onClick={() => setRejectId(r._id)}
                      className="flex-1 h-10 rounded-xl border text-sm font-medium transition-colors"
                      style={{ borderColor: "var(--warning)", color: "var(--warning)" }}
                      data-interactive
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {approveId && <ApproveModal requestId={approveId} onClose={() => setApproveId(null)} />}
      {rejectId && <RejectModal requestId={rejectId} onClose={() => setRejectId(null)} />}
    </div>
  );
}
