"use client";

import { useEffect, useRef } from "react";

/**
 * Refined custom cursor:
 * - Default: 10px solid lime dot
 * - Hover [data-interactive], <a>, <button>: 52px hollow white circle (mix-blend-difference)
 * - Reads data-cursor attribute for optional label inside expanded circle
 * - Hidden on touch devices (pointer: coarse)
 * - Smooth lerp at 0.15
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const pos = useRef({ x: -200, y: -200 });
  const cur = useRef({ x: -200, y: -200 });
  const expanded = useRef(false);
  const raf = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;
    if (!dot || !ring || !label) return;

    // Bail on touch-primary devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      dot.style.display = "none";
      ring.style.display = "none";
      return;
    }

    const LERP = 0.15;

    function move(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
    }

    function over(e: MouseEvent) {
      const el = e.target as Element;
      const target =
        el.closest("[data-interactive]") ||
        el.closest("a") ||
        el.closest("button");

      if (target && !expanded.current) {
        expanded.current = true;
        const cursorLabel = (target as HTMLElement).dataset.cursor ?? "";
        label.textContent = cursorLabel;
        label.style.opacity = cursorLabel ? "1" : "0";

        dot.style.opacity = "0";
        ring.style.transform += " scale(1)"; // ensure visible
        ring.style.opacity = "1";
      }
    }

    function out(e: MouseEvent) {
      const el = e.target as Element;
      const wasInteractive =
        el.closest("[data-interactive]") ||
        el.closest("a") ||
        el.closest("button");

      if (wasInteractive && expanded.current) {
        expanded.current = false;
        label.textContent = "";
        label.style.opacity = "0";
        dot.style.opacity = "1";
        ring.style.opacity = "0";
      }
    }

    function loop() {
      cur.current.x += (pos.current.x - cur.current.x) * LERP;
      cur.current.y += (pos.current.y - cur.current.y) * LERP;

      const x = cur.current.x;
      const y = cur.current.y;

      // Dot — centred on cursor (5px radius)
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;

      // Ring — centred (26px radius)
      ring.style.transform = `translate(${x - 26}px, ${y - 26}px)`;

      raf.current = requestAnimationFrame(loop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    raf.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
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
          transition: "opacity 0.2s cubic-bezier(0.65,0,0.35,1)",
        }}
      >
        <span
          ref={labelRef}
          style={{
            color: "white",
            fontSize: "0.6rem",
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
      </div>
    </>
  );
}
