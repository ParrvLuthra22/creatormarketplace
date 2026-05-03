"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

// ─── Grain overlay ────────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.05 }}
      aria-hidden
    >
      <filter id="hero-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hero-grain)" />
    </svg>
  );
}

// ─── Live timestamp ───────────────────────────────────────────────────────────
function LiveTimestamp() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      const t = new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(`INDIA / ${t}`);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="font-mono-utility text-mono-sm text-(--text-tertiary) tabular-nums"
      aria-label="Current time in India"
    >
      {time}
    </span>
  );
}

// ─── Animated word ────────────────────────────────────────────────────────────
function AnimatedWord({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ delay, duration: 0.8, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// ─── Scroll indicator ─────────────────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.8 }}
    >
      <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
        SCROLL
      </span>
      <div className="relative h-12 w-px bg-(--border)">
        <motion.div
          className="absolute top-0 left-0 w-full bg-(--accent)"
          animate={{ scaleY: [0, 1, 0], y: ["0%", "0%", "100%"] }}
          style={{ transformOrigin: "top" }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center overflow-hidden bg-(--bg-primary)"
      aria-label="Hero"
    >
      <GrainOverlay />

      {/* Top meta labels */}
      <div className="absolute top-24 left-0 right-0 z-10">
        <Container className="flex items-center justify-between">
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
            01 — INTRODUCING CREATORLYFF
          </span>
          <LiveTimestamp />
        </Container>
      </div>

      {/* Parallax content */}
      <Container className="relative z-10 pt-16">
        <motion.div style={{ y, scale, opacity }}>
          {/* ── Headline ── */}
          <h1
            className="text-hero font-display leading-[0.9] tracking-[-0.05em]"
            aria-label="Where brands meet their next favorite creator."
          >
            {/* Line 1 */}
            <span className="flex flex-wrap gap-x-[0.22em]">
              <AnimatedWord delay={0.3}>Where</AnimatedWord>
              <AnimatedWord delay={0.38}>brands</AnimatedWord>
            </span>

            {/* Line 2 */}
            <span className="flex flex-wrap gap-x-[0.22em]">
              <AnimatedWord delay={0.46}>meet</AnimatedWord>
              <AnimatedWord delay={0.52}>their</AnimatedWord>
              <AnimatedWord delay={0.58} className="font-serif text-(--accent)">
                next
              </AnimatedWord>
            </span>

            {/* Line 3 */}
            <span className="flex flex-wrap gap-x-[0.22em]">
              <AnimatedWord delay={0.66}>favorite</AnimatedWord>
              <AnimatedWord delay={0.73}>creator.</AnimatedWord>
            </span>
          </h1>

          {/* ── Subtext ── */}
          <motion.p
            className="text-body-lg text-(--text-secondary) max-w-md mt-8 leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
          >
            The intelligent marketplace connecting brands with the right
            creators — by niche, audience, and authenticity. No more cold DMs.
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.9, ease: EASE }}
          >
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/login/brand'}>
              Get Started Free
            </Button>
            <Button variant="ghost" size="lg" className="flex items-center gap-2">
              Watch Demo
              <ArrowRight size={15} aria-hidden />
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      <ScrollIndicator />

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "linear-gradient(to top, var(--bg-primary), transparent)",
        }}
        aria-hidden
      />
    </section>
  );
}
