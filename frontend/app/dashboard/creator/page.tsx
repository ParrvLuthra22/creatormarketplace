"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorSidebar } from "@/components/CreatorSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Search, Bell, DollarSign, Mail, Eye, ArrowRight, FileText, User as UserIcon, CheckCircle, ChevronDown, Check } from "lucide-react";
import { ProposalCard } from "@/components/ProposalCard";
import { ProposalCarousel } from "@/components/ProposalCarousel";

// Dummy proposal data
const PROPOSALS = [
    { id: 1, brandName: "FitLife Nutrition", title: "Protein Shake Launch", brandLogo: "FL", budget: 15000, deliverables: "2 Reels, 3 Stories", deadline: "2026-02-15", status: "new" as const },
    { id: 2, brandName: "Urban Threads", title: "Summer Collection", brandLogo: "UT", budget: 22000, deliverables: "1 Reel, 5 Posts", deadline: "2026-02-28", status: "new" as const },
    { id: 3, brandName: "GlowUp Skincare", title: "Skincare Routine", brandLogo: "GS", budget: 8000, deliverables: "3 Reels", deadline: "2026-03-05", status: "new" as const },
    { id: 4, brandName: "TechVerse", title: "Gadget Review", brandLogo: "TV", budget: 12000, deliverables: "1 Video, 2 Posts", deadline: "2026-02-20", status: "new" as const },
    { id: 5, brandName: "NatureBite", title: "Organic Campaign", brandLogo: "NB", budget: 9500, deliverables: "4 Stories, 2 Posts", deadline: "2026-01-30", status: "accepted" as const },
    { id: 6, brandName: "PixelArt Studio", title: "Design Tools", brandLogo: "PA", budget: 6000, deliverables: "2 Reels", deadline: "2026-01-22", status: "accepted" as const },
    { id: 7, brandName: "QuickFit App", title: "App Promo", brandLogo: "QF", budget: 5000, deliverables: "1 Reel, 3 Stories", deadline: "2026-01-10", status: "declined" as const },
];

const ACTIVITIES = [
    { icon: "📬", text: "New proposal from FitLife", time: "2 hours ago" },
    { icon: "👁", text: "Profile viewed by Urban Threads", time: "5 hours ago" },
    { icon: "✓", text: "Collaboration completed: NatureBite", time: "2 days ago" },
    { icon: "📬", text: "New proposal from TechVerse", time: "3 days ago" },
];

const FILTER_TABS = [
    { label: "All", count: null },
    { label: "New", count: 4 },
    { label: "Accepted", count: 2 },
    { label: "Declined", count: 1 },
];

