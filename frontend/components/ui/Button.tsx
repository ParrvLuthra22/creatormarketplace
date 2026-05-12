"use client";

import { useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const base =
  "relative inline-flex items-center justify-center font-medium transition-colors duration-200 select-none overflow-hidden min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)";

const variants: Record<Variant, string> = {
  primary:
    "bg-(--accent) text-(--bg-primary) hover:bg-(--accent-hover) rounded-full px-6 py-3 text-sm tracking-tight",
  secondary:
    "border border-(--border-strong) text-(--text-primary) hover:border-(--text-primary) rounded-full px-6 py-3 text-sm tracking-tight bg-transparent",
  ghost:
    "text-(--text-secondary) hover:text-(--text-primary) rounded-full px-4 py-2 text-sm bg-transparent",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2 min-h-[36px]",
  md: "",
  lg: "text-base px-8 py-4",
};

function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: ButtonProps) {
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
    if (ref.current) {
      ref.current.style.transform = "translate(0, 0)";
    }
    onMouseLeave?.(e);
  }

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], "transition-transform duration-300 ease-out", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-interactive
      {...props}
    >
      {children}
    </button>
  );
}

// Export both ways so legacy `{ Button }` imports and new `import Button` both compile
export { Button };
export default Button;
