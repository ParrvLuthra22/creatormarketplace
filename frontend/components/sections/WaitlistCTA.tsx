"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function SignupCTA() {
  return (
    <section
      id="signup"
      className="py-32 md:py-48 bg-(--bg-primary)"
      aria-labelledby="signup-heading"
    >
      <Container>
        <RevealOnScroll>
          <span className="font-mono-utility text-mono-sm text-(--text-tertiary) mb-8 block">
            07 — GET STARTED
          </span>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <h2
            id="signup-heading"
            className="text-hero font-display leading-[0.9] tracking-[-0.05em] mb-10"
          >
            Start building{" "}
            <span className="font-serif text-(--accent)">today.</span>
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <p className="text-body-lg text-(--text-secondary) max-w-lg mb-14 leading-relaxed">
            Join thousands of brands and creators already building authentic
            partnerships on CreatorLyff. Sign up free — no credit card required.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/login/brand"
              className="inline-flex items-center justify-center gap-3 h-16 px-10 rounded-full bg-(--accent) text-(--bg-primary) font-semibold text-body hover:bg-(--accent-hover) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) group"
              data-interactive
            >
              Sign up as a Brand
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/login/creator"
              className="inline-flex items-center justify-center gap-3 h-16 px-10 rounded-full border border-(--border-strong) text-(--text-primary) font-semibold text-body hover:border-(--text-primary) transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) group"
              data-interactive
            >
              Join as a Creator
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) mt-6">
            ALREADY HAVE AN ACCOUNT?{" "}
            <Link
              href="/login"
              className="text-(--text-secondary) hover:text-(--text-primary) transition-colors duration-200 underline underline-offset-4"
              data-interactive
            >
              LOG IN →
            </Link>
          </p>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
