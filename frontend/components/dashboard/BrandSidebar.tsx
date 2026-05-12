"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Megaphone, MessageSquare, Settings, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { useLogout } from "@/lib/hooks/useAuth";

const NAV = [
  { label: "Overview", href: "/dashboard/brand", icon: Home },
  { label: "Discover", href: "/dashboard/brand/discover", icon: Search },
  { label: "Campaigns", href: "/dashboard/brand/campaigns", icon: Megaphone },
  { label: "Messages", href: "/dashboard/brand/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/brand/settings", icon: Settings },
];

export default function BrandSidebar({
  onNewCampaign,
}: {
  onNewCampaign?: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const initials = (user?.fullName || "B").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-(--border) bg-(--bg-secondary)">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="h-8 w-8 rounded-lg bg-(--accent) text-(--bg-primary) flex items-center justify-center font-bold text-sm">C</div>
        <div>
          <p className="font-display font-semibold text-sm">CreatorLyff</p>
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">BRAND</p>
        </div>
      </div>

      {/* New Campaign — sidebar top CTA */}
      {onNewCampaign && (
        <div className="px-3 pb-2">
          <button
            onClick={onNewCampaign}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors"
            data-interactive
          >
            <Plus size={14} aria-hidden />
            New Campaign
          </button>
        </div>
      )}

      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard/brand" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "bg-(--bg-surface) text-(--text-primary)" : "text-(--text-secondary) hover:bg-(--bg-surface)")}>
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-(--border) p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-(--border-strong) flex items-center justify-center text-xs font-semibold">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.fullName || "Brand"}</p>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">BRAND</p>
          </div>
          <button onClick={() => logout.mutate()} className="text-(--text-tertiary) hover:text-(--text-primary) min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
