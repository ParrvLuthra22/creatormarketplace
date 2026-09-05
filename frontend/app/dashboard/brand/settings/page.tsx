"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { api, apiErrorMessage } from "@/lib/api";
import { showToast } from "@/lib/toast";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import LimeToggle from "@/components/dashboard/LimeToggle";
import { SettingsCard, PasswordModal, DeleteAccountModal } from "@/components/dashboard/AccountSettings";

const DEFAULT_PREFS = { newProposal: true, newMessage: true, weeklyDigest: false };

export default function BrandSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <SectionLabel index="01" label="SETTINGS" />
        <h1 className="text-h2 font-display mt-2">Settings.</h1>
      </div>

      <SettingsCard title="Account">
        <div className="space-y-4">
          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-1.5">EMAIL</p>
            <p className="text-sm text-(--text-secondary)">{user?.email}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <MagneticButton variant="secondary" onClick={() => setPasswordModalOpen(true)}>
              Change password
            </MagneticButton>
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
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Notifications">
        <div className="space-y-4">
          <LimeToggle checked={prefs.newProposal} onChange={(v) => updatePref("newProposal", v)} label="Email me when a creator responds to a proposal" />
          <LimeToggle checked={prefs.newMessage} onChange={(v) => updatePref("newMessage", v)} label="Email me about new messages" />
          <LimeToggle checked={prefs.weeklyDigest} onChange={(v) => updatePref("weeklyDigest", v)} label="Weekly performance digest" />
        </div>
      </SettingsCard>

      <SettingsCard title="Billing">
        <div className="rounded-lg border border-dashed border-(--border-strong) p-6 text-center">
          <p className="text-sm text-(--text-tertiary)">Billing management is coming soon.</p>
        </div>
      </SettingsCard>

      <SettingsCard title="Team">
        <div className="rounded-lg border border-dashed border-(--border-strong) p-6 text-center">
          <p className="text-sm text-(--text-tertiary)">Multi-user brand accounts are coming soon.</p>
        </div>
      </SettingsCard>

      {passwordModalOpen && <PasswordModal onClose={() => setPasswordModalOpen(false)} />}
      {deleteModalOpen && <DeleteAccountModal onClose={() => setDeleteModalOpen(false)} profileLabel="brand profile" />}
    </div>
  );
}
