"use client";

import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorDashboardLayout } from "@/components/CreatorDashboardLayout";

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
            <CreatorDashboardLayout variant="white">
                <main className="max-w-6xl mx-auto py-8 transition-all duration-300">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-10 lowercase">analytics</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {METRICS.slice(0, 4).map((m, idx) => (
                            <div key={idx} className="bg-white border border-zinc-100 rounded-sm p-8 hover:border-[#FF4D00] hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 group">
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest group-hover:text-[#FF4D00] transition-colors">{m.label}</p>
                                <p className="text-3xl text-zinc-900 font-black mt-3 tracking-tighter lowercase">{m.value}</p>
                                <p className="text-xs text-zinc-400 mt-2 lowercase font-medium">this month</p>
                            </div>
                        ))}
                    </div>

                    {/* CHART PLACEHOLDER */}
                    <div className="bg-white border border-zinc-100 rounded-sm p-8 mb-12 shadow-sm">
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight lowercase mb-8">Performance</h2>
                        <div className="border-2 border-dashed border-zinc-100 rounded-sm h-[300px] flex flex-col items-center justify-center bg-zinc-50/50">
                            <div className="w-16 h-16 rounded-sm bg-white border border-zinc-100 flex items-center justify-center mb-4 shadow-sm">
                                <div className="w-8 h-8 rounded-full border-4 border-[#FF4D00] border-t-transparent animate-spin opacity-20" />
                            </div>
                            <p className="text-sm text-zinc-400 font-bold tracking-tight lowercase">chart functionality coming soon</p>
                        </div>
                    </div>

                    {/* BOTTOM ROW - Two Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Recent Activity */}
                        <div className="bg-white border border-zinc-100 rounded-sm p-8 shadow-sm">
                            <h2 className="text-xl font-black text-zinc-900 tracking-tight lowercase mb-8">recent activity</h2>
                            <div className="space-y-2">
                                {ACTIVITIES.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-4 py-4 px-4 rounded-md hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100 group">
                                        <div className="w-10 h-10 rounded-md bg-zinc-50 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-[#FF4D00] shadow-[0_0_12px_rgba(255,69,0,0.4)]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-zinc-900 truncate lowercase tracking-tight">{activity.text}</p>
                                            <p className="text-[11px] text-zinc-400 font-bold lowercase">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Metrics */}
                        <div className="bg-white border border-zinc-100 rounded-sm p-8 shadow-sm">
                            <h2 className="text-xl font-black text-zinc-900 tracking-tight lowercase mb-8">key statistics</h2>
                            <div className="space-y-4">
                                {METRICS.map((metric, index) => (
                                    <div key={index} className="flex justify-between items-center py-5 px-6 rounded-md bg-zinc-50/50 border border-zinc-100/50">
                                        <p className="text-sm font-bold text-zinc-400 lowercase">{metric.label}</p>
                                        <p className="text-base font-black text-zinc-900 tracking-tight lowercase">{metric.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </CreatorDashboardLayout>
        </RouteGuard>
    );
}
