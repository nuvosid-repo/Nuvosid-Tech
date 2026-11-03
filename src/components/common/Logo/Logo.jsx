import Image from "next/image";
import { cx } from "@/lib/utils";
import "./Logo.scss";

// Official NUVOSID TECH logo, keyed to transparent PNGs from the supplied artwork.
// Two colour versions: white wordmark for dark mode, navy wordmark for light mode.
// The visible version is switched in CSS via [data-theme], so there is no hydration flicker.
const VARIANTS = {
  wordmark: { width: 744, height: 172, dark: "/images/logo-wordmark-dark.png", light: "/images/logo-wordmark-light.png" },
  full: { width: 744, height: 222, dark: "/images/logo-full-dark.png", light: "/images/logo-full-light.png" },
};

export default function Logo({ variant = "wordmark", className, priority = false }) {
  const v = VARIANTS[variant] || VARIANTS.wordmark;
  return (
    <span className={cx("logo", `logo--${variant}`, className)}>
      <Image
        src={v.dark}
        width={v.width}
        height={v.height}
        alt="NUVOSID TECH"
        className="logo__img logo__img--dark"
        priority={priority}
        sizes="(max-width: 768px) 140px, 200px"
      />
      <Image
        src={v.light}
        width={v.width}
        height={v.height}
        alt=""
        aria-hidden="true"
        className="logo__img logo__img--light"
        priority={priority}
        sizes="(max-width: 768px) 140px, 200px"
      />
    </span>
  );
}
