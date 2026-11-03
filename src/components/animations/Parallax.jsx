"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/animations";

/** Scroll-scrubbed vertical parallax. `speed` > 0 moves slower than scroll. */
export default function Parallax({ as: Tag = "div", children, speed = 0.2, className, ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: speed * 50 },
          {
            yPercent: -speed * 50,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
