"use client";

import { usePathname } from "next/navigation";
import ScrollProgressBar from "./ScrollProgressBar";

// Dashboard/admin routes have their own internal scroll container and
// don't need a page-level progress indicator competing for the same space.
export default function ScrollProgressBarGate() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;
  return <ScrollProgressBar />;
}
