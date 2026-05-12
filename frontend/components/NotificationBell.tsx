"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Mail, MessageCircle, X } from "lucide-react";
import { getChatSummary, getProposalsSummary } from "@/lib/api";

interface NotifItem {
    id: string;
    type: "proposal" | "message";
    title: string;
    message: string;
    read: boolean;
    time: string;
}

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotifItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const bellRef = useRef<HTMLDivElement>(null);

    const buildNotifications = async () => {
        try {
            const [proposals, chat] = await Promise.all([
                getProposalsSummary(),
                getChatSummary(),
            ]);

            const items: NotifItem[] = [];

            const pending = Number(proposals?.pendingProposals || 0);
            if (pending > 0) {
                items.push({
                    id: "proposals",
                    type: "proposal",
                    title: "New Proposals",
                    message: `You have ${pending} proposal${pending > 1 ? "s" : ""} awaiting your response.`,
                    read: false,
                    time: "Just now",
                });
            }

            const unread = Number(chat?.unreadMessages || 0);
            if (unread > 0) {
                items.push({
                    id: "messages",
                    type: "message",
                    title: "Unread Messages",
                    message: `You have ${unread} unread message${unread > 1 ? "s" : ""}.`,
                    read: false,
                    time: "Recently",
                });
            }

            setNotifications(items);
            setUnreadCount(items.filter((n) => !n.read).length);
        } catch {
            // Silently fail
        }
    };

    useEffect(() => {
        buildNotifications();
        const interval = setInterval(buildNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return (
        <div className="relative" ref={bellRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative w-9 h-9 rounded-md bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                aria-label="Notifications"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF4D00] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-12 right-0 w-80 bg-white border border-zinc-200 rounded-md shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                        <h3 className="text-sm font-bold text-zinc-900 lowercase">notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-[10px] text-[#FF4D00] font-bold uppercase tracking-widest hover:underline"
                            >
                                mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[340px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-8 h-8 mx-auto mb-3 text-zinc-200" />
                                <p className="text-sm font-semibold text-zinc-900 lowercase">no new notifications</p>
                                <p className="text-xs text-zinc-400 mt-1 lowercase">we&apos;ll let you know when something happens</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`flex items-start gap-3 px-4 py-3 border-b border-zinc-50 transition-colors cursor-pointer hover:bg-zinc-50 ${
                                        !notif.read ? "bg-orange-50/60" : ""
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {notif.type === "proposal" ? (
                                            <Mail className="w-4 h-4 text-[#FF4D00]" />
                                        ) : (
                                            <MessageCircle className="w-4 h-4 text-[#FF4D00]" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900 lowercase">{notif.title}</p>
                                        <p className="text-xs text-zinc-500 mt-0.5 lowercase leading-relaxed">{notif.message}</p>
                                        <p className="text-[10px] text-zinc-300 mt-1">{notif.time}</p>
                                    </div>
                                    {!notif.read && (
                                        <div className="w-2 h-2 rounded-full bg-[#FF4D00] flex-shrink-0 mt-2" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
