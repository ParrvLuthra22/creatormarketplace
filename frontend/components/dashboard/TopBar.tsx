"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search, Menu } from "lucide-react";
import { useToast } from "@/components/dashboard/Toast";
import { useAuthStore } from "@/lib/auth";
import { useUnreadCount } from "@/lib/socket";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard/brand": "Overview",
  "/dashboard/brand/discover": "Discover Creators",
  "/dashboard/brand/campaigns": "Campaigns",
  "/dashboard/brand/messages": "Messages",
  "/dashboard/brand/analytics": "Analytics",
  "/dashboard/brand/settings": "Settings",
};

export default function TopBar({
  onNewCampaign,
}: {
  onNewCampaign?: () => void;
}) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";
  const { toast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((state) => state.user);
  const unread = useUnreadCount();
  const notifs = unread.data?.totalUnread || 0;
  const initials = (user?.fullName || "U").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

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
        {/* New Campaign */}
        <button
          onClick={() => {
            onNewCampaign?.();
          }}
          className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-lg bg-(--accent) text-(--bg-primary) text-sm font-semibold hover:bg-(--accent-hover) transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-1"
          data-interactive
        >
          <Plus size={14} aria-hidden />
          New Campaign
        </button>

        {/* Notifications */}
        <button
          onClick={() => toast(`You have ${notifs} unread message${notifs === 1 ? "" : "s"}.`, "info")}
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

        {/* Avatar */}
        <div
          className="h-8 w-8 rounded-full bg-(--border-strong) text-(--text-primary) flex items-center justify-center text-xs font-semibold select-none cursor-pointer hover:ring-2 hover:ring-(--accent) transition-all duration-150"
          title={user?.fullName || "Account"}
          aria-label="Account menu"
          data-interactive
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
