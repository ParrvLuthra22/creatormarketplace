"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SocialLoginButtonProps {
  provider: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SocialLoginButton({
  provider,
  icon,
  onClick,
  className,
}: SocialLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      await onClick?.();
    } finally {
      // In a real app OAuth redirects, so we keep loading until navigation
      setTimeout(() => setLoading(false), 3000);
    }
  }

  return (
    <motion.button
      whileHover={loading ? {} : { scale: 1.05 }}
      whileTap={loading ? {} : { scale: 0.96 }}
      onClick={handleClick}
      disabled={loading}
      aria-label={`Sign in with ${provider}`}
      title={provider}
      className={cn(
        "relative flex h-20 w-full items-center justify-center rounded-xl",
        "border bg-(--bg-surface) text-(--text-secondary)",
        "transition-colors duration-200",
        "hover:border-(--accent) hover:text-(--text-primary)",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2",
        // Hover glow
        "hover:shadow-[0_0_20px_rgba(212,255,79,0.08)]",
        className
      )}
      style={{ borderColor: "var(--border)" }}
    >
      {loading ? (
        <span
          className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden
        />
      ) : (
        <span className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
      )}
    </motion.button>
  );
}
