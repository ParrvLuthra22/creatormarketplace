"use client";

import { useState } from "react";
import { Home, Mail, MessageCircle, User, BarChart3, Settings, LogOut } from "lucide-react";
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
    { name: "Home", href: "/dashboard/creator", icon: Home },
    { name: "Proposals", href: "/dashboard/creator/proposals", icon: Mail, badge: 4 },
    { name: "Messages", href: "/dashboard/creator/messages", icon: MessageCircle, badge: 2 },
    { name: "My Profile", href: "/dashboard/creator/profile", icon: User },
    { name: "Analytics", href: "/dashboard/creator/analytics", icon: BarChart3 },
];

interface CreatorSidebarProps {
    userName: string;
    userAvatar?: string;
}

export function CreatorSidebar({ userName, userAvatar }: CreatorSidebarProps) {
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
        <aside className="w-[240px] h-screen bg-[#0F0F0F] border-r border-[#1F1F1F] flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
            {/* Logo */}
            <div className="p-8 pb-6 border-b border-[#1F1F1F] flex-shrink-0">
                <h1 className="text-2xl font-bold text-[#F5F1E8] font-milker tracking-[-0.5px]">CreatorSync</h1>
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
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sf-pro tracking-[0.2px] transition-all duration-200 relative ${isActive
                                    ? "bg-[rgba(0,208,132,0.08)] text-[#00D084] font-medium pl-3.5 border-l-[3px] border-[#00D084]"
                                    : "text-[#6B6B6B] hover:bg-[rgba(0,208,132,0.05)] hover:text-[#C5C5C5]"
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-[#00D084]' : 'text-[#6B6B6B] group-hover:text-[#C5C5C5]'}`} />
                            <span className="flex-1">{item.name}</span>

                            {item.badge && (
                                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#FF4757] text-[11px] font-bold text-white shadow-sm">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="flex-shrink-0 p-4 border-t border-[#1F1F1F] bg-[#0F0F0F]">
                <Link
                    href="/dashboard/creator/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sf-pro mb-3 transition-colors ${pathname === "/dashboard/creator/settings"
                            ? "bg-[rgba(0,208,132,0.08)] text-[#00D084] font-medium"
                            : "text-[#6B6B6B] hover:bg-[rgba(0,208,132,0.05)] hover:text-[#C5C5C5]"
                        }`}
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </Link>

                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sf-pro text-[#6B6B6B] hover:bg-[rgba(255,71,87,0.1)] hover:text-[#FF4757] cursor-pointer transition-colors"
                    onClick={() => setShowLogoutConfirm(true)}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </div>
            </div>

            <LogoutConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleActualLogout}
            />
        </aside>
    );
}
