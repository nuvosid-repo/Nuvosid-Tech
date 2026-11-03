"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, NormalBlending } from "three";

// Small seeded PRNG keeps the particle layout pure/deterministic per render.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSprite() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(c);
}

/** Soft drifting particle field (count is capped by the caller per device). */
export default function FloatingParticles({ count = 500, radius = 7, pointer, theme = "dark", size = 0.05 }) {
  const ref = useRef(null);
  const light = theme === "light";

  const positions = useMemo(() => {
    const random = mulberry32(count * 31 + Math.round(radius * 100));
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + random() * 0.65);
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.4;
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
      arr[i * 3 + 2] = r * Math.cos(phi) * 0.6;
    }
    return arr;
  }, [count, radius]);

  const sprite = useMemo(() => (typeof document !== "undefined" ? makeSprite() : null), []);
  useEffect(() => () => sprite?.dispose(), [sprite]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += delta * 0.02;
    p.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05 + (pointer?.current.y ?? 0) * 0.04;
    p.position.x += ((pointer?.current.x ?? 0) * 0.3 - p.position.x) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={sprite}
        color={light ? "#00A982" : "#65F0C5"}
        transparent
        opacity={light ? 0.55 : 0.8}
        depthWrite={false}
        sizeAttenuation
        blending={light ? NormalBlending : AdditiveBlending}
      />
    </points>
  );
}
