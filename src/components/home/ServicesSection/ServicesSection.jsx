"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animations";
import { services } from "@/data/services";
import { cx } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/animations/FadeIn";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import "./ServicesSection.scss";

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const panel = useRef(null);
  const tabs = useRef([]);
  const first = useRef(true);

  // Animate the detail panel whenever the active service changes
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(panel.current.querySelectorAll("[data-anim]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05 })
        .fromTo(".services__visual-core", { scale: 0.6, rotate: -25, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 1 }, 0)
        .fromTo(".services__panel-glow", { autoAlpha: 0.2 }, { autoAlpha: 1, duration: 1.2 }, 0);
    },
    { scope: root, dependencies: [active] }
  );

  // Hover/focus moves the indicator; click/keyboard select
  const select = useCallback((i) => setActive(i), []);

  const onKeyDown = (e, i) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = null;
    if (e.key in keys) next = (i + keys[e.key] + services.length) % services.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = services.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  const s = services[active];

  return (
    <section id="services" ref={root} className="services section" aria-labelledby="services-title">
      <div className="container">
        <div className="row g-4 align-items-end services__head">
          <div className="col-lg-7">
            <SectionHeading
              id="services-title"
              eyebrow="Our Services"
              size="md"
              segments={[{ text: "Turning ideas into", break: true }, { text: "digital reality.", highlight: true }]}
            />
          </div>
          <div className="col-lg-5">
            <FadeIn as="p" className="lead-c">
              End-to-end capabilities to design, build and scale digital products — choose a service to see how we
              approach it.
            </FadeIn>
          </div>
        </div>

        <div className="row g-4 g-xl-5 services__body">
          <div className="col-lg-6">
            <FadeIn as="div" stagger={0.05} className="services__list" role="tablist" aria-label="Services" aria-orientation="vertical">
              {services.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => (tabs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`service-tab-${i}`}
                  aria-selected={active === i}
                  aria-controls="service-panel"
                  tabIndex={active === i ? 0 : -1}
                  className={cx("services__item", active === i && "is-active")}
                  onClick={() => select(i)}
                  onMouseEnter={() => window.matchMedia("(hover: hover)").matches && select(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className="services__num mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="services__name">{item.title}</span>
                  <span className="services__arrow">
                    <Icon name="arrow-up-right" />
                  </span>
                </button>
              ))}
            </FadeIn>
          </div>

          <div className="col-lg-6">
            <FadeIn delay={0.15}>
              <div
                ref={panel}
                id="service-panel"
                role="tabpanel"
                aria-labelledby={`service-tab-${active}`}
                aria-live="polite"
                className="services__panel surface"
              >
                <div className="services__panel-glow" aria-hidden="true" />
                <div className="services__panel-top" data-anim>
                  <span className="tag">Service {String(active + 1).padStart(2, "0")}</span>
                  <span className="services__panel-icon">
                    <Icon name={s.icon} />
                  </span>
                </div>

                <div className="services__panel-main">
                  <div>
                    <h3 className="services__title display-sm" data-anim>
                      {s.title}
                    </h3>
                    <p className="services__desc" data-anim>
                      {s.summary}
                    </p>
                  </div>
                  <div className="services__visual" aria-hidden="true">
                    <div className="services__visual-ring" />
                    <div className="services__visual-ring services__visual-ring--b" />
                    <div className="services__visual-core">
                      <Icon name={s.icon} />
                    </div>
                  </div>
                </div>

                <div data-anim>
                  <p className="services__label mono">Core Stack</p>
                  <ul className="services__stack">
                    {s.stack.map((t) => (
                      <li className="chip" key={t}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="services__footer" data-anim>
                  <div>
                    <p className="services__label mono">{s.metric.label}</p>
                    <p className="services__metric">{s.metric.value}</p>
                  </div>
                  <Button href="/services" size="sm">
                    Explore Service
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
