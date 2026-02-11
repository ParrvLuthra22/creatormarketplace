"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorSidebar } from "@/components/CreatorSidebar";
import { CreatorRightSidebar } from "@/components/CreatorRightSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CreatorStatsCards } from "@/components/CreatorStatsCards";
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

export default function CreatorDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isActive, setIsActive] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Filter proposals logic
    const activeProposals = PROPOSALS.filter(p => p.status === 'new');
    const acceptedProposals = PROPOSALS.filter(p => p.status === 'accepted');

    return (
        <RouteGuard allowedRole="creator">
            <div className="min-h-screen bg-[#0A0A0A] text-[#F5F1E8] font-sf-pro selection:bg-[#F5F1E8] selection:text-[#0A0A0A]">

                {/* Fixed Header */}
                <DashboardHeader user={user || { fullName: "Creator", accountType: "Creator", email: "", id: "", plan: "free", createdAt: new Date() }} onLogout={handleLogout} />

                {/* Left Sidebar - Fixed */}
                <div className="hidden md:block">
                    <CreatorSidebar
                        userName={user?.fullName || "Creator User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                {/* Right Sidebar - Fixed */}
                <div className="hidden xl:block">
                    <CreatorRightSidebar />
                </div>

                {/* Main Content Area */}
                <main className="pt-24 pb-12 px-6 md:ml-[240px] xl:mr-[320px] min-h-screen transition-all duration-300">
                    <div className="max-w-[1240px] mx-auto">

                        {/* Welcome Heading */}
                        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h1 className="text-4xl md:text-5xl font-bold font-milker text-[#F5F1E8] mb-2 tracking-[-1px]">
                                Hello, {user?.fullName?.split(' ')[0] || "Creator"}
                            </h1>
                            <p className="text-[#6B6B6B] text-lg font-sf-pro">
                                Here's what's happening with your collaborations today.
                            </p>
                        </div>

                        {/* Stats Cards Row */}
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 mb-16">
                            <CreatorStatsCards
                                totalEarnings={45000}
                                pendingProposals={activeProposals.length}
                                isActive={isActive}
                                onToggleStatus={() => setIsActive(!isActive)}
                            />
                        </div>

                        {/* Recent Proposals Section */}
                        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h2 className="text-2xl font-bold font-milker text-[#F5F1E8]">
                                    New Proposals <span className="text-[#6B6B6B] text-lg font-normal ml-2">({activeProposals.length})</span>
                                </h2>
                                <button className="text-sm font-angelo font-bold uppercase tracking-widest text-[#F5F1E8] hover:text-[#C5C5C5] transition-colors">
                                    View All
                                </button>
                            </div>

                            <ProposalCarousel
                                proposals={activeProposals}
                                onProposalClick={(p) => console.log('Clicked proposal:', p)}
                                showMoreLink="/dashboard/creator/proposals"
                            />
                        </section>

                        {/* Active Collaborations Section (Optional/Next Step) */}
                        {acceptedProposals.length > 0 && (
                            <section className="mt-16 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <h2 className="text-2xl font-bold font-milker text-[#F5F1E8]">
                                        Active Collaborations
                                    </h2>
                                </div>
                                <ProposalCarousel
                                    proposals={acceptedProposals}
                                    onProposalClick={(p) => console.log('Clicked active:', p)}
                                />
                            </section>
                        )}

                    </div>
                </main>
            </div>
        </RouteGuard>
    );
}
