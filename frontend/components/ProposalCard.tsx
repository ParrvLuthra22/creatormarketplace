"use client";

import { Proposal } from "@/lib/creatorData";
import ElectricBorder from "./ElectricBorder";
import "./ProposalCard.css";

interface ProposalCardProps {
    proposal: Proposal;
    onClick: () => void;
}

export function ProposalCard({ proposal, onClick }: ProposalCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const formatBudget = (amount: number) => {
        return `₹${(amount / 1000).toFixed(0)}k`;
    };

    const getStatusClass = (status: Proposal['status']) => {
        return status; // 'new', 'accepted', or 'declined'
    };

    const getStatusLabel = (status: Proposal['status']) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <ElectricBorder
            color="#8B5CF6"
            speed={1}
            chaos={0.12}
            thickness={2}
            style={{ borderRadius: 16 }}
        >
            <div className="proposal-card" onClick={onClick}>
                {/* Status Badge */}
                <div className={`proposal-status-badge ${getStatusClass(proposal.status)}`}>
                    {getStatusLabel(proposal.status)}
                </div>

                {/* Brand Logo Section */}
                <div className="proposal-card-header">
                    <div className="brand-logo-container">
                        <div className="brand-logo">
                            {proposal.brandLogo}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="proposal-card-content">
                    <h3 className="proposal-brand-name">
                        {proposal.brandName}
                    </h3>
                    <p className="proposal-campaign-title">{proposal.title}</p>

                    {/* Stats Row */}
                    <div className="proposal-stats">
                        <div className="proposal-stat">
                            <span className="proposal-stat-value">{formatBudget(proposal.budget)}</span>
                            <span className="proposal-stat-label">BUDGET</span>
                        </div>
                        <div className="proposal-stat">
                            <span className="proposal-stat-value">{formatDate(proposal.deadline)}</span>
                            <span className="proposal-stat-label">DEADLINE</span>
                        </div>
                    </div>

                    {/* Deadline Badge */}
                    <div className="proposal-deadline-badge">
                        Due {formatDate(proposal.deadline)}
                    </div>
                </div>
            </div>
        </ElectricBorder>
    );
}
