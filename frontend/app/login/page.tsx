"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const config = {
  brands: {
    href: "/login/brand",
    label: "I'm a Brand",
    cta: "Find creators",
    word: "brands",
    bg: "var(--bg-secondary)",
    textColor: "var(--text-primary)",
    accentColor: "var(--accent)",
    subText: "Discover and hire world-class creators for your next campaign.",
    metaLabel: "01 / BRAND ACCESS",
  },
  creators: {
    href: "/login/creator",
    label: "I'm a Creator",
    cta: "Get discovered",
    word: "creators",
    bg: "var(--accent)",
    textColor: "var(--bg-primary)",
    accentColor: "var(--bg-primary)",
    subText: "Build your portfolio, get inbound brand deals, earn fairly.",
    metaLabel: "02 / CREATOR ACCESS",
  },
} as const;

// ─── Half panel ───────────────────────────────────────────────────────────────

interface HalfProps {
  side: "brands" | "creators";
  hovered: "brands" | "creators" | null;
  isDesktop: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function Half({ side, hovered, isDesktop, onEnter, onLeave }: HalfProps) {
  const c = config[side];
  const isHovered = hovered === side;
  const isShrunk = hovered !== null && hovered !== side;

  // On mobile: full width, 50vh height. On desktop: animated horizontal split.
  const desktopWidth = isHovered ? "62%" : isShrunk ? "38%" : "50%";

  return (
    <div
      className="relative overflow-hidden flex flex-col justify-between p-10 md:p-16"
      style={{
        // Mobile: stacked, each half-screen height
        ...(isDesktop
          ? {
              width: desktopWidth,
              minWidth: "38%",
              height: "100%",
              transition: "width 0.6s cubic-bezier(0.65,0,0.35,1)",
            }
          : {
              width: "100%",
              height: "50%",
            }),
        background: c.bg,
        color: c.textColor,
        cursor: "pointer",
      }}
      onMouseEnter={isDesktop ? onEnter : undefined}
      onMouseLeave={isDesktop ? onLeave : undefined}
    >
      {/* Meta label */}
      <div className="flex items-start justify-between">
        <span
          className="font-mono-utility text-mono-sm"
          style={{
            color:
              isDesktop && isHovered
                ? c.accentColor
                : side === "creators"
                ? "rgba(0,0,0,0.45)"
                : "var(--text-tertiary)",
          }}
        >
          {c.metaLabel}
        </span>
        {isDesktop && (
          <motion.span
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <ArrowRight size={16} aria-hidden />
          </motion.span>
        )}
      </div>

      {/* Main content */}
      <div>
        <h2
          className="font-display font-semibold"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          {c.label}
        </h2>

        <p
          className="text-body mt-4 max-w-xs leading-relaxed"
          style={{
            color:
              side === "creators" ? "rgba(0,0,0,0.65)" : "var(--text-secondary)",
            opacity: !isDesktop || isHovered ? 1 : 0.55,
            transition: "opacity 0.4s",
          }}
        >
          {c.subText}
        </p>

        <div className="mt-8">
          <Link
            href={c.href}
            className="inline-flex items-center gap-2 font-semibold text-body rounded-sm group focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: c.accentColor, outlineColor: c.accentColor }}
            data-interactive
          >
            {c.cta}
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Massive background word — distorts on hover (desktop only) */}
      <motion.span
        className="pointer-events-none absolute select-none font-serif"
        aria-hidden
        style={{
          fontSize: "clamp(5rem, 15vw, 16rem)",
          lineHeight: 0.85,
          bottom: "-0.1em",
          right: side === "brands" ? "-0.05em" : undefined,
          left: side === "creators" ? "-0.05em" : undefined,
          color:
            side === "brands"
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.07)",
          transformOrigin:
            side === "brands" ? "bottom right" : "bottom left",
        }}
        animate={
          isDesktop && isHovered
            ? { scale: 1.15, skewX: side === "brands" ? -4 : 4 }
            : { scale: 1, skewX: 0 }
        }
        transition={{ duration: 0.7, ease: EASE }}
      >
        {c.word}
      </motion.span>

      {/* Desktop divider between halves */}
      {side === "brands" && (
        <div
          className="hidden md:block absolute right-0 top-0 bottom-0 w-px"
          style={{ background: "var(--border)" }}
          aria-hidden
        />
      )}

      {/* Mobile divider between stacked halves */}
      {side === "brands" && (
        <div
          className="md:hidden absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "var(--border)" }}
          aria-hidden
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginRoleSelect() {
  const [hovered, setHovered] = useState<"brands" | "creators" | null>(null);
  const isDesktop = useIsDesktop();

  return (
    <motion.div
      className="flex flex-col md:flex-row h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      aria-label="Choose your role"
    >
      {/* Logo — centred at top */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <Link
          href="/"
          className="font-display font-semibold text-body text-(--text-primary) tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-(--accent) rounded-sm"
          data-interactive
        >
          CreatorLyff
        </Link>
      </div>

      <Half
        side="brands"
        hovered={hovered}
        isDesktop={isDesktop}
        onEnter={() => setHovered("brands")}
        onLeave={() => setHovered(null)}
      />
      <Half
        side="creators"
        hovered={hovered}
        isDesktop={isDesktop}
        onEnter={() => setHovered("creators")}
        onLeave={() => setHovered(null)}
      />
    </motion.div>
  );
}
