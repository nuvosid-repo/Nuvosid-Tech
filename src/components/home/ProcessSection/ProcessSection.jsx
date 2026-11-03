"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/animations";
import { processSteps } from "@/data/process";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/animations/FadeIn";
import Icon from "@/components/ui/Icon";
import "./ProcessSection.scss";

/**
 * Interactive timeline: the connecting line fills as you scroll and each
 * step lights up when the line reaches it. Horizontal on desktop,
 * vertical on mobile (the same CSS var drives both).
 */
export default function ProcessSection() {
  const root = useRef(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray(".process__step");
      const setActive = (p) => {
        const idx = Math.min(steps.length - 1, Math.floor(p * steps.length + 0.15));
        steps.forEach((s, i) => {
          s.classList.toggle("is-active", i <= idx && p > 0.02);
          s.classList.toggle("is-current", i === idx && p > 0.02);
        });
      };

      const reduce = window.matchMedia(MQ.reduce).matches;
      if (reduce) {
        root.current.style.setProperty("--progress", 1);
        steps.forEach((s) => s.classList.add("is-active"));
        return;
      }

      const st = ScrollTrigger.create({
        trigger: ".process__track",
        start: "top 75%",
        end: () => (window.matchMedia(MQ.desktop).matches ? "bottom 45%" : "bottom 60%"),
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          root.current.style.setProperty("--progress", self.progress.toFixed(4));
          setActive(self.progress);
        },
      });
      return () => st.kill();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="process section" aria-labelledby="process-title">
      <div className="container">
        <div className="row g-4 align-items-end">
          <div className="col-lg-7">
            <SectionHeading
              id="process-title"
              eyebrow="Development Methodology"
              size="md"
              segments={[{ text: "From idea" }, { text: "to impact.", highlight: true }]}
            />
          </div>
          <div className="col-lg-5">
            <FadeIn as="p" className="lead-c">
              A proven six-phase process that keeps every project transparent, on schedule and focused on outcomes.
            </FadeIn>
          </div>
        </div>

        <div className="process__track">
          <div className="process__line" aria-hidden="true">
            <span />
          </div>
          <FadeIn as="ol" className="process__steps" stagger={0.08}>
            {processSteps.map((step) => (
              <li key={step.index} className="process__step">
                <span className="process__dot" aria-hidden="true" />
                <div className="process__card surface">
                  <div className="process__head">
                    <span className="process__phase mono">Phase {step.index}</span>
                    <span className="process__icon">
                      <Icon name={step.icon} />
                    </span>
                  </div>
                  <h3 className="process__title">{step.title}</h3>
                  <p className="process__text">{step.text}</p>
                  <p className="process__output mono">
                    <span>Output</span> {step.output}
                  </p>
                </div>
              </li>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
