"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

interface CreatorCarouselProps {
    creators: Creator[];
    isLoading?: boolean;
    isAuthenticated?: boolean;
    onAuthGate?: () => void;
    showCTA?: boolean;
    ctaText?: string;
    onCtaClick?: (creator: any) => void;
    emptyMessage?: string;
    emptySubMessage?: string;
    showMoreLink?: string;
}

export function CreatorCarousel({
    creators,
    isLoading = false,
    isAuthenticated = true,
    onAuthGate,
    showCTA = true,
    ctaText,
    onCtaClick,
    emptyMessage,
    emptySubMessage,
    showMoreLink = "/creators"
}: CreatorCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3;

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(creators.length - itemsPerPage, prev + itemsPerPage)
        );
    };

    const visibleCreators = creators.slice(currentIndex, currentIndex + itemsPerPage);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex + itemsPerPage < creators.length;

    // Show loading skeletons
    if (isLoading) {
        return (
            <div className="creator-carousel">
                <div className="carousel-container">
                    <div className="carousel-grid">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <CreatorCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
                <style jsx>{`
                    .creator-carousel {
                        width: 100%;
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .carousel-container {
                        position: relative;
                        padding: 0 60px;
                    }
                    .carousel-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 24px;
                    }
                    @media (max-width: 1024px) {
                        .carousel-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                    @media (max-width: 640px) {
                        .carousel-container {
                            padding: 0 40px;
                        }
                        .carousel-grid {
                            grid-template-columns: 1fr;
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

    return (
        <div className="creator-carousel">
            <div className="carousel-container">
                {/* Previous Button */}
                {canGoPrev && (
                    <button
                        onClick={handlePrev}
                        className="carousel-nav carousel-nav-prev"
                        aria-label="Previous creators"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Creator Cards */}
                <div className="carousel-grid">
                    {visibleCreators.map((creator) => (
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
                </div>

                {/* Next Button */}
                {canGoNext && (
                    <button
                        onClick={handleNext}
                        className="carousel-nav carousel-nav-next"
                        aria-label="Next creators"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>

            {/* Show More Button */}
            {showMoreLink && (
                <div className="carousel-footer">
                    <a href={showMoreLink} className="show-more-button">
                        Show More Creators →
                    </a>
                </div>
            )}

            <style jsx>{`
                .creator-carousel {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .carousel-container {
                    position: relative;
                    padding: 0 60px;
                }

                .carousel-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 48px;
                    justify-items: center;
                }

                .carousel-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #1F1F1F;
                    border: 1px solid #3D3D3D;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 200ms ease;
                    z-index: 10;
                }

                .carousel-nav:hover {
                    background: #2A2A2A;
                    border-color: #4D4D4D;
                    transform: translateY(-50%) scale(1.05);
                }

                .carousel-nav-prev {
                    left: 0;
                }

                .carousel-nav-next {
                    right: 0;
                }

                .carousel-footer {
                    margin-top: 32px;
                    text-align: center;
                }

                .show-more-button {
                    display: inline-block;
                    padding: 14px 32px;
                    background: white;
                    color: black;
                    font-family: 'Angelo', sans-serif;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 200ms ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .show-more-button:hover {
                    background: #F0F0F0;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
                }

                @media (max-width: 1024px) {
                    .carousel-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 40px;
                    }
                }

                @media (max-width: 640px) {
                    .carousel-container {
                        padding: 0 40px;
                    }
                    
                    .carousel-grid {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }

                    .carousel-nav {
                        width: 40px;
                        height: 40px;
                    }
                }
            `}</style>
        </div>
    );
}
