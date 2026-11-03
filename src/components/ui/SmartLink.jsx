"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

/**
 * Link that smooth-scrolls to in-page anchors ("/#id" or "#id") when the
 * target section exists on the current page; otherwise behaves like next/link.
 */
export default function SmartLink({ href, onClick, children, ...rest }) {
  const pathname = usePathname();
  const { scrollTo } = useApp();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const isAnchor = href.startsWith("#") || (href.startsWith("/#") && pathname === "/");
    if (!isAnchor) return;
    const id = href.split("#")[1];
    const target = id === "top" ? 0 : document.getElementById(id);
    if (target === null) return;
    e.preventDefault();
    // Defer one tick so a closing mobile menu can release the scroll lock first.
    window.setTimeout(() => scrollTo(target), 0);
    if (id !== "top") history.replaceState(null, "", `#${id}`);
    else history.replaceState(null, "", "/");
  };

  return (
    <Link href={href} onClick={handleClick} scroll={!href.includes("#")} {...rest}>
      {children}
    </Link>
  );
}
