"use client";

import Link from "next/link";
import { Button } from "./ui/Button";
import { User } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Search, Bell } from "lucide-react";

interface DashboardHeaderProps {
    user: User;
    onLogout: () => void;
}

// Role-specific navigation configurations
const BRAND_NAV = [
    { id: "discover", label: "Discover Creators", href: "/dashboard/brand" },
    { id: "proposals", label: "My Proposals", href: "/brand/proposals" },
    { id: "profile", label: "Profile", href: "/brand/profile" },
];

const CREATOR_NAV = [
    { id: "home", label: "Home", href: "/dashboard/creator" },
    { id: "proposals", label: "Proposals", href: "/dashboard/creator/proposals" },
    { id: "profile", label: "Profile", href: "/dashboard/creator/profile" },
];

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isBrand = user.accountType === "Brand";
    const navItems = isBrand ? BRAND_NAV : CREATOR_NAV;

    // Determine active nav item
    const isActive = (href: string) => {
        if (href === "/dashboard/brand" || href === "/dashboard/creator") {
            return pathname === href;
        }
        return pathname?.startsWith(href) || false;
    };

    return (
        <header className="fixed top-0 left-0 md:left-[240px] right-0 xl:right-[320px] h-16 bg-[#0A0A0A] border-b border-[#1F1F1F] z-40 px-8 flex items-center justify-between transition-all duration-300">
            {/* Page Title (Mobile/Tablet replacement for Nav) */}
            <div className="flex items-center">
                <h1 className="text-[28px] font-bold text-[#F5F1E8] font-milker tracking-[-0.5px]">Home</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Search Button */}
                <button className="w-10 h-10 rounded-xl bg-[rgba(245,241,232,0.08)] border border-[rgba(245,241,232,0.12)] flex items-center justify-center text-[#F5F1E8] hover:bg-[rgba(0,208,132,0.15)] hover:border-[#00D084] hover:text-[#00D084] transition-all duration-200">
                    <Search className="w-4 h-4" />
                </button>

                {/* Notifications Button */}
                <button className="w-10 h-10 rounded-xl bg-[rgba(245,241,232,0.08)] border border-[rgba(245,241,232,0.12)] flex items-center justify-center text-[#F5F1E8] hover:bg-[rgba(0,208,132,0.15)] hover:border-[#00D084] hover:text-[#00D084] transition-all duration-200 relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[#FF4757] border border-[#0A0A0A]" />
                </button>

                {/* User Menu - Mobile Only (Desktop has sidebar) */}
                <div className="md:hidden relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3"
                    >
                        <div className="w-9 h-9 rounded-full border border-[#00D084] flex items-center justify-center text-[#0A0A0A] font-bold bg-[#00D084]">
                            {user.fullName.charAt(0).toUpperCase()}
                        </div>
                    </button>

                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                            <div className="absolute right-0 mt-2 w-48 bg-[#141414] border border-[#1F1F1F] rounded-xl shadow-xl z-50 py-1">
                                <button className="w-full text-left px-4 py-2 text-sm text-[#F5F1E8] hover:bg-[#1A1A1A] hover:text-[#00D084]">Profile</button>
                                <button className="w-full text-left px-4 py-2 text-sm text-[#F5F1E8] hover:bg-[#1A1A1A] hover:text-[#00D084]">Settings</button>
                                <div className="h-px bg-[#1F1F1F] my-1" />
                                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-[#FF4757] hover:bg-[#1A1A1A]">Log Out</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
