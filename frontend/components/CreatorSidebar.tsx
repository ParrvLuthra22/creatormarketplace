"use client";

import { useEffect, useMemo, useState } from "react";
import { Home, Mail, MessageCircle, User, BarChart3, Settings, LogOut, X } from "lucide-react";
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
    { name: "home", href: "/dashboard/creator", icon: Home },
    { name: "proposals", href: "/dashboard/creator/proposals", icon: Mail },
    { name: "messages", href: "/dashboard/creator/messages", icon: MessageCircle },
    { name: "my profile", href: "/dashboard/creator/profile", icon: User },
    { name: "analytics", href: "/dashboard/creator/analytics", icon: BarChart3 },
];

interface CreatorSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function CreatorSidebar({ isOpen = false, onClose }: CreatorSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [pendingProposals, setPendingProposals] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const badgeByItemName = useMemo(() => {
        return {
            proposals: pendingProposals,
            messages: unreadMessages,
        } as Record<string, number>;
    }, [pendingProposals, unreadMessages]);

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const [p, c] = await Promise.all([getProposalsSummary(), getChatSummary()]);
                setPendingProposals(Number(p?.pendingProposals || 0));
                setUnreadMessages(Number(c?.unreadMessages || 0));
            } catch {
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
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="md:hidden mobile-sidebar-backdrop"
                    onClick={onClose}
                />
            )}

            <aside className={`w-60 h-[calc(100vh-32px)] bg-[#FF4D00] border border-[#E5E5E5] shadow-xl rounded-md flex flex-col fixed left-4 top-4 z-100 text-black transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="p-6 border-b border-[#E5E5E5] shrink-0 flex justify-between items-center">
                    <h1 className="text-[24px] font-bold text-black tracking-tight">CreatorSync</h1>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="md:hidden text-[#6B6B6B] hover:text-black">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-4 overflow-y-auto pb-24 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const badgeCount = badgeByItemName[item.name] || 0;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose} // Close sidebar on nav click
                                className={`group flex items-center gap-3 px-4 py-3.5 rounded-md text-[15px] font-bold transition-all duration-200 relative mb-2 mx-2 ${isActive
                                    ? "bg-black text-white shadow-md border border-[#E5E5E5] border-l-4 border-l-[#FF4D00]"
                                    : "text-[#6B6B6B] hover:bg-[#FF9500] hover:text-black"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-black' : 'text-[#6B6B6B] group-hover:text-black'}`} />
                                <span className="flex-1">{item.name}</span>

                                {badgeCount > 0 && (
                                    <span className="absolute right-4 bg-[#FF4D00] text-white font-bold px-2 py-0.5 rounded-md text-[10px] min-w-6 text-center shadow-sm">
                                        {badgeCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-4 border-t border-[#E5E5E5] pt-4 px-4 pb-4">
                    <Link
                        href="/dashboard/creator/settings"
                        onClick={onClose}
                        className={`group flex items-center gap-3 px-4 py-3.5 rounded-md text-[15px] font-bold mb-2 transition-all duration-200 mx-2 ${pathname === "/dashboard/creator/settings"
                            ? "bg-black text-white shadow-md border border-[#E5E5E5] border-l-4 border-l-[#FF4D00]"
                            : "text-[#6B6B6B] hover:bg-[#FF9500] hover:text-black"
                            }`}
                    >
                        <Settings className={`w-5 h-5 shrink-0 transition-colors ${pathname === "/dashboard/creator/settings" ? 'text-black' : 'text-[#6B6B6B] group-hover:text-black'}`} />
                        <span className="flex-1">settings</span>
                    </Link>

                    <div
                        className="group flex items-center gap-3 px-4 py-3.5 rounded-md text-[15px] font-bold hover:bg-[#FEE2E2] hover:text-[#EF4444] text-[#6B6B6B] cursor-pointer transition-all duration-200 mx-2"
                        onClick={() => setShowLogoutConfirm(true)}
                    >
                        <LogOut className="w-5 h-5" />
                        <span>log out</span>
                    </div>
                </div>

                <LogoutConfirmModal
                    isOpen={showLogoutConfirm}
                    onCancel={() => setShowLogoutConfirm(false)}
                    onConfirm={handleActualLogout}
                />
            </aside>
        </>
    );
}
