"use client";

import { useEffect, useMemo, useState } from "react";
import { Home, Users, Mail, MessageCircle, BarChart3, Settings, LogOut, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";
import { getChatSummary, getProposalsSummary } from "@/lib/api";

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
    const [pendingProposals, setPendingProposals] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const badgeByItemName = useMemo(() => {
        return {
            Proposals: pendingProposals,
            Messages: unreadMessages,
        } as Record<string, number>;
    }, [pendingProposals, unreadMessages]);

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const [p, c] = await Promise.all([getProposalsSummary(), getChatSummary()]);
                setPendingProposals(Number(p?.pendingProposals || 0));
                setUnreadMessages(Number(c?.unreadMessages || 0));
            } catch {
                // If user isn't authenticated yet or endpoint fails, just show 0.
                setPendingProposals(0);
                setUnreadMessages(0);
            }
        };

        loadCounts();
        const id = window.setInterval(loadCounts, 15000);
        return () => window.clearInterval(id);
    }, []);

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
        <aside className="w-55 h-[calc(100vh-32px)] bg-[#FF4D00] border border-[#E5E5E5] shadow-xl rounded-2xl flex flex-col fixed left-4 top-4 z-100 text-black">
            {/* Logo */}
            <div className="p-6 border-b border-[#E5E5E5] shrink-0">
                <h1 className="text-[24px] font-bold text-black tracking-tight">CreatorSync</h1>
            </div>

            {/* Plan Badge */}
            <div className="flex items-center justify-between px-5 mb-6 mt-6">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase ${user?.plan === 'free'
                    ? 'bg-[#FF4D00] text-gray-400 border border-[#2A2A2A]'
                    : user?.plan === 'basic'
                        ? 'bg-[rgba(74,70,255,0.1)] text-info border border-[rgba(74,70,255,0.2)]'
                        : 'bg-[rgba(255,61,0,0.1)] text-black border border-[rgba(255,61,0,0.2)]'
                    }`}>
                    {user?.plan || 'FREE'}
                </span>

                {user?.plan !== 'pro' && (
                    <Link href="/pricing" className="text-[12px] font-bold text-gray-400 hover:text-black transition-colors">
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
                        const badgeCount = badgeByItemName[item.name] || 0;

                        return (
                            <li key={item.name}>
                                {isMessagesLocked ? (
                                    <div className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed relative">
                                        <Lock className="w-3 h-3" />
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold transition-all relative rounded-xl mx-2 my-1
                                            ${isActive
                                            ? "bg-black text-white shadow-md border border-[#E5E5E5]"
                                            : "text-[#6B6B6B] hover:bg-[#FF9500] hover:text-black"
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-l-xl" />
                                        )}
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-[#6B6B6B] group-hover:text-black'}`} />
                                        <span>{item.name}</span>
                                        {badgeCount > 0 && (
                                            <span className="ml-auto text-[11px] font-bold bg-black text-white rounded-full px-2 py-0.5">
                                                {badgeCount}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile with Logout - Fixed at bottom */}
            <div className="mt-4 border-t border-[#E5E5E5] pt-4 px-4 pb-4">
                <div
                    className="shrink-0 p-3 mx-0 rounded-xl cursor-pointer bg-[#FF9500] hover:bg-[#FF4D00] border border-transparent hover:border-[#E5E5E5] text-black/80 hover:text-black transition-colors group flex items-center gap-3"
                    onClick={() => setShowLogoutConfirm(true)}
                >
                    <div className="w-8 h-8 rounded-full bg-[#FF4D00] border border-[#E5E5E5] flex items-center justify-center text-black font-semibold text-xs shrink-0">
                        {userAvatar || userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-black truncate">{userName}</p>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-[rgba(255,61,0,0.1)] border border-[rgba(255,61,0,0.2)] text-black rounded-full mt-0.5">
                            Brand
                        </span>
                    </div>
                    <LogOut className="w-4 h-4 text-[#6B6B6B] group-hover:text-error transition-colors shrink-0" />
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
