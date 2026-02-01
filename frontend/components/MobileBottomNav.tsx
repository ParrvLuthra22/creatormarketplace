"use client";

import { Home, Mail, MessageCircle, BarChart3, Settings, User, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";

interface MobileBottomNavProps {
    role: "brand" | "creator";
}

export function MobileBottomNav({ role }: MobileBottomNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const brandNavItems = [
        { name: "Home", href: "/dashboard/brand", icon: Home },
        { name: "Creators", href: "/dashboard/brand/creators", icon: Users },
        { name: "Messages", href: "/dashboard/brand/messages", icon: MessageCircle },
        { name: "Analytics", href: "/dashboard/brand/analytics", icon: BarChart3 },
    ];

    const creatorNavItems = [
        { name: "Home", href: "/dashboard/creator", icon: Home },
        { name: "Messages", href: "/dashboard/creator/messages", icon: MessageCircle },
        { name: "Profile", href: "/dashboard/creator/profile", icon: User },
        { name: "Analytics", href: "/dashboard/creator/analytics", icon: BarChart3 },
    ];

    const navItems = role === "brand" ? brandNavItems : creatorNavItems;

    const handleActualLogout = async () => {
        setShowLogoutConfirm(false);
        setShowLogoutPopup(false);
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <>
            {/* Logout Popup */}
            {showLogoutPopup && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center md:hidden"
                    onClick={() => setShowLogoutPopup(false)}
                >
                    <div
                        className="bg-[#141414] border-t border-[#1F1F1F] w-full p-4 pb-8 rounded-t-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#1F1F1F]">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-semibold text-sm">
                                {user?.fullName?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{user?.fullName || "User"}</p>
                                <p className="text-xs text-[#6B6B6B] font-angelo capitalize">{role}</p>
                            </div>
                        </div>

                        <Link
                            href={role === "brand" ? "/dashboard/brand/settings" : "/dashboard/creator/settings"}
                            className="flex items-center gap-3 py-3 text-white"
                            onClick={() => setShowLogoutPopup(false)}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="text-sm">Settings</span>
                        </Link>

                        <button
                            onClick={() => {
                                setShowLogoutPopup(false);
                                setShowLogoutConfirm(true);
                            }}
                            className="flex items-center gap-3 py-3 text-white w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#1F1F1F] z-40 md:hidden">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== `/dashboard/${role}` && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${isActive ? "text-white" : "text-[#6B6B6B]"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-angelo">{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* User/Settings Button */}
                    <button
                        onClick={() => setShowLogoutPopup(true)}
                        className="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[#6B6B6B]"
                    >
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black text-[10px] font-semibold">
                            {user?.fullName?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="text-[10px] font-angelo">Menu</span>
                    </button>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal
                isOpen={showLogoutConfirm}
                onConfirm={handleActualLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </>
    );
}
