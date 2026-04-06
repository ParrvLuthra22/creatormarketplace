"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorDashboardLayout } from "@/components/CreatorDashboardLayout";
import { ViewProposalModal } from "@/components/ViewProposalModal";
import { getProposals, Proposal, createConversation } from "@/lib/api";
import { Calendar, DollarSign, Package, MessageCircle } from "lucide-react";

export default function CreatorProposals() {
    const { user, logout } = useAuth();
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
        : proposals.filter(p => {
            const statusMap: Record<string, string> = { "New": "pending", "Accepted": "accepted", "Declined": "declined" };
            return p.status === statusMap[selectedFilter];
        });

    const handleStatusChange = (updatedProposal: Proposal) => {
        setProposals(prev => prev.map(p => p._id === updatedProposal._id ? updatedProposal : p));
    };

    const handleMessage = async (proposal: Proposal) => {
        try {
            const brandId = proposal.brandId?._id;
            if (!brandId) return;
            await createConversation(brandId);
            router.push('/dashboard/creator/messages');
        } catch (err) {
            console.error("Failed to create conversation:", err);
        }
    };

    const FILTER_TABS = [
        { label: "All", count: proposals.length },
        { label: "New", count: proposals.filter(p => p.status === 'pending').length },
        { label: "Accepted", count: proposals.filter(p => p.status === 'accepted').length },
        { label: "Declined", count: proposals.filter(p => p.status === 'declined').length },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "accepted": return "bg-[#E8F5E9] text-[#2E7D32]";
            case "declined": return "bg-[#FFEBEE] text-[#C62828]";
            default: return "bg-[#FFF3E0] text-[#E65100]";
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <RouteGuard allowedRole="creator">
            <CreatorDashboardLayout variant="white">
                <main className="max-w-6xl mx-auto py-8 transition-all duration-300">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-10 lowercase">proposals</h1>

                        {/* Filter Pills */}
                        <div className="flex gap-3 mb-12 flex-wrap">
                            {FILTER_TABS.map(tab => (
                                <button
                                    key={tab.label}
                                    onClick={() => setSelectedFilter(tab.label)}
                                    className={`px-6 py-2.5 rounded-md text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${selectedFilter === tab.label
                                        ? "bg-[#FF4D00] text-white border border-[#FF4D00] shadow-lg shadow-orange-500/20"
                                        : "bg-white text-zinc-400 border border-zinc-100 hover:border-[#FF4D00] hover:text-[#FF4D00] hover:shadow-md"
                                        }`}
                                >
                                    {tab.label} <span className="opacity-50">({tab.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Proposals Grid */}
                        {loading ? (
                            <div className="text-center py-20 text-[#6B6B6B]">
                                <p className="text-lg">Loading proposals...</p>
                            </div>
                        ) : filteredProposals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-[#6B6B6B]">
                                <p className="font-milker text-xl opacity-50">No proposals found</p>
                                <p className="text-sm mt-1">Check back later for new opportunities from brands</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProposals.map((proposal) => (
                                    <div
                                        key={proposal._id}
                                        className="bg-white border border-zinc-100 rounded-sm p-6 hover:border-[#FF4D00] hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                        onClick={() => setSelectedProposal(proposal)}
                                    >
                                        {/* Status Badge */}
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${getStatusBadge(proposal.status)}`}>
                                                {proposal.status === 'pending' ? 'New' : proposal.status}
                                            </span>
                                        </div>

                                        {/* Brand Name & Title */}
                                        <h3 className="font-bold text-black text-base mb-1">
                                            {proposal.brandProfile?.companyName || proposal.brandId?.fullName || 'Brand'}
                                        </h3>
                                        <p className="text-sm text-[#6B6B6B] mb-4">{proposal.title}</p>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            <div className="bg-zinc-50 rounded-md p-3 text-center border border-zinc-100/50">
                                                <DollarSign className="w-4 h-4 text-[#FF4D00] mx-auto mb-1" />
                                                <p className="text-[11px] font-black text-zinc-900 tracking-tight">₹{(proposal.budget / 1000).toFixed(0)}k</p>
                                            </div>
                                            <div className="bg-zinc-50 rounded-md p-3 text-center border border-zinc-100/50 overflow-hidden">
                                                <Package className="w-4 h-4 text-[#FF4D00] mx-auto mb-1" />
                                                <p className="text-[11px] font-black text-zinc-900 tracking-tight truncate px-1">{proposal.deliverables}</p>
                                            </div>
                                            <div className="bg-zinc-50 rounded-md p-3 text-center border border-zinc-100/50">
                                                <Calendar className="w-4 h-4 text-[#FF4D00] mx-auto mb-1" />
                                                <p className="text-[11px] font-black text-zinc-900 tracking-tight">{formatDate(proposal.deadline)}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                className="flex-1 h-9 bg-[#FF4D00] text-black font-bold text-xs rounded-sm hover:opacity-90 transition-opacity"
                                                onClick={(e) => { e.stopPropagation(); setSelectedProposal(proposal); }}
                                            >
                                                VIEW PROPOSAL
                                            </button>
                                            {proposal.status === 'accepted' && (
                                                <button
                                                    className="flex-1 h-9 bg-white text-black border border-[#E5E5E5] font-bold text-xs rounded-sm hover:bg-[#FFF3E0] transition-colors flex items-center justify-center gap-1"
                                                    onClick={(e) => { e.stopPropagation(); handleMessage(proposal); }}
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                    MESSAGE
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </main>

                {selectedProposal && (
                    <ViewProposalModal
                        proposal={selectedProposal}
                        isOpen={true}
                        onClose={() => setSelectedProposal(null)}
                        userRole="creator"
                        onStatusChange={handleStatusChange}
                    />
                )}
            </CreatorDashboardLayout>
        </RouteGuard>
    );
}
