"use client";

export default function DualRangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
}: {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (n: number) => string;
}) {
  const [lo, hi] = value;
  const fmt = formatValue || ((n: number) => String(n));
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between font-mono-utility text-mono-sm text-(--text-tertiary) mb-3">
        <span>{fmt(lo)}</span>
        <span>{fmt(hi)}</span>
      </div>
      <div className="relative h-4">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full bg-(--border)" aria-hidden />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-(--accent)"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
          aria-hidden
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="range-thumb absolute inset-0 w-full h-4"
          aria-label="Minimum"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="range-thumb absolute inset-0 w-full h-4"
          aria-label="Maximum"
        />
      </div>
    </div>
  );
}
