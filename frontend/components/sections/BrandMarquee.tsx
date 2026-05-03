"use client";

import Marquee from "@/components/ui/Marquee";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Container from "@/components/ui/Container";

const brands = [
  "NIKE",
  "FIGMA",
  "NOTION",
  "LINEAR",
  "VERCEL",
  "SPOTIFY",
  "CANVA",
  "FRAMER",
  "RAYCAST",
  "STRIPE",
];

function BrandLogo({ name }: { name: string }) {
  return (
    <span className="text-h3 font-display font-semibold text-(--text-tertiary) hover:text-(--text-primary) transition-colors duration-300 cursor-default select-none whitespace-nowrap px-8">
      {name}
    </span>
  );
}

export default function BrandMarquee() {
  return (
    <section
      className="py-20 border-t border-b border-(--border) overflow-hidden bg-(--bg-primary)"
      aria-label="Trusted brands"
    >
      <RevealOnScroll>
        <Container className="mb-12">
          <p className="font-mono-utility text-mono-sm text-(--text-tertiary) text-center">
            TRUSTED BY FORWARD-THINKING BRANDS
          </p>
        </Container>
      </RevealOnScroll>

      <div className="flex flex-col gap-4">
        {/* Row 1 → left */}
        <Marquee speed={50} direction="left" pauseOnHover>
          {brands.map((b) => (
            <BrandLogo key={b} name={b} />
          ))}
        </Marquee>

        {/* Row 2 → right */}
        <Marquee speed={45} direction="right" pauseOnHover>
          {brands
            .slice()
            .reverse()
            .map((b) => (
              <BrandLogo key={b} name={b} />
            ))}
        </Marquee>
      </div>
    </section>
  );
}
