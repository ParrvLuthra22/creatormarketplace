"use client";

import { useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShieldCheck, Send, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

interface Feature {
  title: string;
  body: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const FEATURES: Feature[] = [
  {
    title: "Discovery",
    body: "Filter by niche, audience size, engagement quality, and content style — surface creators that actually fit the brief.",
    icon: Search,
  },
  {
    title: "Verification",
    body: "Every creator's follower count and engagement is checked against their real platform data before they're marked verified.",
    icon: ShieldCheck,
  },
  {
    title: "Proposals",
    body: "Send a structured brief with budget, deliverables, and deadline — no back-and-forth DMs, no lost context.",
    icon: Send,
  },
  {
    title: "Real-time chat",
    body: "Negotiate, share assets, and align on creative direction in one thread, with delivery and read receipts.",
    icon: MessageCircle,
  },
];

// ─── Left-side animated visual per feature ──────────────────────────────────

function DiscoveryVisual() {
  const filters = ["Fashion", "50K–500K", "5%+ engagement", "Video"];
  return (
    <div className="w-full max-w-sm rounded-2xl border border-(--border) bg-(--bg-secondary) p-6">
      <div className="flex items-center gap-2 mb-5 rounded-lg border border-(--border) bg-(--bg-surface) px-4 py-3">
        <Search size={14} className="text-(--text-tertiary)" />
        <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
          SEARCH CREATORS
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f, i) => (
          <motion.span
            key={f}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: EASE }}
            className="font-mono-utility text-mono-sm rounded-full border border-(--accent)/40 text-(--accent) px-3 py-1.5"
          >
            {f}
          </motion.span>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.4, ease: EASE }}
            className="aspect-square rounded-lg bg-(--bg-surface) border border-(--border)"
          />
        ))}
      </div>
    </div>
  );
}

function VerificationVisual() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-(--border) bg-(--bg-secondary) p-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-(--bg-surface) border border-(--border-strong)" />
        <div>
          <p className="font-display font-semibold text-(--text-primary)">Ananya Iyer</p>
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">PHOTOGRAPHY</p>
        </div>
      </div>
      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: EASE, type: "spring", bounce: 0.5 }}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--accent) text-(--bg-primary) px-4 py-2 font-semibold text-sm"
      >
        <ShieldCheck size={16} />
        Verified
      </motion.div>
      <p className="mt-4 text-sm text-(--text-secondary) leading-relaxed">
        Follower count and engagement cross-checked against live platform data.
      </p>
    </div>
  );
}

function ProposalsVisual() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-(--border) bg-(--bg-secondary) p-8 relative overflow-hidden h-56 flex items-center justify-between">
      <div className="h-12 w-12 rounded-full bg-(--bg-surface) border border-(--border-strong) flex items-center justify-center font-mono-utility text-mono-sm text-(--text-tertiary)">
        B
      </div>
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-(--accent)/40 bg-(--bg-surface) px-5 py-4 w-40"
      >
        <p className="font-mono-utility text-[0.6rem] text-(--accent) mb-1">PROPOSAL</p>
        <p className="text-xs font-semibold text-(--text-primary)">Summer Campaign</p>
        <p className="text-[0.65rem] text-(--text-tertiary) mt-1">₹45,000 · 2 posts</p>
      </motion.div>
      <div className="h-12 w-12 rounded-full bg-(--bg-surface) border border-(--border-strong) flex items-center justify-center font-mono-utility text-mono-sm text-(--text-tertiary)">
        C
      </div>
    </div>
  );
}

function ChatVisual() {
  const bubbles = [
    { text: "Love the concept — can we ship by the 15th?", mine: false },
    { text: "Yes, easily. Sending the first draft tomorrow.", mine: true },
    { text: "Perfect 🙌", mine: false },
  ];
  return (
    <div className="w-full max-w-sm rounded-2xl border border-(--border) bg-(--bg-secondary) p-6 flex flex-col gap-3">
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.25, duration: 0.5, ease: EASE }}
          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
            b.mine
              ? "self-end bg-(--accent) text-(--bg-primary) rounded-br-sm"
              : "self-start bg-(--bg-surface) text-(--text-primary) rounded-bl-sm"
          }`}
        >
          {b.text}
        </motion.div>
      ))}
    </div>
  );
}

const VISUALS = [DiscoveryVisual, VerificationVisual, ProposalsVisual, ChatVisual];

// ─── Section ──────────────────────────────────────────────────────────────

export default function FeatureScrollThrough() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();

  // Keep GSAP's ScrollTrigger in sync with Lenis's virtual scroll position —
  // without this, pin+scrub can visibly desync from the actual scroll (see the
  // note in HowItWorks.tsx about an earlier CSS-sticky attempt freezing for
  // the same class of reason).
  useGSAP(
    () => {
      if (!lenis || reducedMotion) return;

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      const triggers = featureRefs.current.map((el, i) => {
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });

      if (pinRef.current && sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinRef.current,
          pinSpacing: false,
        });
      }

      ScrollTrigger.refresh();

      return () => {
        lenis.off("scroll", onScroll);
        triggers.forEach((t) => t?.kill());
      };
    },
    { scope: sectionRef, dependencies: [lenis, reducedMotion] }
  );

  const ActiveVisual = VISUALS[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-(--bg-primary)"
      aria-label="How it works"
    >
      <Container className="pt-32 pb-16">
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            05 — HOW IT WORKS
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 className="text-h1 font-display">
            From discovery to{" "}
            <span className="font-serif text-(--text-secondary)">deal, in one place.</span>
          </h2>
        </RevealOnScroll>
      </Container>

      <Container className="grid md:grid-cols-2 gap-12 pb-32">
        {/* Left: pinned visual (GSAP pin when motion allowed, static otherwise) */}
        <div
          ref={pinRef}
          className={reducedMotion ? "" : "md:h-screen md:flex md:items-center md:justify-center"}
        >
          <div className="flex md:h-auto items-center justify-center py-12 md:py-0">
            {reducedMotion ? (
              (() => {
                const V = VISUALS[activeIndex];
                return <V />;
              })()
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <ActiveVisual />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right: scrolling feature list */}
        <div>
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => {
                  featureRefs.current[i] = el;
                }}
                className={reducedMotion ? "py-10" : "min-h-[70vh] flex flex-col justify-center"}
              >
                <span className="font-mono-utility text-mono-sm text-(--accent) mb-4 block">
                  {String(i + 1).padStart(2, "0")}/{String(FEATURES.length).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <Icon size={22} className="text-(--accent)" />
                  <h3 className="text-h3 font-display">{feature.title}</h3>
                </div>
                <p className="text-body-lg text-(--text-secondary) max-w-md leading-relaxed">
                  {feature.body}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
