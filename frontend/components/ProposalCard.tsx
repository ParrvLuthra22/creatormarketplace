"use client";

import React, { useState } from 'react';
import { User, Briefcase } from "lucide-react";
import './ProposalCard.css';

interface Proposal {
    id: number;
    brandName: string;
    brandLogo: string;
    title: string;
    budget: number;
    deliverables: string;
    deadline: string;
    status: 'new' | 'accepted' | 'declined';
    startDate?: string;
    isCreatorOwner?: boolean; // Added to handle ownership if needed
    onMessageClick?: () => void;
}

interface ProposalCardProps {
    proposal: Proposal;
    onClick?: () => void;
}

export function ProposalCard({ proposal, onClick }: ProposalCardProps) {
    const [imgError, setImgError] = useState(false);

    const getDaysLeft = () => {
        const today = new Date();
        const dueDate = new Date(proposal.deadline);
        const diffTime = dueDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysLeft = getDaysLeft();

    const showPlaceholder = !proposal.brandLogo || proposal.brandLogo.length <= 3 || imgError;

    return (
        <div className="proposal-card group" onClick={onClick}>
            {/* Background Image */}
            {!showPlaceholder ? (
                <img
                    src={proposal.brandLogo}
                    alt={proposal.brandName}
                    className="proposal-card-bg"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="proposal-card-bg-placeholder">
                    <User className="w-12 h-12 text-zinc-300" />
                </div>
            )}

            {/* Top Badge */}
            <div className={`proposal-card-badge ${proposal.status}`}>
                {proposal.status === 'new' && 'New Proposal'}
                {proposal.status === 'accepted' && 'Active Collab'}
                {proposal.status === 'declined' && 'Declined'}
            </div>

            {/* Main Info Overlay (Visible by default) */}
            <div className="proposal-card-overlay">
                <div className="flex justify-between items-end w-full">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-0.5">{proposal.brandName || 'Brand'}</h3>
                        <p className="text-xs text-white/80 font-medium">{proposal.title || 'Campaign'}</p>
                    </div>
                    <Briefcase className="w-5 h-5 text-white/90" />
                </div>
            </div>

            {/* Hover Expansion Content */}
            <div className="proposal-card-expansion">
                <div className="p-6 pt-0">
                    <div className="h-px bg-white/10 mb-5" />
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Budget:</p>
                            <p className="text-sm font-bold text-white">₹{(proposal.budget / 1000).toFixed(0)}k</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Time Left:</p>
                            <p className="text-sm font-bold text-white">{Math.max(0, daysLeft)} Days</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2.5">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onClick) onClick();
                            }}
                            className="w-full h-11 bg-[#FF4D00] hover:bg-[#FF6A20] text-white rounded-md font-bold text-sm transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                        >
                            View Proposal
                        </button>
                        {proposal.status === 'accepted' && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (proposal.onMessageClick) proposal.onMessageClick();
                                }}
                                className="w-full h-11 bg-white border border-[#FF4D00] text-[#FF4D00] hover:bg-zinc-50 rounded-md font-bold text-sm transition-all active:scale-95 uppercase tracking-widest"
                            >
                                Message User
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
