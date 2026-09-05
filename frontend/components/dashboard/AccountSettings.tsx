"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { api, apiErrorMessage } from "@/lib/api";
import { showToast } from "@/lib/toast";
import MagneticButton from "./MagneticButton";

export function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-6">
      <h2 className="font-display font-semibold text-lg mb-5">{title}</h2>
      {children}
    </div>
  );
}

export function PasswordModal({ onClose }: { onClose: () => void }) {
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

export function DeleteAccountModal({ onClose, profileLabel = "profile" }: { onClose: () => void; profileLabel?: string }) {
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
          This permanently deletes your account and {profileLabel}. This cannot be undone.
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
