"use client";

import Link from "next/link";
import { Button } from "./ui/Button";
import { HelpSupportModal } from "./HelpSupportModal";
import { User } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Bell, Menu, X, Check, Briefcase, FileText, User as UserIcon, Settings, BarChart3, LogOut, HelpCircle } from "lucide-react";

interface DashboardHeaderProps {
    user: User;
    onLogout: () => void;
    onMenuClick?: () => void; // New prop for mobile sidebar toggle
}

export function DashboardHeader({ user, onLogout, onMenuClick }: DashboardHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]); // Mock type
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]); // Mock type
    const [unreadCount, setUnreadCount] = useState(0);
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

    // Mock Fetch notifications
    useEffect(() => {
        // Simulating API call
        const mockNotifications = [
            { id: 1, title: 'New Proposal', message: 'FitLife Nutrition sent you a proposal', time: '2m ago', read: false, icon: <Briefcase size={16} className="text-[#00D084]" /> },
            { id: 2, title: 'Payment Received', message: 'You received ₹15,000 from Urban Threads', time: '1h ago', read: false, icon: <Check size={16} className="text-[#00D084]" /> },
            { id: 3, title: 'Profile View', message: 'Your profile was viewed by 5 brands', time: '5h ago', read: true, icon: <UserIcon size={16} className="text-[#2E86DE]" /> },
        ];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
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
        ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

        setSearchResults(mockResults);
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

    return (
        <header className="fixed top-0 left-0 md:left-[240px] right-0 xl:right-[320px] h-16 bg-[#0A0A0A] border-b border-[#1F1F1F] z-40 px-6 flex items-center justify-between transition-all duration-300">
            {/* Left Section: Hamburger (Mobile) + Title */}
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden w-10 h-10 flex items-center justify-center text-[#F5F1E8] hover:bg-[rgba(245,241,232,0.1)] rounded-xl"
                    onClick={onMenuClick}
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-[20px] font-bold text-[#F5F1E8] font-milker tracking-wider lowercase">home</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Search Button */}
                <button
                    className="w-10 h-10 rounded-[10px] bg-[rgba(245,241,232,0.08)] border border-[rgba(245,241,232,0.12)] flex items-center justify-center text-[#F5F1E8] hover:bg-[rgba(245,241,232,0.15)] hover:border-[#00D084] transition-all duration-200"
                    onClick={() => setSearchOpen(true)}
                >
                    <Search className="w-5 h-5" />
                </button>

                {/* Notifications Button */}
                <div className="relative" ref={notificationsRef}>
                    <button
                        className="w-10 h-10 rounded-[10px] bg-[rgba(245,241,232,0.08)] border border-[rgba(245,241,232,0.12)] flex items-center justify-center text-[#F5F1E8] hover:bg-[rgba(245,241,232,0.15)] hover:border-[#00D084] transition-all duration-200"
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#FF4757] text-white text-[11px] font-bold flex items-center justify-center animate-pulse border border-[#0A0A0A]">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <div className="absolute top-14 right-0 w-[360px] bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between p-5 border-b border-[#1F1F1F]">
                                <h3 className="text-[16px] font-bold text-[#F5F1E8] font-sf-pro lowercase">notifications</h3>
                                <button className="text-[12px] text-[#00D084] font-sf-pro lowercase hover:underline">mark all read</button>
                            </div>
                            <div className="notifications-list max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={`p-4 border-b border-[#1F1F1F] flex gap-3 hover:bg-[#1A1A1A] transition-colors cursor-pointer ${!notif.read ? 'bg-[rgba(0,208,132,0.05)] border-l-[3px] border-l-[#00D084]' : 'opacity-70'}`}>
                                            <div className="w-9 h-9 rounded-lg bg-[rgba(0,208,132,0.15)] flex items-center justify-center flex-shrink-0">
                                                {notif.icon}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-medium text-[#F5F1E8] font-sf-pro mb-0.5">{notif.title}</p>
                                                <p className="text-[12px] text-[#C5C5C5] font-sf-pro leading-snug">{notif.message}</p>
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
                        className="w-10 h-10 rounded-full border-2 border-[#2A2A2A] overflow-hidden hover:border-[#00D084] hover:shadow-[0_0_12px_rgba(0,208,132,0.3)] transition-all duration-200"
                        onClick={() => setProfileOpen(!profileOpen)}
                    >
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1F1F1F] to-[#141414] flex items-center justify-center text-[#F5F1E8] font-bold text-sm">
                                {getUserInitials()}
                            </div>
                        )}
                    </button>

                    {profileOpen && (
                        <div className="absolute top-14 right-0 w-[280px] bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-5 border-b border-[#1F1F1F] flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full border-2 border-[#00D084] overflow-hidden flex-shrink-0">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#1F1F1F] flex items-center justify-center text-[#F5F1E8] font-bold text-lg">
                                            {getUserInitials()}
                                        </div>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[15px] font-bold text-[#F5F1E8] font-sf-pro truncate">{user.fullName}</p>
                                    <p className="text-[12px] text-[#6B6B6B] font-sf-pro truncate">{user.email}</p>
                                    <div className="mt-1 inline-block px-2.5 py-1 rounded-[10px] bg-[rgba(0,208,132,0.15)]">
                                        <span className="text-[9px] font-angelo font-bold text-[#00D084] uppercase tracking-wider">{user.accountType.toLowerCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-2">
                                <Link href="/dashboard/creator/profile" className="flex items-center gap-3 px-5 py-3 text-[#F5F1E8] text-[14px] font-sf-pro lowercase hover:bg-[rgba(0,208,132,0.08)] transition-colors">
                                    <UserIcon size={18} className="text-[#6B6B6B]" />
                                    <span>my profile</span>
                                </Link>
                                <Link href="/dashboard/creator/settings" className="flex items-center gap-3 px-5 py-3 text-[#F5F1E8] text-[14px] font-sf-pro lowercase hover:bg-[rgba(0,208,132,0.08)] transition-colors">
                                    <Settings size={18} className="text-[#6B6B6B]" />
                                    <span>settings</span>
                                </Link>
                                <Link href="/dashboard/creator/analytics" className="flex items-center gap-3 px-5 py-3 text-[#F5F1E8] text-[14px] font-sf-pro lowercase hover:bg-[rgba(0,208,132,0.08)] transition-colors">
                                    <BarChart3 size={18} className="text-[#6B6B6B]" />
                                    <span>analytics</span>
                                </Link>
                                <button
                                    onClick={() => { setProfileOpen(false); setHelpOpen(true); }}
                                    className="w-full flex items-center gap-3 px-5 py-3 text-[#F5F1E8] text-[14px] font-sf-pro lowercase hover:bg-[rgba(0,208,132,0.08)] transition-colors text-left"
                                >
                                    <HelpCircle size={18} className="text-[#6B6B6B]" />
                                    <span>help & support</span>
                                </button>

                                <div className="my-1 h-px bg-[#1F1F1F]" />

                                <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-3 text-[#FF4757] text-[14px] font-sf-pro lowercase hover:bg-[rgba(255,71,87,0.08)] transition-colors text-left">
                                    <LogOut size={18} className="text-[#FF4757]" />
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
                                className="w-full h-[52px] bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl pl-5 pr-12 text-[#F5F1E8] font-sf-pro text-[16px] focus:outline-none focus:border-[#00D084] transition-colors placeholder:text-[#6B6B6B] lowercase"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={20} />
                        </div>

                        {searchResults.length > 0 && (
                            <div className="search-results mt-4 max-h-[400px] overflow-y-auto flex flex-col gap-2">
                                {searchResults.map(result => (
                                    <div key={result.id} className="flex items-center gap-3 p-3 bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl hover:border-[#00D084] hover:bg-[#1A1A1A] hover:translate-x-1 transition-all cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-[#1F1F1F] overflow-hidden flex-shrink-0">
                                            {result.avatar ? <img src={result.avatar} alt={result.name} /> : <div className="w-full h-full bg-[#2A2A2A]" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[#F5F1E8] font-sf-pro font-medium text-[14px]">{result.name}</p>
                                            <p className="text-[#6B6B6B] font-sf-pro text-[12px]">{result.subtitle}</p>
                                        </div>
                                        <span className="text-[10px] font-angelo font-bold text-[#00D084] uppercase tracking-wider px-2 py-1 bg-[rgba(0,208,132,0.1)] rounded-lg">{result.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#F5F1E8] transition-colors"
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
