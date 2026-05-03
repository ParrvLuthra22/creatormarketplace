"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { CreditCard, RefreshCw, Shield } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useCreatorProfile, useUpdateCreatorProfile } from "@/lib/hooks/useProfile";
import { useRefreshStats } from "@/lib/hooks/useSocialSync";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
      <div className="px-6 py-5 border-b border-(--border)">
        <h2 className="font-semibold text-(--text-primary)">{title}</h2>
        {description ? <p className="text-sm text-(--text-secondary) mt-0.5">{description}</p> : null}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function SwitchRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-(--border) last:border-0">
      <div>
        <p className="text-sm font-medium text-(--text-primary)">{label}</p>
        <p className="text-xs text-(--text-secondary) mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("h-6 w-11 rounded-full shrink-0 relative transition-colors", checked ? "bg-(--accent)" : "bg-(--border-strong)")}
      >
        <span className="absolute top-1 h-4 w-4 rounded-full bg-white transition-transform" style={{ transform: checked ? "translateX(18px)" : "translateX(3px)" }} />
      </button>
    </div>
  );
}

export default function CreatorSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const profileQuery = useCreatorProfile();
  const updateProfile = useUpdateCreatorProfile();
  const refreshStats = useRefreshStats();
  const profile = profileQuery.data?.profile || profileQuery.data;
  const [availability, setAvailability] = useState("available");
  const [notifications, setNotifications] = useState({
    newRequest: true,
    dealUpdates: true,
    paymentReceived: true,
    weeklyStats: false,
    marketing: false,
  });
  const [profilePublic, setProfilePublic] = useState(true);
  const [pricingPublic, setPricingPublic] = useState(true);

  useEffect(() => {
    if (profile?.availability) {
      setAvailability(profile.availability);
    }
  }, [profile]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-h2 font-display">Settings</h1>
        <p className="text-sm text-(--text-tertiary) mt-1">{user?.email}</p>
      </div>

      <Section title="Account" description="Your login and profile status.">
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5 block">EMAIL</label>
              <input value={user?.email || ""} readOnly className="w-full h-11 px-4 rounded-xl bg-(--bg-surface) border border-(--border) text-sm text-(--text-secondary) outline-none" />
            </div>
            <div>
              <label className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5 block">AVAILABILITY</label>
              <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-(--bg-surface) border border-(--border) text-sm text-(--text-primary) outline-none">
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => updateProfile.mutate({ availability })}
              disabled={updateProfile.isPending}
              className="h-10 px-5 rounded-lg bg-(--accent) text-(--bg-primary) text-sm font-semibold disabled:opacity-50"
            >
              {updateProfile.isPending ? "Saving..." : "Save account settings"}
            </button>
            <button onClick={() => logout()} className="h-10 px-5 rounded-lg border border-(--border) text-sm text-(--text-secondary) hover:text-(--text-primary)">
              Log out
            </button>
          </div>
        </div>
      </Section>

      <Section title="Connected Stats" description="Refresh Instagram and YouTube metrics from the backend sync service.">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-(--text-primary)">Combined followers: {new Intl.NumberFormat().format(profile?.combinedFollowerCount || profile?.instagramFollowerCount || 0)}</p>
            <p className="text-xs text-(--text-tertiary) mt-1">
              Last updated: {profile?.instagramDataUpdatedAt || profile?.youtubeDataUpdatedAt ? new Date(profile.instagramDataUpdatedAt || profile.youtubeDataUpdatedAt).toLocaleString() : "Not synced yet"}
            </p>
          </div>
          <button
            onClick={() => refreshStats.mutate()}
            disabled={refreshStats.isPending}
            className="h-10 px-4 rounded-lg border border-(--border) text-sm text-(--text-secondary) hover:text-(--text-primary) inline-flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshStats.isPending ? "animate-spin" : ""} />
            Refresh stats
          </button>
        </div>
      </Section>

      <Section title="Notifications">
        <SwitchRow label="New collab requests" description="When a brand sends you a new proposal." checked={notifications.newRequest} onChange={(v) => setNotifications((p) => ({ ...p, newRequest: v }))} />
        <SwitchRow label="Deal updates" description="Status changes on active deals." checked={notifications.dealUpdates} onChange={(v) => setNotifications((p) => ({ ...p, dealUpdates: v }))} />
        <SwitchRow label="Payment received" description="When a payout lands in your account." checked={notifications.paymentReceived} onChange={(v) => setNotifications((p) => ({ ...p, paymentReceived: v }))} />
        <SwitchRow label="Weekly creator stats" description="Profile views and request volume." checked={notifications.weeklyStats} onChange={(v) => setNotifications((p) => ({ ...p, weeklyStats: v }))} />
        <SwitchRow label="Platform updates" description="New features and product announcements." checked={notifications.marketing} onChange={(v) => setNotifications((p) => ({ ...p, marketing: v }))} />
      </Section>

      <Section title="Payment Info" description="Razorpay payouts are planned for the next backend pass.">
        <div className="p-4 rounded-xl bg-(--bg-surface) flex items-start gap-3">
          <CreditCard size={17} className="text-(--accent) shrink-0 mt-0.5" />
          <p className="text-xs text-(--text-secondary) leading-relaxed">
            Earnings are shown as a stub for now. Bank account and payout controls will connect once Razorpay creator payouts are wired.
          </p>
        </div>
      </Section>

      <Section title="Privacy">
        <SwitchRow label="Public profile" description="Brands can discover and view your public profile." checked={profilePublic} onChange={setProfilePublic} />
        <SwitchRow label="Public pricing" description="Show your rate card on your public profile." checked={pricingPublic} onChange={setPricingPublic} />
      </Section>

      <Section title="Danger Zone">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-(--warning) mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-(--text-primary)">Delete creator account</p>
              <p className="text-xs text-(--text-secondary) mt-0.5">Contact support to permanently remove your account.</p>
            </div>
          </div>
          <button onClick={() => showToast("Please contact support.creatorlyff@gmail.com to delete your account.", "error")} className="h-9 px-4 rounded-lg border border-(--warning)/50 text-(--warning) text-sm font-medium">
            Delete
          </button>
        </div>
      </Section>
    </div>
  );
}
