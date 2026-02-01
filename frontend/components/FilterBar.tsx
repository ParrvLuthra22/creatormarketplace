"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

export interface FilterOptions {
    niche: string;
    budgetMin: number;
    budgetMax: number;
    followersRange: string;
}

interface FilterBarProps {
    onFilterChange: (filters: FilterOptions) => void;
}

const niches = [
    "All Niches",
    "Fashion",
    "Tech",
    "Food",
    "Fitness",
    "Beauty",
    "Travel",
    "Lifestyle",
    "Gaming",
    "Photography",
    "Music",
    "Education"
];

const followersRanges = [
    "All Followers",
    "10K - 50K",
    "50K - 100K",
    "100K - 500K",
    "500K - 1M",
    "1M+"
];

export function FilterBar({ onFilterChange }: FilterBarProps) {
    const [selectedNiche, setSelectedNiche] = useState("All Niches");
    const [budgetMin, setBudgetMin] = useState(0);
    const [budgetMax, setBudgetMax] = useState(50000);
    const [followersRange, setFollowersRange] = useState("All Followers");

    const handleApplyFilters = () => {
        onFilterChange({
            niche: selectedNiche,
            budgetMin,
            budgetMax,
            followersRange,
        });
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Niche Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niche
                    </label>
                    <select
                        value={selectedNiche}
                        onChange={(e) => setSelectedNiche(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    >
                        {niches.map((niche) => (
                            <option key={niche} value={niche}>
                                {niche}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Budget Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                    </label>
                    <div className="space-y-2">
                        <input
                            type="range"
                            min="0"
                            max="50000"
                            step="1000"
                            value={budgetMax}
                            onChange={(e) => setBudgetMax(Number(e.target.value))}
                            className="w-full accent-[#FF6B35]"
                        />
                        <p className="text-xs text-gray-600">
                            ₹{budgetMin.toLocaleString()} - ₹{budgetMax.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Followers Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Followers
                    </label>
                    <select
                        value={followersRange}
                        onChange={(e) => setFollowersRange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    >
                        {followersRanges.map((range) => (
                            <option key={range} value={range}>
                                {range}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Apply Button */}
                <div className="flex items-end">
                    <Button
                        variant="primary"
                        onClick={handleApplyFilters}
                        className="w-full bg-[#FF6B35] hover:bg-[#FF5722]"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}
