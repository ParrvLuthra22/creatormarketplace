"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Home, Search, Megaphone, MessageSquare, Settings, User, Inbox, Briefcase, TrendingUp, Plus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { useLogout } from "@/lib/hooks/useAuth";

const BRAND_NAV = [
  { label: "Overview", href: "/dashboard/brand", icon: Home },
  { label: "Discover", href: "/dashboard/brand/discover", icon: Search },
  { label: "Campaigns", href: "/dashboard/brand/campaigns", icon: Megaphone },
  { label: "Messages", href: "/dashboard/brand/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/brand/settings", icon: Settings },
];

const CREATOR_NAV = [
  { label: "Overview", href: "/dashboard/creator", icon: Home },
  { label: "My Profile", href: "/dashboard/creator/profile", icon: User },
  { label: "Inbox", href: "/dashboard/creator/inbox", icon: Inbox },
  { label: "Active Deals", href: "/dashboard/creator/deals", icon: Briefcase },
  { label: "Earnings", href: "/dashboard/creator/earnings", icon: TrendingUp },
  { label: "Settings", href: "/dashboard/creator/settings", icon: Settings },
];

interface MobileSidebarProps {
  type: "brand" | "creator";
  open: boolean;
  onClose: () => void;
  onNewCampaign?: () => void;
}

export default function MobileSidebar({ type, open, onClose, onNewCampaign }: MobileSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const nav = type === "brand" ? BRAND_NAV : CREATOR_NAV;
  const initials = (user?.fullName || "U").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9990] bg-black/50 md:hidden"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer — slides from left */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.65, 0, 0.35, 1] }}
            className="fixed left-0 top-0 bottom-0 z-[9995] w-72 bg-(--bg-secondary) border-r border-(--border) flex flex-col md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-(--border)">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-(--accent) text-(--bg-primary) flex items-center justify-center font-bold text-sm">C</div>
                <div>
                  <p className="font-display font-semibold text-sm">CreatorLyff</p>
                  <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">{type.toUpperCase()}</p>
                </div>
              </div>
              <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-(--bg-surface) text-(--text-tertiary)" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            {/* New Campaign CTA (brand only) */}
            {type === "brand" && onNewCampaign && (
              <div className="px-3 py-3 border-b border-(--border)">
                <button
                  onClick={() => { onNewCampaign(); onClose(); }}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-(--accent) text-(--bg-primary) text-sm font-semibold"
                >
                  <Plus size={14} aria-hidden />
                  New Campaign
                </button>
              </div>
            )}

            {/* Nav links */}
            <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto" data-lenis-prevent>
              {nav.map(({ label, href, icon: Icon }) => {
                const rootHref = type === "brand" ? "/dashboard/brand" : "/dashboard/creator";
                const active = pathname === href || (href !== rootHref && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors min-h-[44px]",
                      active ? "bg-(--bg-surface) text-(--text-primary)" : "text-(--text-secondary) hover:bg-(--bg-surface)"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* User + Logout */}
            <div className="border-t border-(--border) p-3">
              <div className="flex items-center gap-3 rounded-xl px-2 py-2">
                <div className="h-9 w-9 rounded-full bg-(--border-strong) flex items-center justify-center text-xs font-semibold shrink-0">{initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user?.fullName || "User"}</p>
                  <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">{type.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => { logout.mutate(); onClose(); }}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-(--text-tertiary) hover:text-(--text-primary)"
                  aria-label="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
