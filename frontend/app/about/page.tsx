"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

// ─── 1. Manifesto (scroll-driven cross-fade) ──────────────────────────────────

function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.35, 0.5], [1, 0, 0]);
  const scale1 = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.55, 1], [0, 1, 1]);
  const scale2 = useTransform(scrollYProgress, [0.3, 0.6], [1.08, 1]);

  return (
    <section
      ref={ref}
      className="relative bg-(--bg-primary)"
      style={{ height: "220vh" }}
      aria-label="Manifesto"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Grain overlay */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.04]"
          aria-hidden
        >
          <filter id="about-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#about-grain)" />
        </svg>

        {/* Text 1 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
          style={{ opacity: opacity1, scale: scale1 }}
        >
          <h1 className="text-hero font-display leading-[0.9] tracking-[-0.05em]">
            The creator economy<br />
            <span className="font-serif text-(--text-secondary)">is broken.</span>
          </h1>
        </motion.div>

        {/* Text 2 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
          style={{ opacity: opacity2, scale: scale2 }}
        >
          <h1 className="text-hero font-display leading-[0.9] tracking-[-0.05em]">
            We&apos;re{" "}
            <span className="font-serif text-(--accent)">fixing it.</span>
          </h1>
        </motion.div>

        {/* Scroll hint at bottom */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
        >
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">SCROLL</span>
          <motion.div
            className="h-10 w-px bg-(--border)"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── 2. Problem cards (CSS sticky stack) ─────────────────────────────────────

const PROBLEMS = [
  {
    number: "01",
    title: "Cold DMs don't work.",
    body: "Brands spend hours cold-pitching creators on Instagram — most messages go unread. There's no professional channel for brand-creator outreach.",
    accent: "Cold DMs",
  },
  {
    number: "02",
    title: "Fake metrics are everywhere.",
    body: "Follower counts are gamed. Engagement pods inflate rates. Brands spend thousands on campaigns that reach no one real — and have no way to verify.",
    accent: "Fake metrics",
  },
  {
    number: "03",
    title: "Managing collabs is chaos.",
    body: "Briefs in email, contracts in Drive, payments via PayPal, feedback in DMs. Every collaboration lives in 6 different tools — nobody can keep track.",
    accent: "Managing collabs",
  },
  {
    number: "04",
    title: "Pricing is a total guessing game.",
    body: "What does a YouTube integration actually cost? What should a micro-influencer charge? Nobody knows, and both brands and creators lose money because of it.",
    accent: "Pricing",
  },
];

function ProblemsSection() {
  return (
    <section className="bg-(--bg-primary)" aria-labelledby="problems-heading">
      <Container className="pt-24 pb-12">
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            THE PROBLEMS
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 id="problems-heading" className="text-h1 font-display max-w-2xl">
            Four things{" "}
            <span className="font-serif text-(--text-secondary)">nobody fixed.</span>
          </h2>
        </RevealOnScroll>
      </Container>

      {/* Sticky stacking cards */}
      {PROBLEMS.map((p, i) => (
        <div key={p.number} className="md:min-h-[130vh]">
          <div
            className="md:sticky md:top-0 bg-(--bg-primary) py-8 md:min-h-screen flex items-center"
            style={{ zIndex: i + 1 }}
          >
            <Container className="w-full">
              <RevealOnScroll y={32}>
                <div className="rounded-3xl border border-(--border) bg-(--bg-secondary) p-10 md:p-16 max-w-3xl relative overflow-hidden">
                  <span className="font-mono-utility text-mono-sm text-(--accent) mb-6 block">
                    {p.number}
                  </span>
                  <h3 className="text-h2 font-display mb-6">{p.title}</h3>
                  <p className="text-body-lg text-(--text-secondary) leading-relaxed max-w-xl">
                    {p.body}
                  </p>
                  {/* Watermark number */}
                  <span
                    className="pointer-events-none absolute -right-4 -bottom-10 text-[14rem] font-display font-bold leading-none text-(--border) select-none"
                    aria-hidden
                  >
                    {p.number}
                  </span>
                </div>
              </RevealOnScroll>
            </Container>
          </div>
        </div>
      ))}

      <div className="h-24 bg-(--bg-primary)" />
    </section>
  );
}

// ─── 3. Approach (3-step explainer) ──────────────────────────────────────────

const APPROACH = [
  {
    step: "01",
    title: "Verified profiles, real data.",
    body: "Every creator on CreatorLyff goes through audience verification. Real follower demographics, authentic engagement rates, connected platform stats — all pulled directly from platform APIs. No more guessing.",
    icon: "",
  },
  {
    step: "02",
    title: "A professional collaboration layer.",
    body: "Brands send structured proposals. Creators respond with counter-offers. Contracts, briefs, and deliverables — all in one thread. No cold DMs. No scattered email chains. A dedicated workspace for every deal.",
    icon: "",
  },
  {
    step: "03",
    title: "End-to-end campaign management.",
    body: "From the first message to the final payment — CreatorLyff handles everything. Briefs, revisions, content approvals, automated payments, and performance analytics. One platform, zero chaos.",
    icon: "",
  },
];

function ApproachSection() {
  return (
    <section className="py-24 md:py-40 bg-(--bg-secondary)" aria-labelledby="approach-heading">
      <Container>
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            OUR APPROACH
          </span>
          <h2 id="approach-heading" className="text-h1 font-display max-w-2xl mb-16">
            How we{" "}
            <span className="font-serif text-(--text-secondary)">built it differently.</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {APPROACH.map((a, i) => (
            <RevealOnScroll key={a.step} delay={i * 0.12}>
              <div className="flex flex-col gap-5">
                <div className="text-4xl">{a.icon}</div>
                <div>
                  <span className="font-mono-utility text-mono-sm text-(--accent) block mb-2">
                    {a.step}
                  </span>
                  <h3 className="text-h3 font-display mb-3">{a.title}</h3>
                  <p className="text-body text-(--text-secondary) leading-relaxed">
                    {a.body}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── 4. Vision (editorial) ────────────────────────────────────────────────────

function VisionSection() {
  return (
    <section className="py-32 md:py-48 bg-(--bg-primary)" aria-labelledby="vision-heading">
      <Container className="max-w-4xl">
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-8 block">
            THE VISION
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <blockquote className="text-h1 font-display leading-[1.05]" id="vision-heading">
            We&apos;re building{" "}
            <span className="font-serif text-(--accent)">the LinkedIn</span>{" "}
            <span className="text-(--text-tertiary)">+</span>{" "}
            <span className="font-serif text-(--accent)">Upwork</span>{" "}
            for the creator economy.
          </blockquote>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p className="text-body-lg text-(--text-secondary) max-w-2xl mt-10 leading-relaxed">
            Professional profiles. Verified metrics. Structured deals. Fair, transparent pricing. A
            platform where creators are treated as the businesses they are — and brands can find
            exactly the right partner for every campaign.
          </p>
          <p className="text-body-lg text-(--text-secondary) max-w-2xl mt-4 leading-relaxed">
            The creator economy is a $250B market with no real infrastructure. We&apos;re building
            that infrastructure.
          </p>
        </RevealOnScroll>
      </Container>
    </section>
  );
}

// ─── 5. Team ──────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: "Parrv Luthra",
    role: "Founder & CTO",
    gradient: "linear-gradient(135deg,#1a1a3e,#0d2137)",
    // location: "Delhi → San Francisco",
    location: "Delhi",
  },
  {
    name: "Aadit Vachher",
    role: "Founder & CEO",
    gradient: "linear-gradient(135deg,#2a2a3a,#111)",
    location: "Delhi",
  },
];

function TeamSection() {
  return (
    <section className="py-24 bg-(--bg-secondary)" aria-labelledby="team-heading">
      <Container>
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            THE TEAM
          </span>
          <h2 id="team-heading" className="text-h2 font-display mb-12">
            Built by{" "}
            <span className="font-serif text-(--text-secondary)">people who care.</span>
          </h2>
        </RevealOnScroll>
        <div className="flex flex-wrap gap-5">
          {TEAM.map((member, i) => (
            <RevealOnScroll key={member.name} delay={i * 0.1}>
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-(--border) bg-(--bg-primary)">
                <div
                  className="h-14 w-14 rounded-full shrink-0 flex items-center justify-center text-xl font-bold text-(--bg-primary)"
                  style={{ background: member.gradient }}
                  aria-hidden
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-(--text-primary)">{member.name}</p>
                  <p className="text-sm text-(--text-secondary) mt-0.5">{member.role}</p>
                  <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mt-1">
                    {member.location}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        <RevealOnScroll delay={0.2}>
          <p className="text-sm text-(--text-secondary) mt-6 max-w-lg">
            We&apos;re a small team of builders who believe the creator economy deserves better tooling.
            If you want to help build it,{" "}
            <a href="mailto:team@creatorlyff.com" className="text-(--accent) hover:text-(--accent-hover) transition-colors">
              reach out →
            </a>
          </p>
        </RevealOnScroll>
      </Container>
    </section>
  );
}

// ─── 6. CTA ───────────────────────────────────────────────────────────────────

function AboutCTA() {
  return (
    <section className="py-32 md:py-48 bg-(--bg-primary)" aria-labelledby="about-cta-heading">
      <Container>
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-8 block">
            JOIN US
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 id="about-cta-heading" className="text-hero font-display leading-[0.9] tracking-[-0.05em] mb-10">
            Be part of what&apos;s{" "}
            <span className="font-serif text-(--accent)">next.</span>
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/login/brand"
              className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-(--accent) text-(--bg-primary) font-semibold text-body hover:bg-(--accent-hover) transition-colors group"
              data-interactive
            >
              Sign up as a Brand
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login/creator"
              className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-full border border-(--border-strong) text-(--text-primary) font-semibold text-body hover:border-(--text-primary) transition-colors group"
              data-interactive
            >
              Join as a Creator
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-(--bg-primary)">
      <ManifestoSection />
      <ProblemsSection />
      <ApproachSection />
      <VisionSection />
      <TeamSection />
      <AboutCTA />
    </div>
  );
}
