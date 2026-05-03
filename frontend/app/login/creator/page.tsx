"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthSidePanel from "@/components/auth/AuthSidePanel";
import SocialLoginButton from "@/components/auth/SocialLoginButton";
import AuthEmailForm from "@/components/auth/AuthEmailForm";
import { API_URL } from "@/lib/api";
import {
  GoogleIcon,
  InstagramIcon,
  YouTubeIcon,
  XIcon,
  LinkedInIcon,
  SnapchatIcon,
} from "@/components/auth/SocialIcons";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

// ─── Content stagger ──────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.6 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// ─── Side panel data ──────────────────────────────────────────────────────────

const CREATOR_QUOTES = [
  {
    text: "Got my first brand deal within a week of joining. The inbound is real.",
    author: "Alex R.",
    role: "TECH & GADGETS · 2.4M FOLLOWERS",
  },
  {
    text: "Brands actually reach out to ME now. I've stopped cold pitching completely.",
    author: "Maya C.",
    role: "SUSTAINABLE LIVING · 890K FOLLOWERS",
  },
  {
    text: "Fair rates, transparent contracts, no back-and-forth. This is how it should work.",
    author: "Jordan W.",
    role: "FITNESS & WELLNESS · 5.1M FOLLOWERS",
  },
  {
    text: "The brand matching is scary good. Every collab has been with brands my audience loves.",
    author: "Sam T.",
    role: "FOOD & CULTURE · 1.8M FOLLOWERS",
  },
  {
    text: "Completely changed how I work with brands. I'm earning 3× what I made last year.",
    author: "Morgan L.",
    role: "FINANCE & GROWTH · 3.2M FOLLOWERS",
  },
];

// ─── Social providers ─────────────────────────────────────────────────────────

const PROVIDERS = [
  { id: "google", label: "Google", icon: <GoogleIcon /> },
  { id: "instagram", label: "Instagram", icon: <InstagramIcon /> },
  { id: "youtube", label: "YouTube", icon: <YouTubeIcon /> },
  { id: "twitter", label: "X (Twitter)", icon: <XIcon /> },
  { id: "linkedin", label: "LinkedIn", icon: <LinkedInIcon /> },
  { id: "snapchat", label: "Snapchat", icon: <SnapchatIcon /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatorLogin() {
  return (
    <motion.div
      className="flex h-screen bg-(--bg-primary) overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* ── Side panel (desktop only) ── */}
      <div
        className="hidden md:block w-2/5 h-full shrink-0 bg-(--bg-surface) overflow-hidden"
        style={{ maxWidth: 480 }}
      >
        <AuthSidePanel
          label="CREATORS EARNING WITH CREATORLYFF"
          quotes={CREATOR_QUOTES}
          stats="10K+ CREATORS · $2M+ IN COLLABS · 50+ NICHES"
        />
      </div>

      {/* ── Right: background + form ── */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-6 py-10 md:px-12">
        {/* Three.js background — distinct shape for creators */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <AuthBackground shape="torusKnot" />
          {/* Vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, var(--bg-primary) 100%)",
            }}
            aria-hidden
          />
        </motion.div>

        {/* Form panel */}
        <motion.div
          className="relative z-10 w-full max-w-md"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Back + label */}
          <motion.div
            variants={item}
            className="flex items-center justify-between mb-10"
          >
            <Link
              href="/login"
              className="font-mono-utility text-mono-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
              data-interactive
            >
              ← BACK
            </Link>
            <span className="font-mono-utility text-mono-sm text-(--accent)">
              02 / CREATOR ACCESS
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={item} className="mb-8">
            <h1
              className="text-h2 font-display mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              Let&apos;s get you{" "}
              <span className="font-serif text-(--accent)">discovered.</span>
            </h1>
            <p className="text-body text-(--text-secondary)">
              Sign in to manage your profile and inbound collabs.
            </p>
          </motion.div>

          {/* Social grid */}
          <motion.div variants={item}>
            <div className="grid grid-cols-3 gap-3">
              {PROVIDERS.map((p) => (
                <SocialLoginButton
                  key={p.id}
                  provider={p.label}
                  icon={p.icon}
                  onClick={() => {
                    window.location.href = `${API_URL}/api/auth/${p.id}`;
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={item}
            className="flex items-center gap-4 my-6"
          >
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
              aria-hidden
            />
            <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
              OR
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--border)" }}
              aria-hidden
            />
          </motion.div>

          {/* Email form */}
          <motion.div variants={item}>
            <AuthEmailForm
              crossLinkLabel="Are you a brand? Sign in here →"
              crossLinkHref="/login/brand"
              signUpHref="/login/creator?mode=signup"
              signUpLabel="New here? Create a creator account →"
              accountType="Creator"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
