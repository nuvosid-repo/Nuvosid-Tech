"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations";
import { technologies } from "@/data/technologies";
import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import "./TechnologySection.scss";

function Track({ items, hidden }) {
  return (
    <ul className="tech__group" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t.name} className="tech__item">
          <span className="tech__logo">
            <Icon name={t.icon} />
          </span>
          <span className="tech__name">{t.name}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Seamless infinite marquee: the list is rendered twice and the track is
 * moved by exactly -50%, so the loop point is invisible. Scroll velocity
 * briefly speeds it up; hover/focus and off-screen pause it.
 */
export default function TechnologySection() {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const loop = gsap.to(track.current, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });

      const boost = gsap.quickTo(loop, "timeScale", { duration: 0.6, ease: "power2.out" });
      let hovering = false;
      const settle = gsap.delayedCall(0.2, () => !hovering && boost(1)).pause();
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
        onUpdate: (self) => {
          if (hovering) return;
          const v = Math.min(Math.abs(self.getVelocity()) / 400, 4);
          boost(1 + v);
          settle.restart(true);
        },
      });

      const el = root.current.querySelector(".tech__marquee");
      const pause = () => {
        hovering = true;
        boost(0.0001);
      };
      const play = () => {
        hovering = false;
        boost(1);
      };
      el.addEventListener("pointerenter", pause);
      el.addEventListener("pointerleave", play);
      el.addEventListener("focusin", pause);
      el.addEventListener("focusout", play);
      return () => {
        st.kill();
        settle.kill();
        el.removeEventListener("pointerenter", pause);
        el.removeEventListener("pointerleave", play);
        el.removeEventListener("focusin", pause);
        el.removeEventListener("focusout", play);
      };
    },
    { scope: root }
  );

  return (
    <section className="tech section--alt" ref={root} aria-labelledby="tech-title">
      <div className="container">
        <SectionHeading
          id="tech-title"
          align="center"
          size="sm"
          eyebrow="Our Technology Stack"
          segments={[{ text: "Powered by technology." }, { text: "Driven by innovation.", highlight: true }]}
        />
      </div>
      <div className="tech__marquee" tabIndex={0} aria-label="Technologies we use (hover or focus to pause)">
        <div className="tech__track" ref={track}>
          <Track items={technologies} />
          <Track items={technologies} hidden />
        </div>
      </div>
    </section>
  );
}
