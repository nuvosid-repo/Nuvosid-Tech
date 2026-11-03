"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animations";
import { useApp } from "@/context/AppContext";
import { navLinks } from "@/data/site";
import { cx } from "@/lib/utils";
import Logo from "@/components/common/Logo/Logo";
import ThemeToggle from "@/components/common/ThemeToggle/ThemeToggle";
import SmartLink from "@/components/ui/SmartLink";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import "./Navbar.scss";

export default function Navbar() {
  const pathname = usePathname();
  const { lenisRef, loaded } = useApp();
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // Scrolled state + hide on scroll down / reveal on scroll up
  useGSAP(() => {
    const nav = navRef.current;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        nav.classList.toggle("is-scrolled", y > 40);
        nav.classList.toggle("is-hidden", self.direction === 1 && y > window.innerHeight * 0.9);
      },
    });
    return () => st.kill();
  });

  // Intro once the preloader finishes (home page)
  useGSAP(
    () => {
      if (!loaded) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".navbar__inner > *", { y: -24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: "expo.out", delay: 0.25 });
    },
    { scope: navRef, dependencies: [loaded] }
  );

  // Active section highlighting (IntersectionObserver works with pinned sections)
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = navLinks.filter((l) => l.section).map((l) => l.section);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Mobile menu: lock scroll, Esc to close, animate links
  useEffect(() => {
    const html = document.documentElement;
    const lenis = lenisRef.current;
    if (open) {
      lenis?.stop();
      html.classList.add("is-locked");
      const onKey = (e) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      menuRef.current?.querySelector("a")?.focus();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          menuRef.current.querySelectorAll(".mobile-menu__item"),
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, stagger: 0.05, duration: 0.7, ease: "expo.out", delay: 0.15 }
        );
      }
      return () => {
        window.removeEventListener("keydown", onKey);
        html.classList.remove("is-locked");
        lenis?.start();
      };
    }
  }, [open, lenisRef]);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const isActive = (link) => (link.section ? pathname === "/" && active === link.section : pathname === link.href);

  return (
    <header ref={navRef} className={cx("navbar-c", open && "is-open")}>
      <div className="container">
        <nav className="navbar__inner" aria-label="Primary">
          <SmartLink href="/#top" className="navbar__brand" aria-label="NUVOSID TECH — home">
            <Logo priority />
          </SmartLink>

          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <SmartLink
                  href={link.href}
                  className={cx("navbar__link", isActive(link) && "is-active")}
                  aria-current={isActive(link) ? "page" : undefined}
                >
                  <span className="navbar__link-clip">
                    <span data-text={link.label}>{link.label}</span>
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            <ThemeToggle />
            <Button href="/#contact" size="sm" className="navbar__cta d-none d-sm-inline-flex">
              Let&apos;s Talk
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className="navbar__burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </nav>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
      >
        <div className="container">
          <ul className="mobile-menu__list">
            {navLinks.map((link, i) => (
              <li key={link.label} className="mobile-menu__row">
                <SmartLink
                  href={link.href}
                  className={cx("mobile-menu__item", isActive(link) && "is-active")}
                  onClick={close}
                >
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__footer mobile-menu__item">
            <Button href="/#contact" onClick={close} magnetic={false}>
              Let&apos;s Talk
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
