"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorDashboardLayout } from "@/components/CreatorDashboardLayout";
import { Plus, Check, Camera, Loader2 } from "lucide-react";
import { uploadProfilePhoto, showToast, getProfilePhotoUrl } from "@/lib/api";

const AVAILABLE_NICHES = ["Fashion", "Fitness", "Beauty", "Tech", "Food", "Travel", "Comedy", "Finance", "Education"];

export default function CreatorProfile() {
    const { user, profile, refreshProfile } = useAuth();
    const router = useRouter();
    const creatorProfile = profile as any;
    const [selectedNiches, setSelectedNiches] = useState<string[]>(["Fashion", "Lifestyle"]);
    const [availability, setAvailability] = useState("Available");
    const [uploading, setUploading] = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast("File is too large (max 5MB)", "error");
            return;
        }

        try {
            setUploading(true);
            const res = await uploadProfilePhoto(file);
            if (res.success) {
                showToast("Profile photo updated!", "success");
                setImgError(false); // Reset error state on new upload
                // Sync the profile context to update the header instantly
                await refreshProfile();
                router.refresh();
            }
        } catch (err: any) {
            showToast(err.message || "Upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    const toggleNiche = (niche: string) => {
        if (selectedNiches.includes(niche)) {
            setSelectedNiches((prev) => prev.filter((n: string) => n !== niche));
        } else {
            setSelectedNiches((prev) => [...prev, niche]);
        }
    };

    return (
        <RouteGuard allowedRole="creator">
            <CreatorDashboardLayout variant="white">
                <main className="max-w-4xl mx-auto py-8">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-10 lowercase">my profile</h1>

                    {/* CARD 1 - Creator Info */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm transition-all duration-300 hover:shadow-md">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-10 lowercase">profile details</h2>

                        {/* Photo Upload */}
                        <div className="flex flex-col items-center mb-12 group">
                            <label className="relative w-32 h-32 rounded-full border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center cursor-pointer hover:border-[#FF4D00] hover:bg-orange-50 transition-all shadow-sm group-hover:scale-105 group-hover:shadow-lg overflow-hidden">
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                    <>
                                        <img 
                                            src={getProfilePhotoUrl(creatorProfile.profilePhoto)} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                            onError={() => setImgError(true)}
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <Plus className="w-8 h-8 font-bold text-zinc-400" />
                                )}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </label>
                            <p className="text-xs text-[#6B6B6B] font-angelo mt-2 group-hover:text-black transition-colors">
                                {uploading ? "Uploading..." : creatorProfile?.profilePhoto ? "Change Photo" : "Upload photo"}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.fullName || ""}
                                    className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-6 text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner lowercase"
                                />
                            </div>

                            {/* Instagram Handle */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Instagram Handle</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        defaultValue={creatorProfile?.instagramHandle || "@creator"}
                                        className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-6 text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner"
                                    />
                                    <p className="text-[11px] text-[#4A46FF] font-bold mt-3 flex items-center gap-1 lowercase">
                                        <Check className="w-3 h-3" /> account connected
                                    </p>
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Creator Bio</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell brands about your unique style..."
                                    className="w-full px-8 py-5 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-900 text-[15px] font-medium focus:outline-none focus:border-[#FF4D00] transition-colors resize-none leading-relaxed shadow-inner"
                                />
                            </div>

                            {/* Niches */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Content Niches</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_NICHES.map(niche => (
                                        <button
                                            key={niche}
                                            onClick={() => toggleNiche(niche)}
                                            className={`px-4 py-2 rounded-md text-xs font-black tracking-widest uppercase transition-all border ${selectedNiches.includes(niche)
                                                ? "bg-[#FF4D00] text-white border-[#FF4D00] shadow-md scale-105"
                                                : "text-zinc-400 border-zinc-100 bg-zinc-50 hover:border-[#FF4D00] hover:text-[#FF4D00]"
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
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm transition-all duration-300 hover:shadow-md">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-10 lowercase">rate card</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Price per Reel</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-black text-sm">₹</span>
                                    <input
                                        type="number"
                                        placeholder="5000"
                                        className="w-full h-15 pl-12 pr-6 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Price per Story</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-black text-sm">₹</span>
                                    <input
                                        type="number"
                                        placeholder="1500"
                                        className="w-full h-15 pl-12 pr-6 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Price per Post</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-black text-sm">₹</span>
                                    <input
                                        type="number"
                                        placeholder="3000"
                                        className="w-full h-15 pl-12 pr-6 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-3 border-t border-[#E5E5E5] mt-2">
                                <div>
                                    <p className="text-sm text-zinc-900 font-bold lowercase">custom strategy packages</p>
                                    <p className="text-xs text-zinc-400 lowercase">allow brands to request bespoke campaign pricing</p>
                                </div>
                                <button className="w-13 h-7.5 rounded-full bg-[#4CAF50] transition-colors flex items-center px-1">
                                    <div className="w-5.5 h-5.5 rounded-full bg-white shadow-sm translate-x-5.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3 - Availability */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm transition-all duration-300 hover:shadow-md">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-10 lowercase">availability status</h2>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Current Status</label>
                                <div className="relative">
                                    <select
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-8 text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-all appearance-none cursor-pointer shadow-inner"
                                    >
                                        <option>🟢 Available for work</option>
                                        <option>🟡 Limited slots</option>
                                        <option>🔴 Currently booked</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="h-15 px-14 bg-[#FF4D00] text-white rounded-md font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/10">
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </CreatorDashboardLayout>
        </RouteGuard>
    );
}
