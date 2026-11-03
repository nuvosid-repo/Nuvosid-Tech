"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const AppContext = createContext(null);

/**
 * App-wide UI state:
 *  - `loaded`: true once the preloader has finished (gates hero intro)
 *  - `lenisRef`: shared Lenis instance (null on touch / reduced motion)
 *  - `scrollTo`: smooth-scrolls to an element / selector / number
 */
export function AppProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef(null);

  const scrollTo = useCallback((target, options = {}) => {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el === null) return false;
    const offset = options.offset ?? 0;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset, duration: 1.4, force: true, ...options });
    } else if (typeof el === "number") {
      window.scrollTo({ top: el, behavior: "smooth" });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    return true;
  }, []);

  const value = useMemo(() => ({ loaded, setLoaded, lenisRef, scrollTo }), [loaded, scrollTo]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
