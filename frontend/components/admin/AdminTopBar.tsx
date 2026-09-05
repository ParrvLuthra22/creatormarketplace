"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard/admin": "Platform Overview",
  "/dashboard/admin/users": "Users",
  "/dashboard/admin/verification-queue": "Verification Queue",
  "/dashboard/admin/reports": "Reports",
  "/dashboard/admin/settings": "Settings",
  "/dashboard/admin/setup": "Admin Setup",
};

function useISTClock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    function tick() {
      setNow(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function AdminTopBar() {
  const pathname = usePathname();
  const istTime = useISTClock();
  const title =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/dashboard/admin/users/") ? "User Detail" : "Admin");

  return (
    <header
      className="shrink-0 h-16 flex items-center gap-4 px-4 md:px-6 sticky top-0 z-20 border-b"
      style={{ borderColor: "rgba(251,191,36,0.15)", background: "var(--bg-secondary)" }}
    >
      <h1 className="text-sm font-semibold text-(--text-primary) shrink-0">{title}</h1>

      <div className="flex items-center gap-2 ml-auto">
        <span className="hidden sm:flex items-center gap-1.5 font-mono-utility text-mono-sm text-(--text-tertiary)">
          <ShieldCheck size={13} style={{ color: "var(--warning)" }} /> ADMIN MODE
        </span>
        <span className="hidden lg:block font-mono-utility text-mono-sm text-(--text-tertiary)">{istTime} IST</span>
      </div>
    </header>
  );
}
