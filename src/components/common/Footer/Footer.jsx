"use client";

import { useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/lib/animations";
import { footerColumns, legalLinks, site } from "@/data/site";
import SmartLink from "@/components/ui/SmartLink";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/common/Logo/Logo";
import "./Footer.scss";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Footer() {
  const ref = useRef(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.set(".footer__reveal", { autoAlpha: 1 });
        gsap.from(".footer__tagline .footer__line > span", {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
        gsap.from(".footer__col, .footer__newsletter", {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.07,
          scrollTrigger: { trigger: ".footer__grid", start: "top 92%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  const onSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    // TODO: connect to the newsletter provider / API route.
    setStatus({ type: "success", message: "Thanks — you're on the list. We'll be in touch soon." });
    setEmail("");
  };

  const year = new Date().getFullYear();

  return (
    <footer ref={ref} className="footer" aria-labelledby="footer-heading">
      <div className="container">
        <div className="row g-5 align-items-end footer__top">
          <div className="col-lg-7">
            <p className="eyebrow">Engineering Digital Futures</p>
            <h2 id="footer-heading" className="footer__tagline display-md mt-3 footer__reveal" data-reveal="">
              <span className="footer__line"><span>Think Success. Think</span></span>{" "}
              <span className="footer__line"><span>Growth. Think</span></span>{" "}
              <span className="footer__line"><span className="text-gradient">Nuvosid.</span></span>
            </h2>
          </div>
          <div className="col-lg-5">
            <form className="footer__newsletter surface" onSubmit={onSubmit} noValidate>
              <label htmlFor="newsletter-email" className="footer__newsletter-title">
                Intelligence Dispatch
              </label>
              <p className="footer__newsletter-text">
                Occasional insights on engineering, design and emerging technology. No spam.
              </p>
              <div className="footer__field">
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={status.type === "error"}
                  aria-describedby="newsletter-status"
                  required
                />
                <button type="submit" aria-label="Subscribe">
                  <Icon name="arrow-right" />
                </button>
              </div>
              <p id="newsletter-status" className={`footer__status is-${status.type}`} role="status" aria-live="polite">
                {status.message}
              </p>
            </form>
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__col footer__about">
            <Logo />
            <p>{site.description}</p>
            <ul className="footer__social" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  {s.href && s.href !== "#" ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                      <Icon name={s.icon} />
                    </a>
                  ) : (
                    // Profile URL not supplied yet — shown as a non-interactive badge.
                    <span className="is-pending" title={`${s.label} — profile link coming soon`}>
                      <Icon name={s.icon} />
                      <span className="sr-only">{s.label} (coming soon)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h3 className="footer__title">{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href} className="link-underline">
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer__col">
            <h3 className="footer__title">Contact</h3>
            <ul className="footer__contact">
              <li>
                <Icon name="mail" />
                <a href={`mailto:${site.contact.email}`} className="link-underline">
                  {site.contact.email}
                </a>
              </li>
              <li>
                <Icon name="phone" />
                <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="link-underline">
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <Icon name="pin" />
                <span>{site.contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <ul>
            {legalLinks.map((l) => (
              <li key={l.label}>
                <SmartLink href={l.href} className="link-underline">
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
