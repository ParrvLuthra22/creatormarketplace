"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Search, Bell, TrendingUp, Users, Clock, ArrowRight } from "lucide-react";

// Dummy creator data
const CREATORS = [
    { name: "Priya Sharma", handle: "@priyacreates", niche: "Fashion", followers: "45.2K", engagement: "4.5%", price: "₹5,000", avatar: "PS" },
    { name: "Arjun Mehta", handle: "@arjunfit", niche: "Fitness", followers: "32.1K", engagement: "5.2%", price: "₹4,000", avatar: "AM" },
    { name: "Zara Khan", handle: "@zarastyle", niche: "Beauty", followers: "28.7K", engagement: "3.8%", price: "₹3,500", avatar: "ZK" },
    { name: "Rahul Verma", handle: "@techrahul", niche: "Tech", followers: "67.4K", engagement: "6.1%", price: "₹8,000", avatar: "RV" },
    { name: "Anjali Desai", handle: "@foodwithanjali", niche: "Food", followers: "51.2K", engagement: "4.9%", price: "₹6,000", avatar: "AD" },
    { name: "Kabir Singh", handle: "@kabircomedy", niche: "Comedy", followers: "89.3K", engagement: "7.3%", price: "₹10,000", avatar: "KS" },
    { name: "Meera Patel", handle: "@meerafinance", niche: "Finance", followers: "23.8K", engagement: "3.2%", price: "₹3,000", avatar: "MP" },
    { name: "Vikram Rao", handle: "@viktravel", niche: "Travel", followers: "41.6K", engagement: "4.7%", price: "₹5,500", avatar: "VR" },
    { name: "Shreya Gupta", handle: "@shreyabeauty", niche: "Beauty", followers: "38.9K", engagement: "5.0%", price: "₹4,500", avatar: "SG" },
    { name: "Aditya Kumar", handle: "@adifitness", niche: "Fitness", followers: "55.1K", engagement: "5.8%", price: "₹7,000", avatar: "AK" },
    { name: "Pooja Jain", handle: "@poojastyle", niche: "Fashion", followers: "72.4K", engagement: "4.2%", price: "₹9,000", avatar: "PJ" },
    { name: "Rohan Das", handle: "@rohantech", niche: "Tech", followers: "61.8K", engagement: "6.5%", price: "₹7,500", avatar: "RD" },
];

const PROPOSALS = [
    { name: "Priya Sharma", campaign: "Skincare Campaign", amount: "₹15,000", status: "Accepted", avatar: "PS" },
    { name: "Arjun Mehta", campaign: "Fitness App Promo", amount: "₹8,000", status: "Sent", avatar: "AM" },
    { name: "Zara Khan", campaign: "Beauty Launch", amount: "₹12,000", status: "Viewed", avatar: "ZK" },
];

const FILTER_NICHES = ["All", "Fashion", "Fitness", "Tech", "Beauty"];

