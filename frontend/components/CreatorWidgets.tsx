"use client";

import { Button } from "./ui/Button";
import { Edit, Eye, Send, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Activity {
    id: number;
    type: 'proposal' | 'view' | 'other';
    text: string;
    timestamp: string;
}

interface CreatorWidgetsProps {
    userName: string;
    userHandle?: string;
    userAvatar?: string;
    niches?: string[];
    recentActivity?: Activity[];
    onEditProfile?: () => void;
}

export function CreatorWidgets({
    userName,
    userHandle,
    userAvatar,
    niches = ["Fashion", "Lifestyle"],
    recentActivity = [],
    onEditProfile
}: CreatorWidgetsProps) {
    const defaultActivity: Activity[] = recentActivity.length > 0 ? recentActivity : [
        {
            id: 1,
            type: 'proposal',
            text: 'New proposal from FitLife',
            timestamp: '2 hours ago'
        },
        {
            id: 2,
            type: 'view',
            text: 'Profile viewed by Urban Threads',
            timestamp: '5 hours ago'
        },
        {
            id: 3,
            type: 'other',
            text: 'Proposal accepted by StyleHub',
            timestamp: '1 day ago'
        }
    ];

    const getActivityIcon = (type: Activity['type']) => {
        switch (type) {
            case 'proposal':
                return Send;
            case 'view':
                return Eye;
            default:
                return TrendingUp;
        }
    };

    return (
        <div className="w-[300px] space-y-6">
            {/* My Profile Preview Widget */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-md p-6">
                <h3 className="text-base font-bold text-white mb-4 font-milker">My Profile</h3>

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg">
                        {userAvatar || userName.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Name & Handle */}
                <div className="text-center mb-4">
                    <p className="text-sm font-semibold text-white">{userName}</p>
                    <p className="text-xs text-[#6B6B6B] font-angelo mt-1">
                        {userHandle || `@${userName.toLowerCase().replace(/\s+/g, '')}`}
                    </p>
                </div>

                {/* Niche Pills */}
                <div className="flex gap-2 justify-center flex-wrap mb-4">
                    {niches.map((niche, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 rounded-full text-[10px] bg-[#1F1F1F] text-[#6B6B6B] font-angelo"
                        >
                            {niche}
                        </span>
                    ))}
                </div>

                {/* Edit Profile Link */}
                <Link
                    href="/dashboard/creator/profile"
                    className="flex items-center justify-center gap-2 text-sm text-white hover:text-[#E5E5E5] transition-colors font-angelo"
                >
                    Edit Profile
                    <Edit className="w-3 h-3" />
                </Link>
            </div>

            {/* Recent Activity Widget */}
            <div className="bg-[#141414] border border-[#1F1F1F] rounded-md p-6">
                <h3 className="text-base font-bold text-white mb-4 font-milker">Activity</h3>
                <div className="space-y-3">
                    {defaultActivity.map((activity) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#1F1F1F] flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-3.5 h-3.5 text-[#6B6B6B]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] text-white leading-tight">
                                        {activity.text}
                                    </p>
                                    <p className="text-[11px] text-[#6B6B6B] mt-1">
                                        {activity.timestamp}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
