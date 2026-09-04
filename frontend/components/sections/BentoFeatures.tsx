"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, ArrowRight, MessageCircle, Camera, Video, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

// ─── Mini visuals ────────────────────────────────────────────────────────

function EngagementChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const bars = [40, 65, 45, 80, 60, 95, 70];

  return (
    <div ref={ref} className="flex items-end gap-2 h-24 mt-6">
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
      className="h-20 w-20 rounded-full mt-4"
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
    <div className="relative mt-4 flex h-20 w-20 items-center justify-center">
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
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--accent) text-(--bg-primary) px-4 py-2 text-xs font-semibold"
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
    <div className="mt-6 flex flex-col gap-2">
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
    <div className="mt-6 flex items-center justify-center gap-1">
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

// ─── Card shell ──────────────────────────────────────────────────────────

interface BentoCard {
  title: string;
  body: string;
  Visual: React.ComponentType;
  large?: boolean;
}

const CARDS: BentoCard[] = [
  {
    title: "Verified engagement",
    body: "Every metric is checked against real platform data — no vanity followers.",
    Visual: EngagementChart,
    large: true,
  },
  { title: "Real audience data", body: "Demographics and reach, not just follower counts.", Visual: DonutChart },
  { title: "Escrow-safe payments", body: "Funds held securely until deliverables are approved.", Visual: ShieldVisual },
  { title: "One-click proposals", body: "Send a structured brief in seconds, not emails.", Visual: ProposalButtonVisual },
  { title: "Real-time collab tools", body: "Chat, share assets, and align — all in one thread.", Visual: ChatBubblesVisual },
  { title: "Cross-platform stats", body: "Instagram and YouTube performance, combined.", Visual: CrossPlatformVisual },
];

export default function BentoFeatures() {
  return (
    <section className="py-32 md:py-40 bg-(--bg-primary)" aria-labelledby="bento-heading">
      <Container>
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            07 — WHY CREATORLYFF
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 id="bento-heading" className="text-h1 font-display mb-14 max-w-2xl">
            Built for{" "}
            <span className="font-serif text-(--text-secondary)">trust, not guesswork.</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:grid-rows-2">
          {CARDS.map((card, i) => (
            <RevealOnScroll
              key={card.title}
              delay={0.05 * i}
              className={card.large ? "lg:col-span-2 lg:row-span-2" : ""}
            >
              <div className="h-full rounded-2xl border border-(--border) bg-(--bg-secondary) p-7 card-hover flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={14} className="text-(--accent)" />
                  <h3 className="text-body font-semibold text-(--text-primary)">{card.title}</h3>
                </div>
                <p className="text-caption text-(--text-tertiary) leading-relaxed">{card.body}</p>
                <div className="mt-auto">
                  <card.Visual />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
