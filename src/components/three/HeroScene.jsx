"use client";

import { useTheme } from "@/hooks/useTheme";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SceneCanvas from "./SceneCanvas";
import AbstractObject from "./AbstractObject";
import FloatingParticles from "./FloatingParticles";
import { usePointer } from "./usePointer";

/** Hero WebGL scene — loaded via next/dynamic (ssr: false). */
export default function HeroScene({ scrollRef, introRef, className }) {
  const { theme } = useTheme();
  const pointer = usePointer();
  const mobile = useMediaQuery("(max-width: 767.98px)");

  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, mobile ? 7.5 : 6.4], fov: 35 }} rootMargin="0px">
      <AbstractObject
        pointer={pointer}
        scrollRef={scrollRef}
        introRef={introRef}
        theme={theme}
        count={mobile ? 1400 : 3200}
        radius={mobile ? 0.78 : 1.05}
        position={mobile ? [0, -0.75, 0] : [0, -0.6, 0]}
      />
      <FloatingParticles count={mobile ? 90 : 220} pointer={pointer} theme={theme} size={0.035} />
    </SceneCanvas>
  );
}
