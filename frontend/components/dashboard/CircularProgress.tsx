"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function CircularProgress({
  value,
  size = 88,
  strokeWidth = 6,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      const raf = requestAnimationFrame(() => setProgress(Math.min(100, Math.max(0, value))));
      return () => cancelAnimationFrame(raf);
    }
  }, [isInView, value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.65, 0, 0.35, 1)" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
        className="font-display font-semibold"
        style={{ fontSize: size * 0.24, fill: "var(--text-primary)" }}
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
}
