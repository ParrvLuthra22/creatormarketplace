"use client";

import { useRef, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary: "bg-(--accent) text-(--bg-primary) hover:bg-(--accent-hover)",
  secondary: "border border-(--border) text-(--text-primary) hover:border-(--accent)",
  ghost: "text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface)",
};

/** Same mouse-tracking magnetic hover as ui/Button.tsx, but with the dashboard's rounded-xl shape. */
export default function MagneticButton({
  variant = "primary",
  className,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const strength = 4;
    el.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
    onMouseMove?.(e);
  }

  function handleMouseLeave(e: MouseEvent<HTMLButtonElement>) {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
    onMouseLeave?.(e);
  }

  return (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm h-10 px-4 min-h-[44px] select-none",
        "transition-[background-color,border-color,color] duration-200",
        "transition-transform duration-300 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-interactive
      {...props}
    >
      {children}
    </button>
  );
}
