"use client";

import { useCallback, useSyncExternalStore } from "react";

/** SSR-safe media query hook. Returns `serverValue` during SSR/hydration. */
export function useMediaQuery(query, serverValue = false) {
  const subscribe = useCallback(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

export const useIsDesktop = () => useMediaQuery("(min-width: 992px)", true);
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)", false);
