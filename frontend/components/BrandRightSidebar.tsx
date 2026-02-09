"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";

const PROPOSALS = [
    { avatar: "JD", name: "John Doe", campaign: "Summer Collection", amount: "₹15k", status: "Pending" },
    { avatar: "AS", name: "Alice Smith", campaign: "Tech Review", amount: "₹22k", status: "Accepted" },
    { avatar: "MJ", name: "Mike Johnson", campaign: "Fitness Challenge", amount: "₹8k", status: "Declined" },
];

function getStatusColor(status: string) {
    switch (status) {
        case "Pending":
            return "bg-yellow-500/20";
        case "Accepted":
            return "bg-green-500/20";
        case "Declined":
            return "bg-red-500/20";
        default:
            return "bg-gray-500/20";
    }
}

export function BrandRightSidebar() {
    const { user } = useAuth();
    const router = useRouter();
    const [showProposalTooltip, setShowProposalTooltip] = useState(false);

    return (
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
    );
}
