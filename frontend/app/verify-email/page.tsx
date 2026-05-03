"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

export default function VerifyEmailPage() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    async function verify() {
      try {
        await api.post("/api/auth/verify-email", { token });
        const user = await refreshUser();
        router.replace(user?.accountType === "Brand" ? "/dashboard/brand" : "/dashboard/creator");
      } catch {
        setMessage("This verification link is invalid or expired.");
      }
    }
    if (token) void verify();
    else setMessage("Missing verification token.");
  }, [refreshUser, router, token]);

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) grid place-items-center px-6">
      <p className="text-sm text-(--text-secondary)">{message}</p>
    </div>
  );
}
