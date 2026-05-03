import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReactLenis } from "lenis/react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import InitialLoader from "@/components/InitialLoader";
import EasterEgg from "@/components/EasterEgg";
import Providers from "@/app/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CreatorLyff — Creator Marketplace",
    template: "%s | CreatorLyff",
  },
  description:
    "The intelligent marketplace connecting brands with world-class creators — by niche, audience, and authenticity. No more cold DMs.",
  keywords: [
    "creator marketplace",
    "influencer platform",
    "brand creator collaboration",
    "creator economy",
    "content creator deals",
  ],
  authors: [{ name: "CreatorLyff" }],
  openGraph: {
    type: "website",
    siteName: "CreatorLyff",
    title: "CreatorLyff — Creator Marketplace",
    description:
      "The intelligent marketplace connecting brands with world-class creators.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreatorLyff — Creator Marketplace",
    description:
      "Discover, match, and collaborate with world-class creators.",
    creator: "@creatorlyff",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-(--bg-primary) text-(--text-primary) flex flex-col">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9998] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-(--accent) focus:text-(--bg-primary) focus:font-medium focus:text-sm"
        >
          Skip to content
        </a>

        <ReactLenis
          root
          options={{
            lerp: 0.1,
            duration: 1.2,
            smoothWheel: true,
            // syncTouch: false prevents Lenis conflicting with native iOS scroll
            syncTouch: false,
          }}
        >
          <Providers>
            <Cursor />
            <InitialLoader />
            <EasterEgg />
            <Navigation />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </Providers>
        </ReactLenis>
      </body>
    </html>
  );
}
