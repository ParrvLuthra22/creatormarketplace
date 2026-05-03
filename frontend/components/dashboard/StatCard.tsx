"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  trendUp: boolean;
  formatter?: (n: number) => string;
  delay?: number;
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

export default function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  trend,
  trendUp,
  formatter,
  delay = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [run, setRun] = useState(false);
  const count = useCountUp(value, run);

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
      className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-6 flex flex-col gap-3"
    >
      <span className="font-mono-utility text-mono-sm text-(--text-tertiary)">
        {label.toUpperCase()}
      </span>
      <p className="text-h2 font-display tabular-nums">{display}</p>
      <span
        className={cn(
          "font-mono-utility text-mono-sm flex items-center gap-1",
          trendUp ? "text-(--success)" : "text-(--warning)"
        )}
      >
        {trendUp ? "↑" : "↓"} {trend}% vs last month
      </span>
    </div>
  );
}
