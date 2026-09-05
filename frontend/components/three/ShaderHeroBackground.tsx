"use client";

/**
 * Real 21st.dev component: "Shader Hero" by beratberkayg
 * https://21st.dev/@beratberkayg/components/shader-hero (id 5746)
 * Pulled via the 21st.dev MCP connector's get_component.
 *
 * Adapted from the original in two ways:
 * 1. Only the shader background is kept — the original also ships its own
 *    headline/badge/button, but HeroSection.tsx already renders CreatorLyff's
 *    real copy, IST clock, and CTAs, so that part is dropped rather than
 *    stacking a second hero on top of the first.
 * 2. The installed @paper-design/shaders-react (0.0.80) no longer has the
 *    `backgroundColor`/`wireframe` props the 21st.dev demo code was written
 *    against (MeshGradientParams today is just colors/distortion/swirl/
 *    grainMixer/grainOverlay + the shared sizing/motion params) — the demo's
 *    second wireframe layer is dropped rather than passing props that don't
 *    exist, and the "background" is achieved by leading the colors array
 *    with --bg-primary, same as the original's backgroundColor intent.
 * Colors are read live from the page's own CSS custom properties instead of
 * the original's hardcoded black/white palette, so it tracks globals.css.
 */

import { useMemo } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export default function ShaderHeroBackground() {
  const colors = useMemo(() => {
    const bgPrimary = readVar("--bg-primary", "#0a0a0a");
    const bgSurface = readVar("--bg-surface", "#1c1c1c");
    const borderStrong = readVar("--border-strong", "#404040");
    const accent = readVar("--accent", "#d4ff4f");
    return [bgPrimary, bgPrimary, bgSurface, borderStrong, accent];
  }, []);

  return (
    <MeshGradient
      className="absolute inset-0 w-full h-full"
      colors={colors}
      speed={0.25}
      grainOverlay={0.05}
    />
  );
}
