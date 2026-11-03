"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations";
import { useApp } from "@/context/AppContext";
import { heroStats } from "@/data/stats";
import { formatNumber } from "@/lib/utils";
import RevealText from "@/components/animations/RevealText";
import Button from "@/components/ui/Button";
import SmartLink from "@/components/ui/SmartLink";
import Icon from "@/components/ui/Icon";
import "./HeroSection.scss";

// Heavy WebGL bundle is split out and only loaded in the browser.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const HEADLINE = [
  { text: "We Build", break: true },
  { text: "The Future", highlight: true, break: true },
  { text: "Of Digital", break: true },
  { text: "Experiences." },
];

const formatStat = (s, v) => `${s.prefix || ""}${formatNumber(v, s.decimals || 0)}${s.suffix || ""}`;

export default function HeroSection() {
  const { loaded } = useApp();
  const root = useRef(null);
  const scrollRef = useRef(0);
  const introRef = useRef({ value: 0 });

  // Scroll-linked: feeds 3D progress + subtle content parallax
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollRef.current = self.progress;
        },
      });
      if (!reduce) {
        gsap.to(".hero__content-top", {
          yPercent: -18,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
        });
      }
      return () => st.kill();
    },
    { scope: root }
  );

  // Intro timeline — waits for the preloader
  useGSAP(
    () => {
      if (!loaded) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        introRef.current.value = 1;
        return;
      }
      gsap.set("[data-reveal]", { autoAlpha: 1 });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero__eyebrow", { y: 20, autoAlpha: 0, duration: 0.8 })
        .from(".hero__title .rt-word-inner", { yPercent: 115, rotate: 5, duration: 1.3, stagger: 0.08 }, "<0.1")
        .to(introRef.current, { value: 1, duration: 2.6, ease: "power2.out" }, "<0.2")
        .from(".hero__lead", { y: 30, autoAlpha: 0, duration: 1 }, "<0.2")
        .from(".hero__ctas > *", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, "<0.15")
        .from(".hero__stat", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, "<0.1")
        .from(".hero__hud > *", { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.08 }, "<0.2")
        .from(".hero__stage-frame", { scale: 0.96, autoAlpha: 0, duration: 1.2 }, "<");

      // Count-up stats
      root.current.querySelectorAll(".hero__stat-value").forEach((el, i) => {
        const s = heroStats[i];
        const obj = { v: 0 };
        tl.to(obj, { v: s.value, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = formatStat(s, obj.v)) }, 0.9);
      });
    },
    { scope: root, dependencies: [loaded] }
  );

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow hero__glow--a" />
        <div className="hero__glow hero__glow--b" />
      </div>

      <HeroScene className="hero__canvas" scrollRef={scrollRef} introRef={introRef} />

      <div className="container hero__container">
        <div className="row g-4 g-lg-5 align-items-start hero__content-top">
          <div className="col-lg-7 col-xl-7">
            <p className="eyebrow eyebrow--pill hero__eyebrow" data-reveal="">
              Next-Gen Digital Engineering
            </p>
            <RevealText as="h1" id="hero-title" mode="manual" segments={HEADLINE} className="hero__title display-xl" />
          </div>

          <div className="col-lg-5 col-xl-5 hero__aside">
            <p className="hero__lead lead-c" data-reveal="">
              We transform ambitious ideas into powerful digital experiences through innovative technology, creative
              thinking and intelligent solutions.
            </p>
            <div className="hero__ctas" data-reveal="">
              <Button href="/#work">Explore Our Work</Button>
              <Button href="/#contact" variant="ghost">
                Let&apos;s Talk
              </Button>
            </div>
            <dl className="hero__stats" data-reveal="">
              {heroStats.map((s) => (
                <div className={`hero__stat hero__stat--${s.tone}`} key={s.label}>
                  <dt className="hero__stat-label">{s.label}</dt>
                  <dd className="hero__stat-value">{formatStat(s, s.value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 3D stage — the WebGL object renders behind this frame, not inside a card */}
        <div className="hero__stage">
          <div className="hero__stage-frame" data-reveal="" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="hero__hud" data-reveal="">
            <div className="hero__hud-tl">
              <span className="hero__chip">
                <i /> Real-time WebGL
              </span>
              <span className="hero__chip hero__chip--lime">
                <i /> Interactive Core
              </span>
            </div>
            <span className="hero__hud-tr mono">SCENE_01 / NUVOSID</span>
            <div className="hero__hud-bl">
              <p className="eyebrow eyebrow--plain">Innovation in Motion</p>
              <p>Move your cursor to interact with the core — engineered with Three.js and real-time shaders.</p>
            </div>
            <SmartLink href="/#about" className="hero__scroll">
              <span>Scroll to explore</span>
              <span className="hero__scroll-icon">
                <Icon name="arrow-down" />
              </span>
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
