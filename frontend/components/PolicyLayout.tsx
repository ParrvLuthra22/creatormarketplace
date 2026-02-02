"use client";

import { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";

interface PolicyLayoutProps {
    title: string;
    lastUpdated: string;
    children: ReactNode;
}

export function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <PublicHeader />

            {/* Main Content */}
            <main className="max-w-[820px] mx-auto px-8 md:px-4 pt-[64px] pb-20">
                {/* Page Header */}
                <div className="pt-16 pb-9">
                    <h1 className="text-4xl md:text-[36px] font-milker text-white mb-2">
                        {title}
                    </h1>
                    <p className="text-[13px] text-[#6B6B6B]">
                        Last updated: {lastUpdated}
                    </p>
                </div>

                {/* Content Container */}
                <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl px-9 py-10 md:px-[36px] md:py-[40px]">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center">
                <p className="text-[13px] text-[#3D3D3D]">
                    © 2026 CreatorSync. All rights reserved.
                </p>
            </footer>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    main {
                        padding-left: 20px;
                        padding-right: 20px;
                        padding-top: 48px;
                        padding-bottom: 60px;
                    }
                    
                    main > div:first-child {
                        padding-top: 48px;
                        padding-bottom: 36px;
                    }
                    
                    h1 {
                        font-size: 28px !important;
                    }
                    
                    main > div:last-of-type {
                        padding: 28px 24px;
                    }
                }

                @media (max-width: 480px) {
                    main {
                        padding-left: 16px;
                        padding-right: 16px;
                        padding-top: 40px;
                        padding-bottom: 50px;
                    }
                    
                    h1 {
                        font-size: 24px !important;
                    }
                    
                    main > div:last-of-type {
                        padding: 24px 20px;
                    }
                }
            `}</style>
        </div>
    );
}
