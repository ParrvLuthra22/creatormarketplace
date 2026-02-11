"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, User } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
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
    const [imgError, setImgError] = useState(false);

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

    // Determine if we should show placeholder
    const showPlaceholder = !creator.profilePicture ||
        creator.profilePicture === '/api/placeholder/140/140' ||
        creator.profilePicture === '' ||
        imgError;

    return (
        <div className="creator-card" onClick={handleClick}>
            <div className="creator-card-inner">
                {/* Featured/Verified Badge */}
                {(creator.featured || creator.verified) && (
                    <div className="creator-badge">
                        {creator.featured ? 'FEATURED' : 'VERIFIED'}
                    </div>
                )}

                {/* Profile Picture Section */}
                <div className="creator-card-header">
                    <div className={`profile-picture-container ${!isAuthenticated ? 'blur-[8px]' : ''}`}>
                        {!showPlaceholder ? (
                            <img
                                src={creator.profilePicture}
                                alt={creator.name || creator.instagramHandle}
                                className="profile-picture"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="profile-picture-placeholder">
                                <User className="w-10 h-10 opacity-40 text-white" strokeWidth={1.5} />
                            </div>
                        )}
                    </div>

                    {creator.verified && (
                        <div className="verified-checkmark">
                            <Check size={16} strokeWidth={3} />
                        </div>
                    )}

                    {/* Lock Overlay - Now centered over the blurred image */}
                    {!isAuthenticated && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full border border-white/10">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="creator-card-content">
                    {/* Name and Handle - ALWAYS VISIBLE */}
                    <div className="mb-4">
                        <h3 className="creator-name" style={{
                            display: 'block',
                            visibility: 'visible',
                            opacity: 1,
                            color: '#FFFFFF',
                            fontSize: '22px',
                            fontWeight: 700,
                            margin: '0 0 4px 0',
                            position: 'relative',
                            zIndex: 100
                        }}>
                            {creator.name || 'Unknown Creator'}
                        </h3>
                        <p className="creator-handle">@{creator.instagramHandle || 'unknown'}</p>
                    </div>

                    {/* Bio - Blurred if not authenticated */}
                    <div className={`${!isAuthenticated ? 'blur-sm opacity-50 select-none' : ''}`}>
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
        </div>
    );
}
