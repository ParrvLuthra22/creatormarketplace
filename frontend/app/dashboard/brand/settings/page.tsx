"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { api, apiErrorMessage } from "@/lib/api";
import { showToast } from "@/lib/toast";
import SectionLabel from "@/components/dashboard/SectionLabel";
import MagneticButton from "@/components/dashboard/MagneticButton";
import LimeToggle from "@/components/dashboard/LimeToggle";

const NOTIF_PREFS_KEY = "creatorlyff:notification-prefs";
const DEFAULT_PREFS = { newProposal: true, newMessage: true, weeklyDigest: false };

function loadPrefs() {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(NOTIF_PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
      <h2 className="font-display font-semibold text-lg mb-5">{title}</h2>
      {children}
    </div>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await api.put("/api/auth/password", { currentPassword, newPassword });
      showToast("Password updated.", "success");
      onClose();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-(--border) bg-(--bg-secondary) p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-h3 font-display">Change password</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-(--bg-surface) grid place-items-center" aria-label="Close" data-interactive>
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            data-interactive
            className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            data-interactive
            className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            data-interactive
            className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
          />
          {error && <p className="text-caption text-(--warning)" role="alert">{error}</p>}
          <MagneticButton variant="primary" onClick={submit} disabled={loading || !currentPassword || !newPassword} className="w-full justify-center">
            {loading ? "Updating…" : "Update password"}
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  async function submit() {
    setLoading(true);
    try {
      await api.delete("/api/auth/account");
      setUser(null);
      router.push("/");
    } catch (err) {
      showToast(apiErrorMessage(err), "error");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-(--warning) bg-(--bg-secondary) p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={20} className="text-(--warning)" />
          <h3 className="text-h3 font-display">Delete account</h3>
        </div>
        <p className="text-sm text-(--text-secondary) mb-4">
          This permanently deletes your account and brand profile. This cannot be undone.
        </p>
        <label htmlFor="delete-confirm" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
          TYPE DELETE TO CONFIRM
        </label>
        <input
          id="delete-confirm"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          data-interactive
          className="h-11 w-full rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--warning) mb-4"
        />
        <div className="flex gap-2">
          <MagneticButton variant="secondary" onClick={onClose} className="flex-1 justify-center">
            Cancel
          </MagneticButton>
          <button
            onClick={submit}
            disabled={confirmText !== "DELETE" || loading}
            className="flex-1 h-10 rounded-xl bg-(--warning) text-(--bg-primary) font-semibold text-sm disabled:opacity-40 transition-opacity"
            data-interactive
          >
            {loading ? "Deleting…" : "Delete forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BrandSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  function updatePref(key: keyof typeof DEFAULT_PREFS, value: boolean) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(next));
    } catch {
      // best-effort — non-fatal if storage is unavailable
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
      {deleteModalOpen && <DeleteAccountModal onClose={() => setDeleteModalOpen(false)} />}
    </div>
  );
}
