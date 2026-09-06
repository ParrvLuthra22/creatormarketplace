"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  Megaphone,
  MessageSquare,
  User,
  Inbox,
  Briefcase,
  Users,
  ShieldCheck,
  FileBarChart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnseenMessageCount } from "./NotificationCenter";

type NavType = "brand" | "creator" | "admin";

const NAV: Record<NavType, { label: string; href: string; icon: typeof Home; badge?: boolean }[]> = {
  brand: [
    { label: "Overview", href: "/dashboard/brand", icon: Home },
    { label: "Discover", href: "/dashboard/brand/discover", icon: Search },
    { label: "Campaigns", href: "/dashboard/brand/campaigns", icon: Megaphone },
    { label: "Messages", href: "/dashboard/brand/messages", icon: MessageSquare, badge: true },
    { label: "Profile", href: "/dashboard/brand/profile", icon: User },
  ],
  creator: [
    { label: "Overview", href: "/dashboard/creator", icon: Home },
    { label: "Inbox", href: "/dashboard/creator/inbox", icon: Inbox },
    { label: "Deals", href: "/dashboard/creator/deals", icon: Briefcase },
    { label: "Messages", href: "/dashboard/creator/messages", icon: MessageSquare, badge: true },
    { label: "Profile", href: "/dashboard/creator/profile", icon: User },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: Home },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Verify", href: "/dashboard/admin/verification-queue", icon: ShieldCheck },
    { label: "Reports", href: "/dashboard/admin/reports", icon: FileBarChart },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

export default function MobileBottomNav({ type }: { type: NavType }) {
  const pathname = usePathname();
  const unseenMessages = useUnseenMessageCount();
  const items = NAV[type];
  const rootHref = `/dashboard/${type}`;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-(--border) bg-(--bg-primary)/80 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label={`${type} navigation`}
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || (href !== rootHref && pathname?.startsWith(href));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex flex-col items-center justify-center gap-1 py-2.5 min-h-[52px] min-w-[44px] text-(--text-tertiary) data-[active=true]:text-(--bg-primary)"
                data-active={active}
                aria-current={active ? "page" : undefined}
                data-interactive
              >
                {active && (
                  <motion.div
                    layoutId="tubelight-active-pill"
                    className="absolute inset-x-2 top-1 bottom-1 rounded-full bg-(--accent)"
                    style={{ boxShadow: "0 0 16px 2px rgba(212,255,79,0.55)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">
                  <Icon size={19} className={cn(active && "text-(--bg-primary)")} />
                  {badge && unseenMessages > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-(--warning) text-(--bg-primary) text-[10px] font-bold leading-4 text-center"
                      aria-label={`${unseenMessages} unread`}
                    >
                      {unseenMessages > 9 ? "9+" : unseenMessages}
                    </span>
                  )}
                </span>
                <span className={cn("relative font-mono-utility text-[9px] tracking-wide", active ? "text-(--bg-primary)" : "text-(--text-tertiary)")}>
                  {label.toUpperCase()}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
