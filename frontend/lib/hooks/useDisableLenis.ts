"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

const LENIS_OFF_ROUTES = ["/dashboard", "/admin", "/onboarding"];

/**
 * Stops Lenis smooth-scroll while on dashboard / admin routes so that the native
 * overflow-y-auto scroll in dashboard <main data-lenis-prevent> works correctly.
 *
 * Two-layer approach:
 *  1. lenis.stop() — pauses scroll animation
 *  2. html/body overflow reset — ensures browser's native scroll stack is clear
 *
 * The <main data-lenis-prevent> attribute on dashboard layouts is the primary fix:
 * it tells Lenis not to call e.preventDefault() on wheel/touch events inside that
 * element, so native overflow-y-auto scroll works even if Lenis is technically running.
 */
export function useDisableLenis() {
  const pathname = usePathname();
  const lenis = useLenis();

  const shouldDisable = LENIS_OFF_ROUTES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  useEffect(() => {
    if (!lenis) return;

    if (shouldDisable) {
      lenis.stop();
      // Belt-and-suspenders: clear any overflow:hidden Lenis may have set on <html>
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    } else {
      lenis.start();
      // Restore smooth-scroll overflow management
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      // Restore on unmount so the next route starts with the right state
      if (shouldDisable && lenis) {
        lenis.start();
      }
    };
  }, [lenis, shouldDisable]);
}
