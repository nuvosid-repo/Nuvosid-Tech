"use client";

import { useRef } from "react";
import { gsap, MQ, REVEAL_START, useGSAP } from "@/lib/animations";

/**
 * Fades + rises its content (or its direct children when `stagger` is set)
 * when scrolled into view.
 */
export default function FadeIn({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 40,
  stagger,
  start = REVEAL_START,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current;
        const targets = stagger ? el.children : el;
        gsap.set(el, { autoAlpha: 1 });
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            delay,
            stagger: stagger || 0,
            ease: "power3.out",
            clearProps: "transform", // let CSS hover transforms work afterwards
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} data-reveal="" {...rest}>
      {children}
    </Tag>
  );
}
