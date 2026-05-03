"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    async function finish() {
      const user = await refreshUser();
      const isNewUser =
        searchParams.get("isNewUser") === "true" ||
        searchParams.get("new") === "1";

      if (isNewUser) {
        router.replace("/onboarding");
        return;
      }

      router.replace(user?.accountType === "Brand" ? "/dashboard/brand" : "/dashboard/creator");
    }
    void finish();
  }, [refreshUser, router, searchParams]);

  return (
    <div className="min-h-screen grid place-items-center bg-(--bg-primary) text-(--text-primary)">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-(--border) border-t-(--accent) animate-spin" />
        <p className="text-sm text-(--text-secondary)">Finishing sign in...</p>
      </div>
    </div>
  );
}
