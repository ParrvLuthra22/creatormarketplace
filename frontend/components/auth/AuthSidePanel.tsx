"use client";

import { motion } from "framer-motion";

interface Quote {
  text: string;
  author: string;
  role: string;
}

interface AuthSidePanelProps {
  label: string;
  quotes: Quote[];
  stats: string;
}

export default function AuthSidePanel({
  label,
  quotes,
  stats,
}: AuthSidePanelProps) {
  // Duplicate for seamless infinite scroll
  const doubled = [...quotes, ...quotes];

  return (
    <aside
      className="hidden md:flex flex-col justify-between h-full p-12 overflow-hidden"
      style={{ borderRight: "1px solid var(--border)" }}
      aria-label={label}
    >
      {/* Label */}
      <span className="font-mono-utility text-mono-sm text-(--text-tertiary) shrink-0">
        {label}
      </span>

      {/* Scrolling quotes */}
      <div className="flex-1 overflow-hidden relative my-8">
        {/* Fade masks */}
        <div
          className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, var(--bg-surface), transparent)",
          }}
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, var(--bg-surface), transparent)",
          }}
          aria-hidden
        />

        {/* Infinite vertical scroll */}
        <motion.div
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            duration: quotes.length * 4,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {doubled.map((q, i) => (
            <div
              key={i}
              className="mb-8 last:mb-0"
            >
              <p className="text-body text-(--text-secondary) leading-relaxed mb-3 italic">
                &ldquo;{q.text}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-(--text-primary)">
                  {q.author}
                </p>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mt-0.5">
                  {q.role}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Stats */}
      <div className="shrink-0 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
          {stats}
        </p>
      </div>
    </aside>
  );
}
