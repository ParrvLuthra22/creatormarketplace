"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CreatorGrid } from "@/components/CreatorGrid";

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
    const router = useRouter();
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
        filterCreators();
    }, [searchQuery, selectedNiche, creators]);

    const fetchCreators = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creators/public`);
            if (response.ok) {
                const data = await response.json();
                setCreators(data);
            }
        } catch (error) {
            console.error("Error fetching creators:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterCreators = () => {
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
    };

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            {/* Header */}
            <div className="border-b border-[#1F1F1F] bg-[#0D0D0D]">
                <div className="container mx-auto max-w-7xl px-4 py-6">
                    <h1 className="text-4xl font-bold text-white font-milker mb-2">
                        Discover Creators
                    </h1>
                    <p className="text-[#888888] font-sf-pro">
                        Browse our curated list of talented creators
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
                    <input
                        type="text"
                        placeholder="Search creators..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#141414] border border-[#1F1F1F] rounded-xl pl-12 pr-4 py-3 text-white placeholder-[#666666] focus:outline-none focus:border-[#3D3D3D] transition-colors"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {niches.map((niche) => (
                        <button
                            key={niche}
                            onClick={() => setSelectedNiche(niche)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedNiche === niche
                                    ? "bg-white text-black"
                                    : "bg-[#1F1F1F] text-[#888888] hover:bg-[#2A2A2A]"
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
