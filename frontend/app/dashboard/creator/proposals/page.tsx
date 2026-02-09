"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorSidebar } from "@/components/CreatorSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ProposalCard } from "@/components/ProposalCard";
import { CreatorRightSidebar } from "@/components/CreatorRightSidebar";

const PROPOSALS = [
    { id: 1, brandName: "FitLife Nutrition", title: "Protein Shake Launch", brandLogo: "FL", budget: 15000, deliverables: "2 Reels, 3 Stories", deadline: "2026-02-15", status: "new" as const },
    { id: 2, brandName: "Urban Threads", title: "Summer Collection", brandLogo: "UT", budget: 22000, deliverables: "1 Reel, 5 Posts", deadline: "2026-02-28", status: "new" as const },
    { id: 3, brandName: "GlowUp Skincare", title: "Skincare Routine", brandLogo: "GS", budget: 8000, deliverables: "3 Reels", deadline: "2026-03-05", status: "new" as const },
    { id: 4, brandName: "TechVerse", title: "Gadget Review", brandLogo: "TV", budget: 12000, deliverables: "1 Video, 2 Posts", deadline: "2026-02-20", status: "new" as const },
    { id: 5, brandName: "NatureBite", title: "Organic Campaign", brandLogo: "NB", budget: 9500, deliverables: "4 Stories, 2 Posts", deadline: "2026-01-30", status: "accepted" as const },
    { id: 6, brandName: "PixelArt Studio", title: "Design Tools", brandLogo: "PA", budget: 6000, deliverables: "2 Reels", deadline: "2026-01-22", status: "accepted" as const },
    { id: 7, brandName: "QuickFit App", title: "App Promo", brandLogo: "QF", budget: 5000, deliverables: "1 Reel, 3 Stories", deadline: "2026-01-10", status: "declined" as const },
];

const FILTER_TABS = [
    { label: "All", count: null },
    { label: "New", count: 4 },
    { label: "Accepted", count: 2 },
    { label: "Declined", count: 1 },
];

export default function CreatorProposals() {
    const { user } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState("All");

    const filteredProposals = selectedFilter === "All"
        ? PROPOSALS
        : PROPOSALS.filter(p => {
            const statusMap: Record<string, string> = { "New": "new", "Accepted": "accepted", "Declined": "declined" };
            return p.status === statusMap[selectedFilter];
        });

    return (
        <RouteGuard allowedRole="creator">
            <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
                <div className="hidden md:block">
                    <CreatorSidebar
                        userName={user?.fullName || "Creator User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px]">
                    <h1 className="text-[28px] font-bold text-white font-milker mb-8">Proposals</h1>

                    {/* Filter Pills */}
                    <div className="flex gap-2 mb-4">
                        {FILTER_TABS.map(tab => (
                            <button
                                key={tab.label}
                                onClick={() => setSelectedFilter(tab.label)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-angelo transition-colors ${selectedFilter === tab.label
                                    ? "bg-white text-black"
                                    : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
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
                                    // Handle proposal click - could open modal or navigate
                                }}
                            />
                        ))}
                    </div>
                </main>

                <CreatorRightSidebar />

                <MobileBottomNav role="creator" />
            </div>
        </RouteGuard>
    );
}
