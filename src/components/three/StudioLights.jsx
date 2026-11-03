"use client";

import { Environment, Lightformer } from "@react-three/drei";

/** Procedural studio environment (no external HDR download). */
export default function StudioLights({ theme = "dark" }) {
  const light = theme === "light";
  return (
    <>
      <ambientLight intensity={light ? 0.9 : 0.25} />
      <directionalLight position={[4, 6, 5]} intensity={light ? 2.2 : 1.6} />
      <pointLight position={[-4, -2, 3]} color="#00D6A0" intensity={light ? 18 : 40} distance={14} />
      <pointLight position={[4, -3, -2]} color="#C7F36B" intensity={light ? 8 : 18} distance={12} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={light ? 3 : 2.5} color="#65F0C5" position={[0, 5, -6]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[-6, 1, 1]} rotation-y={Math.PI / 2} scale={[2, 8, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#20D6B5" position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[3, 8, 1]} />
        <Lightformer form="ring" intensity={3} color="#C7F36B" position={[3, 3, 5]} scale={2.5} />
        <Lightformer form="circle" intensity={2} color="#00A982" position={[-3, -4, 4]} scale={3} />
      </Environment>
    </>
  );
}
