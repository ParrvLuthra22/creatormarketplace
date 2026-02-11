"use client";

import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorSidebar } from "@/components/CreatorSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CreatorRightSidebar } from "@/components/CreatorRightSidebar";

const ACTIVITIES = [
    { text: "New proposal from FitLife Nutrition", time: "2 hours ago" },
    { text: "Profile viewed by Urban Threads", time: "5 hours ago" },
    { text: "Collaboration completed: NatureBite", time: "2 days ago" },
    { text: "New proposal from TechVerse", time: "3 days ago" },
];

const METRICS = [
    { label: "Total Proposals Received", value: "11" },
    { label: "Accepted Collaborations", value: "8" },
    { label: "Average Deal Value", value: "₹9,000" },
    { label: "Profile Completion", value: "85%" },
];

export default function CreatorAnalytics() {
    const { user } = useAuth();

    return (
        <RouteGuard allowedRole="creator">
            <div className="flex h-screen bg-[#0A0A0A] overflow-hidden text-[#F5F1E8]">
                <div className="hidden md:block">
                    <CreatorSidebar
                        userName={user?.fullName || "Creator User"}
                        userAvatar={user?.fullName?.charAt(0).toUpperCase()}
                    />
                </div>

                <main className="flex-1 overflow-y-auto px-4 md:px-7 py-6 md:py-8 pb-24 md:pb-8 md:ml-[220px] transition-all duration-300">
                    <h1 className="text-[28px] font-bold text-[#F5F1E8] font-milker mb-8">Analytics</h1>

                    {/* TOP ROW - 4 Mini Stat Cards */}
                    <div className="grid grid-cols-4 gap-3.5 mb-6">
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-4 group hover:border-[#00D084]/50 transition-colors">
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest group-hover:text-[#00D084] transition-colors">TOTAL EARNINGS</p>
                            <p className="text-2xl text-[#F5F1E8] font-angelo mt-2">₹45,000</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">This month</p>
                        </div>

                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-4 group hover:border-[#00D084]/50 transition-colors">
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest group-hover:text-[#00D084] transition-colors">PROPOSALS RECEIVED</p>
                            <p className="text-2xl text-[#F5F1E8] font-angelo mt-2">11</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">This month</p>
                        </div>

                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-4 group hover:border-[#00D084]/50 transition-colors">
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest group-hover:text-[#00D084] transition-colors">ACCEPTANCE RATE</p>
                            <p className="text-2xl text-[#F5F1E8] font-angelo mt-2">72%</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">Last 30 days</p>
                        </div>

                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-4 group hover:border-[#00D084]/50 transition-colors">
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-angelo tracking-widest group-hover:text-[#00D084] transition-colors">AVG. DEAL VALUE</p>
                            <p className="text-2xl text-[#F5F1E8] font-angelo mt-2">₹9,000</p>
                            <p className="text-xs text-[#6B6B6B] mt-1">This month</p>
                        </div>
                    </div>

                    {/* CHART PLACEHOLDER */}
                    <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-6 mb-6">
                        <h2 className="text-lg font-bold text-[#F5F1E8] font-milker mb-4">Performance</h2>
                        <div className="border-2 border-dashed border-[#2A2A2A] rounded-[10px] h-[220px] flex items-center justify-center bg-[#0F0F0F]">
                            <p className="text-sm text-[#3D3D3D]">Chart coming soon</p>
                        </div>
                    </div>

                    {/* BOTTOM ROW - Two Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-6">
                            <h2 className="text-lg font-bold text-[#F5F1E8] font-milker mb-4">Recent Activity</h2>
                            <div>
                                {ACTIVITIES.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-3 py-2.5 border-b border-[#1F1F1F] last:border-b-0">
                                        <div className="w-7 h-7 rounded-full bg-[#1F1F1F] flex items-center justify-center flex-shrink-0 border border-[#2A2A2A]">
                                            <div className="w-2 h-2 rounded-full bg-[#00D084] shadow-[0_0_8px_rgba(0,208,132,0.6)]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] text-[#F5F1E8] truncate">{activity.text}</p>
                                            <p className="text-[11px] text-[#6B6B6B]">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Metrics */}
                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[14px] p-6">
                            <h2 className="text-lg font-bold text-[#F5F1E8] font-milker mb-4">Top Metrics</h2>
                            <div>
                                {METRICS.map((metric, index) => (
                                    <div key={index} className="flex justify-between items-center py-3 border-b border-[#1F1F1F] last:border-b-0">
                                        <p className="text-sm text-[#C5C5C5]">{metric.label}</p>
                                        <p className="text-sm text-[#00D084] font-angelo">{metric.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                <div className="hidden xl:block">
                    <CreatorRightSidebar />
                </div>

                <MobileBottomNav role="creator" />
            </div>
        </RouteGuard>
    );
}
