"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animations";
import { useApp } from "@/context/AppContext";
import Logo from "@/components/common/Logo/Logo";
import "./Preloader.scss";

/** Short branded intro: logo, counter, progress bar → wipes up into the page. */
export default function Preloader() {
  const { setLoaded } = useApp();
  const [done, setDone] = useState(false);
  const root = useRef(null);
  const countRef = useRef(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      html.classList.add("is-locked");
      const finish = () => {
        html.classList.remove("is-locked");
        setLoaded(true);
        setDone(true);
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: finish });
        return;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".preloader__logo", { y: 30, autoAlpha: 0, duration: 0.8 })
        .from(".preloader__tagline span", { yPercent: 100, duration: 0.8, stagger: 0.08 }, "<0.1")
        .to(
          counter,
          {
            v: 100,
            duration: 1.3,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.2
        )
        .fromTo(".preloader__bar span", { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0.2)
        .to(".preloader__inner", { y: -40, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "+=0.1")
        // Release the page slightly before the wipe ends so the hero intro overlaps it.
        .add(() => setLoaded(true), "-=0.05")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" })
        .add(finish);
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div ref={root} className="preloader" role="status" aria-live="polite" aria-label="Loading NUVOSID TECH">
      <div className="preloader__glow" aria-hidden="true" />
      <div className="preloader__inner">
        <div className="preloader__logo">
          <Logo priority />
        </div>
        <p className="preloader__tagline" aria-hidden="true">
          {["THINK SUCCESS.", "THINK GROWTH.", "THINK NUVOSID."].map((t) => (
            <span key={t}>
              <span>{t}</span>
            </span>
          ))}
        </p>
        <div className="preloader__meta">
          <span className="preloader__bar">
            <span />
          </span>
          <span className="preloader__count mono" ref={countRef}>
            000
          </span>
        </div>
      </div>
    </div>
  );
}
