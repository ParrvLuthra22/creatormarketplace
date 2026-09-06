"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useCreatorProfile, useUpdateCreatorProfile } from "@/lib/hooks/useProfile";
import { useRefreshStats } from "@/lib/hooks/useSocialSync";
import { api, apiErrorMessage } from "@/lib/api";
import { showToast } from "@/lib/toast";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import LimeToggle from "@/components/dashboard/LimeToggle";
import { SettingsCard, PasswordModal, DeleteAccountModal } from "@/components/dashboard/AccountSettings";
import { InstagramIcon, YouTubeIcon, XIcon, LinkedInIcon, SnapchatIcon } from "@/components/auth/SocialIcons";

const DEFAULT_PREFS = { newProposal: true, newMessage: true, weeklyDigest: false };

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: <InstagramIcon /> },
  { id: "youtube", label: "YouTube", icon: <YouTubeIcon /> },
  { id: "twitter", label: "X", icon: <XIcon /> },
  { id: "linkedin", label: "LinkedIn", icon: <LinkedInIcon /> },
  { id: "snapchat", label: "Snapchat", icon: <SnapchatIcon /> },
];

export default function CreatorSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const profileQuery = useCreatorProfile();
  const updateProfile = useUpdateCreatorProfile();
  const refreshStats = useRefreshStats();
  const profile = profileQuery.data?.profile || profileQuery.data;

  const [availability, setAvailability] = useState("available");
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [profilePublic, setProfilePublic] = useState(true);
  const [pricingPublic, setPricingPublic] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (profile?.availability) setAvailability(profile.availability);
    if (profile) {
      setProfilePublic(profile.profilePublic ?? true);
      setPricingPublic(profile.pricingPublic ?? true);
    }
  }, [profile]);

  useEffect(() => {
    if (user?.notificationPreferences) setPrefs(user.notificationPreferences);
  }, [user?.notificationPreferences]);

  async function updatePref(key: keyof typeof DEFAULT_PREFS, value: boolean) {
    const prev = prefs;
    setPrefs((p) => ({ ...p, [key]: value }));
    try {
      await api.put("/api/auth/notification-preferences", { [key]: value });
      await refreshUser();
    } catch (err) {
      setPrefs(prev);
      showToast(apiErrorMessage(err), "error");
    }
  }

  function updatePrivacy(key: "profilePublic" | "pricingPublic", value: boolean) {
    if (key === "profilePublic") setProfilePublic(value);
    else setPricingPublic(value);
    updateProfile.mutate({ [key]: value });
  }

  const connected = user?.connectedPlatforms || ({} as Record<string, boolean>);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <SectionLabel index="01" label="SETTINGS" />
        <h1 className="text-h2 font-display mt-2">Settings.</h1>
      </div>

      <SettingsCard title="Account">
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5 block">EMAIL</label>
              <input type="email" value={user?.email || ""} readOnly className="w-full h-11 px-4 rounded-xl bg-(--bg-surface) border border-(--border) text-sm text-(--text-secondary) outline-none" />
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

          <div className="flex flex-wrap gap-2">
            <MagneticButton
              variant="primary"
              onClick={() => updateProfile.mutate({ availability })}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving…" : "Save account settings"}
            </MagneticButton>
            <MagneticButton variant="secondary" onClick={() => setPasswordModalOpen(true)}>
              Change password
            </MagneticButton>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Connected Platforms">
        <div className="divide-y divide-(--border)">
          {PLATFORMS.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                {p.icon}
                <span className="text-sm font-medium">{p.label}</span>
              </div>
              <span
                className="font-mono-utility text-mono-sm"
                style={{ color: connected[p.id as keyof typeof connected] ? "var(--accent)" : "var(--text-tertiary)" }}
              >
                {connected[p.id as keyof typeof connected] ? "CONNECTED" : "NOT CONNECTED"}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-(--text-tertiary) mt-4">
          Manage connections and refresh stats from{" "}
          <a href="/dashboard/creator/profile" className="text-(--accent) hover:opacity-80 transition-opacity">
            My Profile
          </a>
          .
        </p>
        <button
          onClick={() => refreshStats.mutate()}
          disabled={refreshStats.isPending}
          className="mt-3 flex items-center gap-1.5 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
          data-interactive
        >
          <RefreshCw size={13} className={refreshStats.isPending ? "animate-spin" : ""} /> Refresh stats
        </button>
      </SettingsCard>

      <SettingsCard title="Notifications">
        <div className="space-y-4">
          <LimeToggle checked={prefs.newProposal} onChange={(v) => updatePref("newProposal", v)} label="Email me about new collab requests" />
          <LimeToggle checked={prefs.newMessage} onChange={(v) => updatePref("newMessage", v)} label="Email me about new messages" />
          <LimeToggle checked={prefs.weeklyDigest} onChange={(v) => updatePref("weeklyDigest", v)} label="Weekly creator stats digest" />
        </div>
      </SettingsCard>

      <SettingsCard title="Payment Info">
        <p className="text-xs text-(--text-secondary) leading-relaxed p-4 rounded-xl bg-(--bg-surface)">
          Earnings are self-reported for now. Bank account and payout controls will connect once Razorpay creator
          payouts are wired.
        </p>
      </SettingsCard>

      <SettingsCard title="Privacy">
        <div className="space-y-4">
          <LimeToggle checked={profilePublic} onChange={(v) => updatePrivacy("profilePublic", v)} label="Public profile — brands can discover and view your profile" />
          <LimeToggle checked={pricingPublic} onChange={(v) => updatePrivacy("pricingPublic", v)} label="Public pricing — show your rate card on your public profile" />
        </div>
      </SettingsCard>

      <SettingsCard title="Danger Zone">
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="h-10 px-4 rounded-xl border border-(--warning) text-(--warning) text-sm font-medium transition-colors"
          style={{ background: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(251,191,36,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          data-interactive
        >
          Delete account
        </button>
      </SettingsCard>

      {passwordModalOpen && <PasswordModal onClose={() => setPasswordModalOpen(false)} />}
      {deleteModalOpen && <DeleteAccountModal onClose={() => setDeleteModalOpen(false)} profileLabel="creator profile" />}
    </div>
  );
}
