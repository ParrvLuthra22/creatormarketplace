import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The creator economy is broken. We're fixing it. Learn how CreatorLyff is building the LinkedIn + Upwork for creator-brand collaboration.",
  openGraph: {
    title: "About CreatorLyff",
    description: "The creator economy is broken. We're fixing it.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
