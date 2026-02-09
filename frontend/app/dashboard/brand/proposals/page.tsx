"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { RouteGuard } from "@/components/RouteGuard";
import { BrandRightSidebar } from "@/components/BrandRightSidebar";
import { ArrowRight, Plus } from "lucide-react";

const PROPOSALS = [
    { creator: "Priya Sharma", campaign: "Skincare Campaign", budget: "₹15,000", dateSent: "Jan 28, 2026", status: "Accepted", avatar: "PS" },
    { creator: "Arjun Mehta", campaign: "Fitness App Promo", budget: "₹8,000", dateSent: "Jan 27, 2026", status: "Sent", avatar: "AM" },
    { creator: "Zara Khan", campaign: "Beauty Launch", budget: "₹12,000", dateSent: "Jan 26, 2026", status: "Sent", avatar: "ZK" },
    { creator: "Rahul Verma", campaign: "Tech Review", budget: "₹10,000", dateSent: "Jan 25, 2026", status: "Accepted", avatar: "RV" },
    { creator: "Anjali Desai", campaign: "Food Campaign", budget: "₹7,500", dateSent: "Jan 24, 2026", status: "Sent", avatar: "AD" },
    { creator: "Kabir Singh", campaign: "Comedy Collab", budget: "₹9,000", dateSent: "Jan 23, 2026", status: "Declined", avatar: "KS" },
    { creator: "Meera Patel", campaign: "Finance Tips", budget: "₹6,000", dateSent: "Jan 22, 2026", status: "Sent", avatar: "MP" },
    { creator: "Vikram Rao", campaign: "Travel Vlog", budget: "₹11,000", dateSent: "Jan 21, 2026", status: "Accepted", avatar: "VR" },
];

const FILTER_TABS = ["All", "Sent", "Accepted", "Declined"];

export default function BrandProposals() {
    const { user } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState("All");

    const filteredProposals = selectedFilter === "All"
        ? PROPOSALS
        : PROPOSALS.filter(p => p.status === selectedFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Accepted": return "bg-[#1A2A1A]";
            case "Declined": return "bg-[#2A1A1A]";
            default: return "bg-[#1F1F1F]";
        }
    };

    return (
        <RouteGuard allowedRole="brand">
            <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
                <div className="hidden md:block">
                    <DashboardSidebar
                        userName={user?.fullName || "Brand User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px]">
                    {/* Page Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-[28px] font-bold text-white font-milker">Proposals</h1>
                        <button className="px-5 h-11 bg-white text-black rounded-[10px] font-angelo text-sm font-semibold hover:opacity-85 transition-opacity flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Proposal
                        </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-2 mb-4">
                        {FILTER_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSelectedFilter(tab)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-angelo transition-colors ${selectedFilter === tab
                                    ? "bg-white text-black"
                                    : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Proposals List */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] overflow-hidden">
                        {/* Column Headers */}
                        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] items-center px-5 py-3 border-b border-[#1F1F1F]">
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">CREATOR</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">CAMPAIGN</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">BUDGET</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">DATE SENT</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">STATUS</div>
                            <div></div>
                        </div>

                        {/* Proposal Rows */}
                        {filteredProposals.map((proposal, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_40px] items-center px-5 py-3.5 border-b border-[#1F1F1F] last:border-b-0 h-16 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                            >
                                {/* Creator */}
                                <div className="flex items-center gap-3">
                                    <div className="w-[38px] h-[38px] rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                        {proposal.avatar}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{proposal.creator}</p>
                                    </div>
                                </div>

                                {/* Campaign */}
                                <div className="text-sm text-white truncate">{proposal.campaign}</div>

                                {/* Budget */}
                                <div className="text-sm text-white font-angelo">{proposal.budget}</div>

                                {/* Date Sent */}
                                <div className="text-[13px] text-[#6B6B6B]">{proposal.dateSent}</div>

                                {/* Status */}
                                <div>
                                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] text-white font-angelo ${getStatusColor(proposal.status)}`}>
                                        {proposal.status}
                                    </span>
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center justify-center">
                                    <ArrowRight className="w-[18px] h-[18px] text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <BrandRightSidebar />

                <MobileBottomNav role="brand" />
            </div>
        </RouteGuard>
    );
}
