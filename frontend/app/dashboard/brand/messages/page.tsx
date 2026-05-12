"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useConversations, useMessages, useSendMessage } from "@/lib/hooks/useChat";
import { useAuthStore } from "@/lib/auth";
import { showToast } from "@/lib/toast";

export default function BrandMessagesPage() {
  const user = useAuthStore((state) => state.user);
  const conversations = useConversations();
  const [activeId, setActiveId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(() => {
    const list = conversations.data?.conversations || [];
    // Default to first conversation if none selected
    return list.find((item: any) => item._id === activeId) || list[0];
  }, [activeId, conversations.data]);

  const messages = useMessages(activeConversation?._id);
  const sendMessage = useSendMessage();
  const [text, setText] = useState("");

  const myId = String(user?.id || (user as any)?._id || "");
  const receiver = activeConversation?.participants?.find(
    (p: any) => String(p._id) !== myId
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.data]);

  async function send() {
    if (!text.trim() || !activeConversation || !receiver) return;
    const draft = text;
    setText("");
    try {
      await sendMessage.mutateAsync({
        conversationId: activeConversation._id,
        receiverId: receiver._id,
        text: draft,
      });
    } catch {
      setText(draft); // restore on error
      showToast("Message failed to send.", "error");
    }
  }

  return (
    <div
      className="grid h-full min-h-[620px] overflow-hidden rounded-2xl border border-(--border) bg-(--bg-secondary)"
      style={{ gridTemplateColumns: "280px 1fr" }}
    >
      {/* ── Conversation list ── */}
      <aside className="border-r border-(--border) overflow-auto flex flex-col">
        <div className="px-4 py-4 border-b border-(--border) shrink-0">
          <h1 className="font-display text-h3">Messages</h1>
        </div>

        {conversations.isLoading ? (
          <div className="flex flex-col gap-1 p-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-(--bg-surface) animate-pulse" />
            ))}
          </div>
        ) : (conversations.data?.conversations || []).length === 0 ? (
          <p className="p-5 text-sm text-(--text-tertiary)">No conversations yet.</p>
        ) : (
          (conversations.data?.conversations || []).map((conversation: any) => {
            const other = conversation.participants?.find(
              (p: any) => String(p._id) !== myId
            );
            const isActive = activeConversation?._id === conversation._id;
            return (
              <button
                key={conversation._id}
                onClick={() => setActiveId(conversation._id)}
                className={`w-full p-4 text-left border-b border-(--border) transition-colors hover:bg-(--bg-surface) ${
                  isActive ? "bg-(--bg-surface)" : ""
                }`}
              >
                <p className="font-semibold text-sm truncate">{other?.fullName || "Conversation"}</p>
                <p className="text-xs text-(--text-tertiary) truncate mt-0.5">
                  {conversation.lastMessage || "No messages yet"}
                </p>
              </button>
            );
          })
        )}
      </aside>

      {/* ── Chat pane ── */}
      <section className="flex min-w-0 flex-col">
        {/* Header */}
        <div className="border-b border-(--border) px-5 py-4 shrink-0">
          <p className="font-semibold">{receiver?.fullName || "Select a conversation"}</p>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-auto p-4 space-y-3" data-lenis-prevent>
          {messages.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <div className="h-10 w-48 rounded-2xl bg-(--bg-surface) animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            (messages.data?.messages || []).map((message: any) => {
              const mine = String(message.senderId) === myId;
              return (
                <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      mine
                        ? "bg-(--accent) text-(--bg-primary)"
                        : "bg-(--bg-surface) text-(--text-primary)"
                    }`}
                  >
                    {message.text}
                    {message.attachments?.length > 0 && (
                      <p className="mt-1 text-xs opacity-70">{message.attachments.length} attachment(s)</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Compose */}
        <div className="flex gap-2 border-t border-(--border) p-4 shrink-0">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder={receiver ? `Message ${receiver.fullName}…` : "Select a conversation"}
            disabled={!receiver}
            className="h-11 flex-1 rounded-xl bg-(--bg-surface) border border-(--border) px-4 outline-none text-sm placeholder:text-(--text-tertiary) focus-visible:ring-2 focus-visible:ring-(--accent) disabled:opacity-40"
          />
          <button
            onClick={send}
            disabled={!text.trim() || !receiver || sendMessage.isPending}
            className="h-11 w-11 rounded-xl bg-(--accent) text-(--bg-primary) grid place-items-center hover:bg-(--accent-hover) transition-colors disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
