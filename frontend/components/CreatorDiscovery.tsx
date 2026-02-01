"use client";

import { useState } from "react";
import { CREATORS } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { CreatorProfileModal } from "./CreatorProfileModal";

const niches = ["All", "Fashion", "Tech", "Food", "Fitness", "Beauty", "Travel", "Lifestyle", "Gaming"];

export function CreatorDiscovery() {
    const [selectedNiche, setSelectedNiche] = useState("All");
    const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

    // Filter creators based on selected niche
    const filteredCreators = selectedNiche === "All"
        ? CREATORS
        : CREATORS.filter((creator) => creator.niches.includes(selectedNiche));

    const formatPrice = (price: number) => {
        return `₹${(price / 1000).toFixed(0)}k`;
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6 font-milker">Discover Creators</h2>

            {/* Filter Pills */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {niches.map((niche) => (
                    <button
                        key={niche}
                        onClick={() => setSelectedNiche(niche)}
                        className={`px-4 py-2 rounded-full text-xs font-angelo transition-colors ${selectedNiche === niche
                                ? "bg-white text-black"
                                : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                            }`}
                    >
                        {niche}
                    </button>
                ))}
            </div>

            {/* Creator List Container */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-2xl overflow-hidden">
                {/* Column Headers */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#1F1F1F] bg-[#0D0D0D]">
                    <div className="col-span-4 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide">
                        Creator
                    </div>
                    <div className="col-span-2 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide">
                        Niche
                    </div>
                    <div className="col-span-2 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide">
                        Followers
                    </div>
                    <div className="col-span-2 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide">
                        Engagement
                    </div>
                    <div className="col-span-2 text-[11px] font-semibold text-[#3D3D3D] uppercase tracking-wide text-right">
                        Price
                    </div>
                </div>

                {/* Creator Rows */}
                <div>
                    {filteredCreators.map((creator, index) => (
                        <div
                            key={creator.id}
                            onClick={() => setSelectedCreatorId(creator.id)}
                            className={`grid grid-cols-12 gap-4 px-6 py-5 hover:bg-[#1A1A1A] transition-colors cursor-pointer group ${index !== filteredCreators.length - 1 ? "border-b border-[#1F1F1F]" : ""
                                }`}
                        >
                            {/* Creator Info */}
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#1F1F1F]">
                                    {creator.photo ? (
                                        <img src={creator.photo} alt={creator.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                            {creator.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{creator.name}</p>
                                    <p className="text-xs text-[#6B6B6B] font-angelo truncate">{creator.handle}</p>
                                </div>
                            </div>

                            {/* Niche */}
                            <div className="col-span-2 flex items-center">
                                <span className="px-2 py-1 rounded-full text-[10px] bg-[#1F1F1F] text-[#6B6B6B] font-angelo">
                                    {creator.niches[0]}
                                </span>
                            </div>

                            {/* Followers */}
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-[#6B6B6B]">{creator.followers}</p>
                            </div>

                            {/* Engagement */}
                            <div className="col-span-2 flex items-center">
                                <p className="text-sm text-[#6B6B6B]">
                                    {creator.engagement || "4.2%"}
                                </p>
                            </div>

                            {/* Price + Arrow */}
                            <div className="col-span-2 flex items-center justify-end gap-3">
                                <p className="text-sm font-semibold text-white font-angelo">
                                    {formatPrice(creator.pricing.starting)}
                                </p>
                                <ArrowRight className="w-4 h-4 text-[#3D3D3D] group-hover:text-[#6B6B6B] transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCreators.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[#6B6B6B]">No creators found matching your filters.</p>
                        <p className="text-sm text-[#3D3D3D] mt-2">Try selecting a different niche.</p>
                    </div>
                )}
            </div>

            {selectedCreatorId && (
                <CreatorProfileModal
                    creatorId={selectedCreatorId}
                    onClose={() => setSelectedCreatorId(null)}
                />
            )}
        </div>
    );
}
