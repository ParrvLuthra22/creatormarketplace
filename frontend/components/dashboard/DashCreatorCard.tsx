"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Creator, formatNumber } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface DashCreatorCardProps {
  creator: Creator;
  size?: "sm" | "md";
  onView?: () => void;
  onInvite?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export default function DashCreatorCard({
  creator,
  size = "md",
  onView,
  onInvite,
  selected = false,
  compact = false,
}: DashCreatorCardProps) {
  const cardW = size === "sm" ? 220 : undefined;
  const cardH = size === "sm" ? 300 : undefined;

  return (
    <motion.div
      className={cn(
        "relative flex-none rounded-xl overflow-hidden border transition-colors duration-200",
        selected ? "border-(--accent)" : "border-(--border)",
        size === "md" && "w-full"
      )}
      style={{
        background: creator.gradient,
        width: cardW,
        height: cardH,
        minHeight: size === "md" ? 320 : undefined,
      }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.25 }}
    >
      {/* Verified badge */}
      {creator.verified && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-(--accent) p-1" aria-label="Verified">
          <Check size={10} className="text-(--bg-primary)" />
        </div>
      )}

      {/* Selected overlay */}
      {selected && (
        <div className="absolute inset-0 bg-(--accent) opacity-10 pointer-events-none" aria-hidden />
      )}

      {/* Gradient to bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 50%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {creator.niche.slice(0, 2).map((n) => (
            <span
              key={n}
              className="font-mono-utility text-mono-sm text-(--accent) border border-(--accent) rounded-full px-2 py-0.5"
              style={{ fontSize: "0.6rem" }}
            >
              {n.toUpperCase()}
            </span>
          ))}
        </div>
        <h3 className="font-display font-semibold text-(--text-primary) leading-tight" style={{ fontSize: size === "sm" ? "1rem" : "1.125rem" }}>
          {creator.name}
        </h3>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mt-0.5">
          {creator.handle}
        </p>

        {/* Stats */}
        <div className="flex gap-4 mt-3">
          <div>
            <p className="font-mono-utility text-(--text-tertiary)" style={{ fontSize: "0.6rem" }}>FOLLOWERS</p>
            <p className="text-sm font-semibold text-(--text-primary)">{formatNumber(creator.followers)}</p>
          </div>
          <div>
            <p className="font-mono-utility text-(--text-tertiary)" style={{ fontSize: "0.6rem" }}>ENG.</p>
            <p className="text-sm font-semibold text-(--accent)">{creator.engagement}%</p>
          </div>
          {size === "md" && (
            <div>
              <p className="font-mono-utility text-(--text-tertiary)" style={{ fontSize: "0.6rem" }}>AVG VIEWS</p>
              <p className="text-sm font-semibold text-(--text-primary)">{formatNumber(creator.avgViews)}</p>
            </div>
          )}
        </div>

        {/* Buttons — md only */}
        {!compact && size === "md" && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={onView}
              className="flex-1 h-9 rounded-lg border border-(--border-strong) text-sm font-medium text-(--text-primary) hover:border-(--text-primary) transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-(--accent)"
              data-interactive
            >
              View Profile
            </button>
            <button
              onClick={onInvite}
              className="flex-1 h-9 rounded-lg bg-(--accent) text-(--bg-primary) text-sm font-medium hover:bg-(--accent-hover) transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-(--accent)"
              data-interactive
            >
              {selected ? "✓ Added" : "Invite"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
