"use client";

import { Button } from "./ui/Button";
import { Send, Compass } from "lucide-react";
import { Proposal } from "@/lib/brandData";

interface DashboardWidgetsProps {
    recentProposals: Proposal[];
    onSendProposal?: () => void;
    onBrowseCreators?: () => void;
}

export function DashboardWidgets({ recentProposals, onSendProposal, onBrowseCreators }: DashboardWidgetsProps) {
    const getStatusColor = (status: Proposal['status']) => {
        switch (status) {
            case 'Sent':
                return 'bg-[#1F1F1F] text-[#6B6B6B]';
            case 'Viewed':
                return 'bg-[#1A1A2A] text-[#8B8BFF]';
            case 'Accepted':
                return 'bg-[#1A2A1A] text-[#8BFF8B]';
            case 'Declined':
                return 'bg-[#2A1A1A] text-[#FF8B8B]';
            default:
                return 'bg-[#1F1F1F] text-[#6B6B6B]';
        }
    };

    const formatCurrency = (amount: number) => {
        return `₹${(amount / 1000).toFixed(0)}k`;
    };

    return (
        <div className="w-[300px] space-y-6">
            {/* Quick Actions Widget */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4 font-milker">Quick Actions</h3>
                <div className="space-y-3">
                    <Button
                        onClick={onSendProposal}
                        className="w-full bg-white text-black hover:bg-[#E5E5E5] py-3 text-sm font-angelo flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send Proposal
                    </Button>
                    <Button
                        onClick={onBrowseCreators}
                        className="w-full border border-white text-white hover:bg-[#1A1A1A] py-3 text-sm font-angelo flex items-center justify-center gap-2"
                    >
                        <Compass className="w-4 h-4" />
                        Browse Creators
                    </Button>
                </div>
            </div>

            {/* Recent Proposals Widget */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4 font-milker">Recent Proposals</h3>
                <div className="space-y-3">
                    {recentProposals.slice(0, 5).map((proposal) => (
                        <div
                            key={proposal.id}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white font-semibold text-xs">
                                {proposal.creatorAvatar || proposal.creatorName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {proposal.creatorName}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 text-[10px] font-angelo rounded-full ${getStatusColor(proposal.status)}`}>
                                        {proposal.status}
                                    </span>
                                    <span className="text-xs text-[#6B6B6B]">
                                        {formatCurrency(proposal.budget)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {recentProposals.length === 0 && (
                    <p className="text-sm text-[#6B6B6B] text-center py-4">No recent proposals</p>
                )}
            </div>
        </div>
    );
}
