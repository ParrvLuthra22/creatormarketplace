"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Superseded by the redesigned /dashboard/brand/campaigns page — proposals ARE campaigns in this data model. */
export default function BrandProposalsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/brand/campaigns");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-(--bg-primary)">
      <div className="h-8 w-8 rounded-full border-2 border-(--border) border-t-(--accent) animate-spin" />
    </div>
  );
}
