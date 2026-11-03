"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/animations";
import RevealText from "@/components/animations/RevealText";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import "./InnovationSection.scss";

const InnovationScene = dynamic(() => import("@/components/three/InnovationScene"), { ssr: false });

export default function InnovationSection() {
  const root = useRef(null);
  const progressRef = useRef(0.5);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => (progressRef.current = self.progress),
      });
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        gsap.fromTo(
          ".innovation__content",
          { yPercent: 12 },
          { yPercent: -12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }
        );
        gsap.fromTo(
          ".innovation__halo",
          { scale: 0.6, autoAlpha: 0.3 },
          { scale: 1.15, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true } }
        );
      });
      return () => {
        st.kill();
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="innovation" aria-labelledby="innovation-title">
      <div className="innovation__halo" aria-hidden="true" />
      <InnovationScene className="innovation__canvas" progressRef={progressRef} />
      <div className="container innovation__content">
        <p className="eyebrow eyebrow--pill">Research &amp; Development</p>
        <RevealText
          id="innovation-title"
          className="display-lg innovation__title"
          segments={[{ text: "Imagination meets", break: true }, { text: "engineering.", highlight: true }]}
        />
        <FadeIn as="p" className="lead-c innovation__lead" delay={0.2}>
          We prototype with emerging technology — real-time 3D, AI and immersive interfaces — and engineer the ideas that
          prove themselves into reliable, production-grade products.
        </FadeIn>
        <FadeIn delay={0.35} className="innovation__cta">
          <Button href="/#contact">Start a Project</Button>
        </FadeIn>
      </div>
    </section>
  );
}
