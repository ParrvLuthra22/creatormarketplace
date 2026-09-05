"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Search } from "lucide-react";
import {
  useAdminUsers,
  useSuspendUser,
  useDeleteAdminUser,
  type AdminUserFilters,
} from "@/lib/hooks/useAdmin";
import { getProfilePhotoUrl } from "@/lib/api";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import LimeToggle from "@/components/dashboard/LimeToggle";
import ConfirmDestructiveModal from "@/components/admin/ConfirmDestructiveModal";
import { SkeletonCard } from "@/components/dashboard/Skeleton";

const DEFAULT_FILTERS: AdminUserFilters = { role: "", verificationStatus: "", suspended: "", plan: "", search: "" };

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<AdminUserFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<"suspend" | "delete" | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const query = useAdminUsers({ ...filters, page });
  const suspendUser = useSuspendUser();
  const deleteUser = useDeleteAdminUser();

  const users = query.data?.users || [];
  const pagination = query.data?.pagination;

  function updateFilter<K extends keyof AdminUserFilters>(key: K, value: AdminUserFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => (prev.size === users.length ? new Set() : new Set(users.map((u: { _id: string }) => u._id))));
  }

  async function runBulkAction() {
    setBulkLoading(true);
    try {
      const ids = Array.from(selected);
      if (bulkAction === "suspend") {
        await Promise.all(ids.map((id) => suspendUser.mutateAsync(id)));
      } else if (bulkAction === "delete") {
        await Promise.all(ids.map((id) => deleteUser.mutateAsync(id)));
      }
      setSelected(new Set());
      setBulkAction(null);
    } finally {
      setBulkLoading(false);
    }
  }

  const verificationColor = (status?: string) =>
    status === "verified" ? "var(--accent)" : status === "pending" ? "var(--warning)" : status === "rejected" ? "var(--text-tertiary)" : "var(--text-tertiary)";

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8">
        <SectionLabel index="01" label={`USERS · ${pagination?.total ?? 0} TOTAL`} />
        <h1 className="text-h2 font-display mt-2">Users.</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters */}
        <aside className="w-full lg:w-[260px] shrink-0 space-y-6">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)" />
            <input
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              placeholder="Search name or email…"
              data-interactive
              className="h-11 w-full rounded-xl bg-(--bg-secondary) border border-(--border) pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            />
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">ROLE</p>
            <div className="flex flex-wrap gap-2">
              {(["", "Brand", "Creator"] as const).map((r) => (
                <button
                  key={r || "all"}
                  onClick={() => updateFilter("role", r)}
                  className="rounded-full border px-3 py-1.5 text-xs transition-colors"
                  style={{ borderColor: filters.role === r ? "var(--accent)" : "var(--border)", color: filters.role === r ? "var(--accent)" : "var(--text-secondary)" }}
                  data-interactive
                >
                  {r || "All"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">VERIFICATION</p>
            <select
              value={filters.verificationStatus}
              onChange={(e) => updateFilter("verificationStatus", e.target.value as AdminUserFilters["verificationStatus"])}
              data-interactive
              className="h-10 w-full rounded-xl bg-(--bg-secondary) border border-(--border) px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              <option value="">All</option>
              <option value="unverified">Unverified</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">PLAN</p>
            <select
              value={filters.plan}
              onChange={(e) => updateFilter("plan", e.target.value as AdminUserFilters["plan"])}
              data-interactive
              className="h-10 w-full rounded-xl bg-(--bg-secondary) border border-(--border) px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
            >
              <option value="">All</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <LimeToggle checked={filters.suspended === "true"} onChange={(v) => updateFilter("suspended", v ? "true" : "")} label="Suspended only" />

          <MagneticButton variant="secondary" onClick={() => { setFilters(DEFAULT_FILTERS); setPage(1); }} className="w-full justify-center">
            Reset filters
          </MagneticButton>
        </aside>

        {/* Table */}
        <div className="flex-1 min-w-0">
          {selected.size > 0 && (
            <div className="flex items-center justify-between mb-4 rounded-xl border border-(--warning) bg-(--bg-secondary) px-4 py-3">
              <span className="text-sm">{selected.size} selected</span>
              <div className="flex gap-2">
                <button onClick={() => setBulkAction("suspend")} className="h-8 px-3 rounded-lg border border-(--warning) text-(--warning) text-xs font-medium" data-interactive>
                  Suspend selected
                </button>
                <button onClick={() => setBulkAction("delete")} className="h-8 px-3 rounded-lg bg-(--warning) text-(--bg-primary) text-xs font-semibold" data-interactive>
                  Delete selected
                </button>
              </div>
            </div>
          )}

          {query.isLoading ? (
            <SkeletonCard />
          ) : users.length === 0 ? (
            <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-16 text-center">
              <p className="text-(--text-tertiary)">No users match these filters.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-(--border) bg-(--bg-secondary) overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b border-(--border) font-mono-utility text-mono-sm text-(--text-tertiary)">
                    <th className="text-left px-4 py-3 w-10">
                      <input type="checkbox" checked={selected.size === users.length && users.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded accent-(--accent)" />
                    </th>
                    <th className="text-left px-4 py-3">USER</th>
                    <th className="text-left px-4 py-3">ROLE</th>
                    <th className="text-left px-4 py-3">PLAN</th>
                    <th className="text-left px-4 py-3">VERIFICATION</th>
                    <th className="text-left px-4 py-3">STATUS</th>
                    <th className="text-left px-4 py-3">JOINED</th>
                    <th className="text-right px-4 py-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => {
                    const photo = u.profile?.profilePhoto || u.profile?.logoUrl;
                    return (
                      <tr key={u._id} className="border-b border-(--border) last:border-b-0 hover:bg-(--bg-surface) transition-colors">
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selected.has(u._id)} onChange={() => toggleSelect(u._id)} className="h-4 w-4 rounded accent-(--accent)" />
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/dashboard/admin/users/${u._id}`} className="flex items-center gap-3" data-interactive>
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold text-xs shrink-0">
                              {photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={getProfilePhotoUrl(photo)} alt="" className="h-full w-full object-cover" />
                              ) : (
                                (u.fullName || "U").charAt(0)
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate flex items-center gap-1">
                                {u.fullName}
                                {u.verificationBadge && u.verificationBadge !== "none" && <BadgeCheck size={12} className="text-(--accent) shrink-0" />}
                              </p>
                              <p className="text-xs text-(--text-tertiary) truncate">{u.email}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-(--text-secondary)">{u.accountType}</td>
                        <td className="px-4 py-3 capitalize text-(--text-secondary)">{u.plan || "free"}</td>
                        <td className="px-4 py-3 capitalize" style={{ color: verificationColor(u.verificationStatus) }}>{u.verificationStatus || "unverified"}</td>
                        <td className="px-4 py-3">
                          {u.suspended ? <span className="text-(--warning)">Suspended</span> : <span className="text-(--success)">Active</span>}
                        </td>
                        <td className="px-4 py-3 text-(--text-tertiary)">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/dashboard/admin/users/${u._id}`} className="text-(--accent) hover:opacity-80 transition-opacity text-xs font-medium" data-interactive>
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 px-3 rounded-lg border border-(--border) text-sm disabled:opacity-40"
                data-interactive
              >
                Previous
              </button>
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="h-9 px-3 rounded-lg border border-(--border) text-sm disabled:opacity-40"
                data-interactive
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {bulkAction && (
        <ConfirmDestructiveModal
          title={bulkAction === "suspend" ? "Suspend users" : "Delete users"}
          description={`This will ${bulkAction === "suspend" ? "suspend" : "permanently delete"} ${selected.size} user(s). ${bulkAction === "delete" ? "This cannot be undone." : ""}`}
          confirmWord={bulkAction === "suspend" ? "SUSPEND" : "DELETE"}
          actionLabel={bulkAction === "suspend" ? "Suspend" : "Delete forever"}
          loading={bulkLoading}
          onConfirm={runBulkAction}
          onClose={() => setBulkAction(null)}
        />
      )}
    </div>
  );
}
