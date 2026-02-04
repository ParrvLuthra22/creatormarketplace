"use client";

import { CreatorCard } from "./CreatorCard";
import { Creator } from "@/lib/data";

interface CreatorSectionProps {
    creators: Creator[];
    onViewProfile: (creator: Creator) => void;
    isAuthenticated: boolean;
    onAuthGate: () => void;
}

export function CreatorSection({ creators, onViewProfile, isAuthenticated, onAuthGate }: CreatorSectionProps) {
    const handleCreatorClick = (creator: Creator, index: number) => {
        // Only rows 1-7 (indices 0-6) are clickable when not authenticated
        if (!isAuthenticated && index >= 7) {
            return; // Blur rows are non-clickable
        }

        if (!isAuthenticated) {
            onAuthGate();
        } else {
            onViewProfile(creator);
        }
    };

    // Show only first 10 creators (hide 11-12)
    const visibleCreators = creators.slice(0, 10);

    return (
        <section className="py-8 px-4 container mx-auto max-w-4xl w-full">
            {/* List Container */}
            <div className="creator-list-container bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F] relative">
                {visibleCreators.map((creator, index) => {
                    // Apply progressive blur to rows 8-10 (indices 7-9)
                    let blurStyle = {};
                    let isBlurred = false;

                    if (!isAuthenticated) {
                        if (index === 7) {
                            blurStyle = { filter: 'blur(2px)', opacity: 0.7, pointerEvents: 'none' as const };
                            isBlurred = true;
                        } else if (index === 8) {
                            blurStyle = { filter: 'blur(5px)', opacity: 0.5, pointerEvents: 'none' as const };
                            isBlurred = true;
                        } else if (index === 9) {
                            blurStyle = { filter: 'blur(9px)', opacity: 0.35, pointerEvents: 'none' as const };
                            isBlurred = true;
                        }
                    }

                    return (
                        <div key={creator.id} style={blurStyle}>
                            <CreatorCard
                                creator={creator}
                                onViewProfile={() => handleCreatorClick(creator, index)}
                                isAuthenticated={isAuthenticated}
                            />
                        </div>
                    );
                })}

                {/* Unlock CTA Overlay - only show when not authenticated */}
                {!isAuthenticated && (
                    <div
                        className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-7 pointer-events-none z-10"
                        style={{
                            height: '180px',
                            background: 'linear-gradient(to bottom, rgba(10, 10, 10, 0), rgba(10, 10, 10, 0.6), rgba(10, 10, 10, 0.95))'
                        }}
                    >
                        <p className="text-white text-[15px] mb-1">See 50+ creators</p>
                        <p className="text-[#6B6B6B] text-[13px] mb-4">Sign up free to unlock full access</p>
                        <button
                            onClick={onAuthGate}
                            className="bg-white text-black font-angelo text-[15px] h-12 px-8 rounded-full cursor-pointer hover:bg-gray-100 transition-colors pointer-events-auto"
                            style={{ fontFamily: 'Angelo, sans-serif' }}
                        >
                            Unlock Full Access →
                        </button>
                    </div>
                )}
            </div>

            {/* Responsive styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .absolute.bottom-0 button {
                        height: 44px;
                        font-size: 14px;
                    }
                }
                
                @media (max-width: 480px) {
                    .absolute.bottom-0 {
                        height: 140px !important;
                        padding-bottom: 1.5rem;
                    }
                    .absolute.bottom-0 button {
                        height: 42px;
                        width: calc(100% - 2rem);
                        margin: 0 1rem;
                    }
                }
            `}</style>
        </section>
    );
}
