"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Superseded by the redesigned /dashboard/creator/inbox page. */
export default function CreatorProposalsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/creator/inbox");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-(--bg-primary)">
      <div className="h-8 w-8 rounded-full border-2 border-(--border) border-t-(--accent) animate-spin" />
    </div>
  );
}
