"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { BrandRightSidebar } from "@/components/BrandRightSidebar";
import { Plus } from "lucide-react";

export default function BrandProfile() {
    const { user, profile } = useAuth();
    const brandProfile = profile as any;

    return (
        <RouteGuard allowedRole="brand">
            <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">
                <div className="hidden md:block">
                    <DashboardSidebar
                        userName={user?.fullName || "Brand User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px]">
                    <h1 className="text-[28px] font-bold text-[#0A0A0A] font-milker mb-8">Profile</h1>

                    {/* CARD 1 - Brand Info */}
                    <div className="bg-white border border-[#E5E5E5] rounded-[14px] p-7 mb-6">
                        <h2 className="text-lg font-bold text-[#0A0A0A] font-milker mb-5">Brand Information</h2>

                        {/* Logo Upload */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#E5E5E5] flex items-center justify-center cursor-pointer hover:border-[#0A0A0A] transition-colors">
                                <Plus className="w-8 h-8 text-[#6B6B6B]" />
                            </div>
                            <p className="text-xs text-[#6B6B6B] font-angelo mt-2">Upload logo</p>
                        </div>

                        <div className="space-y-4">
                            {/* Company Name */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Company Name</label>
                                <input
                                    type="text"
                                    defaultValue={brandProfile?.companyName || ""}
                                    placeholder="Your Company"
                                    className="w-full h-11 px-4 bg-white border border-[#E5E5E5] rounded-[10px] text-[#0A0A0A] text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors"
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Industry</label>
                                <select className="w-full h-11 px-4 bg-white border border-[#E5E5E5] rounded-[10px] text-[#0A0A0A] text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors">
                                    <option>Fashion</option>
                                    <option>Tech</option>
                                    <option>Food</option>
                                    <option>Beauty</option>
                                    <option>Fitness</option>
                                    <option>Finance</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Website</label>
                                <input
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    className="w-full h-11 px-4 bg-white border border-[#E5E5E5] rounded-[10px] text-[#0A0A0A] text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs uppercase text-[#6B6B6B] font-angelo mb-2">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="About your brand..."
                                    className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-[10px] text-[#0A0A0A] text-sm focus:outline-none focus:border-[#0A0A0A] transition-colors resize-none"
                                />
                            </div>

                            <button className="px-6 h-11 bg-[#0A0A0A] text-white rounded-[10px] font-angelo text-sm font-semibold hover:opacity-85 transition-opacity">
                                Save
                            </button>
                        </div>
                    </div>

                    {/* CARD 2 - Collaboration Stats */}
                    <div className="bg-white border border-[#E5E5E5] rounded-[14px] p-7">
                        <h2 className="text-lg font-bold text-[#0A0A0A] font-milker mb-5">Stats</h2>

                        <div>
                            <div className="flex justify-between items-center py-3 border-b border-[#E5E5E5]">
                                <p className="text-sm text-[#0A0A0A]">Total Spend</p>
                                <p className="text-base text-[#0A0A0A] font-angelo">₹1,24,500</p>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-[#E5E5E5]">
                                <p className="text-sm text-[#0A0A0A]">Creators Hired</p>
                                <p className="text-base text-[#0A0A0A] font-angelo">8</p>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-[#E5E5E5]">
                                <p className="text-sm text-[#0A0A0A]">Active Campaigns</p>
                                <p className="text-base text-[#0A0A0A] font-angelo">3</p>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <p className="text-sm text-[#0A0A0A]">Avg. Response Time</p>
                                <p className="text-base text-[#0A0A0A] font-angelo">4.2 hrs</p>
                            </div>
                        </div>
                    </div>
                </main>

                <BrandRightSidebar />

                <MobileBottomNav role="brand" />
            </div>
        </RouteGuard>
    );
}
