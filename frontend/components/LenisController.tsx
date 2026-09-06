"use client";

import { useDisableLenis } from "@/lib/hooks/useDisableLenis";
import { useLenisAutoResize } from "@/lib/hooks/useLenisAutoResize";

/**
 * Thin client component that sits inside <ReactLenis> and disables
 * smooth scroll on dashboard / admin routes, and keeps Lenis's scroll
 * limit in sync as content mounts after its initial measurement.
 * Renders nothing.
 */
export default function LenisController() {
  useDisableLenis();
  useLenisAutoResize();
  return null;
}
