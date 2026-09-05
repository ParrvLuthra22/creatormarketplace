"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendUp?: boolean;
  formatter?: (n: number) => string;
  delay?: number;
  /** Real data points (e.g. daily bucket counts) rendered as a small SVG line. */
  sparkline?: number[];
  /** Shows a small pulsing lime dot next to the label while value > 0. */
  pulseIfPositive?: boolean;
}

function useCountUp(target: number, run: boolean) {
  const [count, setCount] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!run) return;
    const duration = 1400;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setCount(target);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [run, target]);

  return count;
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const w = 100;
  const h = 28;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7 overflow-visible" preserveAspectRatio="none" aria-hidden>
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
    </svg>
  );
}

export default function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
  trendUp,
  formatter,
  delay = 0,
  sparkline,
  pulseIfPositive,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [run, setRun] = useState(false);
  const count = useCountUp(value, run);

  const prevValue = useRef(value);
  const [justUpdated, setJustUpdated] = useState(false);
  useEffect(() => {
    if (prevValue.current !== value && run) {
      setJustUpdated(true);
      const t = setTimeout(() => setJustUpdated(false), 300);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value, run]);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setRun(true), delay * 1000);
      return () => clearTimeout(t);
    }
  }, [isInView, delay]);

  const display = formatter ? formatter(count) : `${prefix}${count.toLocaleString()}${suffix}`;

  return (
    <div
      ref={ref}
      className="card-accent rounded-xl border border-(--border) bg-(--bg-secondary) p-6 flex flex-col gap-3"
    >
      <span className="font-mono-utility text-mono-sm text-(--text-tertiary) flex items-center gap-2">
        {label.toUpperCase()}
        {pulseIfPositive && value > 0 && (
          <span className="h-1.5 w-1.5 rounded-full bg-(--accent) animate-pulse" aria-hidden />
        )}
      </span>
      <p className={cn("text-h2 font-display tabular-nums transition-colors", justUpdated && "stat-pulse")}>
        {display}
      </p>
      {sparkline && sparkline.length > 1 && <Sparkline data={sparkline} />}
      {trend !== undefined && (
        <span
          className={cn(
            "font-mono-utility text-mono-sm flex items-center gap-1",
            trendUp ? "text-(--success)" : "text-(--warning)"
          )}
        >
          {trendUp ? "↑" : "↓"} {trend}% vs last month
        </span>
      )}
    </div>
  );
}
