"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animations";
import { testimonials } from "@/data/testimonials";
import { cx } from "@/lib/utils";
import FadeIn from "@/components/animations/FadeIn";
import Icon from "@/components/ui/Icon";
import "./TestimonialsSection.scss";

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const dir = useRef(1);
  const root = useRef(null);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ".testimonials__quote, .testimonials__author",
        { x: 40 * dir.current, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: "expo.out" }
      );
    },
    { scope: root, dependencies: [index] }
  );

  const go = (step) => {
    dir.current = step;
    setIndex((i) => (i + step + testimonials.length) % testimonials.length);
  };

  const t = testimonials[index];

  return (
    <section
      ref={root}
      className="testimonials section section--alt"
      aria-roledescription="carousel"
      aria-labelledby="testimonials-title"
    >
      <div className="container">
        <div className="testimonials__head">
          <div>
            <p className="eyebrow">Client Perspectives</p>
            <h2 id="testimonials-title" className="sr-only">
              Testimonials
            </h2>
          </div>
          <div className="testimonials__nav">
            <span className="mono testimonials__count" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
            <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Previous testimonial">
              <Icon name="arrow-left" />
            </button>
            <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Next testimonial">
              <Icon name="arrow-right" />
            </button>
          </div>
        </div>

        <FadeIn>
          <figure
            className="testimonials__card surface"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${testimonials.length}`}
            aria-live="polite"
          >
            <span className="testimonials__mark" aria-hidden="true">
              <Icon name="quote" />
            </span>
            <blockquote className="testimonials__quote">
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className="testimonials__author">
              <span className="testimonials__avatar" aria-hidden="true">
                {initials(t.name)}
              </span>
              <span>
                <strong>{t.name}</strong>
                <small>{t.role}</small>
              </span>
            </figcaption>
            <div className="testimonials__dots" role="tablist" aria-label="Choose testimonial">
              {testimonials.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={cx(i === index && "is-active")}
                  onClick={() => {
                    dir.current = i > index ? 1 : -1;
                    setIndex(i);
                  }}
                />
              ))}
            </div>
          </figure>
        </FadeIn>
      </div>
    </section>
  );
}
