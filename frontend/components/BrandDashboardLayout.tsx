"use client";

import { ReactNode } from "react";
import { BrandNavbar } from "./BrandNavbar";

interface BrandDashboardLayoutProps {
    children: ReactNode;
    variant?: "gradient" | "white";
}

export function BrandDashboardLayout({ children, variant = "gradient" }: BrandDashboardLayoutProps) {
    const isWhite = variant === "white";

    return (
        <div 
            className={`min-h-screen selection:bg-[#FF4D00] selection:text-white ${isWhite ? "bg-[#FAFAFA] text-zinc-900" : "text-zinc-900"}`} 
            style={!isWhite ? { background: "linear-gradient(135deg, #FF4D00 0%, #FF05A8 100%)" } : {}}
        >
            <BrandNavbar />
            {/* Main Content - offset by navbar height */}
            <main className="pt-[64px]">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
