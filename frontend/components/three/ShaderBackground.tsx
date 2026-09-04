"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Full-viewport animated gradient-noise shader plane.
 * Colors are read from the page's own CSS custom properties at mount time
 * (--bg-primary / --accent) rather than hardcoded, so it always tracks the
 * design system in globals.css instead of duplicating color values.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorBg;
  uniform vec3 uColorAccent;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y) * 2.4;

    float n1 = fbm(p + uTime * 0.045);
    float n2 = fbm(p * 1.6 - uTime * 0.03 + 11.0);
    float glow = smoothstep(0.35, 0.85, n1 * n2 * 1.3);

    vec3 color = mix(uColorBg, uColorAccent, glow * 0.22);

    /* soft vignette so the corners stay near-black */
    float vig = smoothstep(1.15, 0.25, distance(uv, vec2(0.5)));
    color = mix(uColorBg * 0.6, color, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex.trim());
  return new THREE.Vector3(c.r, c.g, c.b);
}

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    const bg = styles.getPropertyValue("--bg-primary") || "#0a0a0a";
    const accent = styles.getPropertyValue("--accent") || "#d4ff4f";

    return {
      uTime: { value: 0 },
      uColorBg: { value: hexToVec3(bg) },
      uColorAccent: { value: hexToVec3(accent) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 100, position: [0, 0, 1] }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "low-power" }}
      className="!absolute inset-0"
      aria-hidden
    >
      <ShaderPlane />
    </Canvas>
  );
}
