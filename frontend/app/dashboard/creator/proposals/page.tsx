"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorSidebar } from "@/components/CreatorSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ArrowRight } from "lucide-react";

const PROPOSALS = [
    { brand: "FitLife Nutrition", campaign: "Protein Shake Launch", content: "2 Reels, 3 Stories", budget: "₹15,000", deadline: "Feb 15, 2026", status: "New", avatar: "FL" },
    { brand: "Urban Threads", campaign: "Summer Collection", content: "1 Reel, 5 Posts", budget: "₹22,000", deadline: "Feb 28, 2026", status: "New", avatar: "UT" },
    { brand: "GlowUp Skincare", campaign: "Skincare Routine", content: "3 Reels", budget: "₹8,000", deadline: "Mar 5, 2026", status: "New", avatar: "GS" },
    { brand: "TechVerse", campaign: "Gadget Review", content: "1 Video, 2 Posts", budget: "₹12,000", deadline: "Feb 20, 2026", status: "New", avatar: "TV" },
    { brand: "NatureBite", campaign: "Organic Campaign", content: "4 Stories, 2 Posts", budget: "₹9,500", deadline: "Jan 30, 2026", status: "Accepted", avatar: "NB" },
    { brand: "PixelArt Studio", campaign: "Design Tools", content: "2 Reels", budget: "₹6,000", deadline: "Jan 22, 2026", status: "Accepted", avatar: "PA" },
    { brand: "QuickFit App", campaign: "App Promo", content: "1 Reel, 3 Stories", budget: "₹5,000", deadline: "Jan 10, 2026", status: "Declined", avatar: "QF" },
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
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const filteredProposals = selectedFilter === "All"
        ? PROPOSALS
        : PROPOSALS.filter(p => p.status === selectedFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Accepted": return "bg-[#1A2A1A]";
            case "New": return "bg-[#1A1A2A]";
            case "Declined": return "bg-[#2A1A1A]";
            default: return "bg-[#1F1F1F]";
        }
    };

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

                    {/* Proposals List */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] overflow-hidden">
                        {/* Column Headers */}
                        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_140px] items-center px-5 py-3 border-b border-[#1F1F1F]">
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">BRAND</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">CAMPAIGN</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">BUDGET</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">DEADLINE</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">STATUS</div>
                            <div></div>
                        </div>

                        {/* Proposal Rows */}
                        {filteredProposals.map((proposal, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setHoveredRow(index)}
                                onMouseLeave={() => setHoveredRow(null)}
                                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_140px] items-center px-5 py-3.5 border-b border-[#1F1F1F] last:border-b-0 h-16 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                            >
                                {/* Brand */}
                                <div className="flex items-center gap-3">
                                    <div className="w-[38px] h-[38px] rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                        {proposal.avatar}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{proposal.brand}</p>
                                    </div>
                                </div>

                                {/* Campaign */}
                                <div className="min-w-0">
                                    <p className="text-sm text-white truncate">{proposal.campaign}</p>
                                    <p className="text-[11px] text-[#6B6B6B] font-angelo truncate">{proposal.content}</p>
                                </div>

                                {/* Budget */}
                                <div className="text-sm text-white font-angelo">{proposal.budget}</div>

                                {/* Deadline */}
                                <div className="text-[13px] text-[#6B6B6B]">{proposal.deadline}</div>

                                {/* Status */}
                                <div>
                                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] text-white font-angelo ${getStatusColor(proposal.status)}`}>
                                        {proposal.status}
                                    </span>
                                </div>

                                {/* Actions (show on hover for New proposals) */}
                                <div className="flex items-center justify-end gap-2">
                                    {hoveredRow === index && proposal.status === "New" ? (
                                        <>
                                            <button className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-angelo font-semibold hover:opacity-85 transition-opacity">
                                                Accept
                                            </button>
                                            <button className="px-3 py-1.5 bg-transparent border border-white text-white rounded-lg text-xs font-angelo font-semibold hover:bg-white/10 transition-colors">
                                                Decline
                                            </button>
                                        </>
                                    ) : (
                                        <ArrowRight className="w-[18px] h-[18px] text-white" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <aside className="hidden lg:block w-[280px]" />

                <MobileBottomNav role="creator" />
            </div>
        </RouteGuard>
    );
}
