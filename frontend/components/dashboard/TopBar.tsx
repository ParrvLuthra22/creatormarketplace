"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search, Menu, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useLogout } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "./MagneticButton";
import CommandPalette from "./CommandPalette";
import NotificationCenter, { useUnseenNotificationCount } from "./NotificationCenter";

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

function useISTClock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    function tick() {
      setNow(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function TopBar({
  onNewCampaign,
}: {
  onNewCampaign?: () => void;
}) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const initials = (user?.fullName || "U").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const isBrand = pathname.startsWith("/dashboard/brand");
  const settingsHref = isBrand ? "/dashboard/brand/settings" : "/dashboard/creator/settings";
  const istTime = useISTClock();
  const unseenCount = useUnseenNotificationCount();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl+K opens the command palette
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Backdrop-blur once the dashboard's scrollable <main> has scrolled past the top
  useEffect(() => {
    const el = document.getElementById("dashboard-scroll");
    if (!el) return;
    function onScroll() {
      setScrolled((el as HTMLElement).scrollTop > 4);
    }
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (profileMenuOpen || notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen, notifOpen]);

  function openMobileNav() {
    const fn = (window as unknown as Record<string, unknown>).__openMobileNav;
    if (typeof fn === "function") fn();
  }

  return (
    <>
      <header
        className={cn(
          "shrink-0 h-16 border-b border-(--border) flex items-center gap-4 px-4 md:px-6 sticky top-0 z-20 transition-colors duration-200",
          scrolled ? "bg-(--bg-secondary)/85 backdrop-blur-md" : "bg-(--bg-secondary)"
        )}
      >
        <button
          onClick={openMobileNav}
          className="md:hidden text-(--text-secondary) hover:text-(--text-primary) p-2 rounded-lg hover:bg-(--bg-surface) transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open navigation"
          data-interactive
        >
          <Menu size={18} />
        </button>

        <h1 className="hidden md:block text-sm font-semibold text-(--text-primary) shrink-0">
          {title}
        </h1>

        <button
          onClick={() => setPaletteOpen(true)}
          className="flex-1 max-w-sm relative h-9 rounded-lg bg-(--bg-surface) border border-(--border) text-left flex items-center pl-9 pr-4 text-sm text-(--text-tertiary) hover:border-(--border-strong) transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-(--accent)"
          data-interactive
          data-cursor="Search"
        >
          <Search size={14} className="absolute left-3 text-(--text-tertiary) pointer-events-none" aria-hidden />
          Search… (⌘K)
        </button>

        <div className="flex items-center gap-3 ml-auto">
          {/* Live IST clock */}
          <span className="hidden lg:block font-mono-utility text-mono-sm text-(--text-tertiary) shrink-0">
            {istTime} IST
          </span>

          {onNewCampaign && (
            <MagneticButton
              variant="primary"
              onClick={onNewCampaign}
              className="hidden sm:flex"
              data-cursor="New campaign"
            >
              <Plus size={14} aria-hidden />
              New Campaign
            </MagneticButton>
          )}

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative h-9 w-9 rounded-lg hover:bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-150 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-(--accent)"
              aria-label={`${unseenCount} unread notifications`}
              data-interactive
              data-cursor="Notifications"
            >
              <Bell size={16} />
              {unseenCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-(--accent)" aria-hidden />
              )}
            </button>
            <AnimatePresence>
              {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
            </AnimatePresence>
          </div>

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

      <AnimatePresence>
        {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
