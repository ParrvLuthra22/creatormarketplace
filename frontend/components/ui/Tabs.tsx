"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  size = "md",
}: TabsProps) {
  return (
    <div
      className={cn(
        "flex relative border-b border-(--border)",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center px-5 transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-1 rounded-sm",
              size === "sm" ? "py-2.5 text-xs" : "py-3.5 text-sm",
              "font-medium",
              isActive
                ? "text-(--text-primary)"
                : "text-(--text-tertiary) hover:text-(--text-secondary)"
            )}
            data-interactive
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--accent) rounded-t-full"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
