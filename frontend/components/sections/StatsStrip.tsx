"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 10000, suffix: "+", label: "Creators waitlisted" },
  { value: 500, suffix: "+", label: "Brands signed up" },
  { value: 50, suffix: "+", label: "Niches covered" },
  { value: 98, suffix: "%", label: "Match accuracy" },
];

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsStrip() {
  return (
    <section
      className="py-24 border-t border-b border-(--border) bg-(--bg-primary)"
      aria-label="Platform statistics"
    >
      <Container>
        <RevealOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col gap-3 py-8 md:py-0 px-6 md:px-10 ${
                  i > 0 ? "border-l border-(--border)" : ""
                } ${i === 2 ? "border-t border-(--border) md:border-t-0" : ""} ${
                  i === 3 ? "border-t border-(--border) md:border-t-0" : ""
                }`}
              >
                <p className="text-h1 font-display text-(--text-primary)">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
                  {stat.label.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
