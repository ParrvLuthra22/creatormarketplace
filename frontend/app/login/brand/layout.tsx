import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Login",
  description: "Sign in to your CreatorLyff brand account to discover creators and manage campaigns.",
  robots: { index: false },
};

export default function BrandLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
