"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations";

/**
 * Soft follower ring for fine pointers. The native cursor is kept for
 * accessibility; the ring only adds feedback and enlarges over interactive elements.
 */
export default function CustomCursor() {
  const ring = useRef(null);
  const dot = useRef(null);

  useGSAP(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const r = ring.current;
    const d = dot.current;
    gsap.set([r, d], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });
    const dx = gsap.quickTo(d, "x", { duration: 0.1 });
    const dy = gsap.quickTo(d, "y", { duration: 0.1 });

    let shown = false;
    const move = (e) => {
      if (!shown) {
        gsap.to([r, d], { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };
    const over = (e) => {
      const interactive = e.target.closest("a, button, [role='tab'], input, label");
      r.classList.toggle("is-hover", Boolean(interactive));
    };
    const leave = () => {
      gsap.to([r, d], { autoAlpha: 0, duration: 0.3 });
      shown = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
