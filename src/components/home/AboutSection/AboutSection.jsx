"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/animations";
import { aboutStats } from "@/data/stats";
import { cx, formatNumber } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import "./AboutSection.scss";

const display = (s, v) => `${s.prefix || ""}${formatNumber(v, s.decimals || 0)}${s.suffix || ""}`;

export default function AboutSection() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set(".about__stat", { autoAlpha: 1 });
        gsap.from(".about__stat", {
          y: 60,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.12,
          clearProps: "transform",
          scrollTrigger: { trigger: ".about__stats", start: "top 80%", once: true },
        });

        root.current.querySelectorAll(".about__stat").forEach((card, i) => {
          const s = aboutStats[i];
          const valueEl = card.querySelector(".about__value-num");
          const meter = card.querySelector(".meter span");
          const obj = { v: 0 };
          gsap.to(obj, {
            v: s.value,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
            onUpdate: () => (valueEl.textContent = display(s, obj.v)),
          });
          gsap.fromTo(
            meter,
            { scaleX: 0 },
            { scaleX: s.meter, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 85%", once: true } }
          );
        });

        // Decorative orbit drifts with scroll
        gsap.to(".about__orbit", {
          rotate: 120,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="about section section--alt" aria-labelledby="about-title">
      <div className="about__orbit" aria-hidden="true" />
      <div className="container">
        <div className="row g-5">
          {/* Sticky storytelling column */}
          <div className="col-lg-5">
            <div className="about__sticky">
              <SectionHeading
                id="about-title"
                eyebrow="Who We Are"
                size="md"
                segments={[{ text: "Engineering at", break: true }, { text: "the speed of", break: true }, { text: "imagination.", highlight: true }]}
              />
              <div className="about__copy">
                <p className="lead-c">
                  NUVOSID TECH is a technology partner for founders, startups and growing enterprises. We combine
                  product thinking, design craft and modern engineering to build digital products that perform
                  beautifully at scale.
                </p>
                <p className="lead-c">
                  From the first workshop to post-launch optimisation, our team works as an extension of yours —
                  transparent, accountable and obsessed with quality.
                </p>
                <Button href="/#services" variant="ghost" size="sm" icon="arrow-right" className="mt-2">
                  Explore Services
                </Button>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="about__stats">
              {aboutStats.map((s) => (
                <article key={s.title} className={cx("about__stat surface surface--hover", `is-${s.tone}`)} data-reveal="">
                  <header className="about__stat-head">
                    <span className="about__stat-eyebrow mono">{s.eyebrow}</span>
                    <span className="about__stat-icon">
                      <Icon name={s.icon} />
                    </span>
                  </header>
                  <p className="about__value">
                    <span className="about__value-num">{display(s, s.value)}</span>
                    {s.affix && <span className="about__value-affix">{s.affix}</span>}
                  </p>
                  <h3 className="about__stat-title">{s.title}</h3>
                  <p className="about__stat-text">{s.text}</p>
                  <div className={cx("meter", s.tone === "lime" && "meter--lime")}>
                    <span style={{ transform: `scaleX(${s.meter})` }} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
