"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Lenis's own autoResize watches document.documentElement for size changes,
 * but <html> has an explicit h-full (height: 100%) so its own box is pinned
 * to the viewport and never grows as overflowing content is added below —
 * ResizeObserver never fires there. That leaves Lenis's cached scroll limit
 * stuck at whatever it measured on mount, so wheel-driven scroll hard-stops
 * partway down the page once anything mounts after that first measurement
 * (e.g. the next/dynamic, ssr:false sections). <body> uses min-h-full
 * instead, so its box does grow with content — watch that and force Lenis
 * to recompute whenever it changes.
 */
export function useLenisAutoResize() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);

    return () => ro.disconnect();
  }, [lenis]);
}
