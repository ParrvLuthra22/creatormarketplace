"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  gap?: string;
  className?: string;
  pauseOnHover?: boolean;
}

/**
 * Uses a real CSS @keyframes animation (defined in globals.css) rather than a
 * framer-motion-driven transform, specifically so `pauseOnHover` works —
 * animation-play-state only affects native CSS animations.
 */
export default function Marquee({
  children,
  speed = 40,
  direction = "left",
  gap = "2rem",
  className,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden flex", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center",
          direction === "left" ? "animate-[marquee-left_linear_infinite]" : "animate-[marquee-right_linear_infinite]",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{ gap, animationDuration: `${speed}s` }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0 items-center" style={{ gap, marginLeft: gap }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
