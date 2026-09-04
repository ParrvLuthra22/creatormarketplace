"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

const EASE = [0.65, 0, 0.35, 1] as [number, number, number, number];

interface NicheCreator {
  name: string;
  handle: string;
  followers: string;
}

interface Niche {
  label: string;
  slug: string;
  count: number;
  creators: NicheCreator[];
}

const NICHES: Niche[] = [
  { label: "Fashion", slug: "fashion", count: 127, creators: [
    { name: "Sofia Reyes", handle: "@sofiareyes", followers: "3.4M" },
    { name: "Kavya Reddy", handle: "@kavyareddy", followers: "980K" },
    { name: "Diego Martinez", handle: "@diegom", followers: "1.5M" },
    { name: "Meera Joshi", handle: "@meerajoshi", followers: "640K" },
  ]},
  { label: "Tech", slug: "tech", count: 89, creators: [
    { name: "Marcus Chen", handle: "@marcuschen", followers: "1.8M" },
    { name: "Ishaan Bhatt", handle: "@ishaanb", followers: "760K" },
    { name: "Priya Nambiar", handle: "@priyan", followers: "512K" },
    { name: "Tom Reilly", handle: "@tomreilly", followers: "930K" },
  ]},
  { label: "Beauty", slug: "beauty", count: 143, creators: [
    { name: "Kavya Reddy", handle: "@kavyareddy", followers: "980K" },
    { name: "Isla Wren", handle: "@islawren", followers: "1.1M" },
    { name: "Ritika Sethi", handle: "@ritikasethi", followers: "445K" },
    { name: "Nora Kim", handle: "@norakim", followers: "780K" },
  ]},
  { label: "Fitness", slug: "fitness", count: 112, creators: [
    { name: "Jordan Blake", handle: "@jordanb", followers: "3.1M" },
    { name: "Aditya Rao", handle: "@adityarao", followers: "690K" },
    { name: "Sam Torres", handle: "@samtorres", followers: "890K" },
    { name: "Kiara Deshmukh", handle: "@kiarad", followers: "355K" },
  ]},
  { label: "Food", slug: "food", count: 98, creators: [
    { name: "Priya Sharma", handle: "@priyasharma", followers: "1.2M" },
    { name: "Marco Rossi", handle: "@marcorossi", followers: "820K" },
    { name: "Ananya Das", handle: "@ananyadas", followers: "410K" },
    { name: "Leo Fontaine", handle: "@leofontaine", followers: "670K" },
  ]},
  { label: "Travel", slug: "travel", count: 76, creators: [
    { name: "Aisha Kapoor", handle: "@aishakapoor", followers: "2.4M" },
    { name: "Arjun Nair", handle: "@arjunnair", followers: "1.1M" },
    { name: "Elena Petrova", handle: "@elenap", followers: "930K" },
    { name: "Zaid Hussain", handle: "@zaidh", followers: "505K" },
  ]},
  { label: "Gaming", slug: "gaming", count: 154, creators: [
    { name: "Kai Nakamura", handle: "@kainakamura", followers: "2.2M" },
    { name: "Rohan Kulkarni", handle: "@rohankk", followers: "1.4M" },
    { name: "Marcus Chen", handle: "@marcuschen", followers: "1.8M" },
    { name: "Freya Lindqvist", handle: "@freyal", followers: "610K" },
  ]},
  { label: "Music", slug: "music", count: 67, creators: [
    { name: "Leo Fontaine", handle: "@leofontaine", followers: "670K" },
    { name: "Simran Kaur", handle: "@simrankaur", followers: "890K" },
    { name: "Jayden Cole", handle: "@jaydencole", followers: "1.3M" },
    { name: "Ava Bennett", handle: "@avabennett", followers: "455K" },
  ]},
  { label: "Comedy", slug: "comedy", count: 91, creators: [
    { name: "Diego Martinez", handle: "@diegom", followers: "1.5M" },
    { name: "Aryan Kapoor", handle: "@aryankapoor", followers: "2.0M" },
    { name: "Ella Fisher", handle: "@ellafisher", followers: "870K" },
    { name: "Vikram Malhotra", handle: "@vikramm", followers: "630K" },
  ]},
  { label: "Education", slug: "education", count: 58, creators: [
    { name: "Neha Verma", handle: "@nehaverma", followers: "410K" },
    { name: "Daniel Osei", handle: "@danielosei", followers: "320K" },
    { name: "Ananya Iyer", handle: "@ananyaiyer", followers: "540K" },
    { name: "Grace Lin", handle: "@gracelin", followers: "290K" },
  ]},
  { label: "Lifestyle", slug: "lifestyle", count: 134, creators: [
    { name: "Aisha Kapoor", handle: "@aishakapoor", followers: "2.4M" },
    { name: "Sofia Reyes", handle: "@sofiareyes", followers: "3.4M" },
    { name: "Riya Malhotra", handle: "@riyamalhotra", followers: "320K" },
    { name: "Chloe Anderson", handle: "@chloea", followers: "1.0M" },
  ]},
  { label: "Business", slug: "business", count: 45, creators: [
    { name: "Riya Malhotra", handle: "@riyamalhotra", followers: "320K" },
    { name: "Karan Mehta", handle: "@karanmehta", followers: "480K" },
    { name: "James Whitfield", handle: "@jameswhitfield", followers: "610K" },
    { name: "Sana Iqbal", handle: "@sanaiqbal", followers: "270K" },
  ]},
  { label: "Art", slug: "art", count: 72, creators: [
    { name: "Leo Fontaine", handle: "@leofontaine", followers: "670K" },
    { name: "Naina Chopra", handle: "@nainachopra", followers: "390K" },
    { name: "Oscar Lund", handle: "@oscarlund", followers: "455K" },
    { name: "Mira Patel", handle: "@mirapatel", followers: "310K" },
  ]},
  { label: "Photography", slug: "photography", count: 63, creators: [
    { name: "Ananya Iyer", handle: "@ananyaiyer", followers: "540K" },
    { name: "Lucas Ferreira", handle: "@lucasf", followers: "720K" },
    { name: "Tara Singh", handle: "@tarasingh", followers: "380K" },
    { name: "Noah Bergström", handle: "@noahb", followers: "295K" },
  ]},
  { label: "Sports", slug: "sports", count: 84, creators: [
    { name: "Sam Torres", handle: "@samtorres", followers: "890K" },
    { name: "Rahul Devgan", handle: "@rahuldevgan", followers: "1.2M" },
    { name: "Mia Johansson", handle: "@miaj", followers: "560K" },
    { name: "Yusuf Khan", handle: "@yusufkhan", followers: "410K" },
  ]},
];

