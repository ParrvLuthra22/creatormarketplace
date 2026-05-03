"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  gap?: string;
  className?: string;
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  speed = 40,
  direction = "left",
  gap = "2rem",
  className,
  pauseOnHover = true,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const xStart = direction === "left" ? 0 : "-50%";
  const xEnd = direction === "left" ? "-50%" : 0;

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden flex", className)}
      style={{ gap }}
    >
      <motion.div
        className={cn("flex shrink-0 items-center", pauseOnHover && "hover:[animation-play-state:paused]")}
        style={{ gap }}
        animate={{ x: [xStart, xEnd] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {children}
        {children}
      </motion.div>
      {/* Duplicate for seamless loop */}
      <motion.div
        className="flex shrink-0 items-center"
        style={{ gap }}
        animate={{ x: [xStart, xEnd] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        aria-hidden
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
