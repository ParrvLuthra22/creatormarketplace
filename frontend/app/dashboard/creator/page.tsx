"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorDashboardLayout } from "@/components/CreatorDashboardLayout";
import { CreatorStatsCards } from "@/components/CreatorStatsCards";
import { ProposalCarousel } from "@/components/ProposalCarousel";
import { createConversation, getProposals } from "@/lib/api";

type DashboardProposalCard = {
    id: number;
    backendId: string;
    brandName: string;
    brandLogo: string;
    title: string;
    budget: number;
    deliverables: string;
    deadline: string;
    status: 'new' | 'accepted' | 'declined';
    startDate?: string;
    onMessageClick?: () => void;
};

export default function CreatorDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isActive, setIsActive] = useState(true);
    const [proposals, setProposals] = useState<DashboardProposalCard[]>([]);

    const idToNumber = (id: string) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = (hash * 31 + id.charCodeAt(i)) | 0;
        }
        return Math.abs(hash);
    };

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const res = await getProposals();
                if (!res.success) return;

                const mapped: DashboardProposalCard[] = res.proposals.map((p) => {
                    const brandName =
                        p.brandProfile?.companyName ||
                        p.brandId?.fullName ||
                        'Brand';

                    const status: DashboardProposalCard['status'] =
                        p.status === 'pending' ? 'new' : p.status;

                    return {
                        id: idToNumber(p._id),
                        backendId: p._id,
                        brandName,
                        brandLogo: p.brandProfile?.logoUrl || "/images/brand-placeholder.png",
                        title: p.title,
                        budget: p.budget,
                        deliverables: p.deliverables,
                        deadline: p.deadline,
                        status,
                        startDate: p.createdAt,
                    };
                });

                setProposals(mapped);
            } catch (err) {
                console.error("Failed to fetch proposals:", err);
            }
        };
        fetchProposals();
    }, []);

    const handleMessageUser = async (proposal: DashboardProposalCard) => {
        try {
            const res = await createConversation(proposal.brandName);
            router.push(`/dashboard/creator/messages?conv=${res.conversation._id}`);
        } catch (err) {
            console.error("Failed to message user:", err);
        }
    };

    // Filter proposals logic
    const activeProposals = proposals.filter(p => p.status === 'new');
    const acceptedProposals = proposals.filter(p => p.status === 'accepted');

    return (
        <RouteGuard allowedRole="creator">
            <CreatorDashboardLayout variant="white">
                <main className="max-w-6xl mx-auto py-8 transition-all duration-300">
                    {/* Welcome Heading */}
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-2 tracking-tight lowercase">
                            hello, {user?.fullName?.split(' ')[0] || "creator"}
                        </h1>
                        <p className="text-zinc-500 text-lg lowercase font-medium">
                            here is what is happening with your collaborations today.
                        </p>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 mb-16">
                        <CreatorStatsCards
                            totalEarnings={45000}
                            pendingProposals={activeProposals.length}
                            isActive={isActive}
                            onToggleStatus={() => setIsActive(!isActive)}
                            onEarningsClick={() => router.push('/dashboard/creator/analytics?tab=earnings')}
                            onProposalsClick={() => router.push('/dashboard/creator/proposals')}
                        />
                    </div>

                    {/* Recent Proposals Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight lowercase">
                                new proposals <span className="text-zinc-400 text-lg font-bold ml-2">({activeProposals.length})</span>
                            </h2>
                            <button className="text-sm font-black tracking-widest text-zinc-400 hover:text-[#FF4D00] transition-colors lowercase">
                                view all
                            </button>
                        </div>

                        <ProposalCarousel
                            proposals={activeProposals}
                            onProposalClick={(p) => console.log('Clicked proposal:', p)}
                            showMoreLink="/dashboard/creator/proposals"
                        />
                    </section>

                    {/* Active Collaborations Section */}
                    {acceptedProposals.length > 0 && (
                        <section className="mt-20 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h2 className="text-2xl font-black text-zinc-900 tracking-tight lowercase">
                                    active collaborations
                                </h2>
                            </div>
                            <ProposalCarousel
                                proposals={acceptedProposals.map(p => ({
                                    ...p,
                                    onMessageClick: () => handleMessageUser(p)
                                }))}
                                onProposalClick={(p) => console.log('Clicked active:', p)}
                            />
                        </section>
                    )}
                </main>
            </CreatorDashboardLayout>
        </RouteGuard>
    );
}
