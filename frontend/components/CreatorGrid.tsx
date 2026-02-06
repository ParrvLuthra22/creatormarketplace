"use client";

import { CreatorCard } from "./CreatorCard";
import { CreatorCardSkeleton } from "./CreatorCardSkeleton";
import { EmptyCreatorState } from "./EmptyCreatorState";

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

interface CreatorGridProps {
    creators: Creator[];
    isLoading?: boolean;
    isAuthenticated?: boolean;
    onAuthGate?: () => void;
    showCTA?: boolean;
    ctaText?: string;
    onCtaClick?: (creator: any) => void;
    emptyMessage?: string;
    emptySubMessage?: string;
    columns?: {
        desktop?: number;
        tablet?: number;
        mobile?: number;
    };
}

export function CreatorGrid({
    creators,
    isLoading = false,
    isAuthenticated = true,
    onAuthGate,
    showCTA = true,
    ctaText,
    onCtaClick,
    emptyMessage,
    emptySubMessage,
    columns = { desktop: 4, tablet: 3, mobile: 2 }
}: CreatorGridProps) {
    // Show loading skeletons
    if (isLoading) {
        return (
            <div className="creators-grid">
                {Array.from({ length: 8 }).map((_, index) => (
                    <CreatorCardSkeleton key={index} />
                ))}
                <style jsx>{`
                    .creators-grid {
                        display: grid;
                        grid-template-columns: repeat(${columns.desktop}, 1fr);
                        gap: 24px;
                        max-width: 1400px;
                        margin: 0 auto;
                    }

                    @media (max-width: 1200px) {
                        .creators-grid {
                            grid-template-columns: repeat(${columns.tablet}, 1fr);
                            gap: 20px;
                        }
                    }

                    @media (max-width: 768px) {
                        .creators-grid {
                            grid-template-columns: repeat(${columns.mobile}, 1fr);
                            gap: 16px;
                        }
                    }

                    @media (max-width: 480px) {
                        .creators-grid {
                            grid-template-columns: 1fr;
                            gap: 12px;
                        }
                    }
                `}</style>
            </div>
        );
    }

    // Show empty state
    if (creators.length === 0) {
        return (
            <EmptyCreatorState
                message={emptyMessage}
                subMessage={emptySubMessage}
            />
        );
    }

    // Show creator cards
    return (
        <div className="creators-grid">
            {creators.map((creator) => (
                <CreatorCard
                    key={creator.id}
                    creator={creator}
                    isAuthenticated={isAuthenticated}
                    onAuthGate={onAuthGate}
                    showCTA={showCTA}
                    ctaText={ctaText}
                    onCtaClick={onCtaClick}
                />
            ))}

            <style jsx>{`
                .creators-grid {
                    display: grid;
                    grid-template-columns: repeat(${columns.desktop}, 1fr);
                    gap: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px;
                }

                @media (max-width: 1200px) {
                    .creators-grid {
                        grid-template-columns: repeat(${columns.tablet}, 1fr);
                        gap: 32px;
                    }
                }

                @media (max-width: 768px) {
                    .creators-grid {
                        grid-template-columns: repeat(${columns.mobile}, 1fr);
                        gap: 24px;
                    }
                }

                @media (max-width: 480px) {
                    .creators-grid {
                        grid-template-columns: 1fr;
                        gap: 32px;
                    }
                }
            `}</style>
        </div>
    );
}
