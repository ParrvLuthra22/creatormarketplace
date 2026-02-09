"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, Check, Mail, Eye, CheckCircle, FileText } from "lucide-react";

const ACTIVITIES = [
    { icon: "📧", text: "New proposal from FitLife", time: "2 hours ago" },
    { icon: "👁️", text: "Profile viewed by Urban Thr...", time: "5 hours ago" },
    { icon: "✅", text: "Collaboration completed: Na...", time: "2 days ago" },
    { icon: "📄", text: "New proposal from TechVerse", time: "3 days ago" },
];

const availabilityOptions = [
    { value: "actively-accepting", label: "Actively accepting", dot: "bg-green-500" },
    { value: "selective", label: "Selective", dot: "bg-yellow-500" },
    { value: "booked", label: "Booked", dot: "bg-red-500" },
];

export function CreatorRightSidebar() {
    const { user } = useAuth();
    const [availability, setAvailability] = useState("actively-accepting");
    const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);

    const currentAvailability = availabilityOptions.find(opt => opt.value === availability) || availabilityOptions[0];

    // Determine tier based on profile completeness (dummy logic)
    const tier = { label: "Growing", bg: "bg-[#1A1A2A]", color: "text-white" };

    return (
        <aside className="hidden lg:flex w-[280px] px-5 pl-4 py-8 flex-col gap-4 overflow-y-auto">
            {/* WIDGET 1 - My Profile */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5">
                <h3 className="text-base font-bold text-white font-milker mb-4">My Profile</h3>
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-lg font-semibold mb-3">
                        {user?.fullName?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <p className="text-[15px] font-semibold text-white mb-1">{user?.fullName || "Creator User"}</p>

                    {/* Tier Badge */}
                    <div className="relative group mb-2">
                        <span className={`px-2.5 py-0.5 rounded-xl text-[11px] font-angelo ${tier.bg} ${tier.color}`}>
                            {tier.label}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#141414] border border-[#1F1F1F] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            <p className="text-[12px] text-[#6B6B6B]">Tier based on your profile completeness and activity</p>
                        </div>
                    </div>

                    <p className="text-[13px] text-[#6B6B6B] font-angelo mb-3">
                        @testcreator
                    </p>
                    <div className="flex gap-2 justify-center mb-3.5">
                        <span className="px-2.5 py-1 rounded-xl text-[11px] bg-[#1F1F1F] text-white font-angelo">
                            Fashion
                        </span>
                        <span className="px-2.5 py-1 rounded-xl text-[11px] bg-[#1F1F1F] text-white font-angelo">
                            Lifestyle
                        </span>
                    </div>

                    {/* Availability Selector */}
                    <div className="w-full mb-3.5">
                        <p className="text-[11px] uppercase text-[#6B6B6B] font-angelo tracking-wide mb-2 text-left">Availability</p>
                        <div className="relative">
                            <div
                                onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
                                className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-[10px] px-3.5 py-2.5 cursor-pointer flex items-center justify-between hover:border-[#2A2A2A] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${currentAvailability.dot}`}></div>
                                    <span className="text-[14px] text-white font-angelo">{currentAvailability.label}</span>
                                </div>
                                <ChevronDown className="w-3 h-3 text-[#6B6B6B]" />
                            </div>

                            {/* Dropdown Panel */}
                            {showAvailabilityDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-[#1F1F1F] rounded-[10px] p-2 z-20">
                                    {availabilityOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => {
                                                setAvailability(option.value);
                                                setShowAvailabilityDropdown(false);
                                            }}
                                            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${option.dot}`}></div>
                                                <span className="text-[14px] text-white font-angelo">{option.label}</span>
                                            </div>
                                            {availability === option.value && (
                                                <Check className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Link
                        href="/dashboard/creator/profile"
                        className="text-[13px] text-white font-angelo hover:opacity-85 transition-opacity cursor-pointer"
                    >
                        Edit Profile →
                    </Link>
                </div>
            </div>

            {/* WIDGET 2 - Recent Activity */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-5">
                <h3 className="text-base font-bold text-white font-milker mb-4">Activity</h3>
                <div>
                    {ACTIVITIES.map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 py-2.5 border-b border-[#1F1F1F] last:border-b-0"
                        >
                            <div className="w-7 h-7 rounded-full bg-[#1F1F1F] flex items-center justify-center text-sm flex-shrink-0">
                                {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-white truncate">{activity.text}</p>
                                <p className="text-[11px] text-[#6B6B6B]">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
