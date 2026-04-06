"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BrandDashboardLayout } from "@/components/BrandDashboardLayout";
import { RouteGuard } from "@/components/RouteGuard";
import { ViewProposalModal } from "@/components/ViewProposalModal";
import { ArrowRight, Plus, MessageCircle } from "lucide-react";
import { getProposals, Proposal, createConversation, getProfilePhotoUrl } from "@/lib/api";

const FILTER_TABS = ["All", "Pending", "Accepted", "Declined"];

export default function BrandProposals() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        try {
            const res = await getProposals();
            if (res.success) {
                setProposals(res.proposals);
            }
        } catch (err) {
            console.error("Failed to fetch proposals:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProposals = selectedFilter === "All"
        ? proposals
        : proposals.filter(p => p.status === selectedFilter.toLowerCase());

    const getStatusColor = (status: string) => {
        switch (status) {
            case "accepted": return "bg-green-50 text-green-600 border border-green-100";
            case "declined": return "bg-red-50 text-red-600 border border-red-100";
            default: return "bg-orange-50 text-orange-600 border border-orange-100";
        }
    };

    const handleMessage = async (e: React.MouseEvent, proposal: Proposal) => {
        e.stopPropagation();
        try {
            const creatorId = (proposal.creatorId as any)?._id;
            if (!creatorId) return;
            await createConversation(creatorId);
            router.push('/dashboard/brand/messages');
        } catch (err) {
            console.error("Failed to create conversation:", err);
        }
    };

    const handleStatusChange = (updatedProposal: Proposal) => {
        setProposals(prev => prev.map(p => p._id === updatedProposal._id ? updatedProposal : p));
    };

    return (
        <RouteGuard allowedRole="brand">
            <BrandDashboardLayout variant="white">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-3">Campaign Proposals</h1>
                        <p className="text-zinc-500 font-medium text-lg">Manage and track your collaboration requests</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/brand')}
                        className="px-8 h-12 bg-[#FF4D00] text-white rounded-md font-bold text-sm hover:bg-[#FF4D00]/90 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/10"
                    >
                        <Plus className="w-4 h-4" />
                        Send New Proposal
                    </button>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSelectedFilter(tab)}
                            className={`px-6 py-3 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${selectedFilter === tab
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-xl"
                                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
                                }`}
                        >
                            {tab} {tab !== "All" && `(${proposals.filter(p => p.status === tab.toLowerCase()).length})`}
                        </button>
                    ))}
                </div>

                {/* Proposals List */}
                <div className="bg-white rounded-sm overflow-hidden border border-zinc-100 shadow-sm">
                    {/* Column Headers */}
                    <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] items-center px-10 py-6 border-b border-zinc-50 bg-zinc-50/50 text-zinc-400">
                        <div className="text-[10px] uppercase font-black tracking-widest leading-none">CREATOR</div>
                        <div className="text-[10px] uppercase font-black tracking-widest leading-none">CAMPAIGN</div>
                        <div className="text-[10px] uppercase font-black tracking-widest leading-none">BUDGET</div>
                        <div className="text-[10px] uppercase font-black tracking-widest leading-none">STATUS</div>
                        <div className="text-[10px] uppercase font-black tracking-widest leading-none">DATE</div>
                        <div className="text-[10px] uppercase font-black tracking-widest leading-none text-right">ACTION</div>
                    </div>

                    {loading ? (
                        <div className="text-center py-32">
                            <div className="w-8 h-8 border-4 border-zinc-200 border-t-[#FF4D00] rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-zinc-400 font-medium">Loading proposals...</p>
                        </div>
                    ) : filteredProposals.length === 0 ? (
                        <div className="text-center py-32 bg-zinc-50/30">
                            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center">
                                <Plus className="w-10 h-10 text-zinc-300" strokeWidth={1} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900">No proposals yet</h3>
                            <p className="text-zinc-500 mt-2">Start collaborating with amazing creators</p>
                        </div>
                    ) : (
                        filteredProposals.map((proposal) => (
                            <div
                                key={proposal._id}
                                className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] items-center px-10 py-8 border-b border-zinc-50 last:border-b-0 cursor-pointer hover:bg-zinc-50/80 transition-all group"
                                onClick={() => setSelectedProposal(proposal)}
                            >
                                {/* Creator */}
                                <div className="flex items-center gap-5 mb-4 md:mb-0">
                                    <div className="w-12 h-12 rounded-md flex items-center justify-center text-[#FF4D00] bg-orange-50 border border-orange-100 text-sm font-black shrink-0 shadow-sm overflow-hidden">
                                        {proposal.creatorProfile?.profilePhoto ? (
                                            <img src={getProfilePhotoUrl(proposal.creatorProfile.profilePhoto)} className="w-full h-full object-cover" alt="Creator Profile" />
                                        ) : (
                                            (proposal.creatorId?.fullName || 'C').substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-zinc-900 group-hover:text-[#FF4D00] transition-colors">{proposal.creatorId?.fullName || 'Creator'}</p>
                                        <p className="text-[10px] font-bold text-zinc-400 tracking-wider">TOP RATED</p>
                                    </div>
                                </div>

                                {/* Campaign */}
                                <div className="text-sm text-zinc-600 font-semibold truncate mb-2 md:mb-0">{proposal.title}</div>

                                {/* Budget */}
                                <div className="text-sm text-zinc-900 font-black mb-2 md:mb-0">₹{proposal.budget?.toLocaleString()}</div>

                                {/* Status */}
                                <div className="mb-2 md:mb-0">
                                    <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider ${getStatusColor(proposal.status)}`}>
                                        {proposal.status}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="text-xs text-zinc-400 font-bold mb-4 md:mb-0">
                                    {new Date(proposal.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>

                                {/* Action */}
                                <div className="flex items-center justify-end gap-3 translate-x-1 group-hover:translate-x-0 transition-all">
                                    {proposal.status === 'accepted' && (
                                        <button
                                            onClick={(e) => handleMessage(e, proposal)}
                                            className="w-11 h-11 rounded-md bg-zinc-900 border border-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-all"
                                            title="Message Creator"
                                        >
                                            <MessageCircle className="w-5 h-5 text-white" />
                                        </button>
                                    )}
                                    <div className="w-11 h-11 rounded-md bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] group-hover:text-white transition-all shadow-sm">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </BrandDashboardLayout>

            {selectedProposal && (
                <ViewProposalModal
                    proposal={selectedProposal}
                    isOpen={true}
                    onClose={() => setSelectedProposal(null)}
                    userRole="brand"
                    onStatusChange={handleStatusChange}
                />
            )}
        </RouteGuard>
    );
}
