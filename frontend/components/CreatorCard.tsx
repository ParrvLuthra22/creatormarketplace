"use client";

import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/formatNumber";
import { LockIcon } from "./icons/LockIcon";
import "./CreatorCard.css";

interface CreatorCardProps {
    creator: {
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
    };
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

    // Convert followers/following to numbers if they're strings
    const followersNum = typeof creator.followers === 'string'
        ? parseFloat(creator.followers.replace(/[KM]/g, '')) * (creator.followers.includes('K') ? 1000 : creator.followers.includes('M') ? 1000000 : 1)
        : creator.followers || 0;

    const followingNum = typeof creator.following === 'string'
        ? parseFloat(creator.following.replace(/[KM]/g, '')) * (creator.following.includes('K') ? 1000 : creator.following.includes('M') ? 1000000 : 1)
        : creator.following || 0;

    const handleCardClick = () => {
        if (!isAuthenticated && onAuthGate) {
            onAuthGate();
            return;
        }

        if (onCtaClick) {
            onCtaClick(creator);
        } else {
            router.push(`/creator/${creator.id}`);
        }
    };

    const handleCtaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onCtaClick) {
            onCtaClick(creator);
        } else {
            router.push(`/creator/${creator.id}`);
        }
    };

    return (
        <div className="creator-card" onClick={handleCardClick}>
            {/* Featured/Verified Badge */}
            {isAuthenticated && (creator.featured || creator.verified) && (
                <div className="creator-badge">
                    {creator.featured ? 'FEATURED' : 'VERIFIED'}
                </div>
            )}

            {/* Profile Picture Section */}
            <div className="creator-card-header">
                <div className="profile-picture-container">
                    <img
                        src={creator.profilePicture || '/default-avatar.png'}
                        alt={creator.name || 'Creator'}
                        className="profile-picture"
                    />

                    {/* Verified Checkmark */}
                    {isAuthenticated && creator.verified && (
                        <div className="verified-checkmark">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}

                    {/* Locked Overlay - Only for non-authenticated users */}
                    {!isAuthenticated && (
                        <div className="lock-overlay">
                            <LockIcon className="lock-icon" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="creator-card-content">
                {isAuthenticated ? (
                    <>
                        <h3 className="creator-name">{creator.name}</h3>
                        <p className="creator-handle">@{creator.instagramHandle}</p>

                        {creator.bio && (
                            <p className="creator-bio">{creator.bio}</p>
                        )}

                        {/* Stats Row */}
                        <div className="creator-stats">
                            <div className="stat">
                                <span className="stat-number">{formatNumber(followersNum)}</span>
                                <span className="stat-label">FOLLOWERS</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{formatNumber(followingNum)}</span>
                                <span className="stat-label">FOLLOWING</span>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className="creator-badges-row">
                            {creator.isActive && <span className="status-badge">ACTIVE</span>}
                            {creator.openToWork && <span className="status-badge">OPEN TO WORK</span>}
                            {creator.category && <span className="status-badge">{creator.category.toUpperCase()}</span>}
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="creator-name">Creator Profile</h3>
                        <p className="creator-handle">Sign in to view details</p>
                    </>
                )}
            </div>

            {/* CTA Button (appears on hover for authenticated, always visible for non-authenticated) */}
            {showCTA && (
                <button
                    className={`creator-card-cta ${!isAuthenticated ? 'always-visible' : ''}`}
                    onClick={handleCtaClick}
                >
                    {!isAuthenticated ? 'Sign In to View' : ctaText}
                </button>
            )}
        </div>
    );
}
