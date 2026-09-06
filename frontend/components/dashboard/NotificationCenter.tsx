"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { useActivity } from "@/lib/hooks/useActivity";
import { ICONS, HighlightedText, timeAgo } from "./ActivityFeed";

const LAST_SEEN_KEY = "creatorlyff:notifications:last-seen";

function getLastSeen(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
  } catch {
    return 0;
  }
}

export function useUnseenNotificationCount() {
  const activity = useActivity();
  const [lastSeen, setLastSeen] = useState(0);

  useEffect(() => {
    setLastSeen(getLastSeen());
  }, []);

  const items = activity.data?.activity || [];
  return items.filter((item) => new Date(item.timestamp).getTime() > lastSeen).length;
}

/** Same "since last opened the notification bell" cutoff, scoped to message activity — used for the mobile bottom nav's Messages badge. */
export function useUnseenMessageCount() {
  const activity = useActivity();
  const [lastSeen, setLastSeen] = useState(0);

  useEffect(() => {
    setLastSeen(getLastSeen());
  }, []);

  const items = activity.data?.activity || [];
  return items.filter((item) => item.type === "message" && new Date(item.timestamp).getTime() > lastSeen).length;
}

export default function NotificationCenter({ onClose }: { onClose: () => void }) {
  const activity = useActivity();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [lastSeen, setLastSeen] = useState(0);

  useEffect(() => {
    setLastSeen(getLastSeen());
  }, []);

  const items = activity.data?.activity || [];
  const filtered = tab === "unread" ? items.filter((i) => new Date(i.timestamp).getTime() > lastSeen) : items;

  function markAllRead() {
    const now = Date.now();
    try {
      localStorage.setItem(LAST_SEEN_KEY, String(now));
    } catch {
      // best-effort — non-fatal if storage is unavailable
    }
    setLastSeen(now);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-[400px] max-w-[92vw] rounded-xl border border-(--border) bg-(--bg-secondary) shadow-xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
        <div className="flex gap-1">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative px-3 py-1.5 text-sm font-medium capitalize rounded-lg transition-colors"
              style={{
                color: tab === t ? "var(--text-primary)" : "var(--text-tertiary)",
                background: tab === t ? "var(--bg-surface)" : "transparent",
              }}
              data-interactive
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={markAllRead}
          className="font-mono-utility text-mono-sm text-(--accent) hover:opacity-80 transition-opacity"
          data-interactive
        >
          MARK ALL READ
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12 px-6">
            <PartyPopper size={24} className="text-(--text-tertiary) mb-3" aria-hidden />
            <p className="text-sm text-(--text-secondary)">You're all caught up.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-start gap-3 px-4 py-3 border-b border-(--border) last:border-b-0 hover:bg-(--bg-surface) transition-colors duration-150"
                    data-interactive
                  >
                    <span className="mt-0.5 shrink-0">{ICONS[item.type]}</span>
                    <p className="flex-1 text-sm text-(--text-primary) leading-snug">
                      <HighlightedText text={item.text} highlight={item.highlight} />
                    </p>
                    <span className="font-mono-utility text-mono-sm text-(--text-tertiary) shrink-0 mt-0.5">
                      {timeAgo(item.timestamp)}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-start gap-3 px-4 py-3 border-b border-(--border) last:border-b-0">
                    <span className="mt-0.5 shrink-0">{ICONS[item.type]}</span>
                    <p className="flex-1 text-sm text-(--text-primary) leading-snug">
                      <HighlightedText text={item.text} highlight={item.highlight} />
                    </p>
                    <span className="font-mono-utility text-mono-sm text-(--text-tertiary) shrink-0 mt-0.5">
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
