"use client";

import { useRouter } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import ElectricBorder from "./ElectricBorder";
import "./CreatorCard.css";

interface Creator {
    id: string;
    name?: string;
    instagramHandle?: string;
    profilePicture: string;
    followers?: number | string;
    following?: number | string;
    bio?: string;
    verified?: boolean;
    featured?: boolean;
    isActive?: boolean;
    openToWork?: boolean;
    category?: string;
}

interface CreatorCardProps {
    creator: Creator;
    isAuthenticated?: boolean;
    onAuthGate?: () => void;
    showCTA?: boolean;
    ctaText?: string;
    onCtaClick?: (creator: any) => void;
}

export function CreatorCard({
    creator,
    isAuthenticated = true,
    onAuthGate,
    showCTA = true,
    ctaText = "View Profile",
    onCtaClick
}: CreatorCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (!isAuthenticated && onAuthGate) {
            onAuthGate();
        } else {
            router.push(`/creator/${creator.id}`);
        }
    };

    const handleCtaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onCtaClick) {
            onCtaClick(creator);
        } else {
            handleClick();
        }
    };

    // Determine electric border color based on creator status
    const getBorderColor = () => {
        if (creator.featured) return '#ff809f'; // Pink for featured
        if (creator.verified) return '#8b5cf6'; // Purple for verified
        if (creator.isActive) return '#00ff88'; // Green for active
        return '#6366f1'; // Indigo default
    };

    return (
        <ElectricBorder
            color={getBorderColor()}
            speed={1}
            chaos={0.12}
            borderRadius={16}
            style={{ maxWidth: '280px', width: '100%' }}
        >
            <div className="creator-card" onClick={handleClick}>
                {/* Featured/Verified Badge */}
                {(creator.featured || creator.verified) && (
                    <div className="creator-badge">
                        {creator.featured ? 'FEATURED' : 'VERIFIED'}
                    </div>
                )}

                {/* Profile Picture Section */}
                <div className="creator-card-header">
                    <div className="profile-picture-container">
                        {creator.profilePicture && creator.profilePicture !== '/api/placeholder/140/140' ? (
                            <img
                                src={creator.profilePicture}
                                alt={creator.name || creator.instagramHandle}
                                className="profile-picture"
                            />
                        ) : (
                            <div className="profile-picture-placeholder">
                                {(creator.name || creator.instagramHandle || '?').charAt(0).toUpperCase()}
                            </div>
                        )}
                        {creator.verified && (
                            <div className="verified-checkmark">
                                <Check size={16} strokeWidth={3} />
                            </div>
                        )}
                        {!isAuthenticated && (
                            <div className="lock-overlay">
                                <Lock className="lock-icon" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="creator-card-content">
                    <h3
                        className="creator-name"
                        style={{
                            display: 'block',
                            visibility: 'visible',
                            opacity: 1,
                            color: '#FFFFFF',
                            fontSize: '22px',
                            fontWeight: 700,
                            margin: '0 0 4px 0',
                            position: 'relative',
                            zIndex: 100
                        }}
                    >
                        {creator.name || 'Unknown Creator'}
                    </h3>
                    <p className="creator-handle">@{creator.instagramHandle || 'unknown'}</p>

                    {creator.bio && (
                        <p className="creator-bio">{creator.bio}</p>
                    )}

                    {/* Stats Row */}
                    <div className="creator-stats">
                        <div className="stat">
                            <span className="stat-number">{formatNumber(Number(creator.followers) || 0)}</span>
                            <span className="stat-label">FOLLOWERS</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">{formatNumber(Number(creator.following) || 0)}</span>
                            <span className="stat-label">FOLLOWING</span>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="creator-badges-row">
                        {creator.category && <span className="status-badge">{creator.category.toUpperCase()}</span>}
                        {creator.isActive && <span className="status-badge">LIVE</span>}
                        {creator.openToWork && <span className="status-badge">V1.0</span>}
                    </div>
                </div>

                {/* CTA Button */}
                {showCTA && (
                    <button
                        className={`creator-card-cta ${!isAuthenticated ? 'always-visible' : ''}`}
                        onClick={handleCtaClick}
                    >
                        {ctaText || (isAuthenticated ? 'Get Started' : 'Sign In to View')}
                    </button>
                )}
            </div>
        </ElectricBorder>
    );
}
