"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const brandBenefits = [
  "Find creators by real audience data",
  "Verified engagement metrics",
  "Streamlined campaign management",
  "Performance analytics",
];

const creatorBenefits = [
  "Get discovered by relevant brands",
  "Inbound collaboration requests",
  "Fair, transparent pricing",
  "One dashboard for all deals",
];

function useIsDesktop() {
  const [yes, setYes] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setYes(mq.matches);
    const h = (e: MediaQueryListEvent) => setYes(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return yes;
}

export default function SplitCTA() {
  const [hovered, setHovered] = useState<"brands" | "creators" | null>(null);
  const isDesktop = useIsDesktop();

  function brandsWidth() {
    if (!isDesktop) return "100%";
    return hovered === "brands" ? "60%" : hovered === "creators" ? "40%" : "50%";
  }
  function creatorsWidth() {
    if (!isDesktop) return "100%";
    return hovered === "creators" ? "60%" : hovered === "brands" ? "40%" : "50%";
  }

  return (
    <RevealOnScroll y={20}>
      <section
        className="flex flex-col md:flex-row min-h-[560px] md:h-[640px] overflow-hidden border-t border-b border-(--border)"
        aria-label="For Brands and For Creators"
      >
        {/* ── Left: Brands ── */}
        <div
          className="flex flex-col justify-between p-10 md:p-16 bg-(--bg-secondary) overflow-hidden"
          style={{
            width: brandsWidth(),
            transition: "width 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
            minWidth: isDesktop ? "40%" : "100%",
          }}
          onMouseEnter={() => isDesktop && setHovered("brands")}
          onMouseLeave={() => setHovered(null)}
        >
          <div>
            <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-6 block">
              FOR BRANDS
            </span>
            <h3 className="text-h2 font-display mb-10">
              Reach audiences that{" "}
              <span className="font-serif text-(--text-secondary)">
                actually convert.
              </span>
            </h3>
            <ul className="flex flex-col gap-4" role="list">
              {brandBenefits.map((b, i) => (
                <li key={b} className="flex items-start gap-4">
                  <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mt-0.5 shrink-0">
                    0{i + 1}
                  </span>
                  <span className="text-body text-(--text-secondary)">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/login/brand"
            className="inline-flex items-center gap-2 text-body font-medium text-(--text-primary) hover:text-(--accent) transition-colors duration-200 mt-8 group focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2 rounded-sm"
            data-interactive
          >
            Start hiring creators
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </a>
        </div>

        {/* ── Divider ── */}
        <div className="w-px bg-(--border) hidden md:block flex-none" aria-hidden />

        {/* ── Right: Creators ── */}
        <div
          className="flex flex-col justify-between p-10 md:p-16 bg-(--accent) overflow-hidden"
          style={{
            width: creatorsWidth(),
            transition: "width 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
            minWidth: isDesktop ? "40%" : "100%",
          }}
          onMouseEnter={() => isDesktop && setHovered("creators")}
          onMouseLeave={() => setHovered(null)}
        >
          <div>
            <span
              className="font-mono-utility text-mono-sm mb-6 block"
              style={{ color: "rgba(0,0,0,0.45)" }}
            >
              FOR CREATORS
            </span>
            <h3
              className="text-h2 font-display mb-10"
              style={{ color: "var(--bg-primary)" }}
            >
              Build the career you{" "}
              <span className="font-serif" style={{ color: "rgba(0,0,0,0.6)" }}>
                deserve.
              </span>
            </h3>
            <ul className="flex flex-col gap-4" role="list">
              {creatorBenefits.map((b, i) => (
                <li key={b} className="flex items-start gap-4">
                  <span
                    className="font-mono-utility text-mono-sm mt-0.5 shrink-0"
                    style={{ color: "rgba(0,0,0,0.45)" }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className="text-body"
                    style={{ color: "rgba(0,0,0,0.7)" }}
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/login/creator"
            className="inline-flex items-center gap-2 text-body font-medium transition-opacity duration-200 hover:opacity-70 mt-8 group focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm"
            style={{
              color: "var(--bg-primary)",
              outlineColor: "var(--bg-primary)",
            }}
            data-interactive
          >
            Join as a creator
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </a>
        </div>
      </section>
    </RevealOnScroll>
  );
}
