"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, ArrowRight, MessageCircle, Camera, Video, TrendingUp, PieChart, Send } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

// ─── Mini visuals (rendered in each card's `visual` slot) ──────────────────

function EngagementChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const bars = [40, 65, 45, 80, 60, 95, 70];

  return (
    <div ref={ref} className="flex items-end gap-2 h-24">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={inView ? { height: `${h}%` } : { height: 0 }}
          transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: EASE }}
          className="flex-1 rounded-t-sm"
          style={{ background: i === 5 ? "var(--accent)" : "var(--border-strong)" }}
        />
      ))}
    </div>
  );
}

function DonutChart() {
  return (
    <div
      className="h-20 w-20 rounded-full"
      style={{
        background:
          "conic-gradient(var(--accent) 0deg 130deg, var(--border-strong) 130deg 250deg, var(--border) 250deg 360deg)",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 10px))",
        WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 10px))",
      }}
    />
  );
}

function ShieldVisual() {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full border border-(--accent)/40"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <ShieldCheck size={36} className="text-(--accent)" />
    </div>
  );
}

function ProposalButtonVisual() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full bg-(--accent) text-(--bg-primary) px-4 py-2 text-xs font-semibold"
      animate={{ scale: [1, 0.94, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      Send Proposal
      <ArrowRight size={12} />
    </motion.div>
  );
}

function ChatBubblesVisual() {
  return (
    <div className="flex flex-col gap-2">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="self-start rounded-xl rounded-bl-sm bg-(--bg-surface) px-3 py-2 text-xs text-(--text-secondary) flex items-center gap-1.5"
      >
        <MessageCircle size={12} className="text-(--text-tertiary)" />
        Loved the draft!
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="self-end rounded-xl rounded-br-sm bg-(--accent) px-3 py-2 text-xs text-(--bg-primary) font-medium"
      >
        On it 🎬
      </motion.div>
    </div>
  );
}

function CrossPlatformVisual() {
  return (
    <div className="flex items-center justify-center gap-1">
      <motion.div
        initial={{ x: 12, opacity: 0 }}
        whileInView={{ x: 4, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="h-11 w-11 rounded-full bg-(--bg-surface) border border-(--border-strong) flex items-center justify-center z-10"
      >
        <Camera size={18} className="text-(--text-secondary)" />
      </motion.div>
      <motion.div
        initial={{ x: -12, opacity: 0 }}
        whileInView={{ x: -4, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="h-11 w-11 rounded-full bg-(--bg-surface) border border-(--border-strong) flex items-center justify-center"
      >
        <Video size={18} className="text-(--text-secondary)" />
      </motion.div>
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────

const ITEMS: BentoItem[] = [
  {
    title: "Verified engagement",
    description: "Every metric is checked against real platform data — no vanity followers.",
    icon: <TrendingUp size={16} />,
    status: "Live",
    tags: ["Analytics", "Trust"],
    colSpan: 2,
    rowSpan: 2,
    hasPersistentHover: true,
    visual: <EngagementChart />,
  },
  {
    title: "Real audience data",
    description: "Demographics and reach, not just follower counts.",
    icon: <PieChart size={16} />,
    visual: <DonutChart />,
  },
  {
    title: "Escrow-safe payments",
    description: "Funds held securely until deliverables are approved.",
    icon: <ShieldCheck size={16} />,
    status: "Secure",
    visual: <ShieldVisual />,
  },
  {
    title: "One-click proposals",
    description: "Send a structured brief in seconds, not emails.",
    icon: <Send size={16} />,
    visual: <ProposalButtonVisual />,
  },
  {
    title: "Real-time collab tools",
    description: "Chat, share assets, and align — all in one thread.",
    icon: <MessageCircle size={16} />,
    tags: ["Chat"],
    visual: <ChatBubblesVisual />,
  },
  {
    title: "Cross-platform stats",
    description: "Instagram and YouTube performance, combined.",
    icon: <Camera size={16} />,
    tags: ["Instagram", "YouTube"],
    visual: <CrossPlatformVisual />,
  },
];

export default function BentoFeatures() {
  return (
    <section className="py-32 md:py-40 bg-(--bg-primary)" aria-labelledby="bento-heading">
      <Container>
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            06 — WHY CREATORLYFF
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 id="bento-heading" className="text-h1 font-display mb-14 max-w-2xl">
            Built for{" "}
            <span className="font-serif text-(--text-secondary)">trust, not guesswork.</span>
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <BentoGrid items={ITEMS} />
        </RevealOnScroll>
      </Container>
    </section>
  );
}
