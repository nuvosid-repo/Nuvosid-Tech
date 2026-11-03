"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { AdditiveBlending, Color, MathUtils, NormalBlending } from "three";

/**
 * Hero centrepiece — "Digital Core".
 * A breathing sphere of emerald particles (custom shader) around a slowly
 * counter-rotating wireframe crystal, with two fine orbit rings.
 *  - particles gather from a scattered cloud on intro (introRef 0 → 1)
 *  - eases toward the pointer, ripples subtly
 *  - disperses outward as the hero scrolls away (scrollRef 0 → 1)
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uScroll;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uRadius;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  attribute float aRandom;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 n = normalize(position);
    float wave = sin(n.y * 5.0 + uTime * 0.9) * 0.5 + sin(n.x * 4.0 - uTime * 0.7 + n.z * 3.0) * 0.5;
    vec3 onSphere = n * uRadius * (1.0 + wave * 0.035 + (aRandom - 0.5) * 0.04);
    vec3 scattered = n * uRadius * (2.6 + aRandom * 2.4);
    float intro = smoothstep(0.0, 1.0, clamp(uIntro * 1.15 - aRandom * 0.15, 0.0, 1.0));
    vec3 p = mix(scattered, onSphere, intro);
    p += n * uScroll * uRadius * (0.4 + aRandom * 1.2);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRandom * 0.9) / -mv.z;

    // Depth cue: points on the far side of the sphere are dimmer
    vec4 centre = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    float facing = clamp((mv.z - centre.z) / uRadius, -1.0, 1.0);
    vAlpha = (0.18 + 0.82 * smoothstep(-1.0, 0.9, facing)) * (0.35 + 0.65 * intro) * (1.0 - uScroll * 0.6);

    vColor = mix(uColorA, uColorB, n.y * 0.5 + 0.5);
    vColor = mix(vColor, uColorC, step(0.94, aRandom));
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
  }
`;

const PALETTE = {
  dark: { a: "#00A982", b: "#65F0C5", c: "#C7F36B", line: "#65F0C5", wire: "#20D6B5", opacity: 1 },
  light: { a: "#00876A", b: "#00A982", c: "#7FAF1F", line: "#00A982", wire: "#00876A", opacity: 0.95 },
};

function fibonacciSphere(count, seed = 7) {
  const pos = new Float32Array(count * 3);
  const rnd = new Float32Array(count);
  let s = seed;
  const random = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pos[i * 3] = Math.cos(t) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(t) * r;
    rnd[i] = random();
  }
  return { pos, rnd };
}

function ring(radius, segments = 160) {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return [Math.cos(a) * radius, 0, Math.sin(a) * radius];
  });
}

export default function AbstractObject({
  pointer,
  scrollRef,
  introRef,
  theme = "dark",
  count = 3200,
  radius = 1.05,
  position = [0, -0.6, 0],
}) {
  const group = useRef(null);
  const shell = useRef(null);
  const crystal = useRef(null);
  const ringA = useRef(null);
  const ringB = useRef(null);
  const dotA = useRef(null);
  const dotB = useRef(null);
  const material = useRef(null);
  const dpr = useThree((s) => s.viewport.dpr);
  const light = theme === "light";
  const pal = light ? PALETTE.light : PALETTE.dark;

  const { pos, rnd } = useMemo(() => fibonacciSphere(count), [count]);
  const ringPtsA = useMemo(() => ring(radius * 1.28), [radius]);
  const ringPtsB = useMemo(() => ring(radius * 1.48), [radius]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uScroll: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: 1 },
      uRadius: { value: radius },
      uOpacity: { value: 1 },
      uColorA: { value: new Color() },
      uColorB: { value: new Color() },
      uColorC: { value: new Color() },
    }),
    [radius]
  );


  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = scrollRef?.current ?? 0;
    const intro = introRef?.current?.value ?? 1;
    const g = group.current;
    const u = material.current?.uniforms;
    if (!g || !u) return;

    // Theme colours + DPR (cheap; keeps material stable across theme switches)
    u.uColorA.value.set(pal.a);
    u.uColorB.value.set(pal.b);
    u.uColorC.value.set(pal.c);
    u.uOpacity.value = pal.opacity;
    u.uPixelRatio.value = dpr;
    u.uTime.value = t;
    u.uIntro.value = MathUtils.damp(u.uIntro.value, intro, 2.5, delta);
    // Hold the sphere together through the stage; disperse only as the hero leaves
    u.uScroll.value = MathUtils.damp(u.uScroll.value, MathUtils.smoothstep(s, 0.45, 1), 4, delta);

    const px = pointer?.current.x ?? 0;
    const py = pointer?.current.y ?? 0;
    g.rotation.y = MathUtils.damp(g.rotation.y, px * 0.3, 2.5, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, -py * 0.18, 2.5, delta);
    g.position.y = MathUtils.damp(g.position.y, position[1] + Math.sin(t * 0.5) * 0.04, 3, delta);

    if (shell.current) shell.current.rotation.y += delta * 0.06;
    if (crystal.current) {
      crystal.current.rotation.y -= delta * 0.22;
      crystal.current.rotation.x = Math.sin(t * 0.3) * 0.25;
      const cs = u.uIntro.value;
      crystal.current.scale.setScalar(0.001 + cs * (1 + Math.sin(t * 1.4) * 0.03));
    }
    if (ringA.current) ringA.current.rotation.y += delta * 0.12;
    if (ringB.current) ringB.current.rotation.y -= delta * 0.08;
    const ra = radius * 1.28;
    const rb = radius * 1.48;
    if (dotA.current) dotA.current.position.set(Math.cos(t * 0.6) * ra, 0, Math.sin(t * 0.6) * ra);
    if (dotB.current) dotB.current.position.set(Math.cos(-t * 0.4 + 2) * rb, 0, Math.sin(-t * 0.4 + 2) * rb);
  });

  const ringOpacity = light ? 0.32 : 0.22;

  return (
    <group ref={group} position={position}>
      {/* Particle shell */}
      <points ref={shell}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[rnd, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={light ? NormalBlending : AdditiveBlending}
        />
      </points>

      {/* Inner wireframe crystal */}
      <mesh ref={crystal} scale={0.001}>
        <icosahedronGeometry args={[radius * 0.42, 1]} />
        <meshBasicMaterial color={pal.wire} wireframe transparent opacity={light ? 0.55 : 0.45} />
      </mesh>
      {/* Bright energy core */}
      <mesh>
        <sphereGeometry args={[radius * 0.07, 24, 24]} />
        <meshBasicMaterial color={light ? pal.a : pal.c} />
      </mesh>

      {/* Orbit rings */}
      <group rotation={[1.25, 0, 0.35]}>
        <group ref={ringA}>
          <Line points={ringPtsA} color={pal.line} lineWidth={1} transparent opacity={ringOpacity} />
        </group>
        <mesh ref={dotA}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={pal.b} />
        </mesh>
      </group>
      <group rotation={[1.45, 0, -0.5]}>
        <group ref={ringB}>
          <Line points={ringPtsB} color={pal.line} lineWidth={1} transparent opacity={ringOpacity * 0.6} dashed dashSize={0.08} gapSize={0.06} />
        </group>
        <mesh ref={dotB}>
          <sphereGeometry args={[0.028, 16, 16]} />
          <meshBasicMaterial color={pal.c} />
        </mesh>
      </group>
    </group>
  );
}
