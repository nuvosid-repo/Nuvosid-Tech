"use client";

import { Fragment, useRef } from "react";
import { gsap, MQ, REVEAL_START, useGSAP } from "@/lib/animations";
import { cx } from "@/lib/utils";

/**
 * Splits text into words wrapped in masks and reveals them word-by-word.
 *
 * segments: [{ text: "WE BUILD", highlight?: boolean, break?: boolean }]
 *   - highlight → gradient emerald text
 *   - break     → line break after the segment
 * mode: "scroll" (ScrollTrigger) | "manual" (parent animates `.rt-word-inner`)
 * scrub: tie reveal progress to scroll position instead of a one-shot play
 */
export default function RevealText({
  as: Tag = "h2",
  segments,
  text,
  className,
  mode = "scroll",
  scrub = false,
  stagger = 0.06,
  start = REVEAL_START,
  ...rest
}) {
  const ref = useRef(null);
  const parts = segments || [{ text }];

  useGSAP(
    () => {
      if (mode !== "scroll") return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const words = ref.current.querySelectorAll(".rt-word-inner");
        gsap.set(ref.current, { autoAlpha: 1 });
        if (scrub) {
          gsap.fromTo(
            words,
            { yPercent: 105, opacity: 0.15 },
            {
              yPercent: 0,
              opacity: 1,
              stagger,
              ease: "none",
              scrollTrigger: { trigger: ref.current, start: "top 88%", end: "bottom 55%", scrub: 0.6 },
            }
          );
        } else {
          gsap.from(words, {
            yPercent: 110,
            rotate: 4,
            duration: 1.1,
            stagger,
            ease: "expo.out",
            scrollTrigger: { trigger: ref.current, start, once: true },
          });
        }
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={cx("reveal-text", className)} data-reveal={mode === "scroll" ? "" : undefined} {...rest}>
      {parts.map((seg, i) => {
        const words = seg.text.split(" ").filter(Boolean);
        return (
          <Fragment key={i}>
            {words.map((w, j) => (
              <Fragment key={j}>
                <span className="rt-word">
                  <span className={cx("rt-word-inner", seg.highlight && "text-gradient")}>{w}</span>
                </span>
                {j < words.length - 1 || (!seg.break && i < parts.length - 1) ? " " : null}
              </Fragment>
            ))}
            {seg.break && <br />}
          </Fragment>
        );
      })}
    </Tag>
  );
}
