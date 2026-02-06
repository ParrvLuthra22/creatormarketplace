"use client";

import { CreatorCarousel } from "./CreatorCarousel";

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

interface CreatorSectionProps {
    creators: Creator[];
    isAuthenticated?: boolean;
    onAuthGate?: () => void;
    isLoading?: boolean;
}

export function CreatorSection({
    creators,
    isAuthenticated = false,
    onAuthGate,
    isLoading = false
}: CreatorSectionProps) {
    return (
        <section className="py-8 px-4 container mx-auto max-w-7xl w-full">
            <CreatorCarousel
                creators={creators}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                onAuthGate={onAuthGate}
                showCTA={true}
                emptyMessage="No creators found"
                emptySubMessage="Try adjusting your filters"
                showMoreLink="/creators"
            />
        </section>
    );
}
