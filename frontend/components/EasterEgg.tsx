"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

const CONFETTI_COLORS = ["#d4ff4f", "#ffffff", "#0a0a0a", "#a3cc3f"];

function spawnConfetti() {
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;inset:0;z-index:9992;pointer-events:none;overflow:hidden;";
  document.body.appendChild(container);

  for (let i = 0; i < 48; i++) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 6;
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 120;
    const endX = startX + (Math.random() - 0.5) * window.innerWidth * 0.8;
    const endY = window.innerHeight * (0.5 + Math.random() * 0.6);
    const rotation = Math.random() * 720 - 360;
    piece.style.cssText = `
      position:absolute; left:${startX}px; top:-20px;
      width:${size}px; height:${size * (Math.random() > 0.5 ? 1 : 2.2)}px;
      background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
    `;
    container.appendChild(piece);

    piece.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${endX - startX}px, ${endY}px) rotate(${rotation}deg)`,
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration: 1400 + Math.random() * 700,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        delay: Math.random() * 150,
      }
    );
  }

  setTimeout(() => container.remove(), 2400);
}

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA",
];

/**
 * Konami code easter egg.
 * On match: floods the viewport with the lime accent colour for 2 s
 * and injects a toast-style notification without requiring ToastProvider.
 * Drop this anywhere in the component tree.
 */
export default function EasterEgg() {
  const seqRef = useRef<string[]>([]);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    // Lime flood overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9993;
      background:var(--accent);opacity:0;pointer-events:none;
      transition:opacity 0.4s cubic-bezier(0.65,0,0.35,1);
    `;
    document.body.appendChild(overlay);
    overlayRef.current = overlay;

    // Simple toast
    const toast = document.createElement("div");
    toast.style.cssText = `
      position:fixed;top:1.5rem;right:1.5rem;z-index:9994;
      background:var(--bg-secondary);border:1px solid var(--border);
      color:var(--text-primary);padding:0.75rem 1.25rem;
      border-radius:0.75rem;font-size:0.875rem;font-weight:500;
      opacity:0;transform:translateX(2rem);pointer-events:none;
      transition:opacity 0.3s,transform 0.3s;font-family:var(--font-inter),sans-serif;
    `;
    toast.textContent = "🎉 You found the secret. Welcome, curious one.";
    document.body.appendChild(toast);
    toastRef.current = toast;

    function trigger() {
      if (activeRef.current) return;
      activeRef.current = true;

      overlay.style.opacity = "1";
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
      spawnConfetti();
      posthog.capture("easter_egg_triggered");

      setTimeout(() => {
        overlay.style.opacity = "0";
        toast.style.opacity = "0";
        toast.style.transform = "translateX(2rem)";
        setTimeout(() => { activeRef.current = false; }, 400);
      }, 2000);
    }

    function handleKey(e: KeyboardEvent) {
      seqRef.current = [...seqRef.current, e.code].slice(-KONAMI.length);
      if (seqRef.current.join(",") === KONAMI.join(",")) {
        trigger();
        seqRef.current = [];
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      overlay.remove();
      toast.remove();
    };
  }, []);

  return null;
}
