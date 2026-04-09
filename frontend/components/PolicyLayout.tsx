"use client";

import { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";
import { Footer } from "./Footer";
import Link from "next/link";

interface PolicyLayoutProps {
    title: string;
    lastUpdated: string;
    children: ReactNode;
    badge?: string;
}

export function PolicyLayout({ title, lastUpdated, children, badge }: PolicyLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <PublicHeader />

            {/* Hero Header */}
            <div className="border-b border-[#1F1F1F] bg-[#0D0D0D]">
                <div className="max-w-[860px] mx-auto px-8 pt-28 pb-12">
                    {badge && (
                        <span className="inline-block px-3 py-1 bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[#FF4D00] text-[10px] font-angelo uppercase tracking-widest rounded-sm mb-5">
                            {badge}
                        </span>
                    )}
                    <h1 className="text-4xl md:text-5xl font-milker text-white mb-4 leading-tight">
                        {title}
                    </h1>
                    <p className="text-[13px] text-[#3D3D3D] font-angelo uppercase tracking-widest">
                        Last updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-[860px] mx-auto px-8 py-14">
                {/* Table of Contents placeholder stripe */}
                <div className="h-px bg-gradient-to-r from-[#FF4D00]/30 via-[#FF4D00]/10 to-transparent mb-10" />

                <div className="bg-[#111111] border border-[#1F1F1F] rounded-sm">
                    <div className="px-10 py-10 md:px-12 md:py-12">
                        {children}
                    </div>
                </div>

                {/* Back link */}
                <div className="mt-10 flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-[12px] font-angelo uppercase tracking-widest text-[#3D3D3D] hover:text-[#FF4D00] transition-colors"
                    >
                        ← Back to Home
                    </Link>
                    <span className="text-[#1F1F1F]">·</span>
                    <a
                        href="mailto:parrvcodes@gmail.com"
                        className="text-[12px] font-angelo uppercase tracking-widest text-[#3D3D3D] hover:text-[#FF4D00] transition-colors"
                    >
                        Contact Us
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
