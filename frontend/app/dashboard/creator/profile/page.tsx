"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorSidebar } from "@/components/CreatorSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Plus, Check } from "lucide-react";
import { CreatorRightSidebar } from "@/components/CreatorRightSidebar";

const AVAILABLE_NICHES = ["Fashion", "Fitness", "Beauty", "Tech", "Food", "Travel", "Comedy", "Finance", "Education"];

export default function CreatorProfile() {
    const { user, profile } = useAuth();
    const creatorProfile = profile as any;
    const [selectedNiches, setSelectedNiches] = useState<string[]>(["Fashion", "Lifestyle"]);
    const [availability, setAvailability] = useState("Available");

    const toggleNiche = (niche: string) => {
        if (selectedNiches.includes(niche)) {
            setSelectedNiches(selectedNiches.filter(n => n !== niche));
        } else {
            setSelectedNiches([...selectedNiches, niche]);
        }
    };

    return (
        <RouteGuard allowedRole="creator">
            <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
                <div className="hidden md:block">
                    <CreatorSidebar
                        userName={user?.fullName || "Creator User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px]">
                    <h1 className="text-[28px] font-bold text-white font-milker mb-8">My Profile</h1>

                    {/* CARD 1 - Creator Info */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-7 mb-6">
                        <h2 className="text-lg font-bold text-white font-milker mb-5">Profile</h2>

                        {/* Photo Upload */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#2A2A2A] flex items-center justify-center cursor-pointer hover:border-[#6B6B6B] transition-colors">
                                <Plus className="w-8 h-8 text-[#6B6B6B]" />
                            </div>
                            <p className="text-xs text-[#6B6B6B] font-angelo mt-2">Upload photo</p>
                        </div>

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.fullName || ""}
                                    className="w-full h-11 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm focus:outline-none focus:border-white transition-colors"
                                />
                            </div>

                            {/* Instagram Handle */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Instagram Handle</label>
                                <input
                                    type="text"
                                    defaultValue={creatorProfile?.instagramHandle || "@creator"}
                                    className="w-full h-11 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm focus:outline-none focus:border-white transition-colors"
                                />
                                <p className="text-[11px] text-[#1A2A1A] font-angelo mt-1 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Connected
                                </p>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Bio</label>
                                <textarea
                                    rows={3}
                                    placeholder="Tell brands about yourself..."
                                    className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm focus:outline-none focus:border-white transition-colors resize-none"
                                />
                            </div>

                            {/* Niches */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Niches</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_NICHES.map(niche => (
                                        <button
                                            key={niche}
                                            onClick={() => toggleNiche(niche)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-angelo transition-colors ${selectedNiches.includes(niche)
                                                ? "bg-white text-black"
                                                : "bg-[#1F1F1F] text-white hover:bg-[#2A2A2A]"
                                                }`}
                                        >
                                            {niche}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2 - Pricing */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-7 mb-6">
                        <h2 className="text-lg font-bold text-white font-milker mb-5">Pricing</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Price per Reel</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-sm">₹</span>
                                    <input
                                        type="number"
                                        placeholder="5000"
                                        className="w-full h-11 pl-8 pr-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Price per Story</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-sm">₹</span>
                                    <input
                                        type="number"
                                        placeholder="1500"
                                        className="w-full h-11 pl-8 pr-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Price per Post</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-sm">₹</span>
                                    <input
                                        type="number"
                                        placeholder="3000"
                                        className="w-full h-11 pl-8 pr-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-3 border-t border-[#1F1F1F] mt-2">
                                <div>
                                    <p className="text-sm text-white">Custom packages</p>
                                    <p className="text-xs text-[#6B6B6B]">Allow brands to request custom pricing</p>
                                </div>
                                <button className="w-12 h-6 rounded-full bg-white">
                                    <div className="w-5 h-5 rounded-full bg-black translate-x-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3 - Availability */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-7 mb-6">
                        <h2 className="text-lg font-bold text-white font-milker mb-5">Availability</h2>

                        <div>
                            <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Status</label>
                            <select
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                className="w-full h-11 px-4 bg-[#0F0F0F] border border-[#2A2A2A] rounded-[10px] text-white text-sm focus:outline-none focus:border-white transition-colors"
                            >
                                <option>🟢 Available</option>
                                <option>🟡 Limited</option>
                                <option>🔴 Unavailable</option>
                            </select>
                        </div>

                        <button className="mt-6 px-6 h-11 bg-white text-black rounded-[10px] font-angelo text-sm font-semibold hover:opacity-85 transition-opacity">
                            Save Profile
                        </button>
                    </div>
                </main>

                <CreatorRightSidebar />

                <MobileBottomNav role="creator" />
            </div>
        </RouteGuard>
    );
}
