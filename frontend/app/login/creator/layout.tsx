import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Login",
  description: "Sign in to your CreatorLyff creator account to manage your profile and inbound collabs.",
  robots: { index: false },
};

export default function CreatorLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
