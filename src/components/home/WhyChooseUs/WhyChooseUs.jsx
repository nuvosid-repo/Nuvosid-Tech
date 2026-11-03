"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/animations";
import { features } from "@/data/features";
import { cx } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import "./WhyChooseUs.scss";

export default function WhyChooseUs() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray(".why__row").forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } });
          tl.set(row, { autoAlpha: 1 })
            .fromTo(row.querySelector(".why__rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" })
            .from(row.querySelector(".why__num"), { yPercent: 100, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 0.25)
            .from(row.querySelectorAll(".why__title, .why__subtitle, .why__text"), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.9 }, 0.35)
            .fromTo(row.querySelector(".why__accent"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.out" }, 0.6);
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="why section section--alt" aria-labelledby="why-title">
      <div className="container">
        <SectionHeading
          id="why-title"
          eyebrow="Why Partner With Us"
          size="md"
          segments={[{ text: "Why choose" }, { text: "Nuvosid Tech.", highlight: true }]}
        />
        <ol className="why__list">
          {features.map((f) => (
            <li key={f.index} className={cx("why__row", `is-${f.tone}`)} data-reveal="">
              <span className="why__rule" aria-hidden="true" />
              <span className="why__num" aria-hidden="true">
                {f.index}
              </span>
              <div className="why__heading">
                <h3 className="why__title">{f.title}</h3>
                <p className="why__subtitle mono">{f.subtitle}</p>
                <span className="why__accent" aria-hidden="true" />
              </div>
              <p className="why__text">{f.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
