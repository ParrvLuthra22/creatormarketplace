"use client";

import { useDisableLenis } from "@/lib/hooks/useDisableLenis";

/**
 * Thin client component that sits inside <ReactLenis> and disables
 * smooth scroll on dashboard / admin routes. Renders nothing.
 */
export default function LenisController() {
  useDisableLenis();
  return null;
}
