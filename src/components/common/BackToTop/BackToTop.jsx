"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations";
import { useApp } from "@/context/AppContext";
import Icon from "@/components/ui/Icon";

export default function BackToTop() {
  const ref = useRef(null);
  const ring = useRef(null);
  const { scrollTo } = useApp();

  useGSAP(() => {
    const circumference = 2 * Math.PI * 20;
    gsap.set(ring.current, { strokeDasharray: circumference, strokeDashoffset: circumference });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        ring.current.style.strokeDashoffset = String(circumference * (1 - self.progress));
        ref.current.classList.toggle("is-visible", self.scroll() > window.innerHeight * 0.8);
      },
    });
    return () => st.kill();
  });

  return (
    <button
      ref={ref}
      type="button"
      className="back-to-top"
      onClick={() => {
        scrollTo(0);
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      aria-label="Back to top"
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="20" className="back-to-top__track" />
        <circle ref={ring} cx="24" cy="24" r="20" className="back-to-top__ring" />
      </svg>
      <Icon name="arrow-up" />
    </button>
  );
}
