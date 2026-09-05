"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Handshake, MessageSquare, ShieldCheck, XCircle } from "lucide-react";
import type { ActivityItem } from "@/lib/hooks/useActivity";

export const ICONS: Record<ActivityItem["type"], React.ReactNode> = {
  proposal_created: <Handshake size={15} className="text-(--text-secondary)" />,
  proposal_accepted: <CheckCircle2 size={15} className="text-(--success)" />,
  proposal_declined: <XCircle size={15} className="text-(--warning)" />,
  message: <MessageSquare size={15} className="text-(--text-secondary)" />,
  verification: <ShieldCheck size={15} className="text-(--accent)" />,
};

export function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const s = Math.max(0, Math.floor(diffMs / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Wraps the `highlight` substring (a name/entity) in lime. */
export function HighlightedText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  const idx = text.indexOf(highlight);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-(--accent)">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-(--border-strong) bg-(--bg-secondary) p-8 text-center">
        <p className="text-sm text-(--text-tertiary)">No activity yet. It'll show up here as things happen.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-(--border) bg-(--bg-secondary) divide-y divide-(--border) overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => {
          const content = (
            <div className="flex items-start gap-3 px-5 py-4">
              <span className="mt-0.5 shrink-0">{ICONS[item.type]}</span>
              <p className="flex-1 text-sm text-(--text-primary) leading-snug">
                <HighlightedText text={item.text} highlight={item.highlight} />
              </p>
              <span className="font-mono-utility text-mono-sm text-(--text-tertiary) shrink-0 mt-0.5">
                {timeAgo(item.timestamp)}
              </span>
            </div>
          );

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -16, backgroundColor: "rgba(212,255,79,0.12)" }}
              animate={{ opacity: 1, y: 0, backgroundColor: "rgba(212,255,79,0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            >
              {item.href ? (
                <Link href={item.href} className="block hover:bg-(--bg-surface) transition-colors duration-150">
                  {content}
                </Link>
              ) : (
                content
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
