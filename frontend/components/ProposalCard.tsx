"use client";

import React, { useState } from 'react';
import { Image as ImageIcon } from "lucide-react";
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

    const calculateProgress = () => {
        const today = new Date();
        const dueDate = new Date(proposal.deadline);
        const startDate = new Date(proposal.startDate || Date.now() - 1000 * 60 * 60 * 24 * 7); // Default to a week ago if no start date

        // Ensure we don't divide by zero
        const totalTime = dueDate.getTime() - startDate.getTime();
        if (totalTime <= 0) return 0;

        const timeElapsed = today.getTime() - startDate.getTime();
        const progress = (timeElapsed / totalTime) * 100;

        return Math.min(Math.max(progress, 0), 100);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const getDaysLeft = () => {
        const today = new Date();
        const dueDate = new Date(proposal.deadline);
        // Calculate difference in days
        const diffTime = dueDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const progress = calculateProgress();
    const daysLeft = getDaysLeft();
    const isExpired = daysLeft < 0;

    // Helper to determine if we should show the placeholder
    // If brandLogo is missing, empty, short (initials), or if image failed to load
    const showPlaceholder = !proposal.brandLogo || proposal.brandLogo.length <= 3 || imgError;

    return (
        <div className="proposal-card" onClick={onClick}>
            {/* Animated border is handled by ::before pseudo-element */}

            <div className="proposal-card-inner">
                {/* Status Badge */}
                <div className={`proposal-status-badge ${proposal.status.toLowerCase()}`}>
                    {proposal.status === 'accepted' && '✓ '}
                    {proposal.status}
                </div>

                {/* Header with Logo */}
                <div className="proposal-header">
                    {!showPlaceholder ? (
                        <img
                            src={proposal.brandLogo}
                            alt={proposal.brandName}
                            className="brand-logo"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="brand-logo-placeholder">
                            <ImageIcon className="w-8 h-8 opacity-50 text-[#F5F1E8]" strokeWidth={1.5} />
                        </div>
                    )}

                    <h3 className="brand-name">{proposal.brandName}</h3>
                    <p className="campaign-title">{proposal.title}</p>
                </div>

                {/* Budget & Deadline */}
                <div className="proposal-info-grid">
                    <div className="info-item">
                        <div className="info-value">₹{(proposal.budget / 1000).toFixed(0)}k</div>
                        <div className="info-label">BUDGET</div>
                    </div>
                    <div className="info-item">
                        <div className="info-value">{Math.max(0, daysLeft)}d</div>
                        <div className="info-label">LEFT</div>
                    </div>
                </div>

                {/* Due Date */}
                <div className="proposal-due-date">
                    <svg className="due-date-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="due-date-text">Due {formatDate(proposal.deadline)}</span>
                </div>

                {/* Footer Button */}
                <div className="proposal-footer" style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        className="view-proposal-btn" 
                        style={{ flex: 1 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onClick) onClick();
                        }}
                    >
                        VIEW PROPOSAL
                    </button>
                    {proposal.status === 'accepted' && (
                        <button 
                            className="view-proposal-btn" 
                            style={{ flex: 1, backgroundColor: 'white', color: 'black', border: '1px solid black' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (proposal.onMessageClick) proposal.onMessageClick();
                            }}
                        >
                            MESSAGE USER
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
