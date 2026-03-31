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
            case 'proposal': return 'bg-yellow-100 text-yellow-600';
            case 'view': return 'bg-blue-100 text-blue-600';
            case 'complete': return 'bg-green-100 text-green-600';
            default: return 'bg-[#FF4D00] text-gray-600';
        }
    };

    return (
        <aside className="hidden xl:flex w-[320px] h-[calc(100vh-32px)] bg-[#FF4D00] rounded-2xl shadow-xl flex-col fixed right-4 top-4 z-50 overflow-y-auto translate-x-[calc(100%-8px)] hover:translate-x-0 transition-transform duration-300 ease-out group">

            {/* Hover Handle/Strip */}
            <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-[#FF4D00] group-hover:bg-[#FF4D00] hover:bg-[#FF4D00] transition-colors cursor-pointer flex items-center justify-center">
                <div className="h-12 w-[3px] bg-gray-300 rounded-full group-hover:bg-[#FF4D00] transition-colors" />
            </div>

            <div className="px-6 py-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {/* PROFILE CARD */}
                <div className="bg-[#FF4D00] border border-[#E5E5E5] rounded-[20px] p-7 text-center mb-6 relative overflow-hidden group/card shadow-sm">
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[radial-gradient(circle,rgba(255,61,0,0.05)_0%,transparent_70%)] rounded-bl-[100px] pointer-events-none" />

                    <div className="relative mb-4 inline-block">
                        <div className="w-20 h-20 rounded-full border-[3px] border-[#FF4D00] bg-[#FF4D00] flex items-center justify-center text-2xl font-bold text-black shadow-sm">
                            {user?.fullName?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#F4EFE6] ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>

                    <h3 className="text-xl font-bold text-black mb-1">
                        {user?.fullName || "Creator User"}
                    </h3>
                    <p className="text-[13px] text-[#6B6B6B] mb-4">
                        @testcreator
                    </p>

                    <div className="flex justify-center gap-2 mb-6">
                        {["Fashion", "Lifestyle"].map(tag => (
                            <span key={tag} className="px-3 py-1.5 rounded-full bg-[#FF4D00] border border-[#E5E5E5] text-[10px] font-bold text-black uppercase tracking-wide">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Availability Toggle */}
                    <div
                        className="flex justify-between items-center bg-[#FF4D00] rounded-xl px-4 py-3 mb-4 cursor-pointer hover:bg-[#FF9500] border border-[#E5E5E5] transition-colors"
                        onClick={() => setIsAvailable(!isAvailable)}
                    >
                        <span className="text-[13px] text-black font-semibold">Accepting Proposals</span>
                        <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isAvailable ? 'bg-green-500' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 bg-[#FF4D00] shadow-sm ${isAvailable ? 'left-5' : 'left-1'}`} />
                        </div>
                    </div>

                    <Link
                        href="/dashboard/creator/profile"
                        className="block w-full py-3 border border-black rounded-[10px] text-[12px] font-bold text-black uppercase tracking-widest hover:bg-black hover:text-black transition-all duration-200"
                    >
                        Edit Profile
                    </Link>
                </div>

                {/* QUICK STATS */}
                <div className="pt-6 border-t border-[#E5E5E5] mb-8">
                    <h4 className="text-[11px] font-bold uppercase text-[#6B6B6B] tracking-[1.5px] mb-4">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#FF4D00] border border-[#E5E5E5] rounded-[10px] p-3 text-center transition-colors hover:border-[#FF4D00]">
                            <p className="text-xl font-bold text-black mb-1">4.8</p>
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-bold tracking-wide">Rating</p>
                        </div>
                        <div className="bg-[#FF4D00] border border-[#E5E5E5] rounded-[10px] p-3 text-center transition-colors hover:border-[#FF4D00]">
                            <p className="text-xl font-bold text-black mb-1">98%</p>
                            <p className="text-[10px] uppercase text-[#6B6B6B] font-bold tracking-wide">Response</p>
                        </div>
                    </div>
                </div>

                {/* ACTIVITY FEED */}
                <div>
                    <div className="flex justify-between items-center mb-5">
                        <h4 className="text-lg font-bold text-black">Activity</h4>
                        <span className="text-xs text-[#6B6B6B] hover:text-black cursor-pointer transition-colors font-semibold">See all</span>
                    </div>

                    <div className="space-y-3">
                        {ACTIVITIES.map((item, i) => (
                            <div key={i} className="group/item flex gap-3 p-3 rounded-xl bg-[#FF4D00] border border-[#E5E5E5] hover:bg-[#FF4D00] hover:border-[#FF4D00] hover:translate-x-1 transition-all duration-200 cursor-pointer shadow-sm shadow-gray-100">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconStyle(item.type)}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-black font-semibold truncate group-hover/item:text-black transition-colors">{item.text}</p>
                                    <p className="text-[11px] text-[#6B6B6B]">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
