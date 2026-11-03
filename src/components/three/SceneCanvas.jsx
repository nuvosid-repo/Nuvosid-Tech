"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";

/**
 * Shared R3F canvas wrapper:
 *  - mounts WebGL only when the host scrolls near the viewport
 *  - pauses the render loop when off-screen (frameloop "never")
 *  - caps DPR on small screens and for reduced motion renders on demand
 */
export default function SceneCanvas({ children, className, camera, dprMax = 2, rootMargin = "200px", ...rest }) {
  const host = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [env, setEnv] = useState({ reduce: false, dpr: 1.5 });

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767.98px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read client-only media features once
    setEnv({ reduce, dpr: Math.min(window.devicePixelRatio || 1, small ? 1.5 : dprMax) });

    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin }
    );
    io.observe(host.current);
    return () => io.disconnect();
  }, [dprMax, rootMargin]);

  const frameloop = env.reduce ? "demand" : visible ? "always" : "never";

  return (
    <div ref={host} className={className} aria-hidden="true">
      {mounted && (
        <Canvas
          dpr={[1, env.dpr]}
          camera={camera || { position: [0, 0, 6], fov: 35 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={frameloop}
          style={{ pointerEvents: "none" }}
          {...rest}
        >
          <AdaptiveDpr pixelated={false} />
          {children}
        </Canvas>
      )}
    </div>
  );
}
