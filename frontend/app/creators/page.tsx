"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CreatorGrid } from "@/components/CreatorGrid";
import { getPublicCreators } from "@/lib/api";

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

export default function CreatorsPage() {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNiche, setSelectedNiche] = useState<string>("All");

    const niches = ["All", "Fashion", "Tech", "Fitness", "Food", "Travel", "Lifestyle"];

    useEffect(() => {
        fetchCreators();
    }, []);

    useEffect(() => {
        let filtered = creators;

        if (searchQuery) {
            filtered = filtered.filter(
                (creator) =>
                    creator.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    creator.instagramHandle?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedNiche !== "All") {
            filtered = filtered.filter((creator) => creator.category === selectedNiche);
        }

        setFilteredCreators(filtered);
    }, [searchQuery, selectedNiche, creators]);

    const fetchCreators = async () => {
        try {
            setIsLoading(true);
            const response = await getPublicCreators();
            setCreators(response.creators as Creator[]);
        } catch (error) {
            console.error("Error fetching creators:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F8F8]">
            {/* Header */}
            <div className="border-b border-[#E5E5E5] bg-white">
                <div className="container mx-auto max-w-7xl px-4 py-6">
                    <h1 className="text-4xl font-bold text-[#0A0A0A] font-milker mb-2">
                        Discover Creators
                    </h1>
                    <p className="text-[#6B6B6B] font-sf-pro">
                        Browse our curated list of talented creators
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                    <input
                        type="text"
                        placeholder="Search creators..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-[#E5E5E5] rounded-md pl-12 pr-4 py-3 text-[#0A0A0A] placeholder-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {niches.map((niche) => (
                        <button
                            key={niche}
                            onClick={() => setSelectedNiche(niche)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedNiche === niche
                                ? "bg-[#0A0A0A] text-white"
                                : "bg-white text-[#6B6B6B] border border-[#E5E5E5] hover:bg-[#F0F0F0]"
                                }`}
                        >
                            {niche}
                        </button>
                    ))}
                </div>

                {/* Creators Grid */}
                <CreatorGrid
                    creators={filteredCreators}
                    isLoading={isLoading}
                    isAuthenticated={true}
                    showCTA={true}
                    emptyMessage="No creators found"
                    emptySubMessage="Try adjusting your search or filters"
                    columns={{
                        desktop: 4,
                        tablet: 3,
                        mobile: 2
                    }}
                />
            </div>
        </main>
    );
}
