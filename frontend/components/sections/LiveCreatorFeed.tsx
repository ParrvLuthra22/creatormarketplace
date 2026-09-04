"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

// ─── Mock creator data ──────────────────────────────────────────────────────

interface MockCreator {
  name: string;
  niche: string;
  followers: string;
}

const CREATORS: MockCreator[] = [
  { name: "Aisha Kapoor", niche: "Lifestyle & Travel", followers: "2.4M" },
  { name: "Marcus Chen", niche: "Tech & Gaming", followers: "1.8M" },
  { name: "Priya Sharma", niche: "Food & Culture", followers: "1.2M" },
  { name: "Jordan Blake", niche: "Fitness & Wellness", followers: "3.1M" },
  { name: "Kavya Reddy", niche: "Fashion & Beauty", followers: "980K" },
  { name: "Leo Fontaine", niche: "Music & Art", followers: "670K" },
  { name: "Ananya Iyer", niche: "Photography", followers: "540K" },
  { name: "Diego Martinez", niche: "Comedy", followers: "1.5M" },
  { name: "Riya Malhotra", niche: "Business & Finance", followers: "320K" },
  { name: "Sam Torres", niche: "Sports", followers: "890K" },
  { name: "Neha Verma", niche: "Education", followers: "410K" },
  { name: "Kai Nakamura", niche: "Gaming", followers: "2.2M" },
  { name: "Ishaan Bhatt", niche: "Tech", followers: "760K" },
  { name: "Sofia Reyes", niche: "Fashion", followers: "3.4M" },
  { name: "Arjun Nair", niche: "Travel", followers: "1.1M" },
];

// ─── Procedural avatar texture (no pink/purple — lime/black/gray only) ──────

function useAvatarTexture(seed: number, initial: string): THREE.CanvasTexture {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#d4ff4f";
    const surface = styles.getPropertyValue("--bg-surface").trim() || "#1c1c1c";
    const borderStrong = styles.getPropertyValue("--border-strong").trim() || "#404040";

    const angle = (seed * 47) % 360;
    const rad = (angle * Math.PI) / 180;
    const x0 = size / 2 + Math.cos(rad) * size;
    const y0 = size / 2 + Math.sin(rad) * size;
    const x1 = size / 2 - Math.cos(rad) * size;
    const y1 = size / 2 - Math.sin(rad) * size;

    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(0, surface);
    gradient.addColorStop(0.55, borderStrong);
    gradient.addColorStop(1, seed % 3 === 0 ? accent : surface);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Faint diagonal texture lines for depth
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "#ffffff";
    for (let i = -size; i < size * 2; i += 18) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - size, size);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Initial letter
    ctx.font = "700 96px var(--font-inter), sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial.toUpperCase(), size / 2, size / 2 + 8);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [seed, initial]);
}

// ─── Individual floating card ───────────────────────────────────────────────

interface CardProps {
  creator: MockCreator;
  index: number;
  total: number;
  spread: React.MutableRefObject<number>;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
}

