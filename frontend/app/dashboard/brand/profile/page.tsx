"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { BrandDashboardLayout } from "@/components/BrandDashboardLayout";
import { Plus, Camera, Loader2 } from "lucide-react";
import { uploadProfilePhoto, showToast } from "@/lib/api";

export default function BrandProfile() {
    const { user, profile, refreshProfile } = useAuth();
    const router = useRouter();
    const brandProfile = profile as any;
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) {
            showToast("File is too large (max 5MB)", "error");
            return;
        }

        try {
            setUploading(true);
            const res = await uploadProfilePhoto(file);
            if (res.success) {
                showToast("Logo updated successfully!", "success");
                // Sync the profile context to update the header instantly
                await refreshProfile();
                // Refresh the page to show the new logo
                router.refresh();
            }
        } catch (err: any) {
            showToast(err.message || "Upload failed", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <RouteGuard allowedRole="brand">
            <BrandDashboardLayout variant="white">
                <div className="py-8">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-10">Brand Profile</h1>

                    {/* CARD 1 - Brand Info */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-10">Brand Information</h2>

                        {/* Logo Upload */}
                        <div className="flex flex-col items-center mb-12 group">
                            <label className="relative w-32 h-32 rounded-sm border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center cursor-pointer hover:border-[#FF4D00] hover:bg-orange-50 transition-all shadow-sm group-hover:scale-105 group-hover:shadow-lg overflow-hidden">
                                {uploading ? (
                                    <Loader2 className="w-10 h-10 text-[#FF4D00] animate-spin" />
                                ) : brandProfile?.logoUrl ? (
                                    <>
                                        <img 
                                            src={brandProfile.logoUrl.startsWith('/') ? `http://localhost:5001${brandProfile.logoUrl}` : brandProfile.logoUrl} 
                                            alt="Brand Logo" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <Plus className="w-10 h-10 text-zinc-300 group-hover:text-[#FF4D00] transition-colors" />
                                )}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </label>
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-6 group-hover:text-zinc-600 transition-colors">
                                {uploading ? "Uploading..." : brandProfile?.logoUrl ? "Change Brand Identity" : "Update Brand Identity"}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Company Name */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Company Name</label>
                                    <input
                                        type="text"
                                        defaultValue={brandProfile?.companyName || ""}
                                        placeholder="Enter company name"
                                        className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-6 text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner"
                                    />
                                </div>

                                {/* Industry */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Industry</label>
                                    <div className="relative">
                                        <select className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-6 text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-all appearance-none cursor-pointer shadow-inner">
                                            <option>Fashion & Lifestyle</option>
                                            <option>Technology & SaaS</option>
                                            <option>Food & Beverage</option>
                                            <option>Health & Beauty</option>
                                            <option>Fitness & Wellness</option>
                                            <option>Fintech & Finance</option>
                                            <option>Other Industry</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                            <Plus className="w-4 h-4 rotate-45" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Official Website</label>
                                <input
                                    type="url"
                                    placeholder="https://yourbrand.com"
                                    className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-6 text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Brand Story</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell creators what your brand is about..."
                                    className="w-full px-8 py-5 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-900 text-[15px] font-medium focus:outline-none focus:border-[#FF4D00] transition-colors resize-none leading-relaxed shadow-inner"
                                />
                            </div>

                            <div className="pt-6">
                                <button className="h-15 px-14 bg-[#FF4D00] text-white rounded-md font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/10">
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2 - Collaboration Stats */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 shadow-sm">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-10">Performance Snapshot</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-md flex justify-between items-center hover:bg-orange-50 hover:border-orange-100 transition-all group">
                                <p className="text-sm text-zinc-500 font-bold group-hover:text-zinc-600">Total Campaign Spend</p>
                                <p className="text-2xl text-zinc-900 font-black tracking-tight group-hover:text-[#FF4D00]">₹1,24,500</p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-md flex justify-between items-center hover:bg-orange-50 hover:border-orange-100 transition-all group">
                                <p className="text-sm text-zinc-500 font-bold group-hover:text-zinc-600">Creator Partnerships</p>
                                <p className="text-2xl text-zinc-900 font-black tracking-tight group-hover:text-[#FF4D00]">8</p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-md flex justify-between items-center hover:bg-orange-50 hover:border-orange-100 transition-all group">
                                <p className="text-sm text-zinc-500 font-bold group-hover:text-zinc-600">Active Collaborations</p>
                                <p className="text-2xl text-zinc-900 font-black tracking-tight group-hover:text-[#FF4D00]">3</p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-md flex justify-between items-center hover:bg-orange-50 hover:border-orange-100 transition-all group">
                                <p className="text-sm text-zinc-500 font-bold group-hover:text-zinc-600">Avg. Response Time</p>
                                <p className="text-2xl text-zinc-900 font-black tracking-tight group-hover:text-[#FF4D00]">4.2 h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </BrandDashboardLayout>
        </RouteGuard>
    );
}
