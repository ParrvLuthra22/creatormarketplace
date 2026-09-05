"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Fallback gradient (no WebGL) ────────────────────────────────────────────

function FallbackBg() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 60% at 60% 50%, rgba(212,255,79,0.04) 0%, transparent 70%)",
      }}
      aria-hidden
    />
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/** Caps a useFrame callback to ~targetFps — cheap mobile GPU/battery guard. */
function useFrameCapped(targetFps: number, cb: (state: Parameters<Parameters<typeof useFrame>[0]>[0], delta: number) => void) {
  const last = useRef(0);
  const interval = 1 / targetFps;
  useFrame((state, delta) => {
    last.current += delta;
    if (last.current < interval) return;
    cb(state, last.current);
    last.current = 0;
  });
}

// ─── Wireframe mesh ───────────────────────────────────────────────────────────

type Shape = "icosahedron" | "torusKnot" | "distortedSphere";

function WireframeMesh({ shape, isMobile }: { shape: Shape; isMobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const fps = isMobile ? 30 : 60;

  useFrameCapped(fps, (_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.07;
    ref.current.rotation.y += delta * 0.11;
  });

  return (
    <mesh ref={ref}>
      {shape === "icosahedron" && <icosahedronGeometry args={[2.4, 1]} />}
      {shape === "torusKnot" && <torusKnotGeometry args={[1.6, 0.45, 64, 7]} />}
      {shape === "distortedSphere" && <icosahedronGeometry args={[2.2, isMobile ? 2 : 4]} />}
      <meshBasicMaterial
        color="#d4ff4f"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

/** Sphere geometry perturbed per-vertex along its normal — reads as an organic, "distorted" blob. */
function DistortedSphereMesh({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const fps = isMobile ? 30 : 60;

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.2, isMobile ? 2 : 4);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const noise = 0.18 * Math.sin(v.x * 2.3) * Math.cos(v.y * 1.7) * Math.sin(v.z * 2.1);
      v.multiplyScalar(1 + noise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [isMobile]);

  useFrameCapped(fps, (_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.06;
    ref.current.rotation.y += delta * 0.09;
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial color="#d4ff4f" wireframe transparent opacity={0.14} />
    </mesh>
  );
}

// ─── Particle field ───────────────────────────────────────────────────────────

function ParticleField({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const count = isMobile ? 60 : 200;
  const fps = isMobile ? 30 : 60;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a shell around the scene
      const r = 5 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrameCapped(fps, (_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.025;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.18}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ shape, isMobile }: { shape: Shape; isMobile: boolean }) {
  return (
    <>
      {shape === "distortedSphere" ? (
        <DistortedSphereMesh isMobile={isMobile} />
      ) : (
        <WireframeMesh shape={shape} isMobile={isMobile} />
      )}
      <ParticleField isMobile={isMobile} />
    </>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

interface AuthBackgroundProps {
  shape?: Shape;
}

export default function AuthBackground({
  shape = "icosahedron",
}: AuthBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted || !hasWebGL) return <FallbackBg />;

  return (
    <div className="absolute inset-0" aria-hidden>
      <Suspense fallback={<FallbackBg />}>
        <Canvas
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "low-power",
          }}
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={isMobile ? 1 : [1, 1.5]}
          style={{ position: "absolute", inset: 0 }}
        >
          <Scene shape={shape} isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </div>
  );
}
