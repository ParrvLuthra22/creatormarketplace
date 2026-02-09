"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProposalCard } from "./ProposalCard";

interface Proposal {
    id: number;
    brandName: string;
    brandLogo: string;
    title: string;
    budget: number;
    deliverables: string;
    deadline: string;
    status: 'new' | 'accepted' | 'declined';
}

interface ProposalCarouselProps {
    proposals: Proposal[];
    onProposalClick?: (proposal: Proposal) => void;
    showMoreLink?: string;
}

export function ProposalCarousel({
    proposals,
    onProposalClick,
    showMoreLink
}: ProposalCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3;

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(proposals.length - itemsPerPage, prev + itemsPerPage)
        );
    };

    const visibleProposals = proposals.slice(currentIndex, currentIndex + itemsPerPage);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex + itemsPerPage < proposals.length;

    if (proposals.length === 0) {
        return (
            <div className="text-center py-12 bg-[#141414] border border-[#1F1F1F] rounded-[14px]">
                <p className="text-white text-sm">No proposals yet</p>
                <p className="text-[#6B6B6B] text-xs mt-1">Check back later for new opportunities</p>
            </div>
        );
    }

    return (
        <div className="proposal-carousel">
            <div className="carousel-container">
                {/* Previous Button */}
                {canGoPrev && (
                    <button
                        onClick={handlePrev}
                        className="carousel-nav carousel-nav-prev"
                        aria-label="Previous proposals"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Proposal Cards */}
                <div className="carousel-grid">
                    {visibleProposals.map((proposal) => (
                        <ProposalCard
                            key={proposal.id}
                            proposal={proposal}
                            onClick={() => onProposalClick?.(proposal)}
                        />
                    ))}
                </div>

                {/* Next Button */}
                {canGoNext && (
                    <button
                        onClick={handleNext}
                        className="carousel-nav carousel-nav-next"
                        aria-label="Next proposals"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>

            {/* Show More Link */}
            {showMoreLink && (
                <div className="carousel-footer">
                    <a href={showMoreLink} className="show-more-link">
                        See all proposals →
                    </a>
                </div>
            )}

            <style jsx>{`
                .proposal-carousel {
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
                    margin-top: 24px;
                    text-align: center;
                }

                .show-more-link {
                    display: inline-block;
                    color: white;
                    font-family: 'Angelo', sans-serif;
                    font-size: 14px;
                    text-decoration: none;
                    transition: opacity 200ms ease;
                }

                .show-more-link:hover {
                    opacity: 0.85;
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

                    .carousel-nav {
                        width: 40px;
                        height: 40px;
                    }
                }
            `}</style>
        </div>
    );
}
