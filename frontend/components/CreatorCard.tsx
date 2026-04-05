"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Check, Lock, User, Instagram, Star } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { getProfilePhotoUrl } from "@/lib/api";
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
    engagementRate?: string;
    pastBrands?: string[];
    isNew?: boolean;
}

interface CreatorCardProps {
    creator: Creator;
    isAuthenticated?: boolean;
    onAuthGate?: () => void;
    showCTA?: boolean;
    ctaText?: string;
    onCtaClick?: (creator: Creator) => void;
    onProposalClick?: (creator: Creator) => void;
}

export function CreatorCard({
    creator,
    isAuthenticated = true,
    onAuthGate,
    showCTA = true,
    ctaText = "View Profile",
    onCtaClick,
    onProposalClick
}: CreatorCardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [imgError, setImgError] = useState(false);

    const handleClick = () => {
        if (!isAuthenticated && onAuthGate) {
            onAuthGate();
        } else {
            const isBrandDashboard = pathname?.startsWith('/dashboard/brand');
            router.push(isBrandDashboard ? `/dashboard/brand/creators/${creator.id}` : `/creator/${creator.id}`);
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

    const handleProposalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onProposalClick) {
            onProposalClick(creator);
        } else {
            // Default behavior if no prop: maybe navigates to a proposal flow or just clicks profile for now
            // But usually this will be handled by the parent
            const isBrandDashboard = pathname?.startsWith('/dashboard/brand');
            if (isBrandDashboard) {
                router.push(`/dashboard/brand/creators/${creator.id}?action=proposal`);
            } else {
                router.push(`/creator/${creator.id}`);
            }
        }
    };

    // Determine if we should show placeholder
    const showPlaceholder = !creator.profilePicture ||
        creator.profilePicture === '/api/placeholder/140/140' ||
        creator.profilePicture === '' ||
        imgError;

    const normalizedHandle = (creator.instagramHandle || '').replace(/^@+/, '');
    const handleLabel = normalizedHandle ? `@${normalizedHandle}` : '';

    return (
        <div className="creator-card group" onClick={handleClick}>
            {/* Background Image */}
            {!showPlaceholder ? (
                <img
                    src={getProfilePhotoUrl(creator.profilePicture)}
                    alt={creator.name}
                    className="creator-card-bg"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="creator-card-bg-placeholder">
                    <User className="w-12 h-12 text-zinc-300" />
                </div>
            )}

            {/* Top Badge */}
            {(creator.featured || creator.isNew) && (
                <div className="creator-card-badge">
                    {creator.featured ? (
                        <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-orange-500 text-orange-500" /> Top Rated
                        </span>
                    ) : (
                        "New"
                    )}
                </div>
            )}

            {/* Main Info Overlay (Visible by default) */}
            <div className="creator-card-overlay">
                <div className="flex justify-between items-end w-full">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-0.5">{creator.name || 'Unknown'}</h3>
                        <p className="text-xs text-white/80 font-medium">{creator.category || 'Creator'}</p>
                    </div>
                    <Instagram className="w-5 h-5 text-white/90" />
                </div>
            </div>

            {/* Hover Expansion Content */}
            <div className="creator-card-expansion">
                <div className="p-6 pt-0">
                    <div className="h-px bg-white/10 mb-5" />
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Engagement Rate:</p>
                            <p className="text-sm font-bold text-white">{creator.engagementRate || '12.5%'}</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Past Brands:</p>
                        <p className="text-sm font-bold text-white leading-relaxed">
                            {creator.pastBrands?.join(', ') || 'Nike, Google, Apple'}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <button 
                            onClick={handleCtaClick}
                            className="w-full h-11 bg-[#FF4D00] hover:bg-[#FF6A20] text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
                        >
                            {ctaText}
                        </button>
                        <button 
                            onClick={handleProposalClick}
                            className="w-full h-11 bg-white border border-[#FF4D00] text-[#FF4D00] hover:bg-zinc-50 rounded-xl font-bold text-sm transition-all active:scale-95"
                        >
                            Send Proposal
                        </button>
                    </div>
                </div>
            </div>

            {/* Lock for non-authenticated */}
            {!isAuthenticated && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 rounded-[28px]">
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                </div>
            )}
        </div>
    );
}
