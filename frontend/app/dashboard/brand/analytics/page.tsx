"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { BrandDashboardLayout } from "@/components/BrandDashboardLayout";
import { getPublicCreators } from "@/lib/api";

export default function BrandAnalytics() {
    const { user } = useAuth();
    const [creatorCount, setCreatorCount] = useState(0);
    const [activities, setActivities] = useState<{ text: string; time: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPublicCreators();
                if (res.success && res.creators) {
                    setCreatorCount(res.creators.length);
                    setActivities(res.creators.slice(0, 4).map((c, i) => ({
                        text: `Viewed profile: ${c.name || c.instagramHandle || 'Creator'}`,
                        time: `${i + 1} day${i > 0 ? 's' : ''} ago`,
                    })));
                }
            } catch (err) {
                console.error("Failed to fetch analytics data:", err);
            }
        };
        fetchData();
    }, []);

    const metrics = [
        { label: "Total Creators Available", value: String(creatorCount) },
        { label: "Successful Collaborations", value: "0" },
        { label: "Pending Responses", value: "0" },
        { label: "Average Response Time", value: "—" },
    ];

    return (
        <RouteGuard allowedRole="brand">
            <BrandDashboardLayout variant="white">
                <div className="py-8">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none mb-10">Analytics</h1>

                    {/* TOP ROW - 4 Mini Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white border border-zinc-100 rounded-[28px] p-8 shadow-sm">
                            <p className="text-[10px] uppercase text-zinc-400 font-black tracking-widest mb-4">TOTAL SPEND</p>
                            <p className="text-4xl text-zinc-900 font-black tracking-tight">₹0</p>
                            <p className="text-xs text-zinc-400 font-bold mt-3">This month</p>
                        </div>

                        <div className="bg-white border border-zinc-100 rounded-[28px] p-8 shadow-sm">
                            <p className="text-[10px] uppercase text-zinc-400 font-black tracking-widest mb-4">PROPOSALS SENT</p>
                            <p className="text-4xl text-zinc-900 font-black tracking-tight">0</p>
                            <p className="text-xs text-zinc-400 font-bold mt-3">This month</p>
                        </div>

                        <div className="bg-white border border-zinc-100 rounded-[28px] p-8 shadow-sm">
                            <p className="text-[10px] uppercase text-zinc-400 font-black tracking-widest mb-4">RESPONSE RATE</p>
                            <p className="text-4xl text-zinc-900 font-black tracking-tight">0%</p>
                            <p className="text-xs text-zinc-400 font-bold mt-3">Last 30 days</p>
                        </div>

                        <div className="bg-white border border-zinc-100 rounded-[28px] p-8 shadow-sm">
                            <p className="text-[10px] uppercase text-zinc-400 font-black tracking-widest mb-4">CREATORS AVAILABLE</p>
                            <p className="text-4xl text-zinc-900 font-black tracking-tight">{creatorCount}</p>
                            <p className="text-xs text-zinc-400 font-bold mt-3">On the platform</p>
                        </div>
                    </div>

                    {/* CHART PLACEHOLDER */}
                    <div className="bg-white border border-zinc-100 rounded-[32px] p-10 mb-10 shadow-sm">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-8">Performance</h2>
                        <div className="aspect-[21/9] w-full border border-zinc-50 bg-zinc-50/50 rounded-[24px] flex flex-col items-center justify-center p-8">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-zinc-100">
                                <div className="w-10 h-10 rounded-full border-2 border-dashed border-zinc-200 animate-spin-slow" />
                            </div>
                            <p className="text-lg text-zinc-900 font-black">Generating Insights</p>
                            <p className="text-zinc-500 font-medium text-sm mt-1">Detailed performance charts will appear once you start campaigns.</p>
                        </div>
                    </div>

                    {/* BOTTOM ROW - Two Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Recent Activity */}
                        <div className="bg-white border border-zinc-100 rounded-[32px] p-10 shadow-sm">
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-8">Recent Activity</h2>
                            <div className="space-y-4">
                                {activities.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <p className="text-sm text-zinc-400 font-bold italic">No recent activity detected.</p>
                                    </div>
                                ) : (
                                    activities.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-5 py-5 border-b border-zinc-50 last:border-b-0 group">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-[#FF4D00] transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-zinc-900 font-black group-hover:text-[#FF4D00] transition-colors truncate">{activity.text}</p>
                                                <p className="text-[10px] text-zinc-400 font-black mt-1 uppercase tracking-widest">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Top Metrics */}
                        <div className="bg-white border border-zinc-100 rounded-[32px] p-10 shadow-sm">
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-8">Key Metrics</h2>
                            <div className="space-y-2">
                                {metrics.map((metric, index) => (
                                    <div key={index} className="flex justify-between items-center py-5 px-6 hover:bg-zinc-50 rounded-2xl transition-all border border-transparent hover:border-zinc-100">
                                        <p className="text-sm text-zinc-600 font-bold">{metric.label}</p>
                                        <p className="text-xl text-zinc-900 font-black tracking-tight">{metric.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </BrandDashboardLayout>
        </RouteGuard>
    );
}