export default function CreatorDashboard() {
    const { user, profile } = useAuth();
    const creatorProfile = profile as any;
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [availability, setAvailability] = useState<'actively-accepting' | 'selective' | 'booked'>('actively-accepting');
    const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);

    // Dummy follower count for tier calculation (would come from profile in real app)
    const followerCount = 45200; // 45.2K
    const getTier = (followers: number) => {
        if (followers < 30000) return { label: 'Emerging', bg: 'bg-[#1F1F1F]', color: 'text-[#AAAAAA]' };
        if (followers <= 60000) return { label: 'Growing', bg: 'bg-[#1A1A2A]', color: 'text-white' };
        return { label: 'Established', bg: 'bg-[#1A2A1A]', color: 'text-white' };
    };
    const tier = getTier(followerCount);

    const availabilityOptions = [
        { value: 'actively-accepting' as const, label: 'Actively accepting', dot: 'bg-[#1A2A1A]' },
        { value: 'selective' as const, label: 'Selective', dot: 'bg-[#2A2A1A]' },
        { value: 'booked' as const, label: 'Booked', dot: 'bg-[#2A1A1A]' }
    ];
    const currentAvailability = availabilityOptions.find(opt => opt.value === availability)!;

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
                {/* LEFT SIDEBAR - Hidden on mobile */}
                <div className="hidden md:block">
                    <CreatorSidebar
                        userName={user?.fullName || "Creator User"}
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
                            <DollarSign className="absolute top-5 right-5 w-5 h-5 text-[#3D3D3D]" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">TOTAL EARNINGS</p>
                            <p className="text-[30px] text-white font-angelo mt-2">₹45,000</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">From 5 collaborations</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5 relative stat-card">
                            <Mail className="absolute top-5 right-5 w-5 h-5 text-[#3D3D3D]" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">NEW PROPOSALS</p>
                            <p className="text-[30px] text-white font-angelo mt-2">4</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">Awaiting your response</p>
                        </div>

                        {/* Card 3 - Status */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5 relative stat-card">
                            <Eye className="absolute top-5 right-5 w-5 h-5 text-[#3D3D3D]" />
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">STATUS</p>
                            <div className="flex items-center gap-2 mt-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${currentAvailability.dot}`}></div>
                                <p className="text-[20px] text-white font-angelo">{currentAvailability.label}</p>
                            </div>
                            <p className="text-xs text-[#6B6B6B] mt-1">You can change this anytime</p>
                        </div>
                    </div>

                    {/* PROPOSALS INBOX */}
                    <div>
                        {/* Section Header with Filters */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white font-milker">Proposals</h2>
                            <div className="flex gap-2 filter-pills">
                                {FILTER_TABS.map(tab => (
                                    <button
                                        key={tab.label}
                                        onClick={() => setSelectedFilter(tab.label)}
                                        className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors ${selectedFilter === tab.label
                                            ? "bg-white text-black"
                                            : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                                            }`}
                                    >
                                        {tab.label}{tab.count !== null ? ` (${tab.count})` : ''}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Proposals Carousel */}
                        <ProposalCarousel
                            proposals={filteredProposals}
                            onProposalClick={(proposal) => {
                                console.log('Clicked proposal:', proposal.id);
                                // Handle proposal click - could open modal or navigate
                            }}
                            showMoreLink="/dashboard/creator/proposals"
                        />
                    </div>
                </main>

                {/* RIGHT WIDGETS SIDEBAR */}
                <aside className="hidden lg:flex w-[280px] px-5 pl-4 py-8 flex-col gap-4 overflow-y-auto">
                    {/* WIDGET 1 - My Profile */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5">
                        <h3 className="text-base font-bold text-white font-milker mb-4">My Profile</h3>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-lg font-semibold mb-3">
                                {user?.fullName?.charAt(0).toUpperCase() || "C"}
                            </div>
                            <p className="text-[15px] font-semibold text-white mb-1">{user?.fullName || "Creator User"}</p>

                            {/* Tier Badge */}
                            <div className="relative group mb-2">
                                <span className={`px-2.5 py-0.5 rounded-xl text-[11px] font-angelo ${tier.bg} ${tier.color}`}>
                                    {tier.label}
                                </span>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#141414] border border-[#1F1F1F] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    <p className="text-[12px] text-[#6B6B6B]">Tier based on your profile completeness and activity</p>
                                </div>
                            </div>

                            <p className="text-[13px] text-[#6B6B6B] font-angelo mb-3">
                                {creatorProfile?.instagramHandle || "@creator"}
                            </p>
                            <div className="flex gap-2 justify-center mb-3.5">
                                <span className="px-2.5 py-1 rounded-xl text-[11px] bg-[#1F1F1F] text-white font-angelo">
                                    Fashion
                                </span>
                                <span className="px-2.5 py-1 rounded-xl text-[11px] bg-[#1F1F1F] text-white font-angelo">
                                    Lifestyle
                                </span>
                            </div>

                            {/* Availability Selector */}
                            <div className="w-full mb-3.5">
                                <p className="text-[11px] uppercase text-[#6B6B6B] font-angelo tracking-wide mb-2 text-left">Availability</p>
                                <div className="relative">
                                    <div
                                        onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
                                        className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-[10px] px-3.5 py-2.5 cursor-pointer flex items-center justify-between hover:border-[#2A2A2A] transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${currentAvailability.dot}`}></div>
                                            <span className="text-[14px] text-white font-angelo">{currentAvailability.label}</span>
                                        </div>
                                        <ChevronDown className="w-3 h-3 text-[#6B6B6B]" />
                                    </div>

                                    {/* Dropdown Panel */}
                                    {showAvailabilityDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-[#1F1F1F] rounded-[10px] p-2 z-20">
                                            {availabilityOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => {
                                                        setAvailability(option.value);
                                                        setShowAvailabilityDropdown(false);
                                                    }}
                                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${option.dot}`}></div>
                                                        <span className="text-[14px] text-white font-angelo">{option.label}</span>
                                                    </div>
                                                    {availability === option.value && (
                                                        <Check className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/dashboard/creator/profile"
                                className="text-[13px] text-white font-angelo hover:opacity-85 transition-opacity cursor-pointer"
                            >
                                Edit Profile →
                            </Link>
                        </div>
                    </div>

                    {/* WIDGET 2 - Recent Activity */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5">
                        <h3 className="text-base font-bold text-white font-milker mb-4">Activity</h3>
                        <div>
                            {ACTIVITIES.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 py-2.5 border-b border-[#1F1F1F] last:border-b-0"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[#1F1F1F] flex items-center justify-center text-sm flex-shrink-0">
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] text-white truncate">{activity.text}</p>
                                        <p className="text-[11px] text-[#6B6B6B]">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MOBILE BOTTOM NAV */}
                <MobileBottomNav role="creator" />
            </div>

            <style jsx global>{`
                /* Responsive Breakpoints */
                @media (max-width: 1200px) {
                    .widgets-sidebar {
                        display: none;
                    }
                }

                @media (max-width: 768px) {
                    .creator-main-content {
                        padding: 16px;
                    }

                    .stat-cards-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .filter-pills {
                        flex-wrap: wrap;
                    }

                    .proposal-list-header,
                    .proposal-row {
                        grid-template-columns: 2fr 1.5fr 1fr 40px;
                    }

                    .deadline-col,
                    .status-col {
                        display: none;
                    }
                }

                @media (max-width: 480px) {
                    .stat-cards-grid {
                        grid-template-columns: 1fr;
                    }

                    .proposal-list-header,
                    .proposal-row {
                        grid-template-columns: 2fr 1fr 40px;
                    }

                    .campaign-col {
                        display: none;
                    }

                    .proposal-row {
                        height: 56px;
                    }

                    .proposal-avatar {
                        width: 32px !important;
                        height: 32px !important;
                    }
                }
            `}</style>
        </RouteGuard>
    );
}
