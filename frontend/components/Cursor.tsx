"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Refined custom cursor:
 * - Default: 10px solid lime dot
 * - Hover [data-interactive], <a>, <button>: 52px hollow white circle (mix-blend-difference)
 * - Hover [data-spotlight="true"]: 300px radial lime spotlight (8% opacity) follows the cursor,
 *   revealing content that section chooses to keep low-contrast until lit
 * - Label inside the ring: explicit data-cursor attribute, or auto-detected —
 *   "OPEN" (+ arrow icon) for target="_blank" links, "DRAG" for [data-drag-scroll] regions
 * - While hovering a button/link, the cursor magnetizes gently toward its center
 *   (0.3 pull toward center each frame — weaker than the button's own magnetic effect)
 * - Hidden on touch devices (pointer: coarse)
 * - prefers-reduced-motion: instant 1:1 follow, no lerp, no transition
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const iconSlotRef = useRef<HTMLSpanElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: -200, y: -200 });
  const cur = useRef({ x: -200, y: -200 });
  const stickyCenter = useRef<{ x: number; y: number } | null>(null);
  const expanded = useRef(false);
  const inSpotlight = useRef(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    const iconSlot = iconSlotRef.current!;
    const spotlight = spotlightRef.current!;
    if (!dot || !ring || !label || !spotlight) return;

    // Bail on touch-primary devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      dot.style.display = "none";
      ring.style.display = "none";
      spotlight.style.display = "none";
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LERP = reducedMotion ? 1 : 0.15;
    const STICKY_PULL = 0.3;

    if (reducedMotion) {
      // No expand/opacity transitions either — every state change should be instant.
      [dot, ring, label, spotlight].forEach((el) => {
        el.style.transition = "none";
      });
    }

    function setLabel(text: string, showOpenIcon: boolean) {
      label.textContent = text;
      label.style.opacity = text ? "1" : "0";
      iconSlot.style.display = showOpenIcon ? "flex" : "none";
    }

    function move(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };

      const el = e.target as Element;
      const nowInSpotlight = Boolean(el.closest?.('[data-spotlight="true"]'));
      if (nowInSpotlight !== inSpotlight.current) {
        inSpotlight.current = nowInSpotlight;
        spotlight.style.opacity = nowInSpotlight ? "1" : "0";
      }

      if (reducedMotion) {
        dot.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
        ring.style.transform = `translate(${e.clientX - 26}px, ${e.clientY - 26}px)`;
        spotlight.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
      }
    }

    function over(e: MouseEvent) {
      const el = e.target as Element;
      const interactiveTarget =
        (el.closest("[data-interactive]") as HTMLElement | null) ||
        (el.closest("a") as HTMLElement | null) ||
        (el.closest("button") as HTMLElement | null);
      const dragTarget = el.closest("[data-drag-scroll]") as HTMLElement | null;
      const target = interactiveTarget || dragTarget;

      if (target && !expanded.current) {
        expanded.current = true;

        const rect = target.getBoundingClientRect();
        stickyCenter.current = interactiveTarget
          ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
          : null;

        const explicitLabel = interactiveTarget?.dataset.cursor;
        const isExternalLink =
          interactiveTarget?.tagName === "A" && (interactiveTarget as HTMLAnchorElement).target === "_blank";

        if (explicitLabel) {
          setLabel(explicitLabel, false);
        } else if (isExternalLink) {
          setLabel("OPEN", true);
        } else if (!interactiveTarget && dragTarget) {
          setLabel("DRAG", false);
        } else {
          setLabel("", false);
        }

        dot.style.opacity = "0";
        ring.style.opacity = "1";
      }
    }

    function out(e: MouseEvent) {
      const el = e.target as Element;
      const wasTarget =
        el.closest("[data-interactive]") || el.closest("a") || el.closest("button") || el.closest("[data-drag-scroll]");

      if (wasTarget && expanded.current) {
        expanded.current = false;
        stickyCenter.current = null;
        setLabel("", false);
        dot.style.opacity = "1";
        ring.style.opacity = "0";
      }
    }

    function loop() {
      let targetX = pos.current.x;
      let targetY = pos.current.y;

      if (stickyCenter.current) {
        targetX += (stickyCenter.current.x - targetX) * STICKY_PULL;
        targetY += (stickyCenter.current.y - targetY) * STICKY_PULL;
      }

      cur.current.x += (targetX - cur.current.x) * LERP;
      cur.current.y += (targetY - cur.current.y) * LERP;

      const x = cur.current.x;
      const y = cur.current.y;

      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      ring.style.transform = `translate(${x - 26}px, ${y - 26}px)`;
      spotlight.style.transform = `translate(${x - 150}px, ${y - 150}px)`;

      raf.current = requestAnimationFrame(loop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    if (!reducedMotion) raf.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Spotlight — large soft radial glow, only visible over [data-spotlight] sections */}
      <div
        ref={spotlightRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
          opacity: 0,
          willChange: "transform, opacity",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Lime dot */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "var(--accent)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          transition: "opacity 0.2s",
        }}
      />

      {/* Expanded ring (mix-blend-difference) */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "1.5px solid white",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          transition: "opacity 0.2s cubic-bezier(0.65,0,0.35,1)",
        }}
      >
        <span
          ref={labelRef}
          style={{
            color: "white",
            fontSize: "8px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            opacity: 0,
            transition: "opacity 0.15s",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <span ref={iconSlotRef} style={{ color: "white", display: "none", pointerEvents: "none" }}>
          <ArrowUpRight size={10} strokeWidth={2.5} />
        </span>
      </div>
    </>
  );
}
