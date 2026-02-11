"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Search, MoreVertical, Send, Paperclip, ArrowLeft, MessageCircle, Check, CheckCheck } from "lucide-react";

// Dummy conversation data for Brand
const BRAND_CONVERSATIONS = [
    {
        id: 1,
        name: "Priya Sharma",
        avatar: "PS",
        lastMessage: "Sure, I can do 2 reels by Friday",
        timestamp: "2 min ago",
        unread: true,
        unreadCount: 2,
    },
    {
        id: 2,
        name: "Arjun Mehta",
        avatar: "AM",
        lastMessage: "What's the exact brief?",
        timestamp: "1 hour ago",
        unread: false,
    },
    {
        id: 3,
        name: "Zara Khan",
        avatar: "ZK",
        lastMessage: "Sounds good, let me check my schedule",
        timestamp: "Yesterday",
        unread: false,
    },
];

// Dummy messages for first conversation
const DUMMY_MESSAGES = [
    {
        id: 1,
        sender: "other",
        text: "Hey! I saw your profile, love your content style.",
        timestamp: "10:30 AM",
        read: true,
    },
    {
        id: 2,
        sender: "me",
        text: "Thank you! That means a lot.",
        timestamp: "10:31 AM",
        read: true,
    },
    {
        id: 3,
        sender: "other",
        text: "We are launching a new product and would love to collaborate.",
        timestamp: "10:33 AM",
        read: true,
    },
    {
        id: 4,
        sender: "me",
        text: "That sounds interesting! What is the product?",
        timestamp: "10:35 AM",
        read: true,
    },
    {
        id: 5,
        sender: "other",
        text: "It is a new protein shake line. We need 2 Reels and 3 Stories.",
        timestamp: "10:37 AM",
        read: true,
    },
    {
        id: 6,
        sender: "me",
        text: "Sure, I can do 2 reels by Friday",
        timestamp: "10:38 AM",
        read: false,
    },
];

