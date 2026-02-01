import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "CreatorMarket - Connect Brands with Creators",
  description: "The professional marketplace for Instagram creators and brands. Connect, collaborate, and grow.",
  keywords: ["creators", "brands", "influencer marketing", "Instagram", "collaboration"],
  openGraph: {
    title: "CreatorMarket",
    description: "Connect brands with creators",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
