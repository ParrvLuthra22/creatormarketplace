"use client";

import { useState } from "react";
import { Proposal } from "@/lib/creatorData";
import { ProposalDetailModal } from "./ProposalDetailModal";
import { ProposalCard } from "./ProposalCard";

interface ProposalInboxProps {
    proposals: Proposal[];
}

export function ProposalInbox({ proposals }: ProposalInboxProps) {
    const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'accepted' | 'declined'>('all');
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

    const filteredProposals = activeFilter === 'all'
        ? proposals
        : proposals.filter(p => p.status === activeFilter);

    const newCount = proposals.filter(p => p.status === 'new').length;
    const acceptedCount = proposals.filter(p => p.status === 'accepted').length;
    const declinedCount = proposals.filter(p => p.status === 'declined').length;

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6 font-milker">Collaboration Proposals</h2>

            {/* Filter Pills */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors border ${activeFilter === 'all'
                        ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                        : "bg-white text-[#0A0A0A] border-[#E5E5E5] hover:bg-[#F0F0F0]"
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter('new')}
                    className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors border ${activeFilter === 'new'
                        ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                        : "bg-white text-[#0A0A0A] border-[#E5E5E5] hover:bg-[#F0F0F0]"
                        }`}
                >
                    New ({newCount})
                </button>
                <button
                    onClick={() => setActiveFilter('accepted')}
                    className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors border ${activeFilter === 'accepted'
                        ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                        : "bg-white text-[#0A0A0A] border-[#E5E5E5] hover:bg-[#F0F0F0]"
                        }`}
                >
                    Accepted ({acceptedCount})
                </button>
                <button
                    onClick={() => setActiveFilter('declined')}
                    className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors border ${activeFilter === 'declined'
                        ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                        : "bg-white text-[#0A0A0A] border-[#E5E5E5] hover:bg-[#F0F0F0]"
                        }`}
                >
                    Declined ({declinedCount})
                </button>
            </div>

            {/* Proposals Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProposals.map((proposal) => (
                    <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        onClick={() => setSelectedProposal(proposal)}
                    />
                ))}
            </div>

            {filteredProposals.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-[#6B6B6B]">No {activeFilter} proposals.</p>
                </div>
            )}

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
