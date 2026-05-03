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

// ─── Wireframe mesh ───────────────────────────────────────────────────────────

function WireframeMesh({ shape }: { shape: "icosahedron" | "torusKnot" }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.07;
    ref.current.rotation.y += delta * 0.11;
  });

  return (
    <mesh ref={ref}>
      {shape === "icosahedron" ? (
        <icosahedronGeometry args={[2.4, 1]} />
      ) : (
        <torusKnotGeometry args={[1.6, 0.45, 64, 7]} />
      )}
      <meshBasicMaterial
        color="#d4ff4f"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

// ─── Particle field ───────────────────────────────────────────────────────────

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
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
  }, []);

  useFrame((_, delta) => {
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

function Scene({ shape }: { shape: "icosahedron" | "torusKnot" }) {
  return (
    <>
      <WireframeMesh shape={shape} />
      <ParticleField />
    </>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

interface AuthBackgroundProps {
  shape?: "icosahedron" | "torusKnot";
}

export default function AuthBackground({
  shape = "icosahedron",
}: AuthBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

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
          dpr={[1, 1.5]}
          style={{ position: "absolute", inset: 0 }}
        >
          <Scene shape={shape} />
        </Canvas>
      </Suspense>
    </div>
  );
}
