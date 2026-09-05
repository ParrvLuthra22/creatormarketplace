"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Megaphone,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { useLogout } from "@/lib/hooks/useAuth";
import { useUnreadCount } from "@/lib/socket";
import MagneticButton from "./MagneticButton";

const NAV = [
  { label: "Overview", href: "/dashboard/brand", icon: Home },
  { label: "Discover", href: "/dashboard/brand/discover", icon: Search },
  { label: "Campaigns", href: "/dashboard/brand/campaigns", icon: Megaphone },
  { label: "Messages", href: "/dashboard/brand/messages", icon: MessageSquare, badge: true },
  { label: "Analytics", href: "/dashboard/brand/analytics", icon: BarChart3 },
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
  const unread = useUnreadCount();
  const unreadCount = unread.data?.totalUnread || 0;
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.fullName || "B")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isVerified = Boolean(user?.verificationBadge && user.verificationBadge !== "none");

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setMenuOpen(false);
      }}
      animate={{ width: expanded ? 260 : 72 }}
      transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
      className="hidden md:flex shrink-0 flex-col border-r border-(--border) bg-(--bg-secondary) overflow-hidden relative z-30"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 h-[76px] shrink-0">
        <div className="h-8 w-8 rounded-lg bg-(--accent) text-(--bg-primary) flex items-center justify-center font-bold text-sm shrink-0">
          C
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="min-w-0 whitespace-nowrap"
            >
              <p className="font-display font-semibold text-sm">CreatorLyff</p>
              <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">BRAND</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Campaign CTA */}
      {onNewCampaign && (
        <div className="px-3 pb-2 shrink-0">
          <MagneticButton
            variant="primary"
            onClick={onNewCampaign}
            className="w-full justify-center"
            data-cursor="New campaign"
          >
            <Plus size={14} aria-hidden className="shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  New Campaign
                </motion.span>
              )}
            </AnimatePresence>
          </MagneticButton>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {NAV.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard/brand" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              data-interactive
              data-cursor={label}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
                active ? "bg-(--bg-surface) text-(--accent)" : "text-(--text-secondary) hover:bg-(--bg-surface)"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-(--accent)"
                  transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                />
              )}
              <span className="relative shrink-0">
                <Icon size={18} />
                {badge && unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-(--accent)"
                    aria-hidden
                  />
                )}
              </span>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden flex-1"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {badge && unreadCount > 0 && expanded && (
                <span className="font-mono-utility text-mono-sm text-(--accent) shrink-0">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-(--border) p-3 relative shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-full flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-(--bg-surface) transition-colors duration-150"
          data-interactive
          aria-label="Account menu"
        >
          <div className="relative h-8 w-8 rounded-full bg-(--border-strong) flex items-center justify-center text-xs font-semibold shrink-0">
            {initials}
            {isVerified && (
              <BadgeCheck
                size={13}
                className="absolute -bottom-0.5 -right-0.5 text-(--accent) bg-(--bg-secondary) rounded-full"
                aria-label="Verified"
              />
            )}
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="min-w-0 flex-1 text-left overflow-hidden"
              >
                <p className="truncate text-sm font-medium">{user?.fullName || "Brand"}</p>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">BRAND</p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {menuOpen && expanded && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-(--border) bg-(--bg-secondary) shadow-xl overflow-hidden"
            >
              <button
                onClick={() => logout.mutate()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface) transition-colors"
                data-interactive
              >
                <LogOut size={15} />
                Log out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
