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
  const [hovered, setHovered] = useState(false);

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={loading}
      aria-label={`Sign in with ${provider}`}
      title={provider}
      data-interactive
      data-cursor={`Sign in with ${provider}`}
      className={cn(
        "relative flex h-20 w-20 items-center justify-center rounded-xl shrink-0",
        "border bg-(--bg-surface) text-(--text-secondary)",
        "transition-colors duration-200",
        "hover:border-(--accent) hover:text-(--text-primary)",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline-2 focus-visible:outline-(--accent) focus-visible:outline-offset-2",
        className
      )}
      style={{
        borderColor: "var(--border)",
        boxShadow: hovered && !loading ? "0 0 24px rgba(212,255,79,0.15)" : "none",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, color 0.2s ease",
      }}
    >
      {loading ? (
        <span
          className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden
        />
      ) : (
        <motion.span
          className="flex items-center justify-center"
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
}
