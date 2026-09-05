"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import AnimatedCheckmark from "@/components/auth/AnimatedCheckmark";

const AuthBackground = dynamic(() => import("@/components/auth/AuthBackground"), { ssr: false });

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);

  function fail(message: string) {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!token) return fail("This reset link is missing its token.");
    if (newPassword.length < 8) return fail("Password must be at least 8 characters.");

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, newPassword });
      setDone(true);
      setTimeout(() => router.push("/login"), 1400);
    } catch (err) {
      fail(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-(--bg-primary) text-(--text-primary) grid place-items-center px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <AuthBackground shape="torusKnot" />
      </div>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, var(--bg-primary) 100%)" }}
        aria-hidden
      />

      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl border border-(--border) bg-(--bg-secondary) p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={shake ? { x: [0, -8, 8, -6, 6, -2, 2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {done ? (
          <div className="flex flex-col items-center text-center py-6">
            <AnimatedCheckmark />
            <h1 className="text-h3 font-display mt-6 mb-2">Password updated.</h1>
            <p className="text-sm text-(--text-secondary)">Taking you to sign in…</p>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="font-mono-utility text-mono-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-200 mb-8 inline-block focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
              data-interactive
            >
              ← BACK TO LOGIN
            </Link>
            <h1 className="text-h2 font-display mb-2">Choose a new password.</h1>
            <p className="text-sm text-(--text-secondary) mb-8">
              Make it at least 8 characters.
            </p>
            <form onSubmit={submit} noValidate className="space-y-4">
              <div>
                <label htmlFor="rp-password" className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2 block">
                  NEW PASSWORD
                </label>
                <input
                  id="rp-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError("");
                  }}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  data-interactive
                  data-cursor="Enter"
                  className="w-full h-12 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:border-(--accent) transition-all duration-200"
                />
                {error && (
                  <p className="mt-1.5 text-caption text-(--warning) flex items-center gap-1.5" role="alert" aria-live="assertive">
                    <AlertCircle size={13} /> {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !token}
                data-interactive
                data-cursor="Continue"
                className="w-full h-12 rounded-xl bg-(--accent) text-(--bg-primary) font-semibold hover:bg-(--accent-hover) transition-colors duration-200 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2"
              >
                {loading ? "Saving…" : "Reset password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
