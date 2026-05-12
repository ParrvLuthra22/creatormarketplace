"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function DiscoverIllustration() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      className="w-full h-full"
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <motion.circle
            key={`${row}-${col}`}
            cx={20 + col * 40}
            cy={20 + row * 40}
            r={3}
            fill={
              (row === 2 && col === 2) ||
              (row === 2 && col === 3) ||
              (row === 3 && col === 2)
                ? "var(--accent)"
                : "var(--border-strong)"
            }
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2.5,
              delay: (row + col) * 0.12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))
      )}
      <motion.circle
        cx={120}
        cy={120}
        r={58}
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="8 4"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "120px 120px" }}
      />
    </svg>
  );
}

function ConnectIllustration() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      className="w-full h-full"
      aria-hidden
    >
      <motion.line x1="60" y1="120" x2="120" y2="80" stroke="var(--border-strong)" strokeWidth="1.5" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      <motion.line x1="120" y1="80" x2="180" y2="120" stroke="var(--border-strong)" strokeWidth="1.5" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, delay: 0.4, repeat: Infinity, ease: "easeInOut" }} />
      <motion.line x1="60" y1="120" x2="120" y2="160" stroke="var(--border-strong)" strokeWidth="1.5" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, delay: 0.8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.line x1="120" y1="160" x2="180" y2="120" stroke="var(--border-strong)" strokeWidth="1.5" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, delay: 1.2, repeat: Infinity, ease: "easeInOut" }} />
      {[
        { cx: 60, cy: 120, accent: false, delay: 0 },
        { cx: 120, cy: 80, accent: true, delay: 0.3 },
        { cx: 180, cy: 120, accent: false, delay: 0.6 },
        { cx: 120, cy: 160, accent: false, delay: 0.9 },
      ].map(({ cx, cy, accent, delay }, i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={accent ? 14 : 10}
          fill={accent ? "var(--accent)" : "var(--bg-surface)"}
          stroke={accent ? "var(--accent)" : "var(--border-strong)"}
          strokeWidth="1.5"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
    </svg>
  );
}

function CollaborateIllustration() {
  const bars = [
    { y: 60, w: 140, delay: 0 },
    { y: 100, w: 100, delay: 0.15 },
    { y: 140, w: 160, delay: 0.3 },
    { y: 180, w: 80, delay: 0.45 },
  ];
  return (
    <svg viewBox="0 0 240 240" fill="none" className="w-full h-full" aria-hidden>
      {bars.map(({ y, w, delay }, i) => (
        <g key={i}>
          <rect x="30" y={y} width="180" height="18" rx="4" fill="var(--bg-surface)" />
          <motion.rect
            x="30" y={y} height="18" rx="4"
            fill={i === 0 ? "var(--accent)" : "var(--border-strong)"}
            initial={{ width: 0 }}
            animate={{ width: w }}
            transition={{ delay: delay + 0.5, duration: 1.2, ease: EASE }}
          />
        </g>
      ))}
      {[70, 130].map((x, i) => (
        <motion.circle key={i} cx={x} cy={30} r={4} fill="var(--accent)" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, delay: i * 0.5, repeat: Infinity }} />
      ))}
      <line x1="70" y1="38" x2="70" y2="200" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="130" y1="38" x2="130" y2="200" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────

interface Step {
  number: string;
  title: string;
  body: string;
  Illustration: React.ComponentType;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Discover",
    body: "Search creators by niche, audience demographics, engagement quality, and content style. Filter through verified profiles in seconds.",
    Illustration: DiscoverIllustration,
  },
  {
    number: "02",
    title: "Connect",
    body: "Skip cold DMs. Initiate collaborations directly with structured proposals. Get 5× higher response rates.",
    Illustration: ConnectIllustration,
  },
  {
    number: "03",
    title: "Collaborate",
    body: "Manage briefs, deliverables, timelines, and payments in one place. Track campaign performance end-to-end.",
    Illustration: CollaborateIllustration,
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger when 30% of the card is visible — works reliably with Lenis root mode
  const isInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  const { number, title, body, Illustration } = step;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.7, delay: 0.05 * index, ease: EASE }}
      className="relative rounded-2xl border border-(--border) bg-(--bg-secondary) p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 md:gap-16 items-center overflow-hidden"
    >
      {/* Content */}
      <div>
        <span className="font-mono-utility text-mono-sm text-(--accent) mb-6 block">
          {number} /
        </span>
        <h3 className="text-h2 font-display mb-6">{title}</h3>
        <p className="text-body-lg text-(--text-secondary) max-w-lg leading-relaxed">
          {body}
        </p>
      </div>

      {/* Illustration — floats on loop */}
      <motion.div
        className="w-full aspect-square max-w-[200px] mx-auto md:max-w-none opacity-60"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 4 + index * 0.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Illustration />
      </motion.div>

      {/* Watermark step number */}
      <span
        className="pointer-events-none absolute -right-4 -bottom-8 text-[12rem] font-display font-bold leading-none text-(--border) select-none"
        aria-hidden
      >
        {number}
      </span>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
// NOTE: Previously used position:sticky + minHeight:120vh per card which caused
// Lenis root-mode scroll to freeze (virtual scroll desynced from sticky release).
// Now uses simple vertical stack + useInView reveal — scroll works on all devices.

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-(--bg-primary)" aria-labelledby="how-heading">
      {/* Section header */}
      <Container className="pt-32 pb-16">
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            02 — HOW IT WORKS
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 id="how-heading" className="text-h1 font-display">
            How it{" "}
            <span className="font-serif text-(--text-secondary)">works.</span>
          </h2>
        </RevealOnScroll>
      </Container>

      {/* Stacked cards — no sticky, scroll flows through cleanly */}
      <Container className="pb-32 flex flex-col gap-6 md:gap-10">
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} />
        ))}
      </Container>
    </section>
  );
}
