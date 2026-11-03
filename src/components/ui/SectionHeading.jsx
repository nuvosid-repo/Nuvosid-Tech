import RevealText from "@/components/animations/RevealText";
import { cx } from "@/lib/utils";

/** Eyebrow label + split-word reveal heading used across sections. */
export default function SectionHeading({ eyebrow, segments, as = "h2", size = "lg", className, align = "start", id }) {
  return (
    <div className={cx("section-heading", align === "center" && "text-center", className)}>
      {eyebrow && <p className={cx("eyebrow", align === "center" && "eyebrow--pill")}>{eyebrow}</p>}
      <RevealText as={as} id={id} segments={segments} className={cx(`display-${size}`, "mt-3")} />
    </div>
  );
}
