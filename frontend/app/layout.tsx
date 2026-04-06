import type { Metadata } from "next";
import Script from "next/script";
import { Anton, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Footer } from "@/components/Footer";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800", "900"],
});

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
      <body className={`antialiased ${anton.variable} ${nunito.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer />
        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
