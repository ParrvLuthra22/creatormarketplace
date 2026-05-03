"use client";

import { useEffect, useRef } from "react";

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
    toast.textContent = "🎉 You found it.";
    document.body.appendChild(toast);
    toastRef.current = toast;

    function trigger() {
      if (activeRef.current) return;
      activeRef.current = true;

      overlay.style.opacity = "1";
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";

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
