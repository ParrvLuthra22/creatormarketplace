"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, ShieldCheck } from "lucide-react";
import {
  useAdminUser,
  useUpdateAdminUser,
  useSuspendUser,
  useUnsuspendUser,
  useDeleteAdminUser,
} from "@/lib/hooks/useAdmin";
import { getProfilePhotoUrl } from "@/lib/api";
import { SkeletonCard } from "@/components/dashboard/Skeleton";
import MagneticButton from "@/components/dashboard/MagneticButton";
import ConfirmDestructiveModal from "@/components/admin/ConfirmDestructiveModal";

const PLATFORM_FIELDS = [
  { key: "googleId", label: "Google" },
  { key: "instagramId", label: "Instagram" },
  { key: "youtubeId", label: "YouTube" },
  { key: "twitterId", label: "X" },
  { key: "linkedinId", label: "LinkedIn" },
  { key: "snapchatId", label: "Snapchat" },
];

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
      <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4">{title}</p>
      {children}
    </div>
  );
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const query = useAdminUser(id);
  const updateUser = useUpdateAdminUser();
  const suspendUser = useSuspendUser();
  const unsuspendUser = useUnsuspendUser();
  const deleteUser = useDeleteAdminUser();

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  if (query.isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <SkeletonCard />
      </div>
    );
  }

  const user = query.data?.user;
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-(--text-tertiary) mb-4">User not found.</p>
        <Link href="/dashboard/admin/users" className="text-(--accent) text-sm font-medium">← Back to users</Link>
      </div>
    );
  }

  const profile = query.data.profile;
  const activity = query.data.activity;
  const verificationRequests = query.data.verificationRequests || [];
  const photo = profile?.profilePhoto || profile?.logoUrl;

  async function suspendToggle() {
    if (user.suspended) await unsuspendUser.mutateAsync(id);
    else await suspendUser.mutateAsync(id);
    setSuspendModalOpen(false);
  }

  async function confirmDelete() {
    await deleteUser.mutateAsync(id);
    router.push("/dashboard/admin/users");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard/admin/users" className="inline-flex items-center gap-2 font-mono-utility text-mono-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors" data-interactive>
        <ArrowLeft size={13} /> BACK TO USERS
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-xl shrink-0">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getProfilePhotoUrl(photo)} alt="" className="h-full w-full object-cover" />
            ) : (
              (user.fullName || "U").charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-h2 font-display flex items-center gap-2">
              {user.fullName}
              {user.verificationBadge && user.verificationBadge !== "none" && <BadgeCheck size={18} className="text-(--accent)" />}
              {user.isAdmin && <ShieldCheck size={18} style={{ color: "var(--warning)" }} />}
            </h1>
            <p className="text-sm text-(--text-tertiary)">{user.email}</p>
          </div>
        </div>
        <span
          className="rounded-full border px-3 py-1.5 text-xs font-mono-utility uppercase shrink-0"
          style={{ color: user.suspended ? "var(--warning)" : "var(--success)", borderColor: user.suspended ? "var(--warning)" : "var(--success)" }}
        >
          {user.suspended ? "Suspended" : "Active"}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard title="PERSONAL INFO">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-(--text-tertiary)">Role</dt><dd>{user.accountType}</dd></div>
            <div className="flex justify-between"><dt className="text-(--text-tertiary)">Plan</dt><dd className="capitalize">{user.plan || "free"}</dd></div>
            <div className="flex justify-between"><dt className="text-(--text-tertiary)">Joined</dt><dd>{new Date(user.createdAt).toLocaleDateString()}</dd></div>
            <div className="flex justify-between"><dt className="text-(--text-tertiary)">Last login</dt><dd>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}</dd></div>
            <div className="flex justify-between"><dt className="text-(--text-tertiary)">Email verified</dt><dd>{user.emailVerified ? "Yes" : "No"}</dd></div>
          </dl>
        </InfoCard>

        <InfoCard title="CONNECTED PLATFORMS">
          <div className="flex flex-wrap gap-2">
            {PLATFORM_FIELDS.map((p) => (
              <span
                key={p.key}
                className="rounded-full border px-3 py-1 text-xs"
                style={{
                  borderColor: user[p.key] ? "var(--accent)" : "var(--border)",
                  color: user[p.key] ? "var(--accent)" : "var(--text-tertiary)",
                }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="VERIFICATION">
          <dl className="space-y-2 text-sm mb-3">
            <div className="flex justify-between"><dt className="text-(--text-tertiary)">Status</dt><dd className="capitalize">{user.verificationStatus || "unverified"}</dd></div>
            <div className="flex justify-between"><dt className="text-(--text-tertiary)">Badge</dt><dd className="capitalize">{user.verificationBadge || "none"}</dd></div>
            {user.verificationRejectionReason && (
              <div><dt className="text-(--text-tertiary) mb-1">Rejection reason</dt><dd className="text-(--warning)">{user.verificationRejectionReason}</dd></div>
            )}
          </dl>
          {verificationRequests.length > 0 && (
            <div className="border-t border-(--border) pt-3 space-y-2">
              {verificationRequests.slice(0, 5).map((r: any) => (
                <div key={r._id} className="flex justify-between text-xs">
                  <span className="capitalize text-(--text-secondary)">{r.status} · {r.requestType.replace("_", " ")}</span>
                  <span className="text-(--text-tertiary)">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </InfoCard>

        <InfoCard title="ACTIVITY">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-(--text-tertiary)">Messages sent</dt><dd>{activity.messagesSent}</dd></div>
            {activity.proposalsByStatus.map((p: { _id: string; count: number }) => (
              <div key={p._id} className="flex justify-between"><dt className="text-(--text-tertiary) capitalize">Proposals ({p._id})</dt><dd>{p.count}</dd></div>
            ))}
          </dl>
        </InfoCard>
      </div>

      {/* Admin actions */}
      <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6 space-y-5">
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">ADMIN ACTIONS</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5 block">PLAN</label>
            <select
              value={user.plan || "free"}
              onChange={(e) => updateUser.mutate({ id, plan: e.target.value })}
              data-interactive
              className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <div>
            <label className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5 block">VERIFICATION BADGE</label>
            <select
              value={user.verificationBadge || "none"}
              onChange={(e) => updateUser.mutate({ id, verificationBadge: e.target.value })}
              data-interactive
              className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              <option value="none">None</option>
              <option value="verified">Verified</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-(--border)">
          <MagneticButton
            variant={user.isAdmin ? "secondary" : "primary"}
            onClick={() => updateUser.mutate({ id, isAdmin: !user.isAdmin })}
            disabled={updateUser.isPending}
          >
            {user.isAdmin ? "Revoke admin" : "Grant admin"}
          </MagneticButton>

          <button
            onClick={() => setSuspendModalOpen(true)}
            className="h-10 px-4 rounded-xl border text-sm font-medium transition-colors"
            style={{ borderColor: "var(--warning)", color: "var(--warning)" }}
            data-interactive
          >
            {user.suspended ? "Unsuspend user" : "Suspend user"}
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="h-10 px-4 rounded-xl text-sm font-semibold ml-auto"
            style={{ background: "var(--warning)", color: "var(--bg-primary)" }}
            data-interactive
          >
            Delete user
          </button>
        </div>
      </div>

      {suspendModalOpen && (
        <ConfirmDestructiveModal
          title={user.suspended ? "Unsuspend user" : "Suspend user"}
          description={`This will ${user.suspended ? "restore" : "suspend"} ${user.fullName}'s access to CreatorLyff.`}
          confirmWord="SUSPEND"
          actionLabel={user.suspended ? "Unsuspend" : "Suspend"}
          loading={suspendUser.isPending || unsuspendUser.isPending}
          onConfirm={suspendToggle}
          onClose={() => setSuspendModalOpen(false)}
        />
      )}

      {deleteModalOpen && (
        <ConfirmDestructiveModal
          title="Delete user"
          description={`This permanently deletes ${user.fullName}'s account and profile. This cannot be undone.`}
          confirmWord="DELETE"
          actionLabel="Delete forever"
          loading={deleteUser.isPending}
          onConfirm={confirmDelete}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
