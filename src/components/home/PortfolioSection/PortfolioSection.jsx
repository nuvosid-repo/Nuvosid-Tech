"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/animations";
import { projects } from "@/data/projects";
import { cx } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { ProjectVisual } from "@/components/ui/Mockups";
import "./PortfolioSection.scss";

/**
 * Desktop: section pins and project panels travel horizontally with scroll.
 * Scroll distance is computed from the real track width (recomputed on refresh).
 * Mobile / reduced motion: panels simply stack vertically.
 */
export default function PortfolioSection() {
  const root = useRef(null);
  const track = useRef(null);
  const progress = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const distance = () => Math.max(0, track.current.scrollWidth - window.innerWidth);

        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
          },
        });

        // Image reveal + parallax inside each panel, driven by the horizontal tween
        gsap.utils.toArray(".work__panel").slice(1).forEach((panel) => {
          const visual = panel.querySelector(".work__visual-inner");
          gsap.fromTo(
            visual,
            { clipPath: "inset(0% 0% 0% 30% round 18px)", xPercent: 8 },
            {
              clipPath: "inset(0% 0% 0% 0% round 18px)",
              xPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 95%",
                end: "right 60%",
                scrub: true,
              },
            }
          );
        });
      });

      mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
        gsap.utils.toArray(".work__panel").forEach((panel) => {
          gsap.from(panel, {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            scrollTrigger: { trigger: panel, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="work" ref={root} className="work" aria-labelledby="work-title">
      <div className="work__inner">
        <div className="container work__header">
          <SectionHeading
            id="work-title"
            eyebrow="Selected Case Studies"
            size="md"
            segments={[{ text: "Selected work." }, { text: "Real impact.", highlight: true }]}
          />
          <div className="work__meta">
            <span className="mono">{String(projects.length).padStart(2, "0")} concept projects</span>
            <span className="work__progress" aria-hidden="true">
              <span ref={progress} />
            </span>
          </div>
        </div>

        <div className="work__viewport">
          <ol ref={track} className="work__track">
            {projects.map((p) => (
              <li key={p.id} className={cx("work__panel", `is-${p.tone}`)}>
                <article className="work__card surface">
                  <div className="work__content">
                    <p className="work__tags">
                      <span className={cx("tag", p.tone === "lime" && "tag--lime")}>
                        Case {p.index} · {p.category}
                      </span>
                      <span className="tag tag--muted">{p.type}</span>
                    </p>
                    <h3 className="work__title display-sm">{p.title}</h3>
                    <p className="work__desc">{p.description}</p>
                    <ul className="work__stack" aria-label="Technologies">
                      {p.stack.map((t) => (
                        <li className="chip" key={t}>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <Button
                      href={p.href}
                      size="sm"
                      variant={p.tone === "lime" ? "lime" : "primary"}
                      aria-label={`View project: ${p.title}`}
                    >
                      View Case Study
                    </Button>
                  </div>
                  <div className="work__visual">
                    <div className="work__visual-inner">
                      <ProjectVisual variant={p.visual} />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