export default function BrandDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState("All");

    const filteredCreators = selectedFilter === "All"
        ? CREATORS
        : CREATORS.filter(c => c.niche === selectedFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Accepted": return "bg-[#1A2A1A]";
            case "Viewed": return "bg-[#1A1A2A]";
            case "Declined": return "bg-[#2A1A1A]";
            default: return "bg-[#1F1F1F]";
        }
    };

    return (
        <RouteGuard allowedRole="brand">
            <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
                {/* LEFT SIDEBAR - Hidden on mobile */}
                <div className="hidden md:block">
                    <DashboardSidebar
                        userName={user?.fullName || "Brand User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px]">
                    {/* PAGE HEADER */}
                    <div className="flex justify-between items-center mb-7">
                        <h1 className="text-[28px] font-bold text-white font-milker">Home</h1>
                        <div className="flex items-center gap-4">
                            <Search className="w-5 h-5 text-[#6B6B6B] cursor-pointer hover:text-white transition-colors" />
                            <Bell className="w-5 h-5 text-[#6B6B6B] cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>

                    {/* STAT CARDS ROW */}
                    <div className="grid grid-cols-3 gap-4 mb-8 stat-cards-grid">
                        {/* Card 1 */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5 relative stat-card">
                            <TrendingUp className="absolute top-5 right-5 w-5 h-5 text-[#3D3D3D]" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">TOTAL SPEND</p>
                            <p className="text-[30px] text-white font-angelo mt-2">₹1,24,500</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">Across 8 collaborations</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5 relative stat-card">
                            <Users className="absolute top-5 right-5 w-5 h-5 text-[#3D3D3D]" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">CREATORS HIRED</p>
                            <p className="text-[30px] text-white font-angelo mt-2">8</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">Active collaborations</p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5 relative stat-card">
                            <Clock className="absolute top-5 right-5 w-5 h-5 text-[#3D3D3D]" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">PENDING</p>
                            <p className="text-[30px] text-white font-angelo mt-2">3</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">Awaiting response</p>
                        </div>
                    </div>

                    {/* CREATOR LIST */}
                    <div>
                        {/* Section Header with Filters */}
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-bold text-white font-milker">Creators</h2>
                            <div className="flex gap-2 filter-pills">
                                {FILTER_NICHES.map(niche => (
                                    <button
                                        key={niche}
                                        onClick={() => setSelectedFilter(niche)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-angelo transition-colors ${selectedFilter === niche
                                            ? "bg-white text-black"
                                            : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                                            }`}
                                    >
                                        {niche}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List Container */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] overflow-hidden">
                            {/* Column Headers */}
                            <div className="creator-list-header grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] items-center px-5 py-3 border-b border-[#1F1F1F]">
                                <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">CREATOR</div>
                                <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest niche-col">NICHE</div>
                                <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest followers-col">FOLLOWERS</div>
                                <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest engagement-col">ENGAGEMENT</div>
                                <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest price-col">PRICE</div>
                                <div></div>
                            </div>

                            {/* Creator Rows */}
                            {filteredCreators.map((creator, index) => (
                                <div
                                    key={index}
                                    className="creator-row grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] items-center px-5 py-3.5 border-b border-[#1F1F1F] last:border-b-0 h-16 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                                >
                                    {/* Creator Column */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-[38px] h-[38px] rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 creator-avatar">
                                            {creator.avatar}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{creator.name}</p>
                                            <p className="text-xs text-[#6B6B6B] font-angelo truncate">{creator.handle}</p>
                                        </div>
                                    </div>

                                    {/* Niche Column */}
                                    <div className="niche-col">
                                        <span className="inline-block px-2.5 py-1 rounded-xl text-[11px] bg-[#1F1F1F] text-white font-angelo">
                                            {creator.niche}
                                        </span>
                                    </div>

                                    {/* Followers */}
                                    <div className="text-sm text-white followers-col">{creator.followers}</div>

                                    {/* Engagement */}
                                    <div className="text-sm text-[#6B6B6B] engagement-col">{creator.engagement}</div>

                                    {/* Price */}
                                    <div className="text-sm text-white font-angelo price-col">{creator.price}</div>

                                    {/* Arrow */}
                                    <div className="flex items-center justify-center">
                                        <ArrowRight className="w-[18px] h-[18px] text-white" />
                                    </div>
                                </div>
                            ))}

                            {/* See All Row */}
                            <div className="text-center py-4 border-t border-[#1F1F1F] cursor-pointer hover:bg-[#1A1A1A] transition-colors">
                                <span className="text-[13px] text-white font-angelo">See all creators →</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* RIGHT WIDGETS SIDEBAR */}
                <aside className="hidden lg:flex w-[280px] px-5 pl-4 py-8 flex-col gap-4 overflow-y-auto">
                    {/* WIDGET 1 - Quick Actions */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5">
                        <h3 className="text-base font-bold text-white font-milker mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-2.5">
                            <button className="w-full h-11 bg-white text-black rounded-[10px] font-angelo text-sm font-semibold hover:opacity-85 transition-opacity">
                                Send Proposal
                            </button>
                            <button className="w-full h-11 bg-transparent border border-white text-white rounded-[10px] font-angelo text-sm font-semibold hover:opacity-85 transition-opacity">
                                Browse Creators
                            </button>
                        </div>
                    </div>

                    {/* WIDGET 2 - Recent Proposals */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5">
                        <h3 className="text-base font-bold text-white font-milker mb-4">Recent Proposals</h3>
                        <div>
                            {PROPOSALS.slice(0, 3).map((proposal, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 py-2.5 border-b border-[#1F1F1F] last:border-b-0"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                        {proposal.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] text-white truncate">{proposal.name}</p>
                                        <p className="text-[11px] text-[#6B6B6B] truncate">{proposal.campaign}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <p className="text-[13px] text-white font-angelo">{proposal.amount}</p>
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] text-white font-angelo ${getStatusColor(proposal.status)}`}>
                                            {proposal.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div
                            className="text-center mt-2.5 cursor-pointer"
                            onClick={() => router.push('/dashboard/brand/proposals')}
                        >
                            <span className="text-xs text-white font-angelo hover:opacity-85 transition-opacity">View all →</span>
                        </div>
                    </div>
                </aside>

                {/* MOBILE BOTTOM NAV */}
                <MobileBottomNav role="brand" />
            </div>

            <style jsx global>{`
                /* Responsive Breakpoints */
                @media (max-width: 1200px) {
                    .widgets-sidebar {
                        display: none;
                    }
                }

                @media (max-width: 768px) {
                    .brand-main-content {
                        padding: 16px;
                    }

                    .stat-cards-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .filter-pills {
                        flex-wrap: wrap;
                    }

                    .creator-list-header,
                    .creator-row {
                        grid-template-columns: 2fr 1fr 1fr 40px;
                    }

                    .engagement-col,
                    .price-col {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .stat-cards-grid {
                        grid-template-columns: 1fr;
                    }

                    .creator-list-header,
                    .creator-row {
                        grid-template-columns: 2fr 1fr 40px;
                    }

                    .niche-col {
                        display: none;
                    }

                    .creator-row {
                        height: 56px;
                    }

                    .creator-avatar {
                        width: 32px !important;
                        height: 32px !important;
                    }
                }
            `}</style>
        </RouteGuard>
    );
}