function FloatingCard({ creator, index, total, spread, hoveredIndex, setHoveredIndex }: CardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useAvatarTexture(index, creator.name.charAt(0));
  const accentHex = useMemo(
    () => (getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#d4ff4f"),
    []
  );

  // Clustered start position (near center) vs. distributed end position
  const startPos = useMemo(
    () => new THREE.Vector3((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1, 0),
    []
  );
  const endPos = useMemo(() => {
    const col = index % 5;
    const row = Math.floor(index / 5);
    return new THREE.Vector3(
      (col - 2) * 2.6 + (Math.random() - 0.5) * 0.4,
      (row - 1) * 2.2 + (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 1.2
    );
  }, [index]);

  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && !isHovered;

  useFrame((state) => {
    const g = groupRef.current;
    const m = materialRef.current;
    if (!g || !m) return;

    const t = state.clock.elapsedTime;
    const s = spread.current;

    const basePos = startPos.clone().lerp(endPos, s);
    // Gentle sine-wave drift, scaled down as cards cluster
    basePos.x += Math.sin(t * 0.4 + phase) * 0.12 * s;
    basePos.y += Math.cos(t * 0.35 + phase * 1.3) * 0.1 * s;
    basePos.z += Math.sin(t * 0.3 + phase * 0.7) * 0.15;

    g.position.lerp(basePos, 0.06);
    g.rotation.y = Math.sin(t * 0.25 + phase) * 0.15 * s;

    const targetScale = isHovered ? 1.25 : 1;
    g.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

    const targetOpacity = isDimmed ? 0.25 : 1;
    m.opacity = THREE.MathUtils.lerp(m.opacity, targetOpacity, 0.15);
  });

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredIndex(index);
        }}
        onPointerOut={() => setHoveredIndex(null)}
      >
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={1} />
      </mesh>

      {/* Lime glow ring — only visible while hovered */}
      <mesh position={[0, 0, -0.01]} visible={isHovered}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial color={accentHex} transparent opacity={0.35} />
      </mesh>

      <Html center distanceFactor={8} position={[0, -1.05, 0]} style={{ pointerEvents: "none" }}>
        <div
          className="whitespace-nowrap text-center transition-opacity duration-200"
          style={{ opacity: isDimmed ? 0.3 : 1 }}
        >
          <p className="font-display text-xs font-semibold text-(--text-primary)">{creator.name}</p>
          <p className="font-mono-utility text-[0.6rem] text-(--accent)">{creator.niche}</p>
          <p className="font-mono-utility text-[0.55rem] text-(--text-tertiary)">
            {creator.followers} FOLLOWERS
          </p>
        </div>
      </Html>
    </group>
  );
}

// ─── Scene: owns scroll-driven spread + camera ──────────────────────────────

function Scene({ creators, scrollProgress }: { creators: MockCreator[]; scrollProgress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const spread = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useFrame(() => {
    spread.current = THREE.MathUtils.lerp(spread.current, scrollProgress.current, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6 + spread.current * 2, 0.05);
  });

  return (
    <>
      {creators.map((creator, i) => (
        <FloatingCard
          key={creator.name}
          creator={creator}
          index={i}
          total={creators.length}
          spread={spread}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      ))}
    </>
  );
}

// ─── Static fallback (reduced motion / no-WebGL) ────────────────────────────

function StaticGrid({ creators }: { creators: MockCreator[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-16">
      {creators.map((creator) => (
        <div
          key={creator.name}
          className="rounded-xl border border-(--border) bg-(--bg-secondary) p-4 text-center card-hover"
        >
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-(--bg-surface) border border-(--border-strong) flex items-center justify-center font-display font-bold text-(--text-primary)">
            {creator.name.charAt(0)}
          </div>
          <p className="text-sm font-semibold text-(--text-primary) truncate">{creator.name}</p>
          <p className="font-mono-utility text-[0.6rem] text-(--accent) mt-1">{creator.niche}</p>
          <p className="font-mono-utility text-[0.55rem] text-(--text-tertiary) mt-0.5">
            {creator.followers}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────

export default function LiveCreatorFeed() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const scrollProgress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const spreadValue = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);

  useEffect(() => {
    const unsub = spreadValue.on("change", (v) => {
      scrollProgress.current = v;
    });
    return unsub;
  }, [spreadValue]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visibleCreators = useMemo(
    () => (isMobile ? CREATORS.slice(0, 6) : CREATORS),
    [isMobile]
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 bg-(--bg-primary) overflow-hidden"
      aria-label="Live creator feed"
    >
      <Container className="relative z-10 mb-16 text-center">
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            02 — LIVE CREATOR FEED
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 className="text-h1 font-display max-w-2xl mx-auto">
            10,000+ creators{" "}
            <span className="font-serif text-(--accent)">ready to collaborate.</span>
          </h2>
        </RevealOnScroll>
      </Container>

      {reducedMotion ? (
        <Container>
          <StaticGrid creators={visibleCreators} />
        </Container>
      ) : (
        <div className="relative h-[70vh] min-h-[420px] w-full">
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: "low-power" }}
          >
            <Scene creators={visibleCreators} scrollProgress={scrollProgress} />
          </Canvas>
        </div>
      )}
    </section>
  );
}
