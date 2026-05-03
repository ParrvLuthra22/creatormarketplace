import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for brands and creators. Free during beta — no credit card required.",
  openGraph: {
    title: "Pricing | CreatorLyff",
    description:
      "Simple, transparent pricing. Free during beta for brands and creators.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
