"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorSidebar } from "@/components/CreatorSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ProposalCard } from "@/components/ProposalCard";
import { CreatorRightSidebar } from "@/components/CreatorRightSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const PROPOSALS = [
    { id: 1, brandName: "FitLife Nutrition", title: "Protein Shake Launch", brandLogo: "/images/brand-placeholder.png", budget: 15000, deliverables: "2 Reels, 3 Stories", deadline: "2026-02-15", status: "new" as const },
    { id: 2, brandName: "Urban Threads", title: "Summer Collection", brandLogo: "/images/brand-placeholder.png", budget: 22000, deliverables: "1 Reel, 5 Posts", deadline: "2026-02-28", status: "new" as const },
    { id: 3, brandName: "GlowUp Skincare", title: "Skincare Routine", brandLogo: "/images/brand-placeholder.png", budget: 8000, deliverables: "3 Reels", deadline: "2026-03-05", status: "new" as const },
    { id: 4, brandName: "TechVerse", title: "Gadget Review", brandLogo: "/images/brand-placeholder.png", budget: 12000, deliverables: "1 Video, 2 Posts", deadline: "2026-02-20", status: "new" as const },
    { id: 5, brandName: "NatureBite", title: "Organic Campaign", brandLogo: "/images/brand-placeholder.png", budget: 9500, deliverables: "4 Stories, 2 Posts", deadline: "2026-01-30", status: "accepted" as const },
    { id: 6, brandName: "PixelArt Studio", title: "Design Tools", brandLogo: "/images/brand-placeholder.png", budget: 6000, deliverables: "2 Reels", deadline: "2026-01-22", status: "accepted" as const },
    { id: 7, brandName: "QuickFit App", title: "App Promo", brandLogo: "/images/brand-placeholder.png", budget: 5000, deliverables: "1 Reel, 3 Stories", deadline: "2026-01-10", status: "declined" as const },
];

const FILTER_TABS = [
    { label: "All", count: null },
    { label: "New", count: 4 },
    { label: "Accepted", count: 2 },
    { label: "Declined", count: 1 },
];

export default function CreatorProposals() {
    const { user, logout } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState("All");

    const filteredProposals = selectedFilter === "All"
        ? PROPOSALS
        : PROPOSALS.filter(p => {
            const statusMap: Record<string, string> = { "New": "new", "Accepted": "accepted", "Declined": "declined" };
            return p.status === statusMap[selectedFilter];
        });

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <RouteGuard allowedRole="creator">
            <div className="min-h-screen bg-[#0A0A0A] text-[#F5F1E8] font-sf-pro">

                {/* Fixed Header */}
                <DashboardHeader
                    user={user || { fullName: "Creator", accountType: "Creator", email: "", id: "", plan: "free", createdAt: new Date().toISOString() }}
                    onLogout={handleLogout}
                />

                {/* Left Sidebar */}
                <div className="hidden md:block">
                    <CreatorSidebar
                        userName={user?.fullName || "Creator User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                {/* Right Sidebar */}
                <div className="hidden xl:block">
                    <CreatorRightSidebar />
                </div>

                {/* Main Content - REMOVED xl:mr-[320px] to fix overlap with hover sidebar */}
                <main className="pt-24 pb-24 md:pb-12 px-6 md:ml-[240px] min-h-screen transition-all duration-300">
                    <div className="max-w-[1240px] mx-auto">
                        <h1 className="text-[28px] font-bold text-[#F5F1E8] font-milker mb-8">Proposals</h1>

                        {/* Filter Pills */}
                        <div className="flex gap-2 mb-8 flex-wrap">
                            {FILTER_TABS.map(tab => (
                                <button
                                    key={tab.label}
                                    onClick={() => setSelectedFilter(tab.label)}
                                    className={`px-4 py-2 rounded-full text-xs font-angelo font-semibold tracking-wide transition-all duration-200 ${selectedFilter === tab.label
                                        ? "bg-[#F5F1E8] text-[#0A0A0A] shadow-[0_0_12px_rgba(245,241,232,0.3)]"
                                        : "bg-[#141414] text-[#6B6B6B] border border-[#2A2A2A] hover:border-[#F5F1E8] hover:text-[#F5F1E8]"
                                        }`}
                                >
                                    {tab.label}{tab.count !== null ? ` (${tab.count})` : ''}
                                </button>
                            ))}
                        </div>

                        {/* Proposals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProposals.map((proposal) => (
                                <ProposalCard
                                    key={proposal.id}
                                    proposal={proposal}
                                    onClick={() => {
                                        console.log('Clicked proposal:', proposal.id);
                                    }}
                                />
                            ))}
                        </div>

                        {filteredProposals.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-[#6B6B6B]">
                                <p className="font-milker text-xl opacity-50">No proposals found</p>
                            </div>
                        )}
                    </div>
                </main>

                <MobileBottomNav role="creator" />
            </div>
        </RouteGuard>
    );
}
