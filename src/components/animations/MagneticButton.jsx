"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animations";

/**
 * Wraps an interactive element and pulls it toward the pointer.
 * Disabled on touch devices and for reduced motion.
 */
export default function MagneticButton({ children, strength = 0.35, className, as: Tag = "span" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!canHover || reduce) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

      const move = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} style={{ display: "inline-flex" }}>
      {children}
    </Tag>
  );
}
