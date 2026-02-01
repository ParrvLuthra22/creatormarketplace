"use client";

import { ArrowRight, Lock } from "lucide-react";
import { Creator } from "@/lib/data";

interface CreatorProps {
    creator: Creator;
    onViewProfile?: () => void;
    isAuthenticated?: boolean;
}

export function CreatorCard({ creator, onViewProfile, isAuthenticated = false }: CreatorProps) {
    // Generate a placeholder color based on name length if no image
    const fallbackColor = (creator.name || "").length % 2 === 0 ? "bg-[#1F1F1F] text-white" : "bg-[#2A2A2A] text-white";

    // Format price
    const formattedPrice = `₹${(creator.pricing.starting / 1000).toFixed(0)}k`;

    return (
        <div
            className="creator-row group flex items-center h-[72px] px-5 gap-[14px] overflow-hidden hover:bg-[#1A1A1A] transition-colors cursor-pointer border-b border-[#1F1F1F] last:border-b-0"
            onClick={onViewProfile}
        >
            {/* CHILD 1 — Avatar (fixed width, no shrink) */}
            <div className="creator-avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#1F1F1F] flex items-center justify-center">
                {creator.photo ? (
                    <img src={creator.photo} alt={creator.name} className="w-full h-full object-cover" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center font-bold text-sm ${fallbackColor}`}>
                        {creator.name.charAt(0)}
                    </div>
                )}
            </div>

            {/* CHILD 2 — Info block (takes remaining space, clips overflow) */}
            <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
                <p className="text-[15px] text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                    {creator.name}
                </p>
                <p className="text-[13px] text-[#6B6B6B] font-angelo whitespace-nowrap overflow-hidden text-ellipsis">
                    {creator.handle}
                </p>
            </div>

            {/* CHILD 3 — Right side stats (fixed width, no shrink) - HIDDEN when not authenticated */}
            {isAuthenticated && (
                <div className="creator-stats-right flex-shrink-0 text-right flex flex-col gap-[2px]">
                    <p className="creator-followers text-[13px] text-[#6B6B6B]">{creator.followers}</p>
                    <p className="creator-price text-[13px] text-white font-angelo">{formattedPrice}</p>
                </div>
            )}

            {/* CHILD 4 — Arrow (fixed width) */}
            <div className="flex-shrink-0 w-6 flex items-center justify-center">
                {!isAuthenticated ? (
                    <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#4A4A4A]" />
                        <ArrowRight className="w-[18px] h-[18px] text-[#4A4A4A] transition-colors" />
                    </div>
                ) : (
                    <ArrowRight className="w-[18px] h-[18px] text-[#3D3D3D] group-hover:text-[#6B6B6B] transition-colors" />
                )}
            </div>
        </div>
    );
}
