"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Search, Bell, TrendingUp, Users, Clock, Lock } from "lucide-react";
import { CreatorCarousel } from "@/components/CreatorCarousel";

// Dummy creator data - converted to new format
const CREATORS = [
    { id: "1", name: "Priya Sharma", instagramHandle: "priyacreates", niche: "Fashion", followers: 45200, following: 847, profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Fashion", isActive: true, openToWork: true, bio: "Fashion & lifestyle creator | Sponsored by top brands" },
    { id: "2", name: "Arjun Mehta", instagramHandle: "arjunfit", niche: "Fitness", followers: 32100, following: 623, profilePicture: "/api/placeholder/140/140", verified: false, featured: false, category: "Fitness", isActive: true, openToWork: true, bio: "Fitness coach helping you achieve your goals 💪" },
    { id: "3", name: "Zara Khan", instagramHandle: "zarastyle", niche: "Beauty", followers: 28700, following: 512, profilePicture: "/api/placeholder/140/140", verified: true, featured: false, category: "Beauty", isActive: false, openToWork: true, bio: "Beauty & skincare enthusiast" },
    { id: "4", name: "Rahul Verma", instagramHandle: "techrahul", niche: "Tech", followers: 67400, following: 1205, profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Tech", isActive: true, openToWork: false, bio: "Tech reviewer | Gadget geek" },
    { id: "5", name: "Anjali Desai", instagramHandle: "foodwithanjali", niche: "Food", followers: 51200, following: 934, profilePicture: "/api/placeholder/140/140", verified: false, featured: false, category: "Food", isActive: true, openToWork: true, bio: "Food blogger | Recipe creator" },
    { id: "6", name: "Kabir Singh", instagramHandle: "kabircomedy", niche: "Comedy", followers: 89300, following: 1567, profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Comedy", isActive: true, openToWork: true, bio: "Stand-up comedian 😂" },
    { id: "7", name: "Meera Patel", instagramHandle: "meerafinance", niche: "Finance", followers: 23800, following: 345, profilePicture: "/api/placeholder/140/140", verified: false, featured: false, category: "Finance", isActive: false, openToWork: false, bio: "Financial advisor | Investment tips" },
    { id: "8", name: "Vikram Rao", instagramHandle: "viktravel", niche: "Travel", followers: 41600, following: 789, profilePicture: "/api/placeholder/140/140", verified: true, featured: false, category: "Travel", isActive: true, openToWork: true, bio: "Travel photographer 🌍" },
    { id: "9", name: "Shreya Gupta", instagramHandle: "shreyabeauty", niche: "Beauty", followers: 38900, following: 678, profilePicture: "/api/placeholder/140/140", verified: false, featured: false, category: "Beauty", isActive: true, openToWork: true, bio: "Makeup artist | Beauty tutorials" },
    { id: "10", name: "Aditya Kumar", instagramHandle: "adifitness", niche: "Fitness", followers: 55100, following: 1023, profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Fitness", isActive: true, openToWork: true, bio: "Personal trainer | Nutrition expert" },
    { id: "11", name: "Pooja Jain", instagramHandle: "poojastyle", niche: "Fashion", followers: 72400, following: 1456, profilePicture: "/api/placeholder/140/140", verified: true, featured: false, category: "Fashion", isActive: false, openToWork: false, bio: "Fashion designer | Style tips" },
    { id: "12", name: "Rohan Das", instagramHandle: "rohantech", niche: "Tech", followers: 61800, following: 1134, profilePicture: "/api/placeholder/140/140", verified: true, featured: true, category: "Tech", isActive: true, openToWork: true, bio: "Software engineer | Coding tutorials" },
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
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [showProposalTooltip, setShowProposalTooltip] = useState(false);

    const filteredCreators = selectedFilter === "All"
        ? CREATORS
        : CREATORS.filter(c => c.niche === selectedFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Accepted": return "bg-green-100 text-green-700";
            case "Viewed": return "bg-blue-100 text-blue-700";
            case "Declined": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getTierStyle = (tier: string) => {
        switch (tier) {
            case "Emerging": return "bg-gray-100 text-gray-600";
            case "Growing": return "bg-blue-50 text-blue-700";
            case "Established": return "bg-green-50 text-green-700";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const getAvailabilityDot = (availability: string) => {
        switch (availability) {
            case "actively-accepting": return "bg-[#1A2A1A]";
            case "selective": return "bg-[#2A2A1A]";
            case "booked": return "bg-[#2A1A1A]";
            default: return "bg-[#1A2A1A]";
        }
    };

    const getAvailabilityLabel = (availability: string) => {
        switch (availability) {
            case "actively-accepting": return "Actively accepting";
            case "selective": return "Selective";
            case "booked": return "Booked";
            default: return "Actively accepting";
        }
    };

    return (
        <RouteGuard allowedRole="brand">
            <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">
                {/* LEFT SIDEBAR - Hidden on mobile */}
                <div className="hidden md:block">
                    <DashboardSidebar
                        userName={user?.fullName || "Brand User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px] bg-[#F4EFE6]">
                    {/* Upgrade Banner - Free Users Only */}
                    {user?.plan === 'free' && !bannerDismissed && (
                        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 px-5 mb-6 flex items-center justify-between relative shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="text-xl">⚡</div>
                                <div>
                                    <p className="text-[15px] font-bold text-black">Unlock full creator access</p>
                                    <p className="text-[13px] text-[#6B6B6B]">See pricing, filters, and more</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push('/pricing')}
                                    className="bg-black text-white px-5 py-2 rounded-lg text-[13px] font-bold hover:bg-gray-800 transition-colors"
                                >
                                    Upgrade Now
                                </button>
                                <button
                                    onClick={() => setBannerDismissed(true)}
                                    className="w-[22px] h-[22px] rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-black transition-colors text-[16px] leading-none"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PAGE HEADER */}
                    <div className="flex justify-between items-center mb-7">
                        <h1 className="text-[28px] font-bold text-black">Home</h1>
                        <div className="flex items-center gap-4">
                            <Search className="w-5 h-5 text-[#6B6B6B] cursor-pointer hover:text-black transition-colors" />
                            <Bell className="w-5 h-5 text-[#6B6B6B] cursor-pointer hover:text-black transition-colors" />
                        </div>
                    </div>

                    {/* STAT CARDS ROW */}
                    <div className="grid grid-cols-3 gap-4 mb-8 stat-cards-grid">
                        {/* Card 1 */}
                        <div className={`bg-white rounded-[14px] p-5 relative stat-card shadow-sm ${user?.plan === 'free' ? 'border border-[#E5E5E5]' : 'border border-[#E5E5E5] hover:border-[#4A46FF] transition-colors'
                            }`}>
                            <TrendingUp className="absolute top-5 right-5 w-5 h-5 text-gray-400" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-bold tracking-widest">TOTAL SPEND</p>
                            <p className="text-[30px] text-black font-bold mt-2">
                                {user?.plan === 'free' ? '—' : '₹1,24,500'}
                            </p>
                            <p className="text-xs text-[#6B6B6B] mt-1">
                                {user?.plan === 'free' ? 'Upgrade to track spend' : 'Across 8 collaborations'}
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className={`bg-white rounded-[14px] p-5 relative stat-card shadow-sm ${user?.plan === 'free' ? 'border border-[#E5E5E5]' : 'border border-[#E5E5E5] hover:border-[#4A46FF] transition-colors'
                            }`}>
                            <Users className="absolute top-5 right-5 w-5 h-5 text-gray-400" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-bold tracking-widest">CREATORS HIRED</p>
                            <p className="text-[30px] text-black font-bold mt-2">
                                {user?.plan === 'free' ? '0' : '8'}
                            </p>
                            <p className="text-xs text-[#6B6B6B] mt-1">
                                {user?.plan === 'free' ? 'Upgrade to track' : 'Active collaborations'}
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className={`bg-white rounded-[14px] p-5 relative stat-card shadow-sm ${user?.plan === 'free' ? 'border border-[#E5E5E5]' : 'border border-[#E5E5E5] hover:border-[#4A46FF] transition-colors'
                            }`}>
                            <Clock className="absolute top-5 right-5 w-5 h-5 text-gray-400" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-bold tracking-widest">PENDING</p>
                            <p className="text-[30px] text-black font-bold mt-2">
                                {user?.plan === 'free' ? '0' : '3'}
                            </p>
                            <p className="text-xs text-[#6B6B6B] mt-1">
                                {user?.plan === 'free' ? 'Upgrade to track' : 'Awaiting response'}
                            </p>
                        </div>
                    </div>

                    {/* CREATOR GRID */}
                    <div>
                        {/* Section Header with Filters */}
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-bold text-black">Creators</h2>
                            <div className="flex gap-2 filter-pills">
                                {FILTER_NICHES.map(niche => (
                                    <button
                                        key={niche}
                                        onClick={() => setSelectedFilter(niche)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors border ${selectedFilter === niche
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-black border-[#E5E5E5] hover:bg-gray-50"
                                            }`}
                                    >
                                        {niche}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Creator Carousel with Plan-based Access */}
                        <CreatorCarousel
                            creators={user?.plan === 'free' ? filteredCreators.slice(0, 10) : filteredCreators}
                            isAuthenticated={true}
                            showCTA={true}
                            ctaText="View Profile"
                            showMoreLink="/dashboard/brand/creators"
                        />

                        {/* Upgrade CTA for Free users only */}
                        {user?.plan === 'free' && (
                            <div className="text-center py-6 mt-6 bg-white border border-[#E5E5E5] rounded-[14px] shadow-sm">
                                <p className="text-sm text-black font-semibold mb-3">Upgrade to Basic to see all creators</p>
                                <button
                                    onClick={() => router.push('/pricing')}
                                    className="px-6 py-2 bg-black text-white rounded-full font-bold text-[13px] hover:bg-gray-800 transition-colors"
                                >
                                    Upgrade Now →
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                {/* RIGHT WIDGETS SIDEBAR */}
                <aside className="hidden lg:flex w-[280px] px-5 pl-4 py-8 flex-col gap-4 overflow-y-auto">
                    {/* WIDGET 1 - Quick Actions */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5">
                        <h3 className="text-base font-bold text-white font-milker mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-2.5">
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        if (user?.plan !== 'pro') {
                                            setShowProposalTooltip(true);
                                            setTimeout(() => setShowProposalTooltip(false), 3000);
                                        } else {
                                            // Normal proposal logic would go here
                                        }
                                    }}
                                    className={`w-full h-11 rounded-[10px] font-angelo text-sm font-semibold transition-opacity flex items-center justify-center gap-2 ${user?.plan !== 'pro'
                                        ? 'bg-white text-black opacity-40 cursor-not-allowed'
                                        : 'bg-white text-black hover:opacity-85'
                                        }`}
                                    disabled={user?.plan !== 'pro'}
                                >
                                    {user?.plan !== 'pro' && <Lock className="w-4 h-4" />}
                                    Send Proposal
                                </button>

                                {/* Tooltip */}
                                {showProposalTooltip && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-[#1F1F1F] rounded-lg p-3 text-left z-10">
                                        <p className="text-[13px] text-[#AAAAAA]">
                                            Available on Pro plan — Upgrade to send proposals
                                        </p>
                                        <a href="/pricing" className="text-[13px] font-angelo text-white hover:opacity-70 inline-block mt-1">
                                            Upgrade →
                                        </a>
                                    </div>
                                )}
                            </div>
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

                    /* Pro plan: Hide SIGNAL column, keep TIER */
                    .signal-col {
                        display: none;
                    }

                    .creator-list-header,
                    .creator-row {
                        grid-template-columns: 2fr 0.8fr 1fr 1fr 40px !important;
                    }

                    /* Basic plan: Hide engagement and price */
                    .engagement-col,
                    .price-col {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .stat-cards-grid {
                        grid-template-columns: 1fr;
                    }

                    /* Pro plan: Hide TIER and NICHE, keep FOLLOWERS */
                    .tier-col,
                    .niche-col {
                        display: none;
                    }

                    .creator-list-header,
                    .creator-row {
                        grid-template-columns: 2fr 1fr 40px !important;
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
