"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { BrandDashboardLayout } from "@/components/BrandDashboardLayout";
import { RouteGuard } from "@/components/RouteGuard";
import { BrandNavbar } from "@/components/BrandNavbar";
import { Search, MoreVertical, Send, Paperclip, ArrowLeft, MessageCircle, Check, CheckCheck, Pencil, Trash2, X, XCircle } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { getConversations, getMessages, Conversation, ChatMessage, editMessage, deleteMessage, closeConversation, getProfilePhotoUrl } from "@/lib/api";

export default function BrandMessagesPage() {
    const { user, profile } = useAuth();
    const { socket, connected } = useSocket();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string; text: string } | null>(null);
    const [editingMessage, setEditingMessage] = useState<{ id: string; text: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial query param check
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const convParam = urlParams.get('conv');
            if (convParam) {
                setSelectedConversation(convParam);
                setShowMobileChat(true);
            }
        }
    }, []);

    // Fetch conversations
    useEffect(() => {
        const fetchConvs = async () => {
            try {
                const res = await getConversations();
                setConversations(res.conversations);
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            }
        };
        fetchConvs();
    }, []);

    // Fetch messages for selected conversation
    useEffect(() => {
        if (!selectedConversation) return;
        const fetchMsgs = async () => {
            try {
                const res = await getMessages(selectedConversation);
                setMessages(res.messages);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMsgs();
    }, [selectedConversation]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Socket listeners
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg: ChatMessage) => {
            if (msg.conversationId === selectedConversation) {
                setMessages(prev => [...prev, msg]);
                if (msg.senderId !== user?.id) {
                    socket.emit('markAsRead', { conversationId: selectedConversation, senderId: msg.senderId });
                }
            }

            // Update conversation list
            setConversations(prevConvs => {
                const updated = prevConvs.map(c => {
                    if (c._id === msg.conversationId) {
                        return { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt };
                    }
                    return c;
                });
                return updated.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
            });
        };

        socket.on('newMessage', handleNewMessage);
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, selectedConversation, user]);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedConversation || !user || !socket) return;

        const currentConv = conversations.find(c => c._id === selectedConversation);
        if (!currentConv) return;

        const otherParticipant = currentConv.participants.find(p => p._id !== user.id);
        if (!otherParticipant) return;

        const messageData = {
            conversationId: selectedConversation,
            receiverId: otherParticipant._id,
            text: messageInput.trim()
        };

        // Emit message
        socket.emit('sendMessage', messageData, (response: any) => {
            if (response.success) {
                setMessages(prev => [...prev, response.message]);
                setConversations(prevConvs => {
                    const updated = prevConvs.map(c => {
                        if (c._id === selectedConversation) {
                            return { ...c, lastMessage: response.message.text, lastMessageAt: response.message.createdAt };
                        }
                        return c;
                    });
                    return updated.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
                });
            }
        });

        setMessageInput("");
    };

    const handleEditMessage = async () => {
        if (!editingMessage || !editingMessage.text.trim()) return;
        try {
            const res = await editMessage(editingMessage.id, editingMessage.text);
            if (res.success) {
                setMessages(prev => prev.map(m => m._id === editingMessage.id ? { ...m, text: editingMessage.text, edited: true } : m));
            }
        } catch (err) {
            console.error('Failed to edit message:', err);
        }
        setEditingMessage(null);
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            const res = await deleteMessage(messageId);
            if (res.success) {
                setMessages(prev => prev.map(m => m._id === messageId ? { ...m, text: 'This message was deleted', deleted: true } : m));
            }
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
        setContextMenu(null);
    };

    const handleCloseConversation = async () => {
        if (!selectedConversation) return;
        try {
            await closeConversation(selectedConversation);
            setConversations(prev => prev.filter(c => c._id !== selectedConversation));
            setSelectedConversation(null);
            setMessages([]);
            setShowMenu(false);
        } catch (err) {
            console.error('Failed to close conversation:', err);
        }
    };

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const selectedConvData = conversations.find(c => c._id === selectedConversation);
    const chatPartner = selectedConvData?.participants.find(p => p._id !== user?.id);

    return (
        <RouteGuard allowedRole="brand">
            <BrandDashboardLayout variant="white">
                <div className="flex h-[calc(100vh-160px)] overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-xl">
                    {/* CONVERSATION LIST PANEL */}
                    <div className={`w-full md:w-[350px] bg-zinc-50 border-r border-zinc-100 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                        {/* Header */}
                        <div className="px-6 pt-8 pb-4 flex justify-between items-center border-b border-zinc-100">
                            <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Messages</h2>
                            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 shadow-sm' : 'bg-red-500'}`} />
                        </div>

                        {/* Search Bar */}
                        <div className="px-4 py-4 border-b border-zinc-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search chats..."
                                    className="w-full bg-white border border-zinc-200 rounded-xl py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#FF4D00] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Conversation List */}
                        <div className="flex-1 overflow-y-auto pt-2 scrollbar-hide">
                            {conversations.length === 0 && (
                                <div className="text-center mt-20 px-6">
                                    <MessageCircle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                                    <p className="text-sm text-zinc-500">No conversations yet.</p>
                                </div>
                            )}
                            {conversations.map((conv) => {
                                const partner = conv.participants.find(p => p._id !== user?.id);
                                const avatar = partner?.fullName?.charAt(0) || '?';
                                return (
                                <div
                                    key={conv._id}
                                    onClick={() => {
                                        setSelectedConversation(conv._id);
                                        setShowMobileChat(true);
                                    }}
                                    className={`flex items-center gap-4 px-5 py-4 mx-3 my-1 rounded-2xl cursor-pointer transition-all border ${selectedConversation === conv._id
                                        ? 'bg-white text-[#FF4D00] border-[#FF4D00]/20 shadow-sm'
                                        : 'hover:bg-zinc-100 border-transparent text-zinc-900'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border overflow-hidden ${selectedConversation === conv._id ? 'bg-[#FF4D00]/10 border-[#FF4D00]/20' : 'bg-zinc-200 border-zinc-300'}`}>
                                            {partner?.profilePicture || partner?.profilePhoto ? <img src={getProfilePhotoUrl(partner.profilePicture || partner.profilePhoto)} className="w-full h-full object-cover" /> : avatar}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-bold truncate">
                                                {partner?.fullName || 'Unknown'}
                                            </p>
                                            <span className={`text-[10px] ml-2 flex-shrink-0 ${selectedConversation === conv._id ? 'text-[#FF4D00]/60' : 'text-zinc-400'}`}>
                                                {formatTime(conv.lastMessageAt)}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${selectedConversation === conv._id ? 'text-[#FF4D00]/80' : 'text-zinc-500'}`}>
                                            {conv.lastMessage || 'Started a conversation'}
                                        </p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>

                    {/* CHAT WINDOW */}
                    <div className={`flex-1 flex flex-col ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                        {selectedConversation && chatPartner ? (
                            <>
                                {/* Chat Header */}
                                <div className="h-20 border-b border-zinc-100 flex items-center justify-between px-8 bg-white">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setShowMobileChat(false)}
                                            className="md:hidden text-zinc-500 hover:text-zinc-900 transition-colors"
                                        >
                                            <ArrowLeft className="w-6 h-6" />
                                        </button>

                                        <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-900 bg-zinc-100 text-sm font-bold overflow-hidden">
                                            {chatPartner.profilePicture || chatPartner.profilePhoto ? <img src={getProfilePhotoUrl(chatPartner.profilePicture || chatPartner.profilePhoto)} className="w-full h-full object-cover" /> : chatPartner.fullName?.charAt(0)}
                                        </div>

                                        <div>
                                            <p className="text-base font-bold text-zinc-900 tracking-tight">{chatPartner.fullName}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Online</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMenu(!showMenu)}
                                            className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-all"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {showMenu && (
                                            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-zinc-200 rounded-2xl p-2 z-10 shadow-xl overflow-hidden">
                                                <Link href={`/dashboard/brand/creators/${chatPartner._id}`} className="block w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all">
                                                    View Profile
                                                </Link>
                                                <button
                                                    onClick={handleCloseConversation}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Close Chat
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4 scrollbar-hide bg-zinc-50">
                                    {messages.map((msg) => {
                                        const isMe = msg.senderId === user?.id;
                                        return (
                                        <div
                                            key={msg._id}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                                        >
                                            <div
                                                className={`max-w-[70%] relative px-4 py-3 shadow-sm ${isMe
                                                    ? 'bg-[#FF4D00] text-white rounded-[24px_24px_4px_24px]'
                                                    : 'bg-white border border-zinc-200 text-zinc-900 rounded-[24px_24px_24px_4px]'
                                                    } ${msg.deleted ? 'opacity-40 italic' : ''}`}
                                            >
                                                <p className="text-[15px] leading-relaxed mb-1">{msg.text}</p>
                                                <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    {msg.edited && !msg.deleted && (
                                                        <span className={`text-[9px] ${isMe ? 'text-white/60' : 'text-zinc-400'}`}>edited</span>
                                                    )}
                                                    <span className={`text-[10px] font-bold ${isMe ? 'text-white/60' : 'text-zinc-400'}`}>{formatTime(msg.createdAt)}</span>
                                                    {isMe && (
                                                        msg.read ? (
                                                            <CheckCheck className="w-3.5 h-3.5 text-white" />
                                                        ) : (
                                                            <Check className="w-3.5 h-3.5 text-white/60" />
                                                        )
                                                    )}
                                                </div>

                                                {isMe && !msg.deleted && (
                                                    <div className={`absolute ${isMe ? '-left-20' : '-right-20'} top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5`}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setEditingMessage({ id: msg._id, text: msg.text }); }}
                                                            className="w-8 h-8 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-zinc-50 transition-all"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 text-zinc-600" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg._id); }}
                                                            className="w-8 h-8 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:bg-red-50 transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )})}
                                    <div ref={messagesEndRef} />
                                </div>

                                {editingMessage && (
                                    <div className="px-8 py-3 bg-orange-50 border-t border-orange-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <Pencil className="w-4 h-4 text-[#FF4D00]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-[#FF4D00] uppercase tracking-widest mb-0.5">Editing Message</p>
                                            <p className="text-xs text-zinc-600 truncate">{editingMessage.text}</p>
                                        </div>
                                        <button 
                                            onClick={() => setEditingMessage(null)}
                                            className="w-8 h-8 rounded-full hover:bg-orange-200 flex items-center justify-center transition-colors"
                                        >
                                            <X className="w-4 h-4 text-zinc-500" />
                                        </button>
                                    </div>
                                )}

                                <div className="px-8 py-6 bg-white border-t border-zinc-100 flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={editingMessage ? editingMessage.text : messageInput}
                                            onChange={(e) => editingMessage ? setEditingMessage({ ...editingMessage, text: e.target.value }) : setMessageInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    editingMessage ? handleEditMessage() : handleSendMessage();
                                                }
                                            }}
                                            placeholder={editingMessage ? "Make it perfect..." : "Type your message..."}
                                            className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#FF4D00] transition-all"
                                        />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg hover:bg-zinc-200 flex items-center justify-center transition-colors">
                                            <Paperclip className="w-4 h-4 text-zinc-400" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={editingMessage ? handleEditMessage : handleSendMessage}
                                        disabled={!connected || (!messageInput.trim() && !editingMessage)}
                                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${
                                            (editingMessage || messageInput.trim()) && connected
                                            ? 'bg-[#FF4D00] text-white hover:bg-[#FF4D00]/90 active:scale-95' 
                                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {editingMessage ? <Check className="w-6 h-6" /> : <Send className="w-6 h-6" />}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12">
                                <div className="w-24 h-24 rounded-[32px] bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-8">
                                    <MessageCircle className="w-10 h-10 text-zinc-300" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-3">Your Inbox</h3>
                                <p className="text-zinc-500 text-center max-w-sm leading-relaxed">
                                    Select a conversation from the list to view messages and start collaborating with creators.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </BrandDashboardLayout>
        </RouteGuard>
    );
}
