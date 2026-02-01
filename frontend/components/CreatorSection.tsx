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
    const handleCreatorClick = (creator: Creator) => {
        if (!isAuthenticated) {
            onAuthGate();
        } else {
            onViewProfile(creator);
        }
    };

    return (
        <section className="py-8 px-4 container mx-auto max-w-4xl w-full">
            {/* List Container */}
            <div className="creator-list-container bg-[#141414] rounded-2xl overflow-hidden border border-[#1F1F1F]">
                {creators.map((creator) => (
                    <CreatorCard
                        key={creator.id}
                        creator={creator}
                        onViewProfile={() => handleCreatorClick(creator)}
                        isAuthenticated={isAuthenticated}
                    />
                ))}
            </div>
        </section>
    );
}
