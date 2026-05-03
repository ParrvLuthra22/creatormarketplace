"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/request-password-reset", { email });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Reset your password" subtitle="Enter your email and we’ll send a reset link.">
      {sent ? (
        <p className="text-sm text-(--text-secondary)">If that email exists, reset instructions are on the way.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="w-full h-11 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none" />
          <button disabled={loading} className="h-11 rounded-xl bg-(--accent) text-(--bg-primary) px-5 font-semibold disabled:opacity-60">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}

function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) grid place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-(--border) bg-(--bg-secondary) p-6">
        <h1 className="text-h2 font-display">{title}</h1>
        <p className="mt-2 mb-6 text-sm text-(--text-secondary)">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
