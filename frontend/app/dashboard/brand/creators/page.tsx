"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SendProposalModal } from "@/components/SendProposalModal";
import { Search, Bell, Send, Share2 as Instagram, User as UserIcon } from "lucide-react";
import { getPublicCreators } from "@/lib/api";
import { useRouter } from "next/navigation";

const FILTER_NICHES = ["All", "Fashion", "Fitness", "Tech", "Beauty", "Food", "Travel", "Comedy", "Finance"];

type CreatorListItem = {
    id?: string;
    _id?: string;
    userId?: string;
    name?: string;
    instagramHandle?: string;
    profilePicture?: string;
    followers?: string | number;
    following?: string | number;
    bio?: string;
    category?: string;
    niche?: string;
};

type NormalizedCreator = CreatorListItem & {
    niche: string;
    followers: number;
    following: number;
};

export default function BrandCreators() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/brand');
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-zinc-950">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF4D00]"></div>
        </div>
    );
}
