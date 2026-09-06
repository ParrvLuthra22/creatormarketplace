"use client";

import { Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

// Fictional placeholder quotes — not real brands, creators, or people.
const BRAND_QUOTES: Testimonial[] = [
  { quote: "We found our top-performing creator in under a week. No agency fees, no cold outreach.", name: "Meera Krishnan", role: "Growth Lead, Lumen Skincare" },
  { quote: "The proposal flow alone saved us hours of back-and-forth every campaign.", name: "Tom Ashby", role: "Marketing Director, Northside Coffee Co." },
  { quote: "Finally a platform where the engagement numbers are actually trustworthy.", name: "Divya Rajan", role: "Brand Manager, Palette Studio" },
  { quote: "We went from zero to five live collaborations in our first month on the waitlist.", name: "Chris Holloway", role: "Founder, Fielder Outdoor" },
  { quote: "Real-time chat with creators changed how fast we can turn campaigns around.", name: "Aisha Ndiaye", role: "CMO, Vantpoint" },
];

const CREATOR_QUOTES: Testimonial[] = [
  { quote: "Brands reach out to me now instead of the other way around. That alone is worth it.", name: "Rhea Kapoor", role: "Fashion & Lifestyle Creator" },
  { quote: "The verification badge got me three inbound deals in my first two weeks.", name: "Owen Baptiste", role: "Tech Reviewer" },
  { quote: "No more chasing brands for a brief — everything arrives structured and clear.", name: "Nandini Rao", role: "Food & Culture Creator" },
  { quote: "It's the first platform that actually shows my real audience data to brands.", name: "Felix Amaro", role: "Fitness Creator" },
  { quote: "I stopped negotiating over DMs entirely. Proposals just work better.", name: "Simone Achebe", role: "Beauty Creator" },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="w-80 shrink-0 rounded-2xl border border-(--border) bg-(--bg-secondary) p-6">
      <Quote size={18} className="text-(--accent) mb-3" />
      <p className="text-sm text-(--text-secondary) leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-(--bg-surface) border border-(--border-strong) flex items-center justify-center font-display font-bold text-xs text-(--text-primary)">
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-semibold text-(--text-primary)">{t.name}</p>
          <p className="font-mono-utility text-[0.6rem] text-(--text-tertiary)">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function VerticalColumn({ items, direction, speed }: { items: Testimonial[]; direction: "up" | "down"; speed: number }) {
  return (
    <div className="h-[560px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div
        className={cn(
          "flex flex-col gap-5",
          direction === "up" ? "animate-[marquee-up_linear_infinite]" : "animate-[marquee-down_linear_infinite]",
          "hover:[animation-play-state:paused]"
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
        <div className="flex flex-col gap-5" aria-hidden>
          {items.map((t, i) => (
            <TestimonialCard key={`dup-${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialMarquee() {
  return (
    <section className="py-32 md:py-40 bg-(--bg-primary)" aria-labelledby="testimonials-heading">
      <Container>
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-4 block">
            08 — TRUSTED VOICES
          </span>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h2 id="testimonials-heading" className="text-h1 font-display mb-14 max-w-2xl">
            From brands and creators{" "}
            <span className="font-serif text-(--text-secondary)">already in.</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          <VerticalColumn items={BRAND_QUOTES} direction="up" speed={34} />
          <VerticalColumn items={CREATOR_QUOTES} direction="down" speed={30} />
        </div>
      </Container>
    </section>
  );
}
