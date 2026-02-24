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
    match?: number;
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
            <div className="text-center py-16 bg-white border border-[#E5E5E5] shadow-sm rounded-[20px] max-w-4xl mx-auto">
                <p className="text-black text-lg font-bold mb-2">No active proposals</p>
                <p className="text-[#6B6B6B] text-sm">Check back later for new opportunities from top brands.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1240px] mx-auto px-8 pb-16 pt-12 relative group">
            <div className="relative">
                {/* Previous Button */}
                <button
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    className={`absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#E5E5E5] bg-white text-black shadow-sm flex items-center justify-center transition-all duration-300 z-10 ${canGoPrev
                        ? "opacity-100 hover:bg-gray-50 hover:border-black cursor-pointer hover:scale-110"
                        : "opacity-0 cursor-default"
                        }`}
                    aria-label="Previous proposals"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Proposal Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 justify-items-center">
                    {visibleProposals.map((proposal) => (
                        <div key={proposal.id} className="transition-all duration-500 animate-in fade-in slide-in-from-right-4">
                            <ProposalCard
                                proposal={proposal}
                                onClick={() => onProposalClick?.(proposal)}
                            />
                        </div>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className={`absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#E5E5E5] bg-white text-black shadow-sm flex items-center justify-center transition-all duration-300 z-10 ${canGoNext
                        ? "opacity-100 hover:bg-gray-50 hover:border-black cursor-pointer hover:scale-110"
                        : "opacity-0 cursor-default"
                        }`}
                    aria-label="Next proposals"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Show More Link */}
            {showMoreLink && (
                <div className="mt-8 text-center">
                    <a
                        href={showMoreLink}
                        className="inline-flex items-center gap-2 text-[13px] font-bold text-black uppercase tracking-widest hover:gap-4 transition-all duration-300"
                    >
                        View All Proposals <span className="text-lg">→</span>
                    </a>
                </div>
            )}
        </div>
    );
}
