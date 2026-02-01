"use client";

import Link from "next/link";
import { Button } from "./ui/Button";
import { User } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    { id: "explore", label: "Explore Brands", href: "/dashboard/creator" },
    { id: "proposals", label: "Proposals", href: "/creator/proposals" },
    { id: "profile", label: "My Profile", href: "/creator/profile" },
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
            // Dashboard is active only if exactly on dashboard
            return pathname === href;
        }
        return pathname?.startsWith(href) || false;
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold tracking-tight text-[#1A1A1A]">
                        CreatorMarket
                    </Link>

                    {/* Navigation Tabs */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                        ? isBrand
                                            ? "bg-orange-50 text-[#FF6B35]"
                                            : "bg-pink-50 text-[#FF6B9D]"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                        >
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${isBrand
                                        ? "bg-gradient-to-br from-[#FF6B35] to-[#FF8F5D]"
                                        : "bg-gradient-to-br from-[#FF6B35] to-[#FF6B9D]"
                                    }`}
                            >
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                                <p className="text-xs text-gray-500">{user.accountType}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
                        </button>

                        {showUserMenu && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    {/* Mobile Navigation */}
                                    <div className="md:hidden border-b border-gray-100 pb-1 mb-1">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                onClick={() => setShowUserMenu(false)}
                                                className={`block px-4 py-2 text-sm ${isActive(item.href)
                                                        ? "bg-gray-50 font-medium text-gray-900"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                    {/* Logout */}
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            onLogout();
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
