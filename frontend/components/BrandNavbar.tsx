"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
    Search,
    Mail,
    MessageCircle,
    Settings,
    BarChart3,
    LogOut,
    Menu,
    X,
    Lock,
    Bell,
    HelpCircle,
    User as UserIcon,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";
import { HelpSupportModal } from "@/components/HelpSupportModal";
import { NotificationBell } from "./NotificationBell";
import { getChatSummary, getProposalsSummary, getProfilePhotoUrl } from "@/lib/api";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
    { name: "Discover", href: "/dashboard/brand", icon: Search },
    { name: "Proposals", href: "/dashboard/brand/proposals", icon: Mail },
    { name: "Messages", href: "/dashboard/brand/messages", icon: MessageCircle },
];

export function BrandNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user, profile, isBrand } = useAuth();
    const brandProfile = profile as any;
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [pendingProposals, setPendingProposals] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const menuRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const badgeByItemName = useMemo(
        () =>
            ({
                Proposals: pendingProposals,
                Messages: unreadMessages,
            }) as Record<string, number>,
        [pendingProposals, unreadMessages]
    );

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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleActualLogout = async () => {
        setShowLogoutConfirm(false);
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getUserInitials = () => {
        if (!user?.fullName) return "B";
        const names = user.fullName.split(" ");
        if (names.length > 1) return (names[0][0] + names[1][0]).toUpperCase();
        return names[0][0].toUpperCase();
    };

    // Active detection: match exact or sub-paths
    const isActive = (href: string) => {
        if (href === "/dashboard/brand") {
            return pathname === "/dashboard/brand";
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 h-[64px] flex items-center px-4 md:px-6 gap-2 md:gap-6">
                {/* Logo */}
                <Link href="/dashboard/brand" className="flex items-center gap-2 shrink-0 mr-4">
                    <div
                        className="w-7 h-7 bg-[#FF4D00] flex items-center justify-center"
                        style={{ borderRadius: "50% 50% 0% 50%", transform: "rotate(45deg)" }}
                    >
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    </div>
                    <span className="text-lg font-bold text-zinc-900 tracking-tight">CreatorSync</span>
                </Link>

                {/* Main nav items */}
                <nav className="flex items-center gap-1 flex-1">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        const isMessagesLocked = item.name === "Messages" && user?.plan !== "pro";
                        const badge = badgeByItemName[item.name] || 0;

                        if (isMessagesLocked) {
                            return (
                                <span
                                    key={item.name}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-zinc-300 cursor-not-allowed select-none"
                                >
                                    <Lock className="w-4 h-4" />
                                    {item.name}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                                    active
                                        ? "bg-[#FF4D00]/10 text-[#FF4D00]"
                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? "text-[#FF4D00]" : "text-zinc-400"}`} />
                                <span className="hidden md:inline">{item.name}</span>
                                {badge > 0 && (
                                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[#FF4D00] text-white rounded-full">
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side: Bell + Profile + Hamburger */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Bell */}
                    <NotificationBell />

                    {/* Profile dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-all"
                        >
                            <div className="w-6 h-6 rounded-full bg-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] font-bold text-xs shrink-0 overflow-hidden">
                                {isBrand && brandProfile?.logoUrl ? (
                                    <img 
                                        src={getProfilePhotoUrl(brandProfile.logoUrl)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : !isBrand && brandProfile?.profilePhoto ? (
                                    <img 
                                        src={getProfilePhotoUrl(brandProfile.profilePhoto)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    getUserInitials()
                                )}
                            </div>
                            <span className="text-sm font-semibold text-zinc-700 max-w-[100px] truncate hidden sm:block">
                                {user?.fullName?.split(" ")[0] || "Brand"}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </button>

                        {profileOpen && (
                            <div className="absolute top-12 right-0 w-56 bg-white border border-zinc-200 rounded-md shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="p-4 border-b border-zinc-100">
                                    <p className="text-sm font-bold text-zinc-900 truncate">{user?.fullName}</p>
                                    <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                                </div>
                                <div className="py-1.5">
                                    <Link
                                        href="/dashboard/brand/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                    >
                                        <UserIcon size={16} className="text-zinc-400" />
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/dashboard/brand/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                    >
                                        <Settings size={16} className="text-zinc-400" />
                                        Settings
                                    </Link>
                                    <Link
                                        href="/dashboard/brand/analytics"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                    >
                                        <BarChart3 size={16} className="text-zinc-400" />
                                        Analytics
                                    </Link>
                                    <button
                                        onClick={() => { setProfileOpen(false); setHelpOpen(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left"
                                    >
                                        <HelpCircle size={16} className="text-zinc-400" />
                                        Help & Support
                                    </button>
                                    <div className="my-1 mx-3 h-px bg-zinc-100" />
                                    <button
                                        onClick={() => { setProfileOpen(false); setShowLogoutConfirm(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <LogOut size={16} className="text-red-400" />
                                        Log out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hamburger menu (Settings/Analytics overflow on mobile) */}
                    <div className="relative sm:hidden" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-9 h-9 rounded-md bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                        >
                            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>

                        {menuOpen && (
                            <div className="absolute top-12 right-0 w-52 bg-white border border-zinc-200 rounded-md shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="py-1.5">
                                    <Link
                                        href="/dashboard/brand/settings"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                    >
                                        <Settings size={16} className="text-zinc-400" />
                                        Settings
                                    </Link>
                                    <Link
                                        href="/dashboard/brand/analytics"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                                    >
                                        <BarChart3 size={16} className="text-zinc-400" />
                                        Analytics
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <LogoutConfirmModal
                isOpen={showLogoutConfirm}
                onConfirm={handleActualLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />
            <HelpSupportModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
        </>
    );
}
