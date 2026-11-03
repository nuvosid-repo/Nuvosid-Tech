"use client";

// Central GSAP setup — register plugins once and share defaults/presets.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };

export const EASE = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "power2.inOut",
};

// Responsive / reduced-motion conditions for gsap.matchMedia()
export const MQ = {
  desktop: "(min-width: 992px)",
  mobile: "(max-width: 991.98px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
};

// Default ScrollTrigger start for section reveals
export const REVEAL_START = "top 82%";

/** Fade + rise a set of elements when `trigger` enters the viewport. */
export function revealOnScroll(targets, { trigger, stagger = 0.08, y = 40, start = REVEAL_START, delay = 0 } = {}) {
  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      stagger,
      delay,
      ease: EASE.out,
      scrollTrigger: { trigger: trigger || targets, start, once: true },
    }
  );
}

/** Animate a number inside an element from 0 → value. */
export function countUp(el, value, { decimals = 0, duration = 1.8, trigger, prefix = "", suffix = "" } = {}) {
  const obj = { v: 0 };
  return gsap.to(obj, {
    v: value,
    duration,
    ease: "power2.out",
    scrollTrigger: trigger ? { trigger, start: REVEAL_START, once: true } : undefined,
    onUpdate: () => {
      el.textContent = `${prefix}${obj.v.toFixed(decimals)}${suffix}`;
    },
  });
}
