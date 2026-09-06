"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import TheProblemSpotlight from "@/components/sections/TheProblemSpotlight";
import BrandMarquee from "@/components/sections/BrandMarquee";
import NicheExplorer from "@/components/sections/NicheExplorer";
import BentoFeatures from "@/components/sections/BentoFeatures";
import CreatorShowcase from "@/components/sections/CreatorShowcase";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import SplitCTA from "@/components/sections/SplitCTA";
import StatsStrip from "@/components/sections/StatsStrip";
import WaitlistCTA from "@/components/sections/WaitlistCTA";

// FeatureScrollThrough uses an IntersectionObserver, which needs the real
// browser/DOM — load it client-only and off the critical path.
const FeatureScrollThrough = dynamic(() => import("@/components/sections/FeatureScrollThrough"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <TheProblemSpotlight />
      <BrandMarquee />
      <FeatureScrollThrough />
      <NicheExplorer />
      <BentoFeatures />
      <CreatorShowcase />
      <TestimonialMarquee />
      <SplitCTA />
      <StatsStrip />
      <WaitlistCTA />
    </>
  );
}
