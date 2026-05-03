"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Inbox, Briefcase, TrendingUp, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { useLogout } from "@/lib/hooks/useAuth";
import { useProposals } from "@/lib/hooks/useProposals";

const NAV = [
  { label: "Overview", href: "/dashboard/creator", icon: Home },
  { label: "My Profile", href: "/dashboard/creator/profile", icon: User },
  { label: "Inbox", href: "/dashboard/creator/inbox", icon: Inbox },
  { label: "Active Deals", href: "/dashboard/creator/deals", icon: Briefcase },
  { label: "Earnings", href: "/dashboard/creator/earnings", icon: TrendingUp },
  { label: "Settings", href: "/dashboard/creator/settings", icon: Settings },
];

export default function CreatorSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const pending = useProposals("pending");
  const initials = (user?.fullName || "C").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const pendingCount = pending.data?.proposals?.length || 0;

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-(--border) bg-(--bg-secondary)">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="h-8 w-8 rounded-lg bg-(--accent) text-(--bg-primary) flex items-center justify-center font-bold text-sm">C</div>
        <div>
          <p className="font-display font-semibold text-sm">CreatorLyff</p>
          <p className="font-mono-utility text-mono-sm text-(--accent)">CREATOR</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard/creator" && pathname.startsWith(href));
          const badge = href.endsWith("/inbox") ? pendingCount : 0;
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "bg-(--bg-surface) text-(--text-primary)" : "text-(--text-secondary) hover:bg-(--bg-surface)")}>
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge > 0 && <span className="rounded-full bg-(--accent) px-1.5 text-[10px] font-bold text-(--bg-primary)">{badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-(--border) p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-(--accent) text-(--bg-primary) flex items-center justify-center text-xs font-semibold">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.fullName || "Creator"}</p>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">CREATOR</p>
          </div>
          <button onClick={() => logout.mutate()} className="text-(--text-tertiary) hover:text-(--text-primary)" aria-label="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
