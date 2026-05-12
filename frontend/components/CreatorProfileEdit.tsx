"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/Button";
import { Upload, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateCreatorProfile, uploadProfilePhoto, getProfilePhotoUrl } from "@/lib/api";

type Availability = "available" | "limited" | "unavailable";

type CreatorProfileShape = {
    instagramHandle?: string;
    profilePhoto?: string;
    niches?: string[];
    bio?: string;
    followers?: string;
    engagement?: string;
    location?: string;
    availability?: Availability;
    pricing?: {
        reel?: string;
        story?: string;
    };
};

interface CreatorProfileEditProps {
    totalEarnings: number;
    pendingProposals: number;
    profileViews: number;
}

export function CreatorProfileEdit({ totalEarnings, pendingProposals, profileViews }: CreatorProfileEditProps) {
    const { profile, user } = useAuth();

    const initialProfileData = useMemo(() => {
        const creatorProfile: CreatorProfileShape = (profile ?? {}) as CreatorProfileShape;
        const pricing = creatorProfile.pricing || {};

        return {
            fullName: user?.fullName || "",
            instagramHandle: creatorProfile.instagramHandle || "",
            profilePhoto: creatorProfile.profilePhoto || "",
            niches: Array.isArray(creatorProfile.niches) ? creatorProfile.niches : [],
            bio: creatorProfile.bio || "",
            followers: creatorProfile.followers || "",
            engagement: creatorProfile.engagement || "",
            location: creatorProfile.location || "",
            pricePerReel: Number(pricing.reel ?? 0),
            pricePerStory: Number(pricing.story ?? 0),
            availability: (creatorProfile.availability || "available") as "available" | "limited" | "unavailable",
        };
    }, [profile, user?.fullName]);

    const [profileData, setProfileData] = useState(initialProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    const handlePhotoUpload = async () => {
        try {
            setSaveError(null);
            setSaveSuccess(null);

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;

                setIsUploading(true);
                try {
                    const res = await uploadProfilePhoto(file);
                    setProfileData((prev) => ({ ...prev, profilePhoto: res.url }));
                    setSaveSuccess('Photo uploaded. Click “Save Profile” to update your profile.');
                } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Failed to upload photo';
                    setSaveError(message);
                } finally {
                    setIsUploading(false);
                }
            };

            input.click();
        } catch {
            setSaveError('Failed to open file picker');
        }
    };

    useEffect(() => {
        // Keep in sync when profile loads/changes, but don't clobber while editing.
        if (!isEditing) setProfileData(initialProfileData);
    }, [initialProfileData, isEditing]);

    const availableNiches = [
        "Fashion", "Lifestyle", "Beauty", "Fitness", "Tech", "Food",
        "Travel", "Photography", "Music", "Gaming", "Education", "Comedy"
    ];

    const toggleNiche = (niche: string) => {
        if (profileData.niches.includes(niche)) {
            setProfileData({
                ...profileData,
                niches: profileData.niches.filter((n: string) => n !== niche)
            });
        } else {
            setProfileData({
                ...profileData,
                niches: [...profileData.niches, niche]
            });
        }
    };

    const handleSave = async () => {
        try {
            setSaveError(null);
            setSaveSuccess(null);
            setIsSaving(true);

            await updateCreatorProfile({
                bio: profileData.bio,
                instagramHandle: profileData.instagramHandle.replace(/^@+/, ""),
                profilePhoto: profileData.profilePhoto,
                niches: profileData.niches,
                followers: profileData.followers,
                engagement: profileData.engagement,
                location: profileData.location,
                availability: profileData.availability,
                pricing: {
                    reel: Number(profileData.pricePerReel) || 0,
                    story: Number(profileData.pricePerStory) || 0,
                },
            });

            setSaveSuccess("Profile updated");
            setIsEditing(false);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Failed to update profile";
            setSaveError(message);
        } finally {
            setIsSaving(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>

            {/* Stats Summary */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-pink-50 rounded-sm">
                        <p className="text-2xl font-bold text-[#FF6B9D]">{formatCurrency(totalEarnings)}</p>
                        <p className="text-sm text-gray-600 mt-1">Total Earnings</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-sm">
                        <p className="text-2xl font-bold text-[#FF6B9D]">{pendingProposals}</p>
                        <p className="text-sm text-gray-600 mt-1">Pending Proposals</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-sm">
                        <p className="text-2xl font-bold text-[#FF6B9D]">{profileViews}</p>
                        <p className="text-sm text-gray-600 mt-1">Profile Views</p>
                    </div>
                </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Creator Information</h3>
                    {!isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="text-[#FF6B9D]"
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>

                <div className="space-y-6">
                    {(saveError || saveSuccess) && (
                        <div
                            className={`rounded-sm border px-4 py-3 text-sm ${saveError
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-green-200 bg-green-50 text-green-700"
                                }`}
                        >
                            {saveError || saveSuccess}
                        </div>
                    )}

                    {/* Profile Photo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Photo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-3xl overflow-hidden">
                                {profileData.profilePhoto ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={getProfilePhotoUrl(profileData.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{(profileData.fullName || "C").slice(0, 1).toUpperCase()}</span>
                                )}
                            </div>
                            {isEditing && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#FF6B9D]"
                                    onClick={handlePhotoUpload}
                                    disabled={isUploading}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Full Name (updated via account settings/signup; not edited here) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                            disabled
                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    {/* Profile Photo URL */}
                    {isEditing && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Photo URL
                            </label>
                            <input
                                type="url"
                                value={profileData.profilePhoto}
                                onChange={(e) => setProfileData({ ...profileData, profilePhoto: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">(Upload wiring can be added later; for now paste a URL.)</p>
                        </div>
                    )}

                    {/* Instagram Handle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instagram Handle
                            <span className="ml-2 text-green-600">
                                <Check className="w-4 h-4 inline" /> Verified
                            </span>
                        </label>
                        <input
                            type="text"
                            value={profileData.instagramHandle}
                            onChange={(e) => setProfileData({ ...profileData, instagramHandle: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    {/* Niche Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Niche Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableNiches.map((niche) => (
                                <button
                                    key={niche}
                                    onClick={() => isEditing && toggleNiche(niche)}
                                    disabled={!isEditing}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${profileData.niches.includes(niche)
                                            ? 'bg-[#FF6B9D] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio <span className="text-gray-400">(200 characters max)</span>
                        </label>
                        <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value.slice(0, 200) })}
                            disabled={!isEditing}
                            maxLength={200}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/200</p>
                    </div>

                    {/* Pricing Settings */}
                    <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3">Pricing Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price per Reel (₹)
                                </label>
                                <input
                                    type="number"
                                    value={profileData.pricePerReel}
                                    onChange={(e) => setProfileData({ ...profileData, pricePerReel: Number(e.target.value) })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price per Story (₹)
                                </label>
                                <input
                                    type="number"
                                    value={profileData.pricePerStory}
                                    onChange={(e) => setProfileData({ ...profileData, pricePerStory: Number(e.target.value) })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Availability Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Availability Status
                        </label>
                        <select
                            value={profileData.availability}
                            onChange={(e) => setProfileData({ ...profileData, availability: e.target.value as Availability })}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        >
                            <option value="available">Available</option>
                            <option value="limited">Limited Availability</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                className="bg-[#FF6B9D] hover:bg-[#FF5A8D]"
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save Profile"}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSaveError(null);
                                    setSaveSuccess(null);
                                    setProfileData(initialProfileData);
                                    setIsEditing(false);
                                }}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
