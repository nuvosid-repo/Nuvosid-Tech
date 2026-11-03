"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { MathUtils } from "three";
import { useTheme } from "@/hooks/useTheme";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SceneCanvas from "./SceneCanvas";
import StudioLights from "./StudioLights";
import FloatingParticles from "./FloatingParticles";
import { usePointer } from "./usePointer";

// Layouts: objects are spread around the centred headline.
const LAYOUTS = {
  innovation: [
    { geo: "ico", pos: [-4.3, 1.2, -0.5], scale: 0.95, color: "#00D6A0" },
    { geo: "knot", pos: [4.2, -1.2, -0.8], scale: 0.6, color: "#20D6B5" },
    { geo: "octa", pos: [-3, -2.1, 0.6], scale: 0.55, color: "#C7F36B" },
    { geo: "torus", pos: [3.9, 2.1, -1.4], scale: 0.55, color: "#65F0C5" },
    { geo: "dodeca", pos: [0.4, -2.9, -2.2], scale: 0.4, color: "#00A982" },
  ],
  cta: [
    { geo: "torus", pos: [-4.4, -0.6, -1], scale: 0.7, color: "#65F0C5" },
    { geo: "ico", pos: [4.5, -0.9, -0.6], scale: 0.75, color: "#00D6A0" },
    { geo: "octa", pos: [3.6, 2.5, -2], scale: 0.38, color: "#C7F36B" },
    { geo: "dodeca", pos: [-3.2, 2.3, -1.5], scale: 0.34, color: "#20D6B5" },
  ],
};

function Geometry({ type }) {
  switch (type) {
    case "knot":
      return <torusKnotGeometry args={[0.8, 0.26, 160, 24]} />;
    case "octa":
      return <octahedronGeometry args={[1, 0]} />;
    case "torus":
      return <torusGeometry args={[0.9, 0.32, 32, 96]} />;
    case "dodeca":
      return <dodecahedronGeometry args={[1, 0]} />;
    default:
      return <icosahedronGeometry args={[1, 1]} />;
  }
}

function GlassShape({ geo, pos, scale, color, index, progressRef, light }) {
  const ref = useRef(null);
  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    const p = progressRef?.current ?? 0.5;
    m.rotation.x += delta * (0.15 + index * 0.03);
    m.rotation.y += delta * 0.2;
    // Scroll-controlled spread + depth
    const spread = 0.9 + p * 0.2;
    m.position.x = MathUtils.damp(m.position.x, pos[0] * spread, 3, delta);
    m.position.y = MathUtils.damp(m.position.y, pos[1] + (p - 0.5) * (index % 2 ? 1.4 : -1.4), 3, delta);
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={pos} scale={scale}>
        <Geometry type={geo} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.12}
          metalness={light ? 0.1 : 0.25}
          transmission={0.55}
          thickness={1.2}
          ior={1.45}
          clearcoat={1}
          iridescence={0.8}
          iridescenceIOR={1.3}
          envMapIntensity={1.6}
          emissive={color}
          emissiveIntensity={light ? 0.04 : 0.14}
          flatShading={geo === "octa" || geo === "dodeca" || geo === "ico"}
        />
      </mesh>
    </Float>
  );
}

function Rig({ pointer, children }) {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = MathUtils.damp(ref.current.rotation.y, pointer.current.x * 0.18, 2, delta);
    ref.current.rotation.x = MathUtils.damp(ref.current.rotation.x, -pointer.current.y * 0.1, 2, delta);
  });
  return <group ref={ref}>{children}</group>;
}

/** Floating emerald glass geometry (Innovation + CTA sections). */
export default function InnovationScene({ variant = "innovation", progressRef, className }) {
  const { theme } = useTheme();
  const pointer = usePointer();
  const mobile = useMediaQuery("(max-width: 767.98px)");
  const light = theme === "light";
  const shapes = LAYOUTS[variant] || LAYOUTS.innovation;

  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, mobile ? 11 : 8], fov: 40 }} dprMax={1.75}>
      <StudioLights theme={theme} />
      <Rig pointer={pointer}>
        {(mobile ? shapes.slice(0, 3) : shapes).map((s, i) => (
          <GlassShape key={i} index={i} {...s} progressRef={progressRef} light={light} />
        ))}
      </Rig>
      <FloatingParticles count={mobile ? 80 : 220} radius={6} pointer={pointer} theme={theme} size={0.04} />
    </SceneCanvas>
  );
}
