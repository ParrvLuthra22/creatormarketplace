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
    Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";
import { HelpSupportModal } from "@/components/HelpSupportModal";
import { getChatSummary, getProposalsSummary, getProfilePhotoUrl } from "@/lib/api";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
    { name: "Discover", href: "/dashboard/creator", icon: Home },
    { name: "Proposals", href: "/dashboard/creator/proposals", icon: Mail },
    { name: "Messages", href: "/dashboard/creator/messages", icon: MessageCircle },
];

export function CreatorNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user, profile } = useAuth();
    const creatorProfile = profile as any;
    
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [bellOpen, setBellOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [pendingProposals, setPendingProposals] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const menuRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLDivElement>(null);

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
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setBellOpen(false);
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
        if (!user?.fullName) return "C";
        const names = user.fullName.split(" ");
        if (names.length > 1) return (names[0][0] + names[1][0]).toUpperCase();
        return names[0][0].toUpperCase();
    };

    const isActive = (href: string) => {
        if (href === "/dashboard/creator") {
            return pathname === "/dashboard/creator";
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 h-[64px] flex items-center px-6 gap-6">
                {/* Logo */}
                <Link href="/dashboard/creator" className="flex items-center gap-2 shrink-0 mr-4">
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
                        const badge = badgeByItemName[item.name] || 0;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    active
                                        ? "bg-[#FF4D00]/10 text-[#FF4D00]"
                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${active ? "text-[#FF4D00]" : "text-zinc-400"}`} />
                                <span className="lowercase">{item.name}</span>
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
                    {/* Bell Dropdown */}
                    <div className="relative" ref={bellRef}>
                        <button 
                            onClick={() => setBellOpen(!bellOpen)}
                            className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                        >
                            <Bell className="w-4 h-4" />
                        </button>

                        {bellOpen && (
                            <div className="absolute top-12 right-0 w-72 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="p-4 border-b border-zinc-100 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-zinc-900 lowercase">notifications</h3>
                                    <span className="text-[10px] text-[#FF4D00] font-bold cursor-pointer lowercase uppercase tracking-widest hover:underline">mark all as read</span>
                                </div>
                                <div className="p-8 text-center text-zinc-500">
                                    <Bell className="w-8 h-8 mx-auto mb-3 text-zinc-200" />
                                    <p className="text-sm font-bold text-zinc-900 lowercase">no new notifications</p>
                                    <p className="text-xs mt-1 lowercase">we'll let you know when something happens</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 h-9 px-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-all"
                        >
                            <div className="w-6 h-6 rounded-full bg-[#FF4D00]/10 flex items-center justify-center text-[#FF4D00] font-bold text-xs shrink-0 overflow-hidden">
                                {creatorProfile?.profilePhoto && !imgError ? (
                                    <img 
                                        src={getProfilePhotoUrl(creatorProfile.profilePhoto)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    getUserInitials()
                                )}
                            </div>
                            <span className="text-sm font-semibold text-zinc-700 max-w-[100px] truncate hidden sm:block lowercase">
                                {user?.fullName?.split(" ")[0] || "creator"}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        </button>

                        {profileOpen && (
                            <div className="absolute top-12 right-0 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="p-4 border-b border-zinc-100">
                                    <p className="text-sm font-bold text-zinc-900 truncate lowercase">{user?.fullName}</p>
                                    <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                                </div>
                                <div className="py-1.5">
                                    <Link
                                        href="/dashboard/creator/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors lowercase"
                                    >
                                        <UserIcon size={16} className="text-zinc-400" />
                                        my profile
                                    </Link>
                                    <Link
                                        href="/dashboard/creator/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors lowercase"
                                    >
                                        <Settings size={16} className="text-zinc-400" />
                                        settings
                                    </Link>
                                    <Link
                                        href="/dashboard/creator/analytics"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors lowercase"
                                    >
                                        <BarChart3 size={16} className="text-zinc-400" />
                                        analytics
                                    </Link>
                                    <button
                                        onClick={() => { setProfileOpen(false); setHelpOpen(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left lowercase"
                                    >
                                        <HelpCircle size={16} className="text-zinc-400" />
                                        help & support
                                    </button>
                                    <div className="my-1 mx-3 h-px bg-zinc-100" />
                                    <button
                                        onClick={() => { setProfileOpen(false); setShowLogoutConfirm(true); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left lowercase"
                                    >
                                        <LogOut size={16} className="text-red-400" />
                                        log out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hamburger menu (Settings/Analytics overflow on mobile) */}
                    <div className="relative sm:hidden" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                        >
                            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>

                        {menuOpen && (
                            <div className="absolute top-12 right-0 w-52 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="py-1.5">
                                    <Link
                                        href="/dashboard/creator/settings"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors lowercase"
                                    >
                                        <Settings size={16} className="text-zinc-400" />
                                        settings
                                    </Link>
                                    <Link
                                        href="/dashboard/creator/analytics"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors lowercase"
                                    >
                                        <BarChart3 size={16} className="text-zinc-400" />
                                        analytics
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
