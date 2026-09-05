"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import AnimatedCheckmark from "@/components/auth/AnimatedCheckmark";

const AuthBackground = dynamic(() => import("@/components/auth/AuthBackground"), { ssr: false });

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

export default function VerifyEmailPage() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setError("Missing verification token.");
        setStatus("error");
        setShake(true);
        setTimeout(() => setShake(false), 400);
        return;
      }
      try {
        await api.post("/api/auth/verify-email", { token });
        const user = await refreshUser();
        setStatus("success");
        setTimeout(() => {
          router.replace(user?.accountType === "Brand" ? "/dashboard/brand" : "/dashboard/creator");
        }, 1200);
      } catch (err) {
        setError(apiErrorMessage(err) || "This verification link is invalid or expired.");
        setStatus("error");
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
    }
    void verify();
  }, [refreshUser, router, token]);

  return (
    <div className="relative min-h-screen bg-(--bg-primary) text-(--text-primary) grid place-items-center px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <AuthBackground shape="icosahedron" />
      </div>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, var(--bg-primary) 100%)" }}
        aria-hidden
      />

      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl border border-(--border) bg-(--bg-secondary) p-8 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={shake ? { x: [0, -8, 8, -6, 6, -2, 2, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {status === "verifying" && (
          <>
            <div
              className="h-10 w-10 rounded-full border-2 border-(--border) border-t-(--accent) animate-spin"
              aria-hidden
            />
            <p className="text-sm text-(--text-secondary) mt-6">Verifying your email…</p>
          </>
        )}

        {status === "success" && (
          <>
            <AnimatedCheckmark />
            <h1 className="text-h3 font-display mt-6 mb-2">Email verified.</h1>
            <p className="text-sm text-(--text-secondary)">Taking you to your dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="h-16 w-16 rounded-full border-2 border-(--warning) flex items-center justify-center">
              <AlertCircle size={28} className="text-(--warning)" aria-hidden />
            </div>
            <h1 className="text-h3 font-display mt-6 mb-2">Verification failed.</h1>
            <p className="text-sm text-(--text-secondary) mb-6" role="alert" aria-live="assertive">
              {error}
            </p>
            <Link
              href="/login"
              className="font-mono-utility text-mono-sm text-(--accent) hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
              data-interactive
            >
              ← BACK TO LOGIN
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
