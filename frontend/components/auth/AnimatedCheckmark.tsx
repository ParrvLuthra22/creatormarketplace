"use client";

import { motion } from "framer-motion";

/** Lime circle + checkmark that draws itself in via stroke-dasharray. */
export default function AnimatedCheckmark({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <motion.circle
        cx="32"
        cy="32"
        r="29"
        stroke="var(--accent)"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d="M20 33.5L28 41.5L44 24.5"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
      />
    </svg>
  );
}
