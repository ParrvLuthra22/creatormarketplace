"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Heavy animation component — code-split
const Loader = dynamic(() => import("@/components/Loader"), { ssr: false });

const SESSION_KEY = "cl_loaded";

export default function InitialLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show only on first visit per session; skip if user prefers reduced motion
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!alreadySeen && !prefersReduced) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <Loader
      onComplete={() => {
        setShow(false);
        sessionStorage.setItem(SESSION_KEY, "1");
      }}
    />
  );
}
