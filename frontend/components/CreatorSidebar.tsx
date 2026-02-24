"use client";

import { useState } from "react";
import { Home, Mail, MessageCircle, User, BarChart3, Settings, LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";

interface NavItem {
    name: string;
    href: string;
    icon: typeof Home;
    badge?: number;
}

const navItems: NavItem[] = [
    { name: "home", href: "/dashboard/creator", icon: Home },
    { name: "proposals", href: "/dashboard/creator/proposals", icon: Mail, badge: 4 },
    { name: "messages", href: "/dashboard/creator/messages", icon: MessageCircle, badge: 2 },
    { name: "my profile", href: "/dashboard/creator/profile", icon: User },
    { name: "analytics", href: "/dashboard/creator/analytics", icon: BarChart3 },
];

interface CreatorSidebarProps {
    userName: string;
    userAvatar?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function CreatorSidebar({ userName, userAvatar, isOpen = false, onClose }: CreatorSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
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
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="md:hidden mobile-sidebar-backdrop"
                    onClick={onClose}
                />
            )}

            <aside className={`w-[240px] h-screen bg-white border-r border-[#E5E5E5] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="p-8 pb-6 border-b border-[#E5E5E5] flex-shrink-0 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-black font-sans tracking-[-0.5px]">CreatorSync</h1>
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

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose} // Close sidebar on nav click
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-[0.2px] transition-all duration-200 relative lowercase ${isActive
                                    ? "bg-[#F4EFE6] text-black font-bold pl-3.5 border-l-[3px] border-[#4A46FF]"
                                    : "text-[#6B6B6B] hover:bg-gray-50 hover:text-black"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-black' : 'text-[#6B6B6B] group-hover:text-black'}`} />
                                <span className="flex-1">{item.name}</span>

                                {item.badge && (
                                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E5FA4A] text-black text-[11px] font-bold shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="flex-shrink-0 p-4 border-t border-[#E5E5E5] bg-white">
                    <Link
                        href="/dashboard/creator/settings"
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold mb-3 transition-colors lowercase ${pathname === "/dashboard/creator/settings"
                            ? "bg-[#F4EFE6] text-black"
                            : "text-[#6B6B6B] hover:bg-gray-50 hover:text-black"
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span>settings</span>
                    </Link>

                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#6B6B6B] hover:bg-red-50 hover:text-red-500 cursor-pointer transition-colors lowercase"
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
