"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "CreatorLyff".split("");
const DURATION_MS = 2600; // counting + letter phase
const SPLIT_DURATION = 0.65; // seconds the halves take to exit

function Counter({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const start = performance.now();
    const duration = DURATION_MS;

    function tick(now: number) {
      const elapsed = Math.min(now - start, duration);
      const eased = 1 - Math.pow(1 - elapsed / duration, 3);
      const val = Math.floor(eased * 100);
      setCount(val);

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(100);
        if (!doneRef.current) {
          doneRef.current = true;
          onDone();
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onDone]);

  return (
    <span className="tabular-nums" aria-live="polite" aria-atomic>
      {String(count).padStart(2, "0")}
    </span>
  );
}

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [splitting, setSplitting] = useState(false);

  function handleCountDone() {
    setSplitting(true);
    setTimeout(onComplete, SPLIT_DURATION * 1000 + 50);
  }

  const splitVariants = {
    visible: { y: "0%" },
    exit: (dir: "up" | "down") => ({
      y: dir === "up" ? "-100%" : "100%",
      transition: {
        duration: SPLIT_DURATION,
        ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div
      className="fixed inset-0 z-[9995] overflow-hidden"
      aria-label="Loading CreatorLyff"
      role="status"
    >
      {/* ── Top half panel ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2"
        style={{ background: "var(--bg-primary)" }}
        variants={splitVariants}
        initial="visible"
        animate={splitting ? "exit" : "visible"}
        custom="up"
      />

      {/* ── Bottom half panel ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ background: "var(--bg-primary)" }}
        variants={splitVariants}
        initial="visible"
        animate={splitting ? "exit" : "visible"}
        custom="down"
      />

      {/* ── Content (fixed centre, above both panels) ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-10"
        animate={{ opacity: splitting ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        aria-hidden={splitting}
      >
        {/* Wordmark letter-by-letter */}
        <div className="flex" aria-label="CreatorLyff" role="img">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="font-display font-semibold"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                display: "inline-block",
              }}
              initial={{ opacity: 0, y: "0.5em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.055,
                duration: 0.5,
                ease: [0.65, 0, 0.35, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Counter */}
        <motion.div
          className="font-mono-utility text-mono-sm text-(--text-tertiary) flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Counter onDone={handleCountDone} />
          <span style={{ color: "var(--border-strong)" }}>/ 100</span>
        </motion.div>
      </motion.div>

      {/* ── Progress bar (bottom edge, always above panels) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] z-10"
        style={{ background: "var(--border)" }}
        aria-hidden
      >
        <motion.div
          className="h-full"
          style={{ background: "var(--accent)", transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: DURATION_MS / 1000,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}
