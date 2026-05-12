"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Plus, Search, Menu, Settings, LogOut, ChevronDown } from "lucide-react";
import { useToast } from "@/components/dashboard/Toast";
import { useAuthStore } from "@/lib/auth";
import { useUnreadCount } from "@/lib/socket";
import { useLogout } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard/brand": "Overview",
  "/dashboard/brand/discover": "Discover Creators",
  "/dashboard/brand/campaigns": "Campaigns",
  "/dashboard/brand/messages": "Messages",
  "/dashboard/brand/analytics": "Analytics",
  "/dashboard/brand/settings": "Settings",
  "/dashboard/creator": "Overview",
  "/dashboard/creator/profile": "My Profile",
  "/dashboard/creator/inbox": "Inbox",
  "/dashboard/creator/deals": "Active Deals",
  "/dashboard/creator/earnings": "Earnings",
  "/dashboard/creator/settings": "Settings",
};

export default function TopBar({
  onNewCampaign,
}: {
  onNewCampaign?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";
  const { toast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((state) => state.user);
  const unread = useUnreadCount();
  const logout = useLogout();
  const notifs = unread.data?.totalUnread || 0;
  const initials = (user?.fullName || "U").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const isBrand = pathname.startsWith("/dashboard/brand");
  const settingsHref = isBrand ? "/dashboard/brand/settings" : "/dashboard/creator/settings";
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl+K focuses search
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen]);

  function openMobileNav() {
    const fn = (window as unknown as Record<string, unknown>).__openMobileNav;
    if (typeof fn === "function") fn();
  }

  return (
    <header className="shrink-0 h-16 border-b border-(--border) bg-(--bg-secondary) flex items-center gap-4 px-4 md:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={openMobileNav}
        className="md:hidden text-(--text-secondary) hover:text-(--text-primary) p-2 rounded-lg hover:bg-(--bg-surface) transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Open navigation"
        data-interactive
      >
        <Menu size={18} />
      </button>

      {/* Page title — visible on desktop */}
      <h1 className="hidden md:block text-sm font-semibold text-(--text-primary) shrink-0">
        {title}
      </h1>

      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary) pointer-events-none"
          aria-hidden
        />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search… (⌘K)"
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-(--bg-surface) border border-(--border) text-sm text-(--text-primary) placeholder:text-(--text-tertiary) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:border-(--accent) transition-all duration-150"
          aria-label="Search"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* New Campaign — only on brand routes */}
        {onNewCampaign && (
          <button
            onClick={onNewCampaign}
            className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-lg bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-1"
            data-interactive
          >
            <Plus size={14} aria-hidden />
            New Campaign
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={() => toast(`${notifs} unread message${notifs === 1 ? "" : "s"}.`, "info")}
          className="relative h-9 w-9 rounded-lg hover:bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-150 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-(--accent)"
          aria-label={`${notifs} unread notifications`}
          data-interactive
        >
          <Bell size={16} />
          {notifs > 0 && (
            <span
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-(--accent)"
              aria-hidden
            />
          )}
        </button>

        {/* Avatar / profile dropdown */}
        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => setProfileMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-(--bg-surface) transition-colors"
            aria-label="Account menu"
            aria-expanded={profileMenuOpen}
            data-interactive
          >
            <div className="h-7 w-7 rounded-full bg-(--border-strong) text-(--text-primary) flex items-center justify-center text-xs font-semibold select-none">
              {initials}
            </div>
            <ChevronDown size={12} className="text-(--text-tertiary) hidden sm:block" />
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-(--border) bg-(--bg-secondary) shadow-xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-(--border)">
                  <p className="text-sm font-medium truncate">{user?.fullName || "User"}</p>
                  <p className="text-xs text-(--text-tertiary) truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href={settingsHref}
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface) transition-colors"
                  >
                    <Settings size={15} />
                    Settings
                  </Link>
                  <button
                    onClick={() => { logout.mutate(); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface) transition-colors"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
