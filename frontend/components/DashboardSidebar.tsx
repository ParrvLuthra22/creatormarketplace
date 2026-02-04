"use client";

import { useState } from "react";
import { Home, Users, Mail, MessageCircle, BarChart3, Settings, LogOut, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";

interface NavItem {
    name: string;
    href: string;
    icon: typeof Home;
}

const navItems: NavItem[] = [
    { name: "Home", href: "/dashboard/brand", icon: Home },
    { name: "Creators", href: "/dashboard/brand/creators", icon: Users },
    { name: "Proposals", href: "/dashboard/brand/proposals", icon: Mail },
    { name: "Messages", href: "/dashboard/brand/messages", icon: MessageCircle },
    { name: "Analytics", href: "/dashboard/brand/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/brand/settings", icon: Settings },
];

interface DashboardSidebarProps {
    userName: string;
    userAvatar?: string;
}

export function DashboardSidebar({ userName, userAvatar }: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleActualLogout = async () => {
        setShowLogoutConfirm(false);
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <aside className="w-[220px] h-screen bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col fixed left-0 top-0">
            {/* Logo */}
            <div className="p-6 border-b border-[#1F1F1F] flex-shrink-0">
                <h1 className="text-xl font-bold text-white font-milker">CreatorSync</h1>
            </div>

            {/* Plan Badge */}
            <div className="flex items-center justify-between px-5 mb-6">
                <span className={`px-2.5 py-1 rounded-lg font-angelo text-[11px] text-white ${user?.plan === 'free'
                    ? 'bg-[#1F1F1F]'
                    : user?.plan === 'basic'
                        ? 'bg-[#1A1A2A]'
                        : 'bg-[#1A2A1A]'
                    }`}>
                    {user?.plan?.toUpperCase() || 'FREE'}
                </span>

                {user?.plan !== 'pro' && (
                    <Link href="/pricing" className="text-[12px] font-angelo text-white hover:opacity-70 transition-opacity">
                        Upgrade →
                    </Link>
                )}
            </div>

            {/* Navigation - with bottom padding to prevent overlap with logout */}
            <nav className="flex-1 py-6 overflow-y-auto pb-24">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const isMessagesLocked = item.name === 'Messages' && user?.plan !== 'pro';

                        return (
                            <li key={item.name}>
                                {isMessagesLocked ? (
                                    <div className="flex items-center gap-3 px-6 py-3 text-sm font-angelo text-[#3D3D3D] cursor-not-allowed relative">
                                        <Lock className="w-3 h-3" />
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-6 py-3 text-sm font-angelo transition-colors relative ${isActive
                                            ? "text-white bg-[#1A1A1A]"
                                            : "text-[#6B6B6B] hover:text-white hover:bg-[#1A1A1A]/50"
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white" />
                                        )}
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile with Logout - Fixed at bottom */}
            <div
                className="flex-shrink-0 p-4 px-5 border-t border-[#1F1F1F] bg-[#0D0D0D] cursor-pointer hover:bg-[#1A1A1A] transition-colors group"
                onClick={() => setShowLogoutConfirm(true)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-semibold text-xs flex-shrink-0">
                        {userAvatar || userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate">{userName}</p>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-angelo bg-[#1F1F1F] text-[#6B6B6B] rounded-full">
                            Brand
                        </span>
                    </div>
                    <LogOut className="w-4 h-4 text-[#6B6B6B] group-hover:text-white transition-colors flex-shrink-0" />
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal
                isOpen={showLogoutConfirm}
                onConfirm={handleActualLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </aside>
    );
}
