"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations";

/** Thin emerald bar at the very top showing page scroll progress. */
export default function ScrollProgress() {
  const bar = useRef(null);

  useGSAP(() => {
    const setX = gsap.quickSetter(bar.current, "scaleX");
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setX(self.progress),
    });
    return () => st.kill();
  });

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}
