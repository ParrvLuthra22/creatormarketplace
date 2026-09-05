"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Inbox,
  Briefcase,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { useLogout } from "@/lib/hooks/useAuth";
import { useProposals } from "@/lib/hooks/useProposals";

const NAV = [
  { label: "Overview", href: "/dashboard/creator", icon: Home },
  { label: "My Profile", href: "/dashboard/creator/profile", icon: User },
  { label: "Inbox", href: "/dashboard/creator/inbox", icon: Inbox, badge: true },
  { label: "Active Deals", href: "/dashboard/creator/deals", icon: Briefcase },
  { label: "Earnings", href: "/dashboard/creator/earnings", icon: TrendingUp },
  { label: "Analytics", href: "/dashboard/creator/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/creator/settings", icon: Settings },
];

export default function CreatorSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const logout = useLogout();
  const pending = useProposals("pending");
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.fullName || "C").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const pendingCount = pending.data?.proposals?.length || 0;
  const isVerified = Boolean(user?.verificationBadge && user.verificationBadge !== "none");
  const handle = String(profile?.instagramHandle || "").replace(/^@+/, "");

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
              <p className="font-mono-utility text-mono-sm text-(--accent)">CREATOR</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {NAV.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard/creator" && pathname.startsWith(href));
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
                  layoutId="creator-sidebar-active-bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-(--accent)"
                  transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                />
              )}
              <span className="relative shrink-0">
                <Icon size={18} />
                {badge && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-(--accent)" aria-hidden />
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
              {badge && pendingCount > 0 && expanded && (
                <span className="font-mono-utility text-mono-sm text-(--accent) shrink-0">{pendingCount}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* View Public Profile */}
      {handle && (
        <div className="px-3 pb-2 shrink-0">
          <a
            href={`/c/${handle}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-(--text-secondary) hover:bg-(--bg-surface) hover:text-(--text-primary) transition-colors duration-150"
            data-interactive
            data-cursor="View public profile"
          >
            <ExternalLink size={18} className="shrink-0" />
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  View Public Profile
                </motion.span>
              )}
            </AnimatePresence>
          </a>
        </div>
      )}

      {/* User + logout */}
      <div className="border-t border-(--border) p-3 relative shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-full flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-(--bg-surface) transition-colors duration-150"
          data-interactive
          aria-label="Account menu"
        >
          <div className="relative h-8 w-8 rounded-full bg-(--accent) text-(--bg-primary) flex items-center justify-center text-xs font-semibold shrink-0">
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
                <p className="truncate text-sm font-medium">{user?.fullName || "Creator"}</p>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">CREATOR</p>
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
              {user?.isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface) transition-colors"
                  data-interactive
                >
                  <ShieldCheck size={15} />
                  Admin Panel
                </Link>
              )}
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
