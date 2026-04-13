"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorDashboardLayout } from "@/components/CreatorDashboardLayout";
import { Plus, Check, Camera, Loader2, Link as LinkIcon, Trash2 } from "lucide-react";
import { uploadProfilePhoto, showToast, getProfilePhotoUrl, updateCreatorProfile, updateUserProfile } from "@/lib/api";

const AVAILABLE_NICHES = ["Fashion", "Fitness", "Beauty", "Tech", "Food", "Travel", "Comedy", "Finance", "Education"];

export default function CreatorProfile() {
    const { user, profile, refreshProfile } = useAuth();
    const router = useRouter();
    const creatorProfile = profile as any;
    
    // Form State
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [instagramHandle, setInstagramHandle] = useState(creatorProfile?.instagramHandle || "");
    const [bio, setBio] = useState(creatorProfile?.bio || "");
    const [selectedNiches, setSelectedNiches] = useState<string[]>(creatorProfile?.niches?.length ? creatorProfile.niches : ["Fashion", "Lifestyle"]);
    
    // Pricing
    const [reelPrice, setReelPrice] = useState(creatorProfile?.pricing?.reel || "");
    const [storyPrice, setStoryPrice] = useState(creatorProfile?.pricing?.story || "");
    const [postPrice, setPostPrice] = useState(creatorProfile?.pricing?.post || "");
    
    // General State
    const [availability, setAvailability] = useState(creatorProfile?.availability || "available");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [imgError, setImgError] = useState(false);
    
    // Brand Work State
    const [brandWork, setBrandWork] = useState<Array<{ title: string; type: 'image' | 'video'; url: string; instagramUrl?: string }>>(creatorProfile?.brandWork || []);

    // Sync state if profile changes
    useEffect(() => {
        if (user) setFullName(user.fullName);
        if (creatorProfile) {
            setInstagramHandle(creatorProfile.instagramHandle || "");
            setBio(creatorProfile.bio || "");
            if (creatorProfile.niches?.length) setSelectedNiches(creatorProfile.niches);
            if (creatorProfile.pricing) {
                setReelPrice(creatorProfile.pricing.reel || "");
                setStoryPrice(creatorProfile.pricing.story || "");
                setPostPrice(creatorProfile.pricing.post || "");
            }
            setAvailability(creatorProfile.availability || "available");
            setBrandWork(creatorProfile.brandWork || []);
        }
    }, [user, creatorProfile]);

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
                setImgError(false);
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

    const handleAddBrandWork = () => {
        setBrandWork([...brandWork, { title: "New Campaign", type: 'image', url: "", instagramUrl: "" }]);
    };

    const handleUpdateBrandWork = (index: number, field: string, value: string) => {
        const updated = [...brandWork];
        updated[index] = { ...updated[index], [field]: value };
        setBrandWork(updated);
    };

    const handleRemoveBrandWork = (index: number) => {
        const updated = brandWork.filter((_, i) => i !== index);
        setBrandWork(updated);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            
            // Validate required
            if (!fullName.trim() || !instagramHandle.trim()) {
                showToast("Full Name and Instagram Handle are required", "error");
                setSaving(false);
                return;
            }

            // Update user core info (full name)
            if (fullName !== user?.fullName) {
                await updateUserProfile({ fullName });
            }

            // Prepare Creator payload
            const payload = {
                instagramHandle,
                bio,
                niches: selectedNiches,
                availability,
                pricing: {
                    reel: Number(reelPrice) || undefined,
                    story: Number(storyPrice) || undefined,
                    post: Number(postPrice) || undefined,
                },
                brandWork: brandWork.filter(b => b.title && b.url) // filter incomplete entries
            };

            const res = await updateCreatorProfile(payload);
            
            if (res.success) {
                showToast("Profile saved successfully!", "success");
                await refreshProfile();
            } else {
                showToast("Failed to save profile", "error");
            }

        } catch (err: any) {
            showToast(err.message || "Something went wrong", "error");
        } finally {
            setSaving(false);
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
                                ) : creatorProfile?.profilePhoto && !imgError ? (
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
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-6 text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner lowercase"
                                />
                            </div>

                            {/* Instagram Handle */}
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Instagram Handle</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={instagramHandle}
                                        onChange={(e) => setInstagramHandle(e.target.value)}
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
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
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

                    {/* CARD 2 - Past Brand Work */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight lowercase">past brand work</h2>
                            <button 
                                onClick={handleAddBrandWork}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-md text-xs font-bold uppercase tracking-widest hover:bg-[#FF4D00] transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Work
                            </button>
                        </div>

                        {brandWork.length === 0 ? (
                            <div className="text-center py-10 bg-zinc-50 border border-zinc-100 rounded-md">
                                <p className="text-sm font-bold text-zinc-400 lowercase italic">No portfolio items added yet</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {brandWork.map((work, index) => (
                                    <div key={index} className="p-6 bg-zinc-50 border border-zinc-100 rounded-md relative group">
                                        <button 
                                            onClick={() => handleRemoveBrandWork(index)}
                                            className="absolute top-4 right-4 p-2 bg-white border border-zinc-200 text-red-500 rounded-md hover:bg-red-50 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Campaign/Brand Title</label>
                                                <input
                                                    type="text"
                                                    value={work.title}
                                                    onChange={(e) => handleUpdateBrandWork(index, 'title', e.target.value)}
                                                    placeholder="e.g. Nike Summer Campaign"
                                                    className="w-full h-12 bg-white border border-zinc-200 rounded-md px-4 text-zinc-900 text-sm font-bold focus:outline-none focus:border-[#FF4D00]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Media Type</label>
                                                <select
                                                    value={work.type}
                                                    onChange={(e) => handleUpdateBrandWork(index, 'type', e.target.value)}
                                                    className="w-full h-12 bg-white border border-zinc-200 rounded-md px-4 text-zinc-900 text-sm font-bold focus:outline-none focus:border-[#FF4D00] appearance-none"
                                                >
                                                    <option value="image">Image Post</option>
                                                    <option value="video">Video/Reel</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Image/Video Preview URL</label>
                                                <div className="relative">
                                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                                                    <input
                                                        type="url"
                                                        value={work.url}
                                                        onChange={(e) => handleUpdateBrandWork(index, 'url', e.target.value)}
                                                        placeholder="https://images.unsplash.com/..."
                                                        className="w-full h-12 pl-10 pr-4 bg-white border border-zinc-200 rounded-md text-zinc-900 text-sm font-medium focus:outline-none focus:border-[#FF4D00]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Instagram Post URL (Optional)</label>
                                                <div className="relative">
                                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                                                    <input
                                                        type="url"
                                                        value={work.instagramUrl || ""}
                                                        onChange={(e) => handleUpdateBrandWork(index, 'instagramUrl', e.target.value)}
                                                        placeholder="https://instagram.com/p/..."
                                                        className="w-full h-12 pl-10 pr-4 bg-white border border-zinc-200 rounded-md text-zinc-900 text-sm font-medium focus:outline-none focus:border-[#FF4D00]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CARD 3 - Pricing */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm transition-all duration-300 hover:shadow-md">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-10 lowercase">rate card</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Price per Reel</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-black text-sm">₹</span>
                                    <input
                                        type="number"
                                        value={reelPrice}
                                        onChange={(e) => setReelPrice(e.target.value)}
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
                                        value={storyPrice}
                                        onChange={(e) => setStoryPrice(e.target.value)}
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
                                        value={postPrice}
                                        onChange={(e) => setPostPrice(e.target.value)}
                                        placeholder="3000"
                                        className="w-full h-15 pl-12 pr-6 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-colors shadow-inner"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* CARD 4 - Availability & Save */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-10 mb-10 shadow-sm transition-all duration-300 hover:shadow-md">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-10 lowercase">availability & save</h2>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Current Status</label>
                                <div className="relative">
                                    <select
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        className="w-full h-15 bg-zinc-50 border border-zinc-100 rounded-md px-8 text-zinc-900 text-[15px] font-black focus:outline-none focus:border-[#FF4D00] transition-all appearance-none cursor-pointer shadow-inner"
                                    >
                                        <option value="available">🟢 Available for work</option>
                                        <option value="limited">🟡 Limited slots</option>
                                        <option value="unavailable">🔴 Currently booked</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="h-15 px-14 bg-[#FF4D00] text-white rounded-md font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[200px]"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Profile"}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </CreatorDashboardLayout>
        </RouteGuard>
    );
}
