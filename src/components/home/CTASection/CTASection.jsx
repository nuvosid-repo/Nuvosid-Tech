"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, MQ, useGSAP } from "@/lib/animations";
import { site } from "@/data/site";
import RevealText from "@/components/animations/RevealText";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import "./CTASection.scss";

const InnovationScene = dynamic(() => import("@/components/three/InnovationScene"), { ssr: false });

const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent("New project enquiry — NUVOSID TECH")}`;

export default function CTASection() {
  const root = useRef(null);
  const progressRef = useRef(0.5);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ".cta__panel",
          { clipPath: "inset(12% 8% 12% 8% round 48px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 32px)",
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 90%",
              end: "top 25%",
              scrub: true,
              onUpdate: (self) => (progressRef.current = self.progress),
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="contact" ref={root} className="cta" aria-labelledby="cta-title">
      <div className="container-fluid px-2 px-md-3">
        <div className="cta__panel">
          <div className="cta__bg" aria-hidden="true">
            <span className="cta__orb cta__orb--a" />
            <span className="cta__orb cta__orb--b" />
            <span className="cta__grid" />
          </div>
          <InnovationScene variant="cta" className="cta__canvas" progressRef={progressRef} />

          <div className="container cta__content">
            <p className="eyebrow eyebrow--pill">Let&apos;s Start a Conversation</p>
            <RevealText
              id="cta-title"
              className="display-lg cta__title"
              segments={[{ text: "Let's build something", break: true }, { text: "extraordinary.", highlight: true }]}
            />
            <FadeIn as="p" className="lead-c cta__lead" delay={0.15}>
              Have an idea, a product to scale or a platform to modernise? Tell us about it — we&apos;ll help you shape
              the next generation of your digital experience.
            </FadeIn>
            <FadeIn className="cta__actions" delay={0.3}>
              <Button href={mailto} icon="send">
                Start Your Project
              </Button>
              <Button href="/#work" variant="ghost" icon="arrow-up-right">
                Explore Our Work
              </Button>
            </FadeIn>
            <FadeIn as="p" className="cta__email mono" delay={0.4}>
              or write to <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
