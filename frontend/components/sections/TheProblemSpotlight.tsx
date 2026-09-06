"use client";

import { useRef } from "react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface PainPoint {
  text: string;
  top: string;
  left: string;
  rotate: string;
}

const PAIN_POINTS: PainPoint[] = [
  { text: "cold DMs", top: "18%", left: "10%", rotate: "-4deg" },
  { text: "low reply rates", top: "28%", left: "62%", rotate: "3deg" },
  { text: "fake followers", top: "62%", left: "14%", rotate: "2deg" },
  { text: "scattered tools", top: "72%", left: "58%", rotate: "-3deg" },
];

export default function TheProblemSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <section
      data-spotlight="true"
      className="relative py-32 md:py-48 bg-(--bg-primary) overflow-hidden"
      aria-label="The problem"
    >
      <Container className="mb-16">
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            02 — THE PROBLEM
          </span>
        </RevealOnScroll>
      </Container>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[420px] md:min-h-[520px]"
        style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
      >
        {/* Faint base layer — always present at low opacity */}
        {PAIN_POINTS.map((p) => (
          <span
            key={`base-${p.text}`}
            aria-hidden
            className="absolute font-display text-h2 font-bold select-none pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              transform: `rotate(${p.rotate})`,
              color: "var(--text-tertiary)",
              opacity: 0.12,
            }}
          >
            {p.text}
          </span>
        ))}

        {/* Revealed layer — masked to a circle around the cursor (or always-on under reduced motion) */}
        {PAIN_POINTS.map((p) => (
          <span
            key={`reveal-${p.text}`}
            className="absolute font-display text-h2 font-bold select-none pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              transform: `rotate(${p.rotate})`,
              color: "var(--warning)",
              opacity: reducedMotion ? 0.55 : 1,
              maskImage: reducedMotion
                ? undefined
                : "radial-gradient(circle 180px at var(--mx) var(--my), black 0%, transparent 100%)",
              WebkitMaskImage: reducedMotion
                ? undefined
                : "radial-gradient(circle 180px at var(--mx) var(--my), black 0%, transparent 100%)",
            }}
          >
            {p.text}
          </span>
        ))}

        {/* Center headline — always fully visible */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <RevealOnScroll>
            <h2 className="text-h1 font-display text-center max-w-3xl leading-tight">
              The old way of finding creators is{" "}
              <span className="font-serif text-(--accent)">broken.</span>
            </h2>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
