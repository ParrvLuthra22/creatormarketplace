"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  Paperclip,
  Reply,
  Send,
  SmilePlus,
  X,
} from "lucide-react";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useAddReaction,
  useRemoveReaction,
  useMessageReactions,
} from "@/lib/hooks/useChat";
import { useUploadFile } from "@/lib/hooks/useUploads";
import { useTypingIndicator, useOnlineStatus, useUnreadCount } from "@/lib/socket";
import { useAuthStore } from "@/lib/auth";
import { getProfilePhotoUrl } from "@/lib/api";
import { showToast } from "@/lib/toast";
import MagneticButton from "./MagneticButton";

const REACTION_EMOJIS = ["👍", "❤️", "🔥", "😂", "😮", "💯"];

function timeLabel(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Avatar({ name, photo, size = 40 }: { name: string; photo?: string; size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden bg-(--accent) text-(--bg-primary) grid place-items-center font-bold shrink-0"
      style={{ height: size, width: size, fontSize: size / 2.5 }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={getProfilePhotoUrl(photo)} alt={name} className="h-full w-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-2.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-(--text-tertiary) animate-bounce"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

/** Shared conversation-list + chat-thread view, used by both the brand and creator dashboards. */
export default function MessagesView() {
  const user = useAuthStore((state) => state.user);
  const myId = String(user?.id || (user as any)?._id || "");

  const conversations = useConversations();
  const unreadInfo = useUnreadCount().data;
  const [activeId, setActiveId] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [openReactionsFor, setOpenReactionsFor] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unreadByConversation = new Map<string, number>(
    (unreadInfo?.conversations || []).map((c: any) => [c.conversationId, c.unreadCount])
  );

  const list = conversations.data?.conversations || [];
  const filteredList = useMemo(() => {
    let items = list;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((c: any) => {
        const other = c.participants?.find((p: any) => String(p._id) !== myId);
        return (other?.fullName || "").toLowerCase().includes(q);
      });
    }
    if (filterUnread) {
      items = items.filter((c: any) => (unreadByConversation.get(c._id) || 0) > 0);
    }
    return items;
  }, [list, search, filterUnread, myId, unreadByConversation]);

  const activeConversation = useMemo(() => {
    return list.find((item: any) => item._id === activeId) || list[0];
  }, [activeId, list]);

  const messages = useMessages(activeConversation?._id);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const uploadFile = useUploadFile("/api/uploads/chat-attachment");
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const reactions = useMessageReactions(messages.data?.messages || []);

  const [text, setText] = useState("");

  const receiver = activeConversation?.participants?.find((p: any) => String(p._id) !== myId);
  const online = useOnlineStatus(receiver ? [receiver._id] : []);
  const isOnline = receiver ? online.get(String(receiver._id)) : false;
  const { isTyping, sendTyping, stopTyping } = useTypingIndicator(activeConversation?._id, receiver?._id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.data]);

  useEffect(() => {
    if (activeConversation?._id && receiver?._id) {
      markAsRead.mutate({ conversationId: activeConversation._id, senderId: receiver._id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?._id]);

  function selectConversation(id: string) {
    setActiveId(id);
    setMobileThreadOpen(true);
    setReplyingTo(null);
  }

  function autoGrow() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  async function send() {
    if (!text.trim() || !activeConversation || !receiver) return;
    const draft = text;
    const reply = replyingTo;
    setText("");
    setReplyingTo(null);
    stopTyping();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    try {
      await sendMessage.mutateAsync({
        conversationId: activeConversation._id,
        receiverId: receiver._id,
        text: draft,
        replyTo: reply?._id,
      });
    } catch {
      setText(draft);
      showToast("Message failed to send.", "error");
    }
  }

  async function handleAttachment(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeConversation || !receiver) return;
    try {
      const uploaded = await uploadFile.mutateAsync(file);
      await sendMessage.mutateAsync({
        conversationId: activeConversation._id,
        receiverId: receiver._id,
        text: "",
        attachments: [
          {
            type: uploaded.type,
            url: uploaded.url,
            filename: uploaded.filename,
            size: uploaded.size,
            mimeType: uploaded.mimeType,
            thumbnailUrl: uploaded.thumbnailUrl,
          },
        ],
      });
    } catch {
      showToast("Attachment failed to upload.", "error");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function toggleReaction(messageId: string, emoji: string) {
    const mine = (reactions.get(messageId) || []).find((r) => r.userId === myId);
    if (mine?.emoji === emoji) {
      removeReaction.mutate({ messageId });
    } else {
      addReaction.mutate({ messageId, emoji });
    }
    setOpenReactionsFor(null);
  }

  const showListOnMobile = !mobileThreadOpen;

  return (
    <div
      className="grid h-full min-h-[620px] overflow-hidden rounded-xl border border-(--border) bg-(--bg-secondary)"
      style={{ gridTemplateColumns: "320px 1fr" }}
    >
      {/* ── Conversation list ── */}
      <aside
        className={`border-r border-(--border) overflow-auto flex-col ${showListOnMobile ? "flex" : "hidden md:flex"}`}
      >
        <div className="px-4 py-4 border-b border-(--border) shrink-0 space-y-3">
          <h1 className="font-display text-h3">Messages</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            data-interactive
            className="h-9 w-full rounded-lg bg-(--bg-surface) border border-(--border) px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
          />
          <div className="flex gap-1">
            {(["All", "Unread"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterUnread(t === "Unread")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  color: (t === "Unread") === filterUnread ? "var(--text-primary)" : "var(--text-tertiary)",
                  background: (t === "Unread") === filterUnread ? "var(--bg-surface)" : "transparent",
                }}
                data-interactive
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {conversations.isLoading ? (
          <div className="flex flex-col gap-1 p-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <p className="p-5 text-sm text-(--text-tertiary)">No conversations found.</p>
        ) : (
          filteredList.map((conversation: any) => {
            const other = conversation.participants?.find((p: any) => String(p._id) !== myId);
            const isActive = activeConversation?._id === conversation._id;
            const unreadCount = unreadByConversation.get(conversation._id) || 0;
            return (
              <button
                key={conversation._id}
                onClick={() => selectConversation(conversation._id)}
                className={`w-full p-4 text-left border-b border-(--border) transition-colors hover:bg-(--bg-surface) ${isActive ? "bg-(--bg-surface)" : ""}`}
                data-interactive
              >
                <div className="flex items-start gap-3">
                  <Avatar name={other?.fullName || "?"} photo={other?.profilePhoto} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{other?.fullName || "Conversation"}</p>
                      {conversation.lastMessageAt && (
                        <span className="font-mono-utility text-mono-sm text-(--text-tertiary) shrink-0">
                          {timeLabel(conversation.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-(--text-tertiary) truncate">{conversation.lastMessage || "No messages yet"}</p>
                      {unreadCount > 0 && (
                        <span className="shrink-0 h-4 min-w-[16px] px-1 rounded-full bg-(--accent) text-(--bg-primary) text-[10px] font-bold grid place-items-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </aside>

      {/* ── Chat pane ── */}
      <section className={`min-w-0 flex-col ${showListOnMobile ? "hidden md:flex" : "flex"}`}>
        {/* Header */}
        <div className="border-b border-(--border) px-5 py-4 shrink-0 flex items-center gap-3">
          <button
            onClick={() => setMobileThreadOpen(false)}
            className="md:hidden text-(--text-secondary) hover:text-(--text-primary)"
            aria-label="Back to conversations"
            data-interactive
          >
            ←
          </button>
          {receiver && <Avatar name={receiver.fullName} photo={receiver.profilePhoto} size={32} />}
          <div>
            <p className="font-semibold text-sm">{receiver?.fullName || "Select a conversation"}</p>
            {receiver && (
              <p className="text-xs" style={{ color: isOnline ? "var(--accent)" : "var(--text-tertiary)" }}>
                {isOnline ? "Active now" : "Offline"}
              </p>
            )}
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-auto p-4 space-y-1" data-lenis-prevent>
          {messages.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <div className="h-10 w-48 rounded-2xl skeleton-shimmer" />
                </div>
              ))}
            </div>
          ) : (
            (messages.data?.messages || []).map((message: any) => {
              const mine = String(message.senderId) === myId;
              const msgReactions = reactions.get(String(message._id)) || [];
              const repliedTo = message.replyTo
                ? (messages.data?.messages || []).find((m: any) => String(m._id) === String(message.replyTo))
                : null;

              return (
                <div
                  key={message._id}
                  className={`group relative flex ${mine ? "justify-end" : "justify-start"} py-1.5`}
                  onMouseLeave={() => setOpenReactionsFor((id) => (id === message._id ? null : id))}
                >
                  <div className={`flex items-end gap-2 max-w-[75%] ${mine ? "flex-row-reverse" : ""}`}>
                    <div className="relative">
                      {repliedTo && (
                        <div className="mb-1 rounded-lg border-l-2 border-(--accent) bg-(--bg-surface) px-3 py-1.5 text-xs text-(--text-tertiary) truncate max-w-full">
                          {repliedTo.text}
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          mine ? "bg-(--accent) text-(--bg-primary)" : "bg-(--bg-surface) text-(--text-primary)"
                        }`}
                      >
                        {message.text}
                        {message.attachments?.map((att: any, i: number) => (
                          <div key={i} className="mt-2">
                            {att.type === "image" ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={att.url} alt={att.filename} className="max-w-[220px] rounded-lg" />
                            ) : (
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg bg-black/10 px-3 py-2 text-xs underline"
                              >
                                <Paperclip size={12} /> {att.filename}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>

                      {msgReactions.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {Array.from(new Set(msgReactions.map((r) => r.emoji))).map((emoji) => (
                            <span key={emoji} className="text-xs bg-(--bg-surface) border border-(--border) rounded-full px-1.5 py-0.5">
                              {emoji}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className={`flex items-center gap-1.5 mt-1 ${mine ? "justify-end" : ""}`}>
                        <span className="text-[10px] text-(--text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity">
                          {timeLabel(message.createdAt)}
                        </span>
                        {mine && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity" title={message.status}>
                            {message.status === "read" ? (
                              <CheckCheck size={12} className="text-(--accent)" />
                            ) : message.status === "delivered" ? (
                              <CheckCheck size={12} className="text-(--text-tertiary)" />
                            ) : (
                              <Check size={12} className="text-(--text-tertiary)" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover actions: react + reply */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 relative">
                      <button
                        onClick={() => setOpenReactionsFor((id) => (id === message._id ? null : message._id))}
                        className="h-7 w-7 rounded-full hover:bg-(--bg-surface) grid place-items-center text-(--text-tertiary)"
                        aria-label="React"
                        data-interactive
                      >
                        <SmilePlus size={14} />
                      </button>
                      <button
                        onClick={() => { setReplyingTo(message); textareaRef.current?.focus(); }}
                        className="h-7 w-7 rounded-full hover:bg-(--bg-surface) grid place-items-center text-(--text-tertiary)"
                        aria-label="Reply"
                        data-interactive
                      >
                        <Reply size={14} />
                      </button>

                      {openReactionsFor === message._id && (
                        <div
                          className={`absolute z-10 top-full mt-1 flex gap-1 rounded-xl border border-(--border) bg-(--bg-secondary) p-1.5 shadow-xl ${mine ? "right-0" : "left-0"}`}
                          onMouseEnter={() => setOpenReactionsFor(message._id)}
                        >
                          {REACTION_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => toggleReaction(message._id, emoji)}
                              className="h-8 w-8 rounded-lg hover:bg-(--bg-surface) grid place-items-center text-base"
                              data-interactive
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {isTyping && <TypingDots />}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply preview */}
        {replyingTo && (
          <div className="flex items-center justify-between gap-2 px-4 py-2 border-t border-(--border) bg-(--bg-surface)">
            <p className="text-xs text-(--text-tertiary) truncate">
              Replying to: <span className="text-(--text-secondary)">{replyingTo.text}</span>
            </p>
            <button onClick={() => setReplyingTo(null)} className="text-(--text-tertiary) hover:text-(--text-primary)" aria-label="Cancel reply" data-interactive>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Compose */}
        <div className="flex items-end gap-2 border-t border-(--border) p-4 shrink-0">
          <input ref={fileInputRef} type="file" onChange={handleAttachment} className="sr-only" aria-label="Attach file" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!receiver}
            className="h-11 w-11 rounded-xl border border-(--border) grid place-items-center text-(--text-tertiary) hover:text-(--text-primary) hover:border-(--border-strong) transition-colors disabled:opacity-40 shrink-0"
            aria-label="Attach file"
            data-interactive
          >
            <Paperclip size={16} />
          </button>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              autoGrow();
              if (e.target.value) sendTyping();
              else stopTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder={receiver ? `Message ${receiver.fullName}…` : "Select a conversation"}
            disabled={!receiver}
            data-interactive
            className="flex-1 max-h-40 resize-none rounded-xl bg-(--bg-surface) border border-(--border) px-4 py-2.5 outline-none text-sm placeholder:text-(--text-tertiary) focus-visible:ring-2 focus-visible:ring-(--accent) disabled:opacity-40"
          />
          <MagneticButton
            variant="primary"
            onClick={send}
            disabled={!text.trim() || !receiver || sendMessage.isPending}
            className="h-11 w-11 p-0 shrink-0"
            aria-label="Send message"
          >
            <Send size={16} />
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
