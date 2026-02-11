"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, Check, Mail, Eye, CheckCircle, FileText, ToggleRight, ToggleLeft, ChevronLeft } from "lucide-react";

const ACTIVITIES = [
    { icon: Mail, text: "New proposal from FitLife", time: "2h ago", type: "proposal" },
    { icon: Eye, text: "Profile viewed by Urban...", time: "5h ago", type: "view" },
    { icon: CheckCircle, text: "Collaboration completed", time: "2d ago", type: "complete" },
];

export function CreatorRightSidebar() {
    const { user } = useAuth();
    const [isAvailable, setIsAvailable] = useState(true);

    // Activity Icon Styles
    const getIconStyle = (type: string) => {
        switch (type) {
            case 'proposal': return 'bg-[rgba(255,176,32,0.15)] text-[#FFB020]';
            case 'view': return 'bg-[rgba(46,134,222,0.15)] text-[#2E86DE]';
            case 'complete': return 'bg-[rgba(0,208,132,0.15)] text-[#00D084]';
            default: return 'bg-[rgba(245,241,232,0.1)] text-[#F5F1E8]';
        }
    };

    return (
        <aside className="hidden xl:flex w-[320px] h-screen bg-[#0F0F0F] border-l border-[#1F1F1F] flex-col fixed right-0 top-0 z-50 overflow-y-auto translate-x-[calc(100%-8px)] hover:translate-x-0 transition-transform duration-300 ease-out shadow-[-10px_0_30px_rgba(0,0,0,0.5)] group">

            {/* Hover Handle/Strip */}
            <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-[#1F1F1F] group-hover:bg-[#00D084] transition-colors cursor-pointer flex items-center justify-center">
                <div className="h-12 w-[3px] bg-[#6B6B6B] rounded-full group-hover:bg-white transition-colors" />
            </div>

            <div className="px-6 py-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {/* PROFILE CARD */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#141414] border border-[#2A2A2A] rounded-[20px] p-7 text-center mb-6 relative overflow-hidden group/card">
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[radial-gradient(circle,rgba(0,208,132,0.05)_0%,transparent_70%)] rounded-bl-[100px] pointer-events-none" />

                    <div className="relative mb-4 inline-block">
                        <div className="w-20 h-20 rounded-full border-[3px] border-[#00D084] bg-[#1F1F1F] flex items-center justify-center text-2xl font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.4),0_0_0_8px_rgba(0,208,132,0.05)]">
                            {user?.fullName?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#1A1A1A] ${isAvailable ? 'bg-[#00D084]' : 'bg-[#6B6B6B]'}`} />
                    </div>

                    <h3 className="text-xl font-bold text-[#F5F1E8] font-milker mb-1">
                        {user?.fullName || "Creator User"}
                    </h3>
                    <p className="text-[13px] text-[#F5F1E8] font-sf-pro opacity-80 mb-4">
                        @testcreator
                    </p>

                    <div className="flex justify-center gap-2 mb-6">
                        {["Fashion", "Lifestyle"].map(tag => (
                            <span key={tag} className="px-3 py-1.5 rounded-full bg-[rgba(245,241,232,0.1)] border border-[rgba(245,241,232,0.15)] text-[10px] font-angelo text-[#C5C5C5] uppercase tracking-wide">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Availability Toggle */}
                    <div
                        className="flex justify-between items-center bg-[rgba(245,241,232,0.05)] rounded-xl px-4 py-3 mb-4 cursor-pointer hover:bg-[rgba(0,208,132,0.05)] transition-colors"
                        onClick={() => setIsAvailable(!isAvailable)}
                    >
                        <span className="text-[13px] text-[#F5F1E8] font-sf-pro">Accepting Proposals</span>
                        <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isAvailable ? 'bg-[#00D084]' : 'bg-[#2A2A2A]'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${isAvailable ? 'left-5 bg-[#0A0A0A]' : 'left-1 bg-[#6B6B6B]'}`} />
                        </div>
                    </div>

                    <Link
                        href="/dashboard/creator/profile"
                        className="block w-full py-3 border border-[#00D084] rounded-[10px] text-[12px] font-angelo font-semibold text-[#00D084] uppercase tracking-widest hover:bg-[#00D084] hover:text-[#FFFFFF] transition-all duration-200"
                    >
                        Edit Profile
                    </Link>
                </div>

                {/* QUICK STATS */}
                <div className="pt-6 border-t border-[#1F1F1F] mb-8">
                    <h4 className="text-[11px] font-angelo uppercase text-[#6B6B6B] tracking-[1.5px] mb-4">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[rgba(245,241,232,0.03)] border border-[rgba(245,241,232,0.08)] rounded-[10px] p-3 text-center transition-colors hover:border-[rgba(0,208,132,0.3)]">
                            <p className="text-xl font-bold text-[#F5F1E8] font-milker mb-1">4.8</p>
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-sf-pro tracking-wide">Rating</p>
                        </div>
                        <div className="bg-[rgba(245,241,232,0.03)] border border-[rgba(245,241,232,0.08)] rounded-[10px] p-3 text-center transition-colors hover:border-[rgba(0,208,132,0.3)]">
                            <p className="text-xl font-bold text-[#F5F1E8] font-milker mb-1">98%</p>
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-sf-pro tracking-wide">Response</p>
                        </div>
                    </div>
                </div>

                {/* ACTIVITY FEED */}
                <div>
                    <div className="flex justify-between items-center mb-5">
                        <h4 className="text-lg font-milker text-[#F5F1E8]">Activity</h4>
                        <span className="text-xs text-[#6B6B6B] hover:text-[#00D084] cursor-pointer">See all</span>
                    </div>

                    <div className="space-y-3">
                        {ACTIVITIES.map((item, i) => (
                            <div key={i} className="group/item flex gap-3 p-3 rounded-xl bg-[rgba(245,241,232,0.03)] border border-[rgba(245,241,232,0.08)] hover:bg-[rgba(0,208,132,0.05)] hover:border-[rgba(0,208,132,0.15)] hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconStyle(item.type)}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-[#F5F1E8] font-sf-pro truncate group-hover/item:text-[#00D084] transition-colors">{item.text}</p>
                                    <p className="text-[11px] text-[#6B6B6B] font-sf-pro">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
