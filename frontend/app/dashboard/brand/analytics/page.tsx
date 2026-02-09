"use client";

import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { BrandRightSidebar } from "@/components/BrandRightSidebar";
import { TrendingUp, Send, Target, Clock } from "lucide-react";

const ACTIVITIES = [
    { text: "Proposal sent to Priya Sharma", time: "2 hours ago" },
    { text: "Urban Threads accepted proposal", time: "1 day ago" },
    { text: "New creator viewed: Arjun Mehta", time: "2 days ago" },
    { text: "Proposal declined by Zara Khan", time: "3 days ago" },
];

const METRICS = [
    { label: "Total Creators Contacted", value: "24" },
    { label: "Successful Collaborations", value: "8" },
    { label: "Pending Responses", value: "3" },
    { label: "Average Response Time", value: "4.2 hrs" },
];

export default function BrandAnalytics() {
    const { user } = useAuth();

    return (
        <RouteGuard allowedRole="brand">
            <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
                <div className="hidden md:block">
                    <DashboardSidebar
                        userName={user?.fullName || "Brand User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px]">
                    <h1 className="text-[28px] font-bold text-white font-milker mb-8">Analytics</h1>

                    {/* TOP ROW - 4 Mini Stat Cards */}
                    <div className="grid grid-cols-4 gap-3.5 mb-6">
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-4">
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">TOTAL SPEND</p>
                            <p className="text-2xl text-white font-angelo mt-2">₹1,24,500</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">This month</p>
                        </div>

                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-4">
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">PROPOSALS SENT</p>
                            <p className="text-2xl text-white font-angelo mt-2">12</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">This month</p>
                        </div>

                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-4">
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">RESPONSE RATE</p>
                            <p className="text-2xl text-white font-angelo mt-2">67%</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">Last 30 days</p>
                        </div>

                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-4">
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest">AVG. COST/CREATOR</p>
                            <p className="text-2xl text-white font-angelo mt-2">₹15,562</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">This month</p>
                        </div>
                    </div>

                    {/* CHART PLACEHOLDER */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-6 mb-6">
                        <h2 className="text-lg font-bold text-white font-milker mb-4">Performance</h2>
                        <div className="border-2 border-dashed border-[#2A2A2A] rounded-[10px] h-[220px] flex items-center justify-center">
                            <p className="text-sm text-[#3D3D3D]">Chart coming soon</p>
                        </div>
                    </div>

                    {/* BOTTOM ROW - Two Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-6">
                            <h2 className="text-lg font-bold text-white font-milker mb-4">Recent Activity</h2>
                            <div>
                                {ACTIVITIES.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-3 py-2.5 border-b border-[#1F1F1F] last:border-b-0">
                                        <div className="w-7 h-7 rounded-full bg-[#1F1F1F] flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] text-white truncate">{activity.text}</p>
                                            <p className="text-[11px] text-[#6B6B6B]">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Metrics */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-6">
                            <h2 className="text-lg font-bold text-white font-milker mb-4">Top Metrics</h2>
                            <div>
                                {METRICS.map((metric, index) => (
                                    <div key={index} className="flex justify-between items-center py-3 border-b border-[#1F1F1F] last:border-b-0">
                                        <p className="text-sm text-white">{metric.label}</p>
                                        <p className="text-sm text-white font-angelo">{metric.value}</p>
                                    </div>
                                ))}
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
