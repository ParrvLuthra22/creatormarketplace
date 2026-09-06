"use client";

import { useEffect } from "react";

/**
 * Closes a modal/dialog on Escape — shared across every hand-rolled modal in
 * the app. Pass `enabled: false` for components that stay mounted while
 * closed (e.g. Drawer, toggled via an `open` prop rather than conditional
 * rendering) so Escape doesn't fire onClose while nothing is actually open.
 */
export function useEscapeToClose(onClose: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, enabled]);
}
