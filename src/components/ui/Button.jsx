import SmartLink from "./SmartLink";
import Icon from "./Icon";
import MagneticButton from "@/components/animations/MagneticButton";
import { cx } from "@/lib/utils";

/**
 * Pill button. Renders a link when `href` is set, otherwise a <button>.
 * variant: primary | ghost | lime    size: md | sm
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  icon = "arrow-up-right",
  magnetic = true,
  className,
  children,
  ...rest
}) {
  const classes = cx("btn-c", `btn-c--${variant}`, size === "sm" && "btn-c--sm", className);
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} />}
    </>
  );
  const el = href ? (
    <SmartLink href={href} className={classes} {...rest}>
      {content}
    </SmartLink>
  ) : (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
  return magnetic ? <MagneticButton strength={0.25}>{el}</MagneticButton> : el;
}
