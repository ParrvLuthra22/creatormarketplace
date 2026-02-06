"use client";

import { CreatorGrid } from "./CreatorGrid";

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
    isAuthenticated: boolean;
    onAuthGate: () => void;
}

export function CreatorSection({ creators, isAuthenticated, onAuthGate }: CreatorSectionProps) {
    return (
        <section className="py-8 px-4 container mx-auto max-w-7xl w-full">
            <CreatorGrid
                creators={creators}
                isAuthenticated={isAuthenticated}
                onAuthGate={onAuthGate}
                showCTA={true}
                emptyMessage="No creators found"
                emptySubMessage="Try adjusting your filters or search terms"
            />
        </section>
    );
}
