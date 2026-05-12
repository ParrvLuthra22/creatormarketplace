"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Upload } from "lucide-react";
import { uploadProfilePhoto } from "@/lib/api";

interface BrandProfileData {
    companyName: string;
    industry: string;
    website: string;
    logo?: string;
}

interface BrandProfileProps {
    totalSpend: number;
    creatorsHired: number;
    pendingProposals: number;
}

export function BrandProfile({ totalSpend, creatorsHired, pendingProposals }: BrandProfileProps) {
    const [profileData, setProfileData] = useState<BrandProfileData>({
        companyName: "Brand Test Company",
        industry: "Fashion & Lifestyle",
        website: "https://example.com",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    const industries = [
        "Fashion & Lifestyle",
        "Technology",
        "Food & Beverage",
        "Health & Fitness",
        "Beauty & Cosmetics",
        "Travel & Tourism",
        "Entertainment",
        "Education",
        "E-commerce",
        "Other"
    ];

    const handleSave = () => {
        // TODO: Save to backend
        setIsEditing(false);
        console.log("Saving profile:", profileData);
    };

    const handleLogoUpload = async () => {
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
                    setProfileData((prev) => ({ ...prev, logo: res.url }));
                    setSaveSuccess('Logo uploaded.');
                } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : 'Failed to upload logo';
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

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Profile</h2>

            {/* Stats Summary */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-sm">
                        <p className="text-2xl font-bold text-[#FF6B35]">{formatCurrency(totalSpend)}</p>
                        <p className="text-sm text-gray-600 mt-1">Total Spent</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-sm">
                        <p className="text-2xl font-bold text-[#FF6B35]">{creatorsHired}</p>
                        <p className="text-sm text-gray-600 mt-1">Creators Hired</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-sm">
                        <p className="text-2xl font-bold text-[#FF6B35]">{pendingProposals}</p>
                        <p className="text-sm text-gray-600 mt-1">Pending Proposals</p>
                    </div>
                </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                    {!isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="text-[#FF6B35]"
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

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Logo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-sm bg-linear-to-br from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                                {profileData.logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={profileData.logo} alt="Company logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{profileData.companyName.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            {isEditing && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#FF6B35]"
                                    onClick={handleLogoUpload}
                                    disabled={isUploading}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isUploading ? 'Uploading...' : 'Upload Logo'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            value={profileData.companyName}
                            onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry
                        </label>
                        <select
                            value={profileData.industry}
                            onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        >
                            {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                            disabled={!isEditing}
                            placeholder="https://example.com"
                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                className="bg-[#FF6B35] hover:bg-[#FF5722]"
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setIsEditing(false)}
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
