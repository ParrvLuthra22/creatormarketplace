"use client";

import { useState } from "react";
import { Proposal } from "@/lib/creatorData";
import { ProposalDetailModal } from "./ProposalDetailModal";
import { ArrowRight } from "lucide-react";

interface ProposalInboxProps {
    proposals: Proposal[];
}

export function ProposalInbox({ proposals }: ProposalInboxProps) {
    const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'accepted' | 'declined'>('all');
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

    const filteredProposals = activeFilter === 'all'
        ? proposals
        : proposals.filter(p => p.status === activeFilter);

    const getStatusColor = (status: Proposal['status']) => {
        switch (status) {
            case 'new':
                return 'bg-[#1F1F1F] text-[#6B6B6B]';
            case 'accepted':
                return 'bg-[#1A2A1A] text-[#8BFF8B]';
            case 'declined':
                return 'bg-[#2A1A1A] text-[#FF8B8B]';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const formatBudget = (amount: number) => {
        return `₹${(amount / 1000).toFixed(0)}k`;
    };

    const newCount = proposals.filter(p => p.status === 'new').length;
    const acceptedCount = proposals.filter(p => p.status === 'accepted').length;
    const declinedCount = proposals.filter(p => p.status === 'declined').length;

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-milker">Collaboration Proposals</h2>

            {/* Filter Pills */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors ${activeFilter === 'all'
                            ? "bg-white text-black"
                            : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter('new')}
                    className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors ${activeFilter === 'new'
                            ? "bg-white text-black"
                            : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                        }`}
                >
                    New ({newCount})
                </button>
                <button
                    onClick={() => setActiveFilter('accepted')}
                    className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors ${activeFilter === 'accepted'
                            ? "bg-white text-black"
                            : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                        }`}
                >
                    Accepted ({acceptedCount})
                </button>
                <button
                    onClick={() => setActiveFilter('declined')}
                    className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors ${activeFilter === 'declined'
                            ? "bg-white text-black"
                            : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                        }`}
                >
                    Declined ({declinedCount})
                </button>
            </div>

            {/* Proposals List Container */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl overflow-hidden">
                {/* Column Headers */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#1F1F1F] bg-[#0D0D0D]">
                    <div className="col-span-3 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide">
                        Brand
                    </div>
                    <div className="col-span-3 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide">
                        Campaign
                    </div>
                    <div className="col-span-2 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide">
                        Budget
                    </div>
                    <div className="col-span-2 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide">
                        Deadline
                    </div>
                    <div className="col-span-2 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide text-right">
                        Status
                    </div>
                </div>

                {/* Proposal Rows */}
                <div>
                    {filteredProposals.map((proposal, index) => (
                        <div
                            key={proposal.id}
                            onClick={() => setSelectedProposal(proposal)}
                            className={`grid grid-cols-12 gap-4 px-6 py-5 hover:bg-[#1A1A1A] transition-colors cursor-pointer group ${index !== filteredProposals.length - 1 ? "border-b border-[#1F1F1F]" : ""
                                }`}
                        >
                            {/* Brand Info */}
                            <div className="col-span-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {proposal.brandLogo}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{proposal.brandName}</p>
                                </div>
                            </div>

                            {/* Campaign Title */}
                            <div className="col-span-3 flex items-center">
                                <p className="text-sm text-white truncate">{proposal.title}</p>
                            </div>

                            {/* Budget */}
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm font-semibold text-white font-angelo">
                                    {formatBudget(proposal.budget)}
                                </p>
                            </div>

                            {/* Deadline */}
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-[#6B6B6B]">{formatDate(proposal.deadline)}</p>
                            </div>

                            {/* Status + Arrow */}
                            <div className="col-span-2 flex items-center justify-end gap-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-angelo ${getStatusColor(proposal.status)}`}>
                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                </span>
                                <ArrowRight className="w-4 h-4 text-[#3D3D3D] group-hover:text-[#6B6B6B] transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProposals.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[#6B6B6B]">No {activeFilter} proposals.</p>
                    </div>
                )}
            </div>

            {/* Proposal Detail Modal */}
            {selectedProposal && (
                <ProposalDetailModal
                    proposal={selectedProposal}
                    onClose={() => setSelectedProposal(null)}
                />
            )}
        </div>
    );
}
