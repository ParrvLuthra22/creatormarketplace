"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, newPassword });
      showToast("Password reset. Please sign in.", "success");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) grid place-items-center px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-(--border) bg-(--bg-secondary) p-6 space-y-4">
        <h1 className="text-h2 font-display">Choose a new password</h1>
        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password" className="w-full h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
        <button disabled={loading || !token} className="h-11 rounded-xl bg-(--accent) text-(--bg-primary) px-5 font-semibold disabled:opacity-60">
          {loading ? "Saving..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}
