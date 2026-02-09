"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CreatorGrid } from "@/components/CreatorGrid";
import { BrandRightSidebar } from "@/components/BrandRightSidebar";
import { Search, Bell } from "lucide-react";

// Dummy creator data - convert to new format with numeric followers
const CREATORS = [
    { id: "1", name: "Priya Sharma", instagramHandle: "priyacreates", niche: "Fashion", followers: 45200, following: 847, engagement: "4.5%", price: "₹5,000", profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Fashion", isActive: true, openToWork: true, bio: "Fashion & lifestyle creator | Sponsored by top brands | DM for collabs 💼" },
    { id: "2", name: "Arjun Mehta", instagramHandle: "arjunfit", niche: "Fitness", followers: 32100, following: 623, engagement: "5.2%", price: "₹4,000", profilePicture: "/api/placeholder/140/140", verified: false, featured: false, category: "Fitness", isActive: true, openToWork: true, bio: "Fitness coach helping you achieve your goals 💪" },
    { id: "3", name: "Zara Khan", instagramHandle: "zarastyle", niche: "Beauty", followers: 28700, following: 512, engagement: "3.8%", price: "₹3,500", profilePicture: "/api/placeholder/140/140", verified: true, featured: false, category: "Beauty", isActive: false, openToWork: true, bio: "Beauty & skincare enthusiast | Product reviews" },
    { id: "4", name: "Rahul Verma", instagramHandle: "techrahul", niche: "Tech", followers: 67400, following: 1205, engagement: "6.1%", price: "₹8,000", profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Tech", isActive: true, openToWork: false, bio: "Tech reviewer | Gadget geek | Latest tech trends" },
    { id: "5", name: "Anjali Desai", instagramHandle: "foodwithanjali", niche: "Food", followers: 51200, following: 934, engagement: "4.9%", price: "₹6,000", profilePicture: "/api/placeholder/140/140", verified: false, featured: false, category: "Food", isActive: true, openToWork: true, bio: "Food blogger | Recipe creator | Restaurant reviews" },
    { id: "6", name: "Kabir Singh", instagramHandle: "kabircomedy", niche: "Comedy", followers: 89300, following: 1567, engagement: "7.3%", price: "₹10,000", profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Comedy", isActive: true, openToWork: true, bio: "Stand-up comedian | Making you laugh daily 😂" },
    { id: "7", name: "Meera Patel", instagramHandle: "meerafinance", niche: "Finance", followers: 23800, following: 345, engagement: "3.2%", price: "₹3,000", profilePicture: "/api/placeholder/140/140", verified: false, featured: false, category: "Finance", isActive: false, openToWork: false, bio: "Financial advisor | Investment tips | Money management" },
    { id: "8", name: "Vikram Rao", instagramHandle: "viktravel", niche: "Travel", followers: 41600, following: 789, engagement: "4.7%", price: "₹5,500", profilePicture: "/api/placeholder/140/140", verified: true, featured: false, category: "Travel", isActive: true, openToWork: true, bio: "Travel photographer | Exploring the world 🌍" },
    { id: "9", name: "Shreya Gupta", instagramHandle: "shreyabeauty", niche: "Beauty", followers: 38900, following: 678, engagement: "5.0%", price: "₹4,500", profilePicture: "/api/placeholder/140/140", verified: false, featured: false, category: "Beauty", isActive: true, openToWork: true, bio: "Makeup artist | Beauty tutorials | Product reviews" },
    { id: "10", name: "Aditya Kumar", instagramHandle: "adifitness", niche: "Fitness", followers: 55100, following: 1023, engagement: "5.8%", price: "₹7,000", profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Fitness", isActive: true, openToWork: true, bio: "Personal trainer | Nutrition expert | Transform your body" },
    { id: "11", name: "Pooja Jain", instagramHandle: "poojastyle", niche: "Fashion", followers: 72400, following: 1456, engagement: "4.2%", price: "₹9,000", profilePicture: "/api/placeholder/140/140", verified: true, featured: false, category: "Fashion", isActive: false, openToWork: false, bio: "Fashion designer | Style tips | Wardrobe essentials" },
    { id: "12", name: "Rohan Das", instagramHandle: "rohantech", niche: "Tech", followers: 61800, following: 1134, engagement: "6.5%", price: "₹7,500", profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Tech", isActive: true, openToWork: true, bio: "Software engineer | Coding tutorials | Tech reviews" },
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
            creator.instagramHandle.toLowerCase().includes(searchQuery.toLowerCase());
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

                    {/* CREATOR GRID */}
                    <CreatorGrid
                        creators={filteredCreators}
                        isAuthenticated={true}
                        showCTA={true}
                        ctaText="View Profile"
                        emptyMessage="No creators found"
                        emptySubMessage="Try adjusting your search or filters"
                    />
                </main>

                <BrandRightSidebar />

                <MobileBottomNav role="brand" />
            </div>
        </RouteGuard>
    );
}
