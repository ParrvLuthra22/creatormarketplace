"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

interface Creator {
  name: string;
  niche: string;
  followers: string;
  engagement: string;
  gradient: string;
}

const creators: Creator[] = [
  {
    name: "Alex Rivera",
    niche: "Tech & Gadgets",
    followers: "2.4M",
    engagement: "8.2%",
    gradient: "linear-gradient(135deg, #27272a 0%, #18181b 100%)",
  },
  {
    name: "Maya Chen",
    niche: "Sustainable Living",
    followers: "890K",
    engagement: "12.1%",
    gradient: "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
  },
  {
    name: "Jordan Wolf",
    niche: "Fitness & Wellness",
    followers: "5.1M",
    engagement: "6.8%",
    gradient: "linear-gradient(135deg, #404040 0%, #171717 100%)",
  },
  {
    name: "Sam Torres",
    niche: "Food & Culture",
    followers: "1.8M",
    engagement: "9.4%",
    gradient: "linear-gradient(135deg, #44403c 0%, #1c1917 100%)",
  },
  {
    name: "Morgan Lee",
    niche: "Finance & Growth",
    followers: "3.2M",
    engagement: "7.5%",
    gradient: "linear-gradient(135deg, #292524 0%, #0c0a09 100%)",
  },
  {
    name: "Casey Park",
    niche: "Art & Design",
    followers: "1.1M",
    engagement: "11.3%",
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  {
    name: "Taylor Kim",
    niche: "Travel & Culture",
    followers: "4.7M",
    engagement: "5.9%",
    gradient: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)",
  },
];

// Card uses variant propagation for hover states
const cardVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] },
  },
};

const borderVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3 } },
};

const infoVariants = {
  rest: { y: 12, opacity: 0.75 },
  hover: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] } },
};

function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <motion.div
      className="relative flex-none rounded-xl overflow-hidden cursor-pointer"
      style={{ width: 300, height: 400, background: creator.gradient }}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      aria-label={`${creator.name} — ${creator.niche}`}
    >
      {/* Lime border on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-(--accent) pointer-events-none"
        variants={borderVariants}
      />

      {/* Gradient fade to bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 40%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Info */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6"
        variants={infoVariants}
      >
        <span className="font-mono-utility text-mono-sm text-(--accent) mb-2 block">
          {creator.niche}
        </span>
        <h3 className="text-h3 font-display mb-4 leading-tight">{creator.name}</h3>
        <div className="flex gap-6">
          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
              FOLLOWERS
            </p>
            <p className="text-sm font-semibold text-(--text-primary) mt-0.5">
              {creator.followers}
            </p>
          </div>
          <div>
            <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
              ENGAGEMENT
            </p>
            <p className="text-sm font-semibold text-(--accent) mt-0.5">
              {creator.engagement}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CreatorShowcase() {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="py-24 bg-(--bg-primary) overflow-hidden"
      aria-labelledby="creators-heading"
    >
      <Container className="mb-12">
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            03 — FEATURED CREATORS
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 id="creators-heading" className="text-h1 font-display max-w-2xl">
            Meet the creators redefining{" "}
            <span className="font-serif text-(--text-secondary)">
              brand storytelling.
            </span>
          </h2>
        </RevealOnScroll>
      </Container>

      {/* Drag scroll container */}
      <div
        ref={constraintsRef}
        className="overflow-hidden pl-6 md:pl-12"
        style={{ cursor: "grab" }}
        aria-label="Creator gallery — drag to scroll"
      >
        <motion.div
          className="flex gap-5 pb-4 w-max"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 40 }}
          style={{ cursor: "grab" }}
          whileDrag={{ cursor: "grabbing" }}
        >
          {creators.map((c) => (
            <CreatorCard key={c.name} creator={c} />
          ))}
          {/* Right padding element */}
          <div className="w-6 md:w-12 flex-none" aria-hidden />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <Container className="mt-6">
        <p className="font-mono-utility text-mono-sm text-(--text-tertiary)">
          ← DRAG TO EXPLORE →
        </p>
      </Container>
    </section>
  );
}
