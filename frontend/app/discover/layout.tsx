import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Creators",
  description:
    "Browse 10,000+ verified creators across every niche. Filter by audience, platform, engagement rate, and more.",
  openGraph: {
    title: "Discover Creators | CreatorLyff",
    description:
      "Browse verified creators across tech, fitness, lifestyle, food, travel, and more.",
  },
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
