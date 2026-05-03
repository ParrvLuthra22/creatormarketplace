"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, X, ArrowRight, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import Accordion from "@/components/ui/Accordion";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

// ─── Data ─────────────────────────────────────────────────────────────────────

const BRAND_PLANS = [
  {
    id: "explorer",
    name: "Explorer",
    price: "Free",
    billing: "forever",
    badge: null,
    description: "For brands just getting started with creator marketing.",
    cta: "Get started",
    ctaHref: "/login/brand",
    comingSoon: false,
    highlight: false,
    features: [
      { text: "Browse creator profiles", included: true },
      { text: "Basic niche filters", included: true },
      { text: "3 outreach requests / month", included: true },
      { text: "Campaign dashboard", included: false },
      { text: "Advanced audience filters", included: false },
      { text: "Unlimited outreach", included: false },
      { text: "Analytics & reporting", included: false },
      { text: "Team seats (3)", included: false },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    price: "$499",
    billing: "per month",
    badge: "MOST POPULAR",
    description: "For brands running regular creator campaigns at scale.",
    cta: "Join beta waitlist",
    ctaHref: "/login/brand",
    comingSoon: true,
    highlight: true,
    features: [
      { text: "Unlimited creator browsing", included: true },
      { text: "Advanced audience & engagement filters", included: true },
      { text: "Unlimited outreach requests", included: true },
      { text: "Campaign dashboard", included: true },
      { text: "Analytics & reporting", included: true },
      { text: "3 team seats", included: true },
      { text: "Priority support", included: true },
      { text: "Custom contract templates", included: false },
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: "Custom",
    billing: "contact us",
    badge: null,
    description: "For agencies managing multiple brand accounts and creator rosters.",
    cta: "Talk to us",
    ctaHref: "mailto:agency@creatorlyff.com",
    comingSoon: false,
    highlight: false,
    features: [
      { text: "Everything in Studio", included: true },
      { text: "Unlimited team seats", included: true },
      { text: "Multi-brand account management", included: true },
      { text: "Custom contract templates", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "API access", included: true },
      { text: "SLA & uptime guarantees", included: true },
      { text: "Custom integrations", included: true },
    ],
  },
];

const CREATOR_PLANS = [
  {
    id: "free",
    name: "Creator Free",
    price: "Free",
    billing: "forever",
    badge: null,
    description: "Everything you need to get discovered and start earning.",
    cta: "Join as creator",
    ctaHref: "/login/creator",
    comingSoon: false,
    highlight: false,
    features: [
      { text: "Public creator profile", included: true },
      { text: "Receive inbound collab requests", included: true },
      { text: "Deal management dashboard", included: true },
      { text: "Earnings withdrawal", included: true },
      { text: "Profile analytics", included: false },
      { text: "Priority discovery placement", included: false },
      { text: "Custom profile domain", included: false },
      { text: "Advanced audience insights", included: false },
    ],
  },
  {
    id: "pro",
    name: "Creator Pro",
    price: "$29",
    billing: "per month",
    badge: "COMING SOON",
    description: "For full-time creators who want maximum visibility and insight.",
    cta: "Join beta waitlist",
    ctaHref: "/login/creator",
    comingSoon: true,
    highlight: true,
    features: [
      { text: "Everything in Creator Free", included: true },
      { text: "Full profile analytics dashboard", included: true },
      { text: "Priority placement in search results", included: true },
      { text: "Custom profile domain", included: true },
      { text: "Advanced audience insights", included: true },
      { text: "Rate card suggestions powered by AI", included: true },
      { text: "Early access to beta features", included: true },
      { text: "1:1 onboarding call", included: true },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "When does pricing start?",
    answer: "CreatorLyff is currently in open beta — all features are free to use while we're in beta. Paid plans will launch later in 2026. We'll give all beta users at least 30 days notice before any billing begins, and early users will receive significant discounts.",
  },
  {
    question: "Do creators pay to join?",
    answer: "No. Creators can always join, build their profile, receive inbound requests, and withdraw earnings for free. The Creator Pro tier adds premium analytics and placement features, but the core platform is free for creators forever.",
  },
  {
    question: "How does the creator matching work?",
    answer: "Our matching algorithm considers niche alignment, audience demographics, past collaboration performance, engagement quality scores, and brand fit signals. The more data a creator adds to their profile, the better the matches they receive.",
  },
  {
    question: "How are creator metrics verified?",
    answer: "Creators connect their social platforms via OAuth, which lets us pull live follower counts, engagement rates, and audience demographic data directly from each platform's API. This data is re-synced every 48 hours and cannot be manually edited.",
  },
  {
    question: "How do payments between brands and creators work?",
    answer: "Brands fund a campaign escrow when a deal is accepted. Once deliverables are approved, payment is released to the creator automatically — typically within 2–3 business days. CreatorLyff takes a 10% platform fee on completed deals.",
  },
  {
    question: "What's the difference between Studio and Agency?",
    answer: "Studio is for a single brand running campaigns regularly. Agency is for marketing agencies managing multiple brand accounts simultaneously, with features like multi-account management, custom contract templates, API access, and a dedicated account manager.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes — subscriptions are month-to-month with no lock-in. You can cancel any time from your account settings. You'll retain access to paid features until the end of your current billing period.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Since we're in beta, you can use all features free right now. When paid plans launch, Studio will include a 14-day free trial. No credit card required to start.",
  },
  {
    question: "How is my data kept safe?",
    answer: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We're SOC 2 compliant and never sell your data to third parties. Social platform credentials are handled exclusively through OAuth — we never store passwords.",
  },
  {
    question: "What social platforms are supported?",
    answer: "Instagram, YouTube, TikTok, X (Twitter), LinkedIn, and Snapchat. We're adding Twitch, Pinterest, and Substack in Q3 2026. You can also add unlisted platforms with manual follower count entry.",
  },
];

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: (typeof BRAND_PLANS)[number] }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border p-7 md:p-8 transition-all duration-200",
        plan.highlight
          ? "border-(--accent) bg-(--bg-secondary) ring-1 ring-(--accent)/20"
          : "border-(--border) bg-(--bg-secondary)"
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="font-mono-utility text-mono-sm bg-(--accent) text-(--bg-primary) px-3 py-1 rounded-full whitespace-nowrap">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-2">
          {plan.name.toUpperCase()}
        </p>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-h2 font-display">{plan.price}</span>
          <span className="text-sm text-(--text-tertiary)">{plan.billing}</span>
        </div>
        <p className="text-sm text-(--text-secondary) leading-relaxed">{plan.description}</p>
      </div>

      {/* CTA */}
      <Link
        href={plan.ctaHref}
        className={cn(
          "flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-colors mb-7",
          plan.highlight
            ? "bg-(--accent) text-(--bg-primary) hover:bg-(--accent-hover)"
            : "border border-(--border-strong) text-(--text-primary) hover:border-(--text-primary)"
        )}
        data-interactive
      >
        {plan.cta}
        {plan.comingSoon && <span className="font-mono-utility text-mono-sm opacity-60">· BETA</span>}
      </Link>

      {/* Features */}
      <ul className="flex flex-col gap-3 flex-1" role="list">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 shrink-0",
                f.included ? "text-(--accent)" : "text-(--border-strong)"
              )}
            >
              {f.included ? <Check size={15} /> : <X size={15} />}
            </span>
            <span
              className={cn(
                "text-sm",
                f.included ? "text-(--text-secondary)" : "text-(--text-tertiary) line-through"
              )}
            >
              {f.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────

const COMPARE_ROWS_BRAND = [
  { feature: "Creator search", explorer: "Limited", studio: "Unlimited", agency: "Unlimited" },
  { feature: "Monthly outreach", explorer: "3", studio: "Unlimited", agency: "Unlimited" },
  { feature: "Audience filters", explorer: "Basic", studio: "Advanced", agency: "Advanced +" },
  { feature: "Campaign dashboard", explorer: "—", studio: "✓", agency: "✓" },
  { feature: "Analytics", explorer: "—", studio: "✓", agency: "✓" },
  { feature: "Team seats", explorer: "1", studio: "3", agency: "Unlimited" },
  { feature: "Support", explorer: "Community", studio: "Email", agency: "Dedicated" },
  { feature: "API access", explorer: "—", studio: "—", agency: "✓" },
];

function ComparisonTable({ type }: { type: "brand" | "creator" }) {
  const rows = COMPARE_ROWS_BRAND;
  const cols =
    type === "brand"
      ? ["Feature", "Explorer", "Studio", "Agency"]
      : ["Feature", "Free", "Pro"];

  return (
    <div className="overflow-x-auto rounded-2xl border border-(--border)">
      <table className="w-full text-sm" role="table">
        <thead>
          <tr className="border-b border-(--border) bg-(--bg-surface)">
            {cols.map((c) => (
              <th
                key={c}
                scope="col"
                className="text-left font-mono-utility text-mono-sm text-(--text-tertiary) px-5 py-4 first:w-[40%]"
              >
                {c.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.feature}
              className={cn(
                "transition-colors",
                i < rows.length - 1 ? "border-b border-(--border)" : "",
                i % 2 === 0 ? "bg-(--bg-secondary)" : "bg-(--bg-primary)"
              )}
            >
              <td className="px-5 py-4 font-medium text-(--text-primary)">{row.feature}</td>
              <td className="px-5 py-4 text-(--text-secondary)">{row.explorer}</td>
              {type === "brand" && (
                <>
                  <td className="px-5 py-4 text-(--accent) font-medium">{row.studio}</td>
                  <td className="px-5 py-4 text-(--text-secondary)">{row.agency}</td>
                </>
              )}
              {type === "creator" && (
                <td className="px-5 py-4 text-(--accent) font-medium">{row.studio}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type PricingTab = "brands" | "creators";

export default function PricingPage() {
  const [tab, setTab] = useState<PricingTab>("brands");

  return (
    <div className="min-h-screen bg-(--bg-primary) pt-24">
      {/* Beta banner */}
      <div className="bg-(--accent)/10 border-b border-(--accent)/20 py-3">
        <Container className="flex items-center justify-center gap-3">
          <Zap size={14} className="text-(--accent)" />
          <p className="text-sm font-medium text-(--text-primary)">
            <span className="text-(--accent)">CreatorLyff is in open beta</span>{" "}
            <span className="text-(--text-secondary)">— all features are free during beta. No credit card required.</span>
          </p>
        </Container>
      </div>

      {/* Hero */}
      <section className="pt-20 pb-16 text-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-6 block">
              PRICING
            </span>
            <h1 className="text-hero font-display leading-[0.9] tracking-[-0.05em] mb-6">
              Simple,{" "}
              <span className="font-serif text-(--accent)">transparent</span>{" "}
              pricing.
            </h1>
            <p className="text-body-lg text-(--text-secondary) max-w-lg mx-auto mb-10">
              No hidden fees. No fake engagement. Just straightforward plans built around how you actually work.
            </p>
          </motion.div>

          {/* Tab toggle */}
          <motion.div
            className="inline-flex p-1.5 rounded-full border border-(--border) bg-(--bg-secondary) gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {(["brands", "creators"] as PricingTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                  tab === t
                    ? "text-(--bg-primary)"
                    : "text-(--text-secondary) hover:text-(--text-primary)"
                )}
              >
                {tab === t && (
                  <motion.div
                    layoutId="pricing-tab-bg"
                    className="absolute inset-0 rounded-full bg-(--accent)"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative z-10 capitalize">For {t}</span>
              </button>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <Container>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div
                className={cn(
                  "grid gap-6",
                  tab === "brands"
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                )}
              >
                {(tab === "brands" ? BRAND_PLANS : CREATOR_PLANS).map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="py-20 border-t border-(--border)">
        <Container>
          <RevealOnScroll>
            <h2 className="text-h2 font-display mb-2">
              Compare{" "}
              <span className="font-serif text-(--text-secondary)">plans.</span>
            </h2>
            <p className="text-sm text-(--text-secondary) mb-8">
              Full feature breakdown for {tab === "brands" ? "brand" : "creator"} plans.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <ComparisonTable type={tab === "brands" ? "brand" : "creator"} />
          </RevealOnScroll>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-(--border) bg-(--bg-secondary)">
        <Container className="max-w-3xl">
          <RevealOnScroll>
            <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
              FAQ
            </span>
            <h2 className="text-h2 font-display mb-10">
              Frequently asked{" "}
              <span className="font-serif text-(--text-secondary)">questions.</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Accordion items={FAQ_ITEMS} allowMultiple className="divide-y-0" />
          </RevealOnScroll>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-(--bg-primary)">
        <Container className="text-center max-w-2xl">
          <RevealOnScroll>
            <h2 className="text-h1 font-display mb-4">
              Ready to{" "}
              <span className="font-serif text-(--accent)">get started?</span>
            </h2>
            <p className="text-body text-(--text-secondary) mb-8">
              Join the beta — free for everyone right now. No credit card, no commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login/brand"
                className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full bg-(--accent) text-(--bg-primary) font-semibold text-body hover:bg-(--accent-hover) transition-colors group"
                style={{ height: 52 }}
                data-interactive
              >
                Get started as a brand
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login/creator"
                className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full border border-(--border-strong) text-(--text-primary) font-semibold text-body hover:border-(--text-primary) transition-colors group"
                style={{ height: 52 }}
                data-interactive
              >
                Join as a creator
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </div>
  );
}
