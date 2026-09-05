"use client";

/**
 * Real 21st.dev component: "Bento Grid" by kokonutd
 * https://21st.dev/@kokonutd/components/bento-grid (id 622)
 * Pulled via the 21st.dev MCP connector's get_component.
 *
 * Adapted from the original: the light/dark Tailwind gray pairs are replaced
 * with CreatorLyff's own design tokens (this app is always-dark, no toggle),
 * the hover treatment matches the app's existing `.card-hover` convention
 * (translateY lift + border-strong, defined in globals.css) instead of the
 * original's shadow pulse, and a `visual` slot was added to each item so a
 * card can carry a small custom animation below its description — the
 * original only supports icon + text + tags.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface BentoItem {
  title: string;
  description: string;
  icon: ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  rowSpan?: number;
  hasPersistentHover?: boolean;
  visual?: ReactNode;
}

interface BentoGridProps {
  items: BentoItem[];
}

function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-6 rounded-2xl overflow-hidden card-hover flex flex-col",
            "border border-(--border) bg-(--bg-secondary)",
            item.colSpan === 2 ? "lg:col-span-2" : "col-span-1",
            item.rowSpan === 2 ? "lg:row-span-2" : "",
            item.hasPersistentHover && "border-(--border-strong)"
          )}
        >
          {/* Subtle dot-grid texture — always on for the persistent card, hover-revealed otherwise */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300 pointer-events-none",
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,255,79,0.04)_1px,transparent_1px)] bg-[length:16px_16px]" />
          </div>

          <div className="relative flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-(--bg-surface) text-(--accent) group-hover:bg-(--accent)/10 transition-colors duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span className="font-mono-utility text-[0.6rem] px-2 py-1 rounded-lg bg-(--bg-surface) text-(--text-tertiary) group-hover:text-(--accent) transition-colors duration-300">
                  {item.status}
                </span>
              )}
            </div>

            <h3 className="font-display font-semibold text-(--text-primary) text-[15px] tracking-tight">
              {item.title}
              {item.meta && (
                <span className="ml-2 font-mono-utility text-[0.6rem] text-(--text-tertiary) font-normal">
                  {item.meta}
                </span>
              )}
            </h3>
            <p className="text-caption text-(--text-tertiary) leading-snug mt-1.5">
              {item.description}
            </p>

            {item.visual && <div className="mt-auto pt-4">{item.visual}</div>}

            {item.tags && (
              <div className="flex items-center flex-wrap gap-1.5 mt-4">
                {item.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="font-mono-utility text-[0.6rem] px-2 py-1 rounded-md bg-(--bg-surface) text-(--text-tertiary)"
                  >
                    #{tag}
                  </span>
                ))}
                <span className="ml-auto font-mono-utility text-[0.6rem] text-(--accent) opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.cta || "Explore →"}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };
