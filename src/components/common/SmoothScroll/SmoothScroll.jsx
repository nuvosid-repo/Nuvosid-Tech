"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { useApp } from "@/context/AppContext";

/**
 * Lenis smooth scrolling synced with GSAP's ticker + ScrollTrigger.
 * - Disabled when the user prefers reduced motion.
 * - Touch devices keep native scrolling (syncTouch: false).
 */
export default function SmoothScroll() {
  const { lenisRef, loaded, scrollTo } = useApp();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lenisRef]);

  // Lock scrolling while the preloader is visible; then honour any URL hash.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!loaded) {
      lenis?.stop();
      return;
    }
    lenis?.start();
    ScrollTrigger.refresh();
    const id = window.location.hash.slice(1);
    if (id) {
      const el = document.getElementById(id);
      if (el) window.setTimeout(() => scrollTo(el, { immediate: true }), 50);
    }
  }, [loaded, lenisRef, scrollTo]);

  return null;
}
