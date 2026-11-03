"use client";

import { gsap, useGSAP, MQ } from "@/lib/animations";

/**
 * Thin wrapper around useGSAP + gsap.matchMedia.
 * `setup(ctx)` runs only when motion is allowed; everything is scoped to
 * `scope` and reverted automatically on unmount / breakpoint change.
 *
 * ctx.conditions = { desktop, mobile }
 */
export function useGSAPAnimation(scope, setup, deps = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: `${MQ.desktop} and ${MQ.motion}`,
          mobile: `${MQ.mobile} and ${MQ.motion}`,
        },
        (ctx) => setup(ctx)
      );
      return () => mm.revert();
    },
    { scope, dependencies: deps, revertOnUpdate: true }
  );
}
