"use client";

import Image from "next/image";
import Link from "next/link";
import { HelpSupportModal } from "./HelpSupportModal";
import { User } from "@/lib/api";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Bell, Menu, X, Check, Briefcase, User as UserIcon, Settings, BarChart3, LogOut, HelpCircle } from "lucide-react";

type SearchResult = {
    id: number;
    name: string;
    subtitle: string;
    type: 'BRAND' | 'PROPOSAL';
    avatar: string;
};

type NotificationItem = {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: React.ReactNode;
};

interface DashboardHeaderProps {
    user: User;
    onLogout: () => void;
    onMenuClick?: () => void; // New prop for mobile sidebar toggle
}

export function DashboardHeader({ user, onLogout, onMenuClick }: DashboardHeaderProps) {
    const pathname = usePathname() || '';
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const mockNotifications: NotificationItem[] = [
        { id: 1, title: 'New Proposal', message: 'FitLife Nutrition sent you a proposal', time: '2m ago', read: false, icon: <Briefcase size={16} className="text-black" /> },
        { id: 2, title: 'Payment Received', message: 'You received ₹15,000 from Urban Threads', time: '1h ago', read: false, icon: <Check size={16} className="text-black" /> },
        { id: 3, title: 'Profile View', message: 'Your profile was viewed by 5 brands', time: '5h ago', read: true, icon: <UserIcon size={16} className="text-[#2E86DE]" /> },
    ];
    const [notifications] = useState<NotificationItem[]>(mockNotifications);
    const unreadCount = notifications.filter(n => !n.read).length;
    const [profileOpen, setProfileOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search handler (mock)
    const handleSearch = (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        // Mock results
        const mockResults = [
            { id: 1, name: 'FitLife Nutrition', subtitle: 'Brand', type: 'BRAND', avatar: '/images/brand-placeholder.png' },
            { id: 2, name: 'Summer Campaign', subtitle: 'Proposal', type: 'PROPOSAL', avatar: '' },
            { id: 3, name: 'TechVerse', subtitle: 'Brand', type: 'BRAND', avatar: '' },
        ] as const;

        const filteredResults: SearchResult[] = mockResults
            .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
            .map(item => ({ ...item }));

        setSearchResults(filteredResults);
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300);

        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const getUserInitials = () => {
        if (!user.fullName) return "C";
        const names = user.fullName.split(' ');
        if (names.length > 1) return (names[0][0] + names[1][0]).toUpperCase();
        return names[0][0].toUpperCase();
    };

    const isBrand = pathname.includes('/brand');
    const headerClasses = `fixed top-4 h-16 bg-white rounded-2xl shadow-sm border border-[#E5E5E5] z-40 px-6 flex items-center justify-between transition-all duration-300 ${isBrand ? 'md:left-[252px]' : 'md:left-[272px]'} left-4 right-4`;
    
    // Determine title from pathname
    const pathParts = pathname.split('/').filter(Boolean);
    const title = pathParts.length > 2 ? pathParts[pathParts.length - 1] : 'home';

    return (
        <header className={headerClasses}>
            {/* Left Section: Hamburger (Mobile) + Title */}
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden w-10 h-10 flex items-center justify-center text-[#6B6B6B] hover:bg-[#F4EFE6] hover:text-black rounded-xl transition-colors"
                    onClick={onMenuClick}
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-[20px] font-bold text-black font-sans tracking-wider lowercase">{title}</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button
                    className="w-10 h-10 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#6B6B6B] hover:bg-[#FF4D00] hover:text-black hover:shadow-sm transition-all"
                    onClick={() => setSearchOpen(true)}
                >
                    <Search className="w-5 h-5" />
                </button>

                {/* Notifications Button */}
                <div className="relative" ref={notificationsRef}>
                    <button
                        className="w-10 h-10 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#6B6B6B] hover:bg-[#FF4D00] hover:text-black hover:shadow-sm transition-all relative"
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#FF5722] text-[#FFFFFF] text-[10px] font-bold px-1.5 py-0.5 rounded-[10px] border-2 border-[#FF9500]">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <div className="absolute top-14 right-0 w-90 bg-white border border-[#E5E5E5] rounded-2xl shadow-strong z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between p-5 border-b border-[#E5E5E5]">
                                <h3 className="text-[16px] font-bold text-black font-sf-pro lowercase">notifications</h3>
                                <button className="text-[12px] text-black font-sf-pro lowercase hover:underline">mark all read</button>
                            </div>
                            <div className="notifications-list max-h-100 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={`p-4 border-b border-[#E5E5E5] flex gap-3 hover:bg-[#F4EFE6] transition-colors cursor-pointer ${!notif.read ? 'bg-[#FFF7ED] border-l-[3px] border-l-[#FF4D00]' : 'opacity-70'}`}>
                                            <div className="w-9 h-9 rounded-lg bg-[#F4EFE6] flex items-center justify-center shrink-0">
                                                {notif.icon}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-medium text-black font-sf-pro mb-0.5">{notif.title}</p>
                                                <p className="text-[12px] text-[#6B6B6B] font-sf-pro leading-snug">{notif.message}</p>
                                                <p className="text-[11px] text-[#6B6B6B] font-sf-pro mt-1 lowercase">{notif.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-[#6B6B6B]">
                                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm font-sf-pro lowercase">no new notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Button */}
                <div className="relative" ref={profileRef}>
                    <button
                        className="w-10 h-10 rounded-full border-2 border-[#2A2A2A] overflow-hidden hover:border-[#FF4D00] hover:shadow-[0_0_12px_rgba(255,61,0,0.3)] transition-all duration-200"
                        onClick={() => setProfileOpen(!profileOpen)}
                    >
                        {user.profilePicture ? (
                            <Image src={user.profilePicture} alt={user.fullName} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-[#1F1F1F] to-[#141414] flex items-center justify-center text-black font-bold text-sm">
                                {getUserInitials()}
                            </div>
                        )}
                    </button>

                    {profileOpen && (
                        <div className="absolute top-14 right-0 w-70 bg-white border border-[#E5E5E5] rounded-2xl shadow-strong z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-5 border-b border-[#E5E5E5] flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full border-2 border-[#FF4D00] overflow-hidden shrink-0">
                                    {user.profilePicture ? (
                                        <Image src={user.profilePicture} alt={user.fullName} width={56} height={56} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-black font-bold text-lg">
                                            {getUserInitials()}
                                        </div>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[15px] font-bold text-black font-sf-pro truncate">{user.fullName}</p>
                                    <p className="text-[12px] text-[#6B6B6B] font-sf-pro truncate">{user.email}</p>
                                    <div className="mt-1 inline-block px-2.5 py-1 rounded-[10px] bg-[rgba(255,61,0,0.15)]">
                                        <span className="text-[9px] font-sans font-bold text-black tracking-wider">{user.accountType.toLowerCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-2">
                                <Link href="/dashboard/creator/profile" className="flex items-center gap-3 px-5 py-3 text-black text-[14px] font-sf-pro lowercase hover:bg-[rgba(255,61,0,0.08)] transition-colors">
                                    <UserIcon size={18} className="text-[#6B6B6B]" />
                                    <span>my profile</span>
                                </Link>
                                <Link href="/dashboard/creator/settings" className="flex items-center gap-3 px-5 py-3 text-black text-[14px] font-sf-pro lowercase hover:bg-[rgba(255,61,0,0.08)] transition-colors">
                                    <Settings size={18} className="text-[#6B6B6B]" />
                                    <span>settings</span>
                                </Link>
                                <Link href="/dashboard/creator/analytics" className="flex items-center gap-3 px-5 py-3 text-black text-[14px] font-sf-pro lowercase hover:bg-[rgba(255,61,0,0.08)] transition-colors">
                                    <BarChart3 size={18} className="text-[#6B6B6B]" />
                                    <span>analytics</span>
                                </Link>
                                <button
                                    onClick={() => { setProfileOpen(false); setHelpOpen(true); }}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-black text-[14px] font-sf-pro lowercase hover:bg-[rgba(255,61,0,0.08)] transition-colors text-left"
                                >
                                    <HelpCircle size={18} className="text-[#6B6B6B]" />
                                    <span>help & support</span>
                                </button>

                                <div className="my-1 h-px bg-gray-50" />

                                <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-3 text-error text-[14px] font-sf-pro lowercase hover:bg-[rgba(255,71,87,0.08)] transition-colors text-left">
                                    <LogOut size={18} className="text-error" />
                                    <span>log out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Help & Support Modal */}
            <HelpSupportModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

            {/* Search Modal */}
            {searchOpen && (
                <div className="search-overlay" onClick={() => setSearchOpen(false)}>
                    <div className="search-modal" onClick={e => e.stopPropagation()}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="search for creators, brands, proposals..."
                                className="w-full h-13 bg-white border border-[#E5E5E5] rounded-xl pl-5 pr-12 text-black font-sf-pro text-[16px] focus:outline-none focus:border-[#FF4D00] transition-colors placeholder:text-[#6B6B6B] lowercase"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                        </div>

                        {searchResults.length > 0 && (
                            <div className="search-results mt-4 max-h-100 overflow-y-auto flex flex-col gap-2">
                                {searchResults.map(result => (
                                    <div key={result.id} className="flex items-center gap-3 p-3 bg-white border border-[#E5E5E5] rounded-xl hover:border-[#FF4D00] hover:bg-[#F9FAFB] hover:translate-x-1 transition-all cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 overflow-hidden shrink-0">
                                            {result.avatar ? (
                                                <Image src={result.avatar} alt={result.name} width={40} height={40} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#2A2A2A]" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-black font-sf-pro font-medium text-[14px]">{result.name}</p>
                                            <p className="text-[#6B6B6B] font-sf-pro text-[12px]">{result.subtitle}</p>
                                        </div>
                                        <span className="text-[10px] font-sans font-bold text-black tracking-wider px-2 py-1 bg-[rgba(255,61,0,0.1)] rounded-lg">{result.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="absolute top-4 right-4 text-[#6B6B6B] hover:text-black transition-colors"
                            onClick={() => setSearchOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
