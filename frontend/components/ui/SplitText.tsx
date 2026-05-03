"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  splitBy?: "chars" | "words";
  className?: string;
  charClassName?: string;
  staggerDelay?: number;
  delay?: number;
  duration?: number;
  variants?: Variants;
  once?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

const defaultVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: { y: "0%", opacity: 1 },
};

export default function SplitText({
  text,
  splitBy = "chars",
  className,
  charClassName,
  staggerDelay = 0.05,
  delay = 0,
  duration = 0.8,
  variants = defaultVariants,
  once = true,
  as: Tag = "span",
}: SplitTextProps) {
  const units = useMemo(() => {
    if (splitBy === "words") return text.split(" ");
    return text.split("");
  }, [text, splitBy]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const unitVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        duration,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  return (
    <motion.span
      className={cn("inline-block overflow-hidden", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className={cn("inline-block", charClassName)}
            variants={unitVariants}
          >
            {unit === " " ? " " : unit}
          </motion.span>
          {splitBy === "words" && i < units.length - 1 && (
            <span aria-hidden> </span>
          )}
        </span>
      ))}
    </motion.span>
  );
}
