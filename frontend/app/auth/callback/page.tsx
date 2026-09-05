"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/auth";

const MIN_DISPLAY_MS = 500;
const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const [status, setStatus] = useState<"loading" | "error">("loading");

  const finish = useCallback(async () => {
    setStatus("loading");
    const started = Date.now();
    try {
      const user = await refreshUser();
      const elapsed = Date.now() - started;
      if (elapsed < MIN_DISPLAY_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_DISPLAY_MS - elapsed));
      }

      if (!user) {
        setStatus("error");
        return;
      }

      const isNewUser =
        searchParams.get("isNewUser") === "true" || searchParams.get("new") === "1";

      if (isNewUser) {
        router.replace("/onboarding");
        return;
      }

      router.replace(user.accountType === "Brand" ? "/dashboard/brand" : "/dashboard/creator");
    } catch {
      setStatus("error");
    }
  }, [refreshUser, router, searchParams]);

  useEffect(() => {
    void finish();
  }, [finish]);

  return (
    <div className="min-h-screen grid place-items-center bg-(--bg-primary) text-(--text-primary) px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <p className="font-display font-semibold text-body tracking-[-0.04em] mb-8">
          CreatorLyff
        </p>

        {status === "loading" ? (
          <>
            <div
              className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-(--border) border-t-(--accent) animate-spin"
              aria-hidden
            />
            <p className="text-sm text-(--text-secondary)">Finishing sign in…</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-(--warning) flex items-center justify-center">
              <AlertCircle size={18} className="text-(--warning)" aria-hidden />
            </div>
            <p className="text-sm text-(--text-secondary) mb-4" role="alert" aria-live="assertive">
              Something went wrong finishing sign in.
            </p>
            <button
              onClick={() => void finish()}
              data-interactive
              data-cursor="Retry"
              className="font-mono-utility text-mono-sm text-(--accent) hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
            >
              TRY AGAIN
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