function useCountUp(target: number) {
  const [count, setCount] = useState(target);
  const raf = useRef(0);
  const prev = useRef(target);

  useEffect(() => {
    const from = prev.current;
    const duration = 500;
    const start = performance.now();

    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(from + (target - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else prev.current = target;
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return count;
}

export default function NicheExplorer() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = NICHES[activeIndex];
  const count = useCountUp(active.count);

  return (
    <section
      data-spotlight="true"
      className="py-32 md:py-40 bg-(--bg-primary)"
      aria-labelledby="niche-heading"
    >
      <Container>
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            06 — EXPLORE THE NETWORK
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 id="niche-heading" className="text-h1 font-display mb-14 max-w-2xl">
            Find creators by{" "}
            <span className="font-serif text-(--text-secondary)">niche.</span>
          </h2>
        </RevealOnScroll>

        {/* Pill grid */}
        <RevealOnScroll delay={0.15}>
          <div className="flex flex-wrap gap-2.5 mb-14" role="list">
            {NICHES.map((niche, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={niche.slug}
                  data-interactive
                  data-cursor="EXPLORE"
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  onClick={() => router.push(`/discover?niche=${niche.slug}`)}
                  className={cn(
                    "font-mono-utility text-mono-sm px-4 py-2 rounded-full border transition-all duration-200",
                    isActive
                      ? "border-(--accent) text-(--accent) scale-105 bg-(--accent)/5"
                      : "border-(--border) text-(--text-tertiary) hover:border-(--border-strong) hover:text-(--text-secondary)"
                  )}
                >
                  {niche.label}
                </button>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* Dynamic counter */}
        <div className="text-center mb-14">
          <AnimatePresence mode="wait">
            <motion.p
              key={active.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="text-h1 font-display"
            >
              <span className="tabular-nums">{count}</span>{" "}
              <span className="font-serif text-(--accent)">{active.label}</span> creators
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Sample creators for the active niche */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {active.creators.map((creator) => (
              <motion.div
                key={`${active.slug}-${creator.handle}`}
                layoutId={`${active.slug}-${creator.handle}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-xl border border-(--border) bg-(--bg-secondary) p-4 card-hover"
              >
                <div className="h-10 w-10 rounded-full bg-(--bg-surface) border border-(--border-strong) flex items-center justify-center font-display font-bold text-sm text-(--text-primary) mb-3">
                  {creator.name.charAt(0)}
                </div>
                <p className="text-sm font-semibold text-(--text-primary) truncate">
                  {creator.name}
                </p>
                <p className="font-mono-utility text-[0.6rem] text-(--text-tertiary) mt-0.5">
                  {creator.handle}
                </p>
                <p className="font-mono-utility text-[0.6rem] text-(--accent) mt-2">
                  {creator.followers}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