export default function BrandMessagesPage() {
    const { user, profile } = useAuth();
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const selectedConv = BRAND_CONVERSATIONS.find(c => c.id === selectedConversation);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // TODO: Add message sending logic
            setMessageInput("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <RouteGuard allowedRole="brand">
            <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">
                {/* LEFT SIDEBAR */}
                <div className="hidden md:block">
                    <DashboardSidebar
                        userName={user?.fullName || "Brand User"}
                        userAvatar={(profile as any)?.companyName?.charAt(0)}
                    />
                </div>

                {/* MESSAGES LAYOUT - Two Panel */}
                <div className="flex-1 flex overflow-hidden md:ml-[220px]">
                    {/* CONVERSATION LIST PANEL */}
                    <div className={`w-full md:w-[280px] bg-white border-r border-[#E5E5E5] flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                        {/* Header */}
                        <div className="px-[18px] pt-6 pb-4">
                            <h2 className="text-lg font-bold text-[#0A0A0A] font-milker">Messages</h2>
                        </div>

                        {/* Search Bar */}
                        <div className="px-[14px] mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full h-[38px] bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg pl-10 pr-4 text-[13px] text-[#0A0A0A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {BRAND_CONVERSATIONS.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => {
                                        setSelectedConversation(conv.id);
                                        setShowMobileChat(true);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 mx-2 mb-0.5 rounded-[10px] cursor-pointer transition-colors ${selectedConversation === conv.id
                                        ? 'bg-[#F0F0F0]'
                                        : 'hover:bg-[#F5F5F5]'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-[38px] h-[38px] rounded-full bg-[#E5E5E5] flex items-center justify-center text-[#0A0A0A] text-sm font-semibold">
                                            {conv.avatar}
                                        </div>
                                        {conv.unread && (
                                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#0A0A0A] rounded-full border-2 border-white"></div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className={`text-sm font-semibold truncate ${conv.unread ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]'}`}>
                                                {conv.name}
                                            </p>
                                            <span className="text-[10px] text-[#6B6B6B] ml-2 flex-shrink-0">
                                                {conv.timestamp}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-[#6B6B6B] truncate">
                                                {conv.lastMessage}
                                            </p>
                                            {conv.unread && conv.unreadCount && (
                                                <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] bg-[#0A0A0A] rounded-full flex items-center justify-center text-[10px] text-white font-angelo font-semibold">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CHAT WINDOW */}
                    <div className={`flex-1 flex flex-col bg-[#F8F8F8] ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                        {selectedConv ? (
                            <>
                                {/* Chat Header */}
                                <div className="h-16 border-b border-[#E5E5E5] flex items-center justify-between px-6 bg-white">
                                    <div className="flex items-center gap-3">
                                        {/* Mobile Back Button */}
                                        <button
                                            onClick={() => setShowMobileChat(false)}
                                            className="md:hidden text-[#0A0A0A] hover:text-[#6B6B6B] transition-colors"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>

                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-[#E5E5E5] flex items-center justify-center text-[#0A0A0A] text-sm font-semibold">
                                            {selectedConv.avatar}
                                        </div>

                                        {/* Name & Status */}
                                        <div>
                                            <p className="text-base font-semibold text-[#0A0A0A]">{selectedConv.name}</p>
                                            <p className="text-[11px] text-[#6B6B6B]">Active now</p>
                                        </div>
                                    </div>

                                    {/* Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMenu(!showMenu)}
                                            className="text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {showMenu && (
                                            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-[#E5E5E5] rounded-[10px] p-2 z-10 shadow-lg">
                                                <button className="w-full text-left px-3 py-2 text-[13px] text-[#0A0A0A] hover:bg-[#F5F5F5] rounded-lg transition-colors">
                                                    View Profile
                                                </button>
                                                <button className="w-full text-left px-3 py-2 text-[13px] text-[#0A0A0A] hover:bg-[#F5F5F5] rounded-lg transition-colors">
                                                    Clear Chat
                                                </button>
                                                <button className="w-full text-left px-3 py-2 text-[13px] text-[#0A0A0A] hover:bg-[#F5F5F5] rounded-lg transition-colors">
                                                    Block User
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
                                    {/* Date Separator */}
                                    <div className="flex items-center gap-3 my-4">
                                        <div className="flex-1 h-px bg-[#E5E5E5]"></div>
                                        <span className="text-[11px] text-[#6B6B6B]">Today</span>
                                        <div className="flex-1 h-px bg-[#E5E5E5]"></div>
                                    </div>

                                    {DUMMY_MESSAGES.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[65%] ${msg.sender === 'me'
                                                    ? 'bg-[#0A0A0A] rounded-[18px_18px_4px_18px] text-white'
                                                    : 'bg-white border border-[#E5E5E5] rounded-[18px_18px_18px_4px] text-[#0A0A0A]'
                                                    } px-3.5 py-2.5`}
                                            >
                                                <p className={`text-sm mb-1 ${msg.sender === 'me' ? 'text-white' : 'text-[#0A0A0A]'}`}>{msg.text}</p>
                                                <div className={`flex items-center gap-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[10px] text-[#6B6B6B]">{msg.timestamp}</span>
                                                    {msg.sender === 'me' && (
                                                        msg.read ? (
                                                            <CheckCheck className="w-3 h-3 text-white" />
                                                        ) : (
                                                            <Check className="w-3 h-3 text-[#6B6B6B]" />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Typing Indicator */}
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-[#E5E5E5] rounded-[18px_18px_18px_4px] px-4 py-3">
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 bg-[#6B6B6B] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-1.5 h-1.5 bg-[#6B6B6B] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-1.5 h-1.5 bg-[#6B6B6B] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="h-18 border-t border-[#E5E5E5] px-5 py-3 bg-white flex items-center gap-3">
                                    {/* Attachment Icon */}
                                    <button className="text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>

                                    {/* Input Field */}
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1 h-11 bg-[#F5F5F5] border border-[#E5E5E5] rounded-full px-5 text-sm text-[#0A0A0A] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                                    />

                                    {/* Send Button */}
                                    <button
                                        onClick={handleSendMessage}
                                        className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center hover:opacity-85 transition-opacity"
                                    >
                                        <Send className="w-[18px] h-[18px] text-white" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Empty State
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <MessageCircle className="w-10 h-10 text-[#CCCCCC] mb-4" strokeWidth={1.5} />
                                <h3 className="text-lg font-milker text-[#6B6B6B] mb-2">No conversation selected</h3>
                                <p className="text-[13px] text-[#6B6B6B]">Click a conversation on the left to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Nav */}
                <MobileBottomNav role="brand" />
            </div>
        </RouteGuard>
    );
}
