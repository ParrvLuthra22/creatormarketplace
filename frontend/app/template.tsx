"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

/**
 * template.tsx — re-mounts on every route change (unlike layout.tsx).
 * A lime panel sweeps up from the bottom, briefly shows the wordmark,
 * then exits through the top — revealing the new page beneath.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return <>{children}</>;

  return (
    <>
      {/* Page content fades in after the overlay exits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.55, ease: EASE }}
      >
        {children}
      </motion.div>

      {/* Lime sweep overlay — enters from bottom, exits through top */}
      <motion.div
        className="fixed inset-0 pointer-events-none flex items-center justify-center"
        style={{
          background: "var(--accent)",
          zIndex: 9990,
        }}
        initial={{ y: "100%" }}
        animate={{ y: ["100%", "0%", "0%", "-100%"] }}
        transition={{
          duration: 0.9,
          times: [0, 0.38, 0.62, 1],
          ease: EASE,
        }}
        aria-hidden
      >
        {/* Wordmark visible while panel holds centre */}
        <motion.span
          className="font-display font-semibold tracking-[-0.04em]"
          style={{
            color: "var(--bg-primary)",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.9, times: [0, 0.3, 0.7, 1] }}
        >
          CreatorLyff
        </motion.span>
      </motion.div>
    </>
  );
}
