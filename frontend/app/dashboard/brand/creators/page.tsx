"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Search, Bell, ArrowRight } from "lucide-react";

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

const FILTER_NICHES = ["All", "Fashion", "Fitness", "Tech", "Beauty", "Food", "Travel", "Comedy", "Finance"];

export default function BrandCreators() {
    const { user } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCreators = CREATORS.filter(creator => {
        const matchesNiche = selectedFilter === "All" || creator.niche === selectedFilter;
        const matchesSearch = searchQuery === "" ||
            creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            creator.handle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesNiche && matchesSearch;
    });

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
                    {/* PAGE HEADER */}
                    <div className="flex justify-between items-center mb-7">
                        <h1 className="text-[28px] font-bold text-white font-milker">Creators</h1>
                        <div className="flex items-center gap-4">
                            <Bell className="w-5 h-5 text-[#6B6B6B] cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                            <input
                                type="text"
                                placeholder="Search creators..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-[#141414] border border-[#1F1F1F] rounded-xl text-white text-sm focus:outline-none focus:border-[#3D3D3D] transition-colors"
                            />
                        </div>
                    </div>

                    {/* FILTER PILLS */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {FILTER_NICHES.map(niche => (
                            <button
                                key={niche}
                                onClick={() => setSelectedFilter(niche)}
                                className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors ${selectedFilter === niche
                                    ? "bg-white text-black"
                                    : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                                    }`}
                            >
                                {niche}
                            </button>
                        ))}
                    </div>

                    {/* CREATOR LIST */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] overflow-hidden">
                        {/* Column Headers */}
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] items-center px-5 py-3 border-b border-[#1F1F1F]">
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">CREATOR</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">NICHE</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">FOLLOWERS</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">ENGAGEMENT</div>
                            <div className="text-[10px] uppercase text-[#3D3D3D] tracking-widest">PRICE</div>
                            <div></div>
                        </div>

                        {/* Creator Rows */}
                        {filteredCreators.map((creator, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] items-center px-5 py-3.5 border-b border-[#1F1F1F] last:border-b-0 h-16 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                            >
                                {/* Creator Column */}
                                <div className="flex items-center gap-3">
                                    <div className="w-[38px] h-[38px] rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                        {creator.avatar}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{creator.name}</p>
                                        <p className="text-xs text-[#6B6B6B] font-angelo truncate">{creator.handle}</p>
                                    </div>
                                </div>

                                {/* Niche Column */}
                                <div>
                                    <span className="inline-block px-2.5 py-1 rounded-xl text-[11px] bg-[#1F1F1F] text-white font-angelo">
                                        {creator.niche}
                                    </span>
                                </div>

                                {/* Followers */}
                                <div className="text-sm text-white">{creator.followers}</div>

                                {/* Engagement */}
                                <div className="text-sm text-[#6B6B6B]">{creator.engagement}</div>

                                {/* Price */}
                                <div className="text-sm text-white font-angelo">{creator.price}</div>

                                {/* Arrow */}
                                <div className="flex items-center justify-center">
                                    <ArrowRight className="w-[18px] h-[18px] text-white" />
                                </div>
                            </div>
                        ))}

                        {filteredCreators.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-[#6B6B6B] text-sm">No creators found</p>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="hidden lg:block w-[280px]" />

                <MobileBottomNav role="brand" />
            </div>
        </RouteGuard>
    );
}
