import ScrollProgressBar from "@/components/ScrollProgressBar";
import HeroSection from "@/components/sections/HeroSection";
import BrandMarquee from "@/components/sections/BrandMarquee";
import HowItWorks from "@/components/sections/HowItWorks";
import CreatorShowcase from "@/components/sections/CreatorShowcase";
import SplitCTA from "@/components/sections/SplitCTA";
import StatsStrip from "@/components/sections/StatsStrip";
import WaitlistCTA from "@/components/sections/WaitlistCTA";

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <HeroSection />
      <BrandMarquee />
      <HowItWorks />
      <CreatorShowcase />
      <SplitCTA />
      <StatsStrip />
      <WaitlistCTA />
    </>
  );
}
