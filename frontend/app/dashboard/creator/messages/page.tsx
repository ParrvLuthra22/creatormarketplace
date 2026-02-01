"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";
import { CreatorSidebar } from "@/components/CreatorSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Search, MoreVertical, Send, Paperclip, ArrowLeft, MessageCircle, Check, CheckCheck } from "lucide-react";

// Dummy conversation data for Creator
const CREATOR_CONVERSATIONS = [
    {
        id: 1,
        name: "FitLife Nutrition",
        avatar: "FN",
        lastMessage: "Great, here is the detailed brief",
        timestamp: "5 min ago",
        unread: true,
        unreadCount: 1,
    },
    {
        id: 2,
        name: "Urban Threads",
        avatar: "UT",
        lastMessage: "Can you share your media kit?",
        timestamp: "3 hours ago",
        unread: false,
    },
    {
        id: 3,
        name: "GlowUp Skincare",
        avatar: "GS",
        lastMessage: "We would love to work with you!",
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

export default function CreatorMessagesPage() {
    const { user, profile } = useAuth();
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const selectedConv = CREATOR_CONVERSATIONS.find(c => c.id === selectedConversation);

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
        <RouteGuard allowedRole="creator">
            <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
                {/* LEFT SIDEBAR */}
                <div className="hidden md:block">
                    <CreatorSidebar
                        userName={user?.fullName || "Creator User"}
                        userAvatar={(profile as any)?.instagramHandle?.charAt(0)}
                    />
                </div>

                {/* MESSAGES LAYOUT - Two Panel */}
                <div className="flex-1 flex overflow-hidden md:ml-[220px]">
                    {/* CONVERSATION LIST PANEL */}
                    <div className={`w-full md:w-[280px] bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                        {/* Header */}
                        <div className="px-[18px] pt-6 pb-4">
                            <h2 className="text-lg font-bold text-white font-milker">Messages</h2>
                        </div>

                        {/* Search Bar */}
                        <div className="px-[14px] mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D3D3D]" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full h-[38px] bg-[#141414] border border-[#1F1F1F] rounded-lg pl-10 pr-4 text-[13px] text-white placeholder:text-[#3D3D3D] focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto">
                            {CREATOR_CONVERSATIONS.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => {
                                        setSelectedConversation(conv.id);
                                        setShowMobileChat(true);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 mx-2 mb-0.5 rounded-[10px] cursor-pointer transition-colors ${selectedConversation === conv.id
                                        ? 'bg-[#1F1F1F]'
                                        : 'hover:bg-[#1A1A1A]'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-[38px] h-[38px] rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-sm font-semibold">
                                            {conv.avatar}
                                        </div>
                                        {conv.unread && (
                                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full border-2 border-[#0D0D0D]"></div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className={`text-sm font-semibold truncate ${conv.unread ? 'text-white' : 'text-white'}`}>
                                                {conv.name}
                                            </p>
                                            <span className="text-[10px] text-[#3D3D3D] ml-2 flex-shrink-0">
                                                {conv.timestamp}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-[#6B6B6B] truncate">
                                                {conv.lastMessage}
                                            </p>
                                            {conv.unread && conv.unreadCount && (
                                                <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center text-[10px] text-black font-angelo font-semibold">
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
                    <div className={`flex-1 flex flex-col bg-[#0A0A0A] ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                        {selectedConv ? (
                            <>
                                {/* Chat Header */}
                                <div className="h-16 border-b border-[#1F1F1F] flex items-center justify-between px-6 bg-[#0A0A0A]">
                                    <div className="flex items-center gap-3">
                                        {/* Mobile Back Button */}
                                        <button
                                            onClick={() => setShowMobileChat(false)}
                                            className="md:hidden text-white hover:text-[#6B6B6B] transition-colors"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>

                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-sm font-semibold">
                                            {selectedConv.avatar}
                                        </div>

                                        {/* Name & Status */}
                                        <div>
                                            <p className="text-base font-semibold text-white">{selectedConv.name}</p>
                                            <p className="text-[11px] text-[#6B6B6B]">Active now</p>
                                        </div>
                                    </div>

                                    {/* Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMenu(!showMenu)}
                                            className="text-[#6B6B6B] hover:text-white transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {showMenu && (
                                            <div className="absolute right-0 top-full mt-2 w-40 bg-[#141414] border border-[#1F1F1F] rounded-[10px] p-2 z-10">
                                                <button className="w-full text-left px-3 py-2 text-[13px] text-white hover:bg-[#1A1A1A] rounded-lg transition-colors">
                                                    View Profile
                                                </button>
                                                <button className="w-full text-left px-3 py-2 text-[13px] text-white hover:bg-[#1A1A1A] rounded-lg transition-colors">
                                                    Clear Chat
                                                </button>
                                                <button className="w-full text-left px-3 py-2 text-[13px] text-white hover:bg-[#1A1A1A] rounded-lg transition-colors">
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
                                        <div className="flex-1 h-px bg-[#1F1F1F]"></div>
                                        <span className="text-[11px] text-[#3D3D3D]">Today</span>
                                        <div className="flex-1 h-px bg-[#1F1F1F]"></div>
                                    </div>

                                    {DUMMY_MESSAGES.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[65%] ${msg.sender === 'me'
                                                    ? 'bg-[#1F1F1F] rounded-[18px_18px_4px_18px]'
                                                    : 'bg-[#141414] border border-[#1F1F1F] rounded-[18px_18px_18px_4px]'
                                                    } px-3.5 py-2.5`}
                                            >
                                                <p className="text-sm text-white mb-1">{msg.text}</p>
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
                                        <div className="bg-[#141414] border border-[#1F1F1F] rounded-[18px_18px_18px_4px] px-4 py-3">
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 bg-[#6B6B6B] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-1.5 h-1.5 bg-[#6B6B6B] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-1.5 h-1.5 bg-[#6B6B6B] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="h-18 border-t border-[#1F1F1F] px-5 py-3 bg-[#0A0A0A] flex items-center gap-3">
                                    {/* Attachment Icon */}
                                    <button className="text-[#6B6B6B] hover:text-white transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>

                                    {/* Input Field */}
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1 h-11 bg-[#141414] border border-[#1F1F1F] rounded-full px-5 text-sm text-white placeholder:text-[#3D3D3D] focus:outline-none focus:border-[#2A2A2A] transition-colors"
                                    />

                                    {/* Send Button */}
                                    <button
                                        onClick={handleSendMessage}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#E5E5E5] transition-colors"
                                    >
                                        <Send className="w-[18px] h-[18px] text-black" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Empty State
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <MessageCircle className="w-10 h-10 text-[#3D3D3D] mb-4" strokeWidth={1.5} />
                                <h3 className="text-lg font-milker text-[#6B6B6B] mb-2">No conversation selected</h3>
                                <p className="text-[13px] text-[#3D3D3D]">Click a conversation on the left to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Nav */}
                <MobileBottomNav role="creator" />
            </div>
        </RouteGuard>
    );
}
